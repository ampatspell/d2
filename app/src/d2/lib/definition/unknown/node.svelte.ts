import LucideCircleSlash from '$d2/icons/lucide--circle-slash.svelte';
import { NodeModel, NodePropertiesModel } from '$d2/lib/nodes/node.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UnknownNodePropertiesModel extends NodePropertiesModel<any> {
  readonly paths = [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UnknownNodeModel extends NodeModel<any> {
  readonly properties: UnknownNodePropertiesModel = new UnknownNodePropertiesModel({
    model: this,
  });

  readonly icon = LucideCircleSlash;
  readonly name = 'Unknown';
}
