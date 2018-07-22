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
      await createCrud(
        "admins",
        "ADMINISTRATOR",
        template,
        CONTAINER,
        TEMPLATE_NAME
      );
    } catch (e) {
      console.log("E", e);
      toastr.error("Ocurrió un error al cargar la data", "Error");
    }
  });
})();
