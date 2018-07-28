/*global*/
(() => {
  const app = Sammy.apps.body;
  const MAIN_CONTAINER = ".content";
  const ROOT = "#/residents";
  const MAIN_TEMPLATE_NAME = "resident";
  const TABLE_TEMPLATE_NAME = "residentTable";
  const CONTAINER1 = ".container1";
  const CONTAINER2 = ".container2";
  const HB = MyApp; // handlebars;

  const approveGenerator = (
    pendingTable,
    approveTable,
    pendingItems,
    community
  ) => {
    return async pos => {
      confirm("¿Esta seguro?", async () => {
        const promises = pos.map(i =>
          putMainApi(
            {},
            `communities/${community}/approve/${pendingItems[i].user._id}`
          )
        );
        try {
          await Promise.all(promises);
          pendingTable.remove(pos);
          approveTable.add(format(pos.map(i => pendingItems[i])));
        } catch (error) {
          console.log("ERR", error);
        }
      });
    };
  };

  app.get(ROOT, async () => {
    try {
      const template = HB.templates[MAIN_TEMPLATE_NAME];
      const templateTable = HB.templates[TABLE_TEMPLATE_NAME];
      if ($(MAIN_CONTAINER).exists()) startPreload(MAIN_CONTAINER);
      else startPreload("body", "Cargando tu experiencia...");
      const { communities } = getSessionData();
      const community = communities.find(comm => comm.selected === true)._id;
      const items = await getMainApi({}, `communities/${community}/residents`);
      const approved = items.filter(item => item.status === "APPROVED");
      const pending = items.filter(item => item.status === "PENDING");
      const templateStr = template();
      loadTemplate(MAIN_CONTAINER, MAIN_TEMPLATE_NAME, templateStr);
      const approveTable = loadTable(
        approved,
        "approvedTable",
        "RESIDENT",
        templateTable,
        CONTAINER1,
        TABLE_TEMPLATE_NAME
      );
      approveTable.init();

      const pendingTable = loadTable(
        pending,
        "pendingTable",
        "RESIDENT",
        templateTable,
        CONTAINER2,
        TABLE_TEMPLATE_NAME
      );

      const onApprove = approveGenerator(
        pendingTable,
        approveTable,
        pending,
        community
      );

      pendingTable.removeButton("Añadir");
      pendingTable.addButton("Aprobar");
      pendingTable.addEvent("Aprobar", onApprove);
      pendingTable.init();
    } catch (e) {
      console.log("E", e);
      notify.error("Ocurrió un error al cargar la data", "Error");
    }
  });
})();
