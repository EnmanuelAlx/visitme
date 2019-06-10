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
      if ($(CONTAINER).exists()) startPreload(CONTAINER);
      else startPreload("body", "Cargando tu experiencia...");
      const { table, items } = await createCrud(
        "security",
        "SECURITY",
        template,
        CONTAINER,
        TEMPLATE_NAME
      );
      initListeners(table, items);
    } catch (error) {
      console.log("E", error);
      notify.error("Ocurrió un error al cargar la data", "Error");
    }
  });

  const triggerResidentDetail = data => {
    if ($("#user-detail-modal").exists()) {
      $("#user-detail-modal").modal("dispose");
      $("#user-detail-modal-container").remove();
    }

    const template = Handlebars.partials["user-detail"];
    $("body").append(template(data));
    $("#user-detail-modal").modal("show");
  };

  const initListeners = (table, items) => {
    let longpress = 200;
    let start;

    $("tr").on("mousedown", () => (start = new Date().getTime()));
    $("tr").on("mouseleave", () => (start = 0));
    $("tr").on("mouseup", event => {
      if (new Date().getTime() >= start + longpress) {
        $(event.currentTarget).addClass("selected");
        const selected = table.tableInstance.rows(".selected")[0];
        triggerResidentDetail(items[selected]);
      }
    });
  };
})();
