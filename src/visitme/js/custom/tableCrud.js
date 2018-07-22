/*exported createCrud */

const deleteEventGenerator = (table, items) => {
  return async pos => {
    confirm("¿Esta seguro?", async () => {
      const promises = pos.map(i =>
        deleteMainApi(`communities/communityUser/${items[i]._id}`)
      );
      await Promise.all(promises);
      table.remove(pos);
    });
  };
};

const addEventGenerator = (table, type) => {
  return async () => {};
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
  const columns = Object.keys(rows[0]);
  const templateStr = template({
    id,
    rows,
    columns
  });
  loadTemplate(CONTAINER, TEMPLATE_NAME, templateStr);
  const table = new Table(id);
  const onDelete = deleteEventGenerator(table, items);
  const onAdd = addEventGenerator(table, type);
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
