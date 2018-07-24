/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/alerts";
  const TEMPLATE_NAME = "alerts";
  const HB = MyApp; // handlebars;

  app.get(ROOT, async () => {
    try {
      const template = HB.templates[TEMPLATE_NAME];
      if ($(CONTAINER).exists()) startPreload(CONTAINER);
      else startPreload("body", "Cargando tu experiencia...");
      const { communities } = getSessionData();
      const community = communities.find(comm => comm.selected === true)._id;
      let information = (await getMainApi({}, "/user/me/alerts/information")).alerts;
      let incident = (await getMainApi({}, "/user/me/alerts/incident")).alerts;
      let other = (await getMainApi({}, "/user/me/alerts/other")).alerts;
      console.log("information", information);
      information = information.filter(item => filterAlert(item, community));
      incident = incident.filter(item => filterAlert(item, community));
      other = other.filter(item => filterAlert(item, community));
      loadTemplate(CONTAINER, TEMPLATE_NAME, template({
        information,
        incident,
        other
      }));
    } catch (e) {
      console.log("E", e);
      notify.error("Ocurrió un error al cargar la data", "Error");
    }
  });
  const filterAlert = (element, community) => element.community._id === community;
})();