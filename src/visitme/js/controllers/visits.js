/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/visits";
  const TEMPLATE_NAME = "visits";
  const HB = MyApp; // handlebars;


  app.get(ROOT, () => {
    const template = HB.templates[TEMPLATE_NAME];
    loadTemplate(CONTAINER, TEMPLATE_NAME, template());
  });
})();
