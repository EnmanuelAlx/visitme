/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/security";
  const TEMPLATE_NAME = "security";
  const HB = MyApp; // handlebars;

  app.get(ROOT, async () => {
    try {
      const template = HB.templates[TEMPLATE_NAME];
      startPreload(CONTAINER);
      await createCrud(
        "security",
        "SECURITY",
        template,
        CONTAINER,
        TEMPLATE_NAME
      );
    } catch (error) {
      console.log("E", e);
      toastr.error("Ocurrió un error al cargar la data", "Error");
    }
  });
})();
