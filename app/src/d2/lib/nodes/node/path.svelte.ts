import { Model } from '$d2/lib/base/model/model.svelte';
import { serialized } from '$d2/lib/base/utils/object';

export type NodePathModelOptions = {
  path: string;
};

export class NodePathModel extends Model<NodePathModelOptions> {
  readonly value = $derived(this.options.path);

  exceptOwn(path: string | undefined) {
    if (path === this.value) {
      return undefined;
    }
    return path;
  }

  exceptParents(path: string | undefined) {
    if (typeof path === 'string' && this.value.startsWith(path) && path !== this.value) {
      return undefined;
    }
    return path;
  }

  readonly serialized = $derived(serialized(this, ['value']));
}
