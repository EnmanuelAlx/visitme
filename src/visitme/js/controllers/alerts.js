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
      information = information.filter(item => filterAlert(item, community));
      incident = incident.filter(item => filterAlert(item, community));
      other = other.filter(item => filterAlert(item, community));
      loadTemplate(CONTAINER, TEMPLATE_NAME, template({
        information,
        incident,
        other
      }));
      listenAlerts();
    } catch (e) {
      console.log("E", e);
      notify.error("Ocurrió un error al cargar la data", "Error");
    }
  });

  app.post(ROOT, context => {
    if (!app.getAccessToken()) return context.redirect("#/login");
    const data = $(context.target).serializeJSON();
    const { communities } = getSessionData();
    const community = communities.find(comm => comm.selected === true)._id;
    data.community = community;
    startPreload("#alert-modal");
    postMainApi(data, "alerts")
      .then(() => {
        stopPreload();
        $("#alert-modal").modal("hide");
        notify.info("Alerta registrada exitosamente", "Éxito");
        $(context.target).trigger("reset");
        app.refresh();
      })
      .catch(() => {
        stopPreload();
        notify.error("Ocurrió un error al registrar la alerta", "Error");

      });
  });

  const filterAlert = (element, community) => element.community._id === community;
  
  const listenAlerts = () => {
    $("#add-alert").click(()=>{
      if (!$("#alert-modal").exists()) {
        const template = Handlebars.partials["alert-modal"];
        $("body").append(template());
        $("#alerts-form").validate(FORM_VALIDATION_DEFAULTS);
        validateForms();
        $("#alert-select").select2();
      }
      $("#alert-modal").modal("show");
    });
  };
})();