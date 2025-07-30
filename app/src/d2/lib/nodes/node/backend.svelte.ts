import type { NodeParentData } from '$d2-shared/documents';
import { Model } from '$d2/lib/base/model/base.svelte';
import { isTruthy } from '$d2/lib/base/utils/array';
import type { PropertyUpdateResult } from '$d2/lib/base/utils/property.svelte';
import type { NodeModel, NodeType } from './node.svelte';

export type NodeBackendModelDelegate = {
  parentFor: (node: NodeModel) => NodeModel | undefined;
  childrenFor: (node: NodeModel) => NodeModel[];
  didUpdatePath: (opts: PropertyUpdateResult<string>) => Promise<(NodeModel | undefined)[]>;
};

export type NodeBackendModelOptions<Type extends NodeType> = {
  node: NodeModel<Type>;
  delegate: NodeBackendModelDelegate;
};

export class NodeBackendModel<Type extends NodeType = NodeType> extends Model<NodeBackendModelOptions<Type>> {
  private readonly delegate = $derived(this.options.delegate);
  private readonly node = $derived(this.options.node);

  readonly parent = $derived(this.delegate.parentFor(this.node));
  readonly children = $derived(this.delegate.childrenFor(this.node));

  readonly nodes: NodeModel[] = $derived.by(() => {
    return [
      this.node,
      ...this.children.reduce<NodeModel[]>((all, child) => {
        const recursive = child.backend?.nodes ?? [];
        return [...all, ...recursive];
      }, []),
    ];
  });

  hasParent(node: NodeModel): boolean {
    return this.parent?.backend?.isOrHasParent(node) ?? false;
  }

  isOrHasParent(node: NodeModel) {
    return this.node === node || this.hasParent(node);
  }

  readonly path: string = $derived.by(() => {
    const parent = this.parent?.backend?.path;
    return [parent, '/', this.node.identifier].filter(isTruthy).join('');
  });

  async didUpdatePath(opts: PropertyUpdateResult<string>) {
    const nodes = await this.delegate.didUpdatePath(opts);
    return nodes.filter(isTruthy);
  }

  async didUpdateParent(parent: NodeParentData) {
    const nodes = await Promise.all(this.children.map((child) => child.didUpdateParentIdentifier(parent)));
    return nodes.filter(isTruthy);
  }
}
