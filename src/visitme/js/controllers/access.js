/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/access";
  const TEMPLATE_NAME = "access";
  const HB = MyApp; // handlebars;

  app.get(ROOT, async context => {
    if (!app.getAccessToken()) return context.redirect("#/login");
    const template = HB.templates[TEMPLATE_NAME];
    if ($(CONTAINER).exists()) startPreload(CONTAINER);
    else startPreload("body", "Cargando tu experiencia...");
    loadTemplate(CONTAINER, TEMPLATE_NAME, template());
    initListeners();
  });

  app.post(ROOT, async context => {
    try {
      if (!app.getAccessToken()) return context.redirect("#/login");
      const data = $(context.target).serializeJSON();
      startPreload(CONTAINER);
      const image = $("#access-profile")[0].files[0];
      if (image) data.image = image;
      const formData = new FormData();
      Object.keys(data).map(key => {
        const value = key === "address" ? JSON.stringify(data[key]) : data[key];
        formData.append(key, value);
      });
      await multipartApi(formData, "user/me", "PUT");
      notify.info("Tus datos fueron modificados exitosamente", "Éxito");
      app.refresh();
    } catch (e) {
      stopPreload();
      notify.error("Ocurrió un error al guardar tus datos", "Error");
    }
  });

  const initListeners = () => {

    $("#access-form").submit(e => e.preventDefault());
  };
})();