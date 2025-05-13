import { untrack } from 'svelte';
import { isTruthy, sortedBy, type SortDescriptors } from '../utils/array';
import { Subscribable } from './model.svelte';

const ITERATIONS = 10;

export type BaseMapOptions<Source, Target> = {
  target: (source: Source) => Target | undefined;
  key?: (source: Source) => unknown;
};

type CacheValue<Target> = {
  target: Target;
  iteration: number;
  key: unknown;
};

const maybeSubscribeContent = (object: unknown) => {
  if (object instanceof Subscribable) {
    return object.subscriber.subscribe();
  } else {
    return () => {};
  }
};

const maybeSubscribeContentArray = (objects: unknown[]) => {
  const cancels = objects.map((object) => maybeSubscribeContent(object));
  return () => cancels.forEach((c) => c());
};

export abstract class BaseMap<Source, Target, O extends BaseMapOptions<Source, Target>> extends Subscribable<O> {
  private readonly _target = $derived(this.options.target);
  private readonly _cache: Map<Source, CacheValue<Target>> = new Map();
  private _iteration = 0;

  private _compact() {
    const cache = this._cache;
    const iteration = this._iteration - ITERATIONS;
    const entries = this._cache.entries();
    for (const [source, value] of entries) {
      if (value.iteration < iteration) {
        cache.delete(source);
      }
    }
  }

  private _model(source: Source) {
    return this._target(source);
  }

  private _keyFor(source: Source) {
    const key = this.options.key;
    if (key) {
      return key(source);
    }
  }

  private _keyEquals(source: Source, value: CacheValue<Target>) {
    return this._keyFor(source) === value.key;
  }

  private _findOrCreate(source: Source) {
    const cache = this._cache;
    const iteration = this._iteration;
    if (cache.has(source)) {
      const value = cache.get(source)!;
      if (this._keyEquals(source, value)) {
        value.iteration = iteration;
        return value.target;
      }
    }
    const target = this._model(source);
    const key = this._keyFor(source);
    if (target) {
      cache.set(source, {
        key,
        target,
        iteration,
      });
    }
    return target;
  }

  protected _withCache<R>(fn: (findOrCreate: (source: Source) => Target | undefined) => R): R {
    this._iteration++;
    const result = fn((source: Source) => this._findOrCreate(source));
    this._compact();
    return result;
  }

  protected abstract readonly waitForContent: (Target | undefined)[];

  async waitFor(fn: (model: Target) => boolean): Promise<Target> {
    return new Promise<Target>((resolve) => {
      // TODO: timeout
      const cancel = $effect.root(() => {
        $effect(() => {
          const model = this.waitForContent.find((model) => {
            if (model !== undefined) {
              return fn(model);
            }
          });
          if (model) {
            cancel();
            resolve(model);
          }
        });
      });
    });
  }
}

export type MapModelsOptions<Source, Target> = {
  source: Source[];
  sort?: SortDescriptors<Target>;
} & BaseMapOptions<Source, Target>;

export class MapModels<Source, Target> extends BaseMap<Source, Target, MapModelsOptions<Source, Target>> {
  private readonly _source = $derived(this.options.source);
  private _content = $state<Target[]>([]);

  readonly content = $derived(this._content);
  protected readonly waitForContent = $derived(this.content);

  readonly sorted = $derived.by(() => {
    const descriptors = this.options.sort;
    const content = this.content;
    if (descriptors) {
      return sortedBy(content, descriptors);
    }
    return content;
  });

  private update() {
    const content = this._withCache((findOrCreate) => {
      return this._source.map((source) => findOrCreate(source)).filter(isTruthy);
    });
    this._content = untrack(() => content);
    return content;
  }

  subscribe() {
    return $effect.root(() => {
      $effect(() => {
        const content = this.update();
        return maybeSubscribeContentArray(content);
      });
    });
  }

  async load(cb?: (target: Target) => Promise<void>) {
    const models = this.update();
    if (cb) {
      await Promise.all(models.map((model) => cb(model)));
    }
  }
}

export type MapModelOptions<Source, Target> = {
  source: Source | undefined;
} & BaseMapOptions<Source, Target>;

export class MapModel<Source, Target> extends BaseMap<Source, Target, MapModelOptions<Source, Target>> {
  private readonly _source = $derived(this.options.source);
  private _content = $state<Target>();

  readonly content = $derived(this._content);
  protected readonly waitForContent = $derived([this.content]);

  private update() {
    let content: Target | undefined;
    const source = this._source;
    if (source) {
      content = this._withCache((findOrCreate) => findOrCreate(source));
    }
    this._content = untrack(() => content);
    return content;
  }

  subscribe() {
    return $effect.root(() => {
      $effect(() => {
        const content = this.update();
        return maybeSubscribeContent(content);
      });
    });
  }

  async load(cb?: (target: Target) => Promise<void>) {
    const target = this.update();
    if (target && cb) {
      await cb(target);
    }
  }
}

export const mapModels = <Source, Target>(...args: ConstructorParameters<typeof MapModels<Source, Target>>) =>
  new MapModels<Source, Target>(...args);

export const mapModel = <Source, Target>(...args: ConstructorParameters<typeof MapModel<Source, Target>>) =>
  new MapModel<Source, Target>(...args);
