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
      startPreload("#unexpected-form");
      const { communities } = getSessionData();
      const community = communities.find(comm => comm.selected === true)._id;
      const visit = await postMainApi(
        data,
        `communities/${community}/shouldEnter`,
        "PUT"
      );
      const check = await postMainApi({}, `visits/${visit.id}/checkIn`, "PUT");
      notify.info("Visita verificada", "Éxito");
      stopPreload();
    } catch (e) {
      console.log("ERROR", e);
      stopPreload();
      notify.error("Visita no encontrada", "Error");
      $("#expected-div").hide();
      $("#unexpected-div").show();
    }
  });

  app.post(`${ROOT}/unexpected`, async context => {
    try {
      if (!app.getAccessToken()) return context.redirect("#/login");
    } catch (e) {
      stopPreload();
    }
  });

  const initListeners = () => {
    $("#unexpected-form,#expected-form").submit(e => e.preventDefault());
  };
})();
