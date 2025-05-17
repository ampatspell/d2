import type { TreeDelegate, TreeModelDelegate, TreeOnReorder } from '$d2/components/dark/tree/tree.svelte';
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

  children(model: NodeModel) {
    return model.backend?.children ?? [];
  }

  onSelect(model: NodeModel | undefined) {
    this.options.onSelect(model);
  }

  deselect() {
    this.onSelect(undefined);
  }

  delegateFor(model: NodeModel) {
    return new NodesTreeModelDelegate({ model, delegate: this });
  }

  isOpen(model: NodeModel) {
    return this.settings.isOpen(model.id);
  }

  setOpen(model: NodeModel, isOpen: boolean) {
    this.settings.setOpen(model.id, isOpen);
  }

  async onReorder(opts: TreeOnReorder<NodeModel>) {
    const { source, position: over, target } = opts;
    const o = (model: NodeModel) => (this.isOpen(model) ? `(open)` : `(closed)`);
    if (over === 'over') {
      await source.setParent(target);
    } else {
      console.log(source.path.value, over, target.path.value, o(target));
    }
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
  private readonly model = $derived(this.options.model);

  readonly children = $derived(this.delegate.nodes.byParentId(this.model.id));
  readonly isOpen = $derived(this.delegate.isOpen(this.model));
  readonly isSelected = $derived(this.delegate.selected === this.model);
  readonly icon = $derived(this.model.icon);

  select() {
    this.delegate.onSelect(this.model);
  }

  setOpen(isOpen: boolean) {
    this.delegate.setOpen(this.model, isOpen);
  }
}
