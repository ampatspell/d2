import LucideFlame from '$d2/icons/lucide--flame.svelte';
import { isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { getter } from '$d2/lib/base/utils/options';
import { data } from '$d2/lib/base/utils/property.svelte';
import { FileNodeDocumentModel } from '$d2/lib/definition/file/node.svelte';
import { mapNode } from '$d2/lib/nodes/map.svelte';
import { NodeDocumentModel, NodeModelProperties } from '$d2/lib/nodes/node.svelte';

export class BlankNodeProperties extends NodeModelProperties<'blank'> {
  readonly title = data(this, 'title');
  readonly background = data(this, 'background');
}

export class BlankNodeDocumentModel extends NodeDocumentModel<'blank'> {
  readonly properties: BlankNodeProperties = new BlankNodeProperties({
    model: this,
  });

  readonly name = 'Blank';
  readonly icon = LucideFlame;

  readonly title = $derived(this.data.properties.title);

  private readonly _background = mapNode.forPath({
    path: getter(() => this.path.exceptOwn(this.data.properties.background)),
    factory: FileNodeDocumentModel,
  });

  readonly background = $derived(this._background.node);

  async load() {
    await super.load();
    await this._background.load();
  }

  readonly dependencies = [...this.nodeDependencies, this._background];
  readonly isLoaded = $derived(isLoaded([...this.nodeIsLoaded, this._background]));
}
