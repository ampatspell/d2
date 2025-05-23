export const load = async (event) => {
  const { nodes } = await event.parent();
  const id = event.params.id;
  return {
    loader: await nodes.byIdLoader(id).preload(),
  };
};
