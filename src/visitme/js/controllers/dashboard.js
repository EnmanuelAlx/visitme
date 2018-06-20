/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/dashboard";
  const TEMPLATE_NAME = "dashboard";
  const HB = MyApp; // handlebars;


  app.get(ROOT, () => {
    const template = HB.templates[TEMPLATE_NAME];
    loadTemplate(CONTAINER, TEMPLATE_NAME, template());
  });

})();
