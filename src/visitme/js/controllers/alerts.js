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
      startPreload(CONTAINER);
      const alerts = await getMainApi({}, "/user/me/alerts/info");
      loadTemplate(CONTAINER, TEMPLATE_NAME, template(alerts));
    } catch (e) {
      console.log("E", e);
      notify.error("Ocurrió un error al cargar la data", "Error");
    }
  });
})();