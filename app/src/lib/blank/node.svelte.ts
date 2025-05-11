import LucideFlame from '$d2/icons/lucide--flame.svelte';
import { isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { mapModel } from '$d2/lib/base/model/models.svelte';
import { getter } from '$d2/lib/base/utils/options';
import { data } from '$d2/lib/base/utils/property.svelte';
import { node } from '$d2/lib/nodes/loader.svelte';
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

  private readonly _background = mapModel({
    source: getter(() => this.data.properties.background),
    target: (path) => node.forPath(path),
  });

  readonly background = $derived(this._background.content);

  async load() {
    await super.load();
    await this._background.load();
    await this.background?.load();
  }

  readonly isLoaded = $derived(isLoaded([...this.nodeIsLoaded, this.background]));
  readonly dependencies = [...this.nodeDependencies, this._background];
}
