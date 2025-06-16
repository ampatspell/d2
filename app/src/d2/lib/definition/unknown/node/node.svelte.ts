import LucideCircleSlash from '$d2/icons/lucide--circle-slash.svelte';
import { NodeDetailsModel } from '$d2/lib/nodes/node/details.svelte';
import { NodeModel } from '$d2/lib/nodes/node/node.svelte';
import { NodePropertiesModel } from '$d2/lib/nodes/node/properties.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UnknownNodePropertiesModel extends NodePropertiesModel<any> {
  readonly paths = [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UnknownNodeDetailsModel extends NodeDetailsModel<any> {
  async load() {}
  readonly isLoaded = true;
  readonly dependencies = [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UnknownNodeModel extends NodeModel<any> {
  readonly properties: UnknownNodePropertiesModel = new UnknownNodePropertiesModel({ model: this });
  readonly details: UnknownNodeDetailsModel = new UnknownNodeDetailsModel({ model: this });

  readonly icon = LucideCircleSlash;
  readonly name = 'Unknown';
}
