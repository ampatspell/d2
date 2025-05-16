import type { TreeDelegate, TreeModelDelegate } from '$d2/components/dark/tree/tree.svelte';
import { Model } from '$d2/lib/base/model/model.svelte';
import type { NodeModel } from '$d2/lib/nodes/node.svelte';
import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';

export type NodesTreeSettings = {
  isOpen: (id: string) => boolean;
  setOpen: (id: string, open: boolean) => void;
};

export type NodesTreeDelegateOptions = {
  nodes: NodesModel;
  isReorderable?: boolean;
  onSelect: (model: NodeModel | undefined) => void;
  settings: NodesTreeSettings;
  selected: NodeModel | undefined;
};

export class NodesTreeDelegate extends Model<NodesTreeDelegateOptions> implements TreeDelegate<NodeModel> {
  readonly nodes = $derived(this.options.nodes);
  readonly settings = $derived(this.options.settings);
  readonly selected = $derived(this.options.selected);

  readonly models = $derived(this.nodes.byParentId(null));
  readonly isReorderable = $derived(this.options.isReorderable ?? false);

  onSelect(model: NodeModel | undefined) {
    this.options.onSelect(model);
  }

  deselect() {
    this.onSelect(undefined);
  }

  delegateFor(model: NodeModel) {
    return new NodesTreeModelDelegate({ model, delegate: this });
  }
}

export type NodesTreeModelDelegateOptions = {
  model: NodeModel;
  delegate: NodesTreeDelegate;
};

export class NodesTreeModelDelegate
  extends Model<NodesTreeModelDelegateOptions>
  implements TreeModelDelegate<NodeModel>
{
  private readonly delegate = $derived(this.options.delegate);
  private readonly settings = $derived(this.delegate.settings);
  private readonly model = $derived(this.options.model);

  readonly children = $derived(this.delegate.nodes.byParentId(this.model.id));
  readonly isOpen = $derived(this.settings.isOpen(this.model.id));
  readonly isSelected = $derived(this.delegate.selected === this.model);
  readonly icon = $derived(this.model.icon);

  hasParent(parent: NodeModel) {
    return this.model.backend?.hasParent(parent) ?? false;
  }

  select() {
    this.delegate.onSelect(this.model);
  }

  setOpen(isOpen: boolean) {
    this.settings.setOpen(this.model.id, isOpen);
  }
}
