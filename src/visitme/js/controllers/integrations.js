/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/integrations";
  const TEMPLATE_NAME = "integrations";
  const HB = MyApp; // handlebars;
  const eventTranslations = {
    ON_NEW_RESIDENT: "Nuevo Residente",
    ON_NEW_VISIT: "Nueva Visita",
    ON_ACCESS: "Acceso",
    ON_INCIDENT: "Alerta de Incidente",
    ON_INFORMATION: "Alerta de Informacion"
  };

  app.get(ROOT, async () => {
    try {
      const template = HB.templates[TEMPLATE_NAME];
      startPreload(CONTAINER);
      const { communities } = getSessionData();
      const community = communities.find(comm => comm.selected === true)._id;
      const items = await getMainApi({}, `communities/${community}/webhooks`);
      const columns = ["Evento", "URL"];
      const table = loadCustomTable(
        items,
        columns,
        format,
        "integrations",
        template,
        CONTAINER,
        TEMPLATE_NAME
      );
      const onDelete = onDeleteGenerator(community, items, table);
      const onAdd = addEventGenerator(community, items, table);
      table.addEvent("Eliminar", onDelete);
      table.addEvent("Add", onAdd);
      table.init();
    } catch (error) {
      console.log("EEE", error);
      toastr.error("Ocurrió un error al cargar la data", "Error");
    }
  });

  const onDeleteGenerator = (community, items, table) => {
    return async pos => {
      confirm("¿Esta seguro?", async () => {
        const promises = pos.map(i =>
          deleteMainApi(`communities/${community}/webhooks/${items[i]._id}`)
        );
        await Promise.all(promises);
        table.remove(pos);
        items = items.filter((item, index) => pos.indexOf(index) === -1);
      });
    };
  };

  const showWeebhooks = callback => {
    if (!$("#webhooks-modal").exists()) {
      const template = Handlebars.partials["webhooks-modal"];
      $("body").append(template());
      $("#webhooks-select").select2();
      $("#addition-form").validate(FORM_VALIDATION_DEFAULTS);
      validateForms();

      $("#webhooks-modal").modal("show");

      $(".addition-cb").click(async event => {
        try {
          startPreload("#webhooks-modal");
          const form = $(event.target.form);
          const result = form.serializeJSON();
          form.trigger("reset");
          $("#webhooks-select").val("");
          $("#webhooks-select").trigger("change");
          await callback(result);
          $("#webhooks-modal").modal("hide");
          notify.info("Solicitud exitosa", "Éxito");
        } catch (error) {
          console.log("error", error);
          notify.error("Ocurrió un error al agregar", "Error");
        } finally {
          stopPreload();
        }
      });
    }
  };
  

  const addEventGenerator = (community, items, table) => {
    return async () => {
      showWeebhooks(async data => {
        try {
          const added = await postMainApi(data, `communities/${community}/webhooks`);
          table.add(format([data]));
          items.push(added);
        } catch (error) {
          console.log("error", error);
          throw error;
        }
      });
    };
  };


  const format = items => {
    return items.map(item => ({
      type: eventTranslations[item.eventType],
      url: item.endpoint
    }));
  };
})();
