/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/account";
  const TEMPLATE_NAME = "account";
  const HB = MyApp; // handlebars;

  app.get(ROOT, async context => {
    if (!app.getAccessToken()) return context.redirect("#/login");
    const template = HB.templates[TEMPLATE_NAME];
    startPreload(CONTAINER);
    const data = await getMainApi({}, "user/me");
    data.address = data.address || {};
    loadTemplate(CONTAINER, TEMPLATE_NAME, template(data));
  });

  app.post(ROOT, context => {
    if (!app.getAccessToken()) return context.redirect("#/login");
    const data = $(context.target).serializeJSON();
    startPreload(CONTAINER);
    putMainApi(data, "user/me")
      .then(()=>{
        toastr.info("Tus datos fueron modificados exitosamente", "Éxito");
        app.refresh();
      })
      .catch(()=>{
        toastr.error("Ocurrió un error al guardar tus datos", "Error");
      }).finally(()=>{
        stopPreload();
      });
  });
})();