/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/admins";
  const TEMPLATE_NAME = "admins";
  const HB = MyApp; // handlebars;

  app.get(ROOT, async () => {
    try{
      const template = HB.templates[TEMPLATE_NAME];
      startPreload(CONTAINER);
      const { communities } = getSessionData();
      const community = communities.find(comm => comm.selected === true)._id;
      const admins = await getMainApi({}, `communities/${community}/admins`);
      const rows = format(admins);
      const columns = Object.keys(rows[0]);
      loadTemplate(
        CONTAINER,
        TEMPLATE_NAME,
        template({
          id: "adminTable",
          rows,
          columns
        })
      );
      $("#adminTable").DataTable({
        buttons: ["copy"],
        language: DATATABLES_SPANISH
      });
      $("#adminTable tbody").on("click", "tr", function () {
        $(this).toggleClass("selected");
      });
    }catch(e){
      toastr.error("Ocurrió un error al cargar la data", "Error");
    }
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
