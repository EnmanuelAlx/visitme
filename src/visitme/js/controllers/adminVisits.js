/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/adminVisits";
  const TEMPLATE_NAME = "adminVisits";
  const HB = MyApp; // handlebars;

  app.get(ROOT, async () => {
    try {
      const template = HB.templates[TEMPLATE_NAME];
      if ($(CONTAINER).exists()) startPreload(CONTAINER);
      else startPreload("body", "Cargando tu experiencia...");
      const { communities } = getSessionData();
      const community = communities.find(comm => comm.selected === true)._id;
      const items = await getMainApi({}, `communities/${community}/visits`);
      const columns = ["Residente", "Invitado", "Tipo", "Horario"];
      const table = loadCustomTable(
        items,
        columns,
        format,
        "adminVisits",
        template,
        CONTAINER,
        TEMPLATE_NAME
      );
      table.init();
    } catch (error) {
      console.log("E", error);
      notify.error("Ocurrió un error al cargar la data", "Error");
    }
  });

  const format = items =>
    items.map(item => ({
      resident: item.resident.name,
      guest: item.guest ? item.guest.name : "N/A",
      kind: item.kind,
      partDay: item.partOfDay
    }));
})();
