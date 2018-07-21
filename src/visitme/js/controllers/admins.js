/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/admins";
  const TEMPLATE_NAME = "admins";
  const HB = MyApp; // handlebars;

  app.get(ROOT, async () => {
    try {
      const template = HB.templates[TEMPLATE_NAME];
      startPreload(CONTAINER);
      const { communities } = getSessionData();
      const community = communities.find(comm => comm.selected === true)._id;
      const admins = await getMainApi({}, `communities/${community}/admins`);
      const rows = format(admins);
      const columns = Object.keys(rows[0]);
      const templateStr = template({
        id: "adminTable",
        rows,
        columns
      });
      loadTemplate(CONTAINER, TEMPLATE_NAME, templateStr);
      const table = new Table("adminTable");
      table.addEvent("Add", onAdd);
      const onDelete = async pos => {
        const promises = pos.map(i =>
          deleteMainApi(`communities/communityUser/${admins[i]._id}`)
        );
        await Promise.all(promises);
        table.remove(pos);
      };
      table.addEvent("Eliminar", onDelete);

      table.init();
    } catch (e) {
      console.log("E!", e);
      toastr.error("Ocurrió un error al cargar la data", "Error");
    }
  });
})();

const onAdd = () => {
  console.log("ADDDDDDD");
};

const format = items => items.map(formatItem);

const formatItem = item => {
  return {
    image: item.user.image,
    nombre: item.user.name,
    cedula: item.user.identification,
    localidad: item.reference
  };
};
