/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/admins";
  const TEMPLATE_NAME = "admins";
  const HB = MyApp; // handlebars;

  app.get(ROOT, () => {
    const template = HB.templates[TEMPLATE_NAME];

    const { communities } = getSessionData();
    const community = communities.find(comm => comm.selected === true)._id;
    getMainApi({}, `communities/${community}/admins`).then(admins => {
      const rows = format(admins);
      const columns = Object.keys(rows[0]);
      loadTemplate(
        CONTAINER,
        TEMPLATE_NAME,
        template({ id: "adminTable", rows, columns })
      );
      $("#adminTable").DataTable({
        buttons: ["Eliminar", "Añadir", "Actualizar"]
      });
      $("#adminTable tbody").on("click", "tr", function() {
        console.log("CLICK SELECTED");
        $(this).toggleClass("selected");
      });
    });
  });
})();

const format = items => items.map(formatItem);

const formatItem = item => {
  return {
    nombre: item.user.name,
    cedula: item.user.identification,
    localidad: item.reference
  };
};
