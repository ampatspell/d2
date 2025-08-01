import { SubscribableModel } from '$d2/lib/base/refactoring/subscribable.svelte';
import { getter } from '$d2/lib/base/utils/options';
import { data, DocumentModelProperties, Property, type PropertyUpdateResult } from '$d2/lib/base/utils/property.svelte';
import type { NodeData, NodeModel, NodeType } from './node.svelte';

export type NodePropertiesModelOptions<Type extends NodeType> = {
  model: NodeModel<Type>;
};

export class NodeBasePropertiesModel<Type extends NodeType> extends DocumentModelProperties<NodeData<Type>> {
  readonly identifier = data(this, 'identifier');
}

export abstract class NodePropertiesModel<
  Type extends NodeType,
  O extends NodePropertiesModelOptions<Type> = NodePropertiesModelOptions<Type>,
> extends SubscribableModel<O> {
  readonly base = new NodeBasePropertiesModel<Type>({
    model: getter(() => this.options.model),
  });

  readonly data = $derived(this.options.model.data.properties);

  async didUpdate<T>(property: Property<T>, result: PropertyUpdateResult<T>) {
    await this.options.model.didUpdate(property, result);
  }

  abstract readonly paths: (Property<string | undefined> | Property<string>)[];

  async updatePaths(opts: PropertyUpdateResult<string>) {
    let updated = false;
    this.paths.forEach((prop) => {
      const path = prop.value;
      if (path?.startsWith(opts.before)) {
        const rest = path.substring(opts.before.length, path.length);
        const after = `${opts.after}${rest}`;
        prop.update(after);
        updated = true;
      }
    });
    return updated;
  }

  readonly dependencies = [];
}
