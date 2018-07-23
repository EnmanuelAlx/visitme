/*exported createCrud */

const deleteEventGenerator = (table, items) => {
  return async pos => {
    confirm("¿Esta seguro?", async () => {
      const promises = pos.map(i =>
        deleteMainApi(`communities/communityUser/${items[i]._id}`)
      );
      await Promise.all(promises);
      table.remove(pos);
      items = items.filter((item, index) => pos.indexOf(index) === -1);
    });
  };
};

const addEventGenerator = (table, community, type) => {
  return async () => {
    showAdditionModal(async data => {
      try {
        await postMainApi(
          {
            reference: data.reference,
            user: data.user._id
          },
          `communities/${community}/${type.toLowerCase()}`
        );
        table.add([formatItem(data)]);
      } catch (error) {
        throw error;
      }
    });
  };
};

async function createCrud(resource, type, template, CONTAINER, TEMPLATE_NAME) {
  const { communities } = getSessionData();
  const community = communities.find(comm => comm.selected === true)._id;
  const tableId = `${resource}Table`;
  const items = await getMainApi({}, `communities/${community}/${resource}`);
  loadTable(items, tableId, type, template, CONTAINER, TEMPLATE_NAME).init();
}

function loadTable(items, id, type, template, CONTAINER, TEMPLATE_NAME) {
  const rows = format(items);
  const columns = ["Imagen", "Nombre", "Cedula", "Localidad"];
  const templateStr = template({
    id,
    rows,
    columns
  });
  const { communities } = getSessionData();
  const community = communities.find(comm => comm.selected === true)._id;
  loadTemplate(CONTAINER, TEMPLATE_NAME, templateStr);
  const table = new Table(id);
  const onDelete = deleteEventGenerator(table, items);
  const onAdd = addEventGenerator(table, community, type);
  table.addEvent("Add", onAdd);
  table.addEvent("Eliminar", onDelete);
  return table;
}

const format = items => items.map(formatItem);

const formatItem = item => {
  return {
    image: item.user.image,
    nombre: item.user.name,
    cedula: item.user.identification,
    localidad: item.reference
  };
};
