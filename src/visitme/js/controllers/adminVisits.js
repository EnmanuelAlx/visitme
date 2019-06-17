/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/adminVisits";
  const TEMPLATE_NAME = "adminVisits";
  const HB = MyApp; // handlebars;
  const kindTranslations = {
    SPORADIC: "Esporadica",
    FREQUENT: "Frecuente",
    SCHEDULED: "Esperada",
    "NOT EXPECTED": "No Esperada"
  };

  const partOfDayTranslation = {
    AFTERNOON: "Tarde",
    NIGHT: "Noche",
    MORNING: "Mañana",
    "ALL DAY": "Todo el Dia"
  };

  app.get(ROOT, async () => {
    try {
      const template = HB.templates[TEMPLATE_NAME];
      startPreload(CONTAINER);
      const { communities } = getSessionData();
      const community = communities.find(comm => comm.selected === true)._id;
      const items = await getMainApi({}, `communities/${community}/visits`);
      const columns = [
        "Tipo",
        "Horario",
        "Residente",
        "Invitado",
        "Localidad",
        "Ultima entrada"
      ];
      const table = loadCustomTable(
        items,
        columns,
        format,
        "adminVisits",
        template,
        CONTAINER,
        TEMPLATE_NAME
      );
      table.removeButton("Añadir");
      table.removeButton("Eliminar");
      table.init({ order: [[5, "desc"]] });
      initListeners(table, items);
    } catch (error) {
      toastr.error("Ocurrió un error al cargar la data", "Error");
    }
  });

  const format = items => items.map(formatItem);

  const formatItem = item => {
    return {
      kind: kindTranslations[item.kind],
      partDay: partOfDayTranslation[item.partOfDay],
      resident: item.resident.name,
      guest: item.guest.name,
      locality: item.community_user.find(
        ({ community, user }) =>
          community === item.community && user === item.resident.id
      ).reference,
      lastIn: findLastIn(item.checks),
      timestamp: item.checks[0] && item.checks[0].created_at
    };
  };

  const findLastIn = checks => {
    let maxDate = moment(checks[0].created_at);
    for (let i = 1; i < checks.length; i++) {
      if (moment(checks[i].created_at) > maxDate)
        maxDate = moment(checks[i].created_at);
    }
    return moment(maxDate).fromNow();
  };

  const triggerVisitDetail = data => {
    if ($("#visit-detail-modal").exists()) {
      $("#visit-detail-modal").modal("dispose");
      $("#visit-detail-modal-container").remove();
    }

    const template = Handlebars.partials["visit-detail"];
    $("body").append(template(data));
    $("#visit-detail-modal").modal("show");
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
        triggerVisitDetail(items[selected]);
      }
    });
  };
})();
