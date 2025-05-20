export const load = async (event) => {
  const parent = await event.parent();
  return {
    node: parent.nodes.byId(event.params.id),
  };
};
