/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/admins";
  const TEMPLATE_NAME = "admins";
  const HB = MyApp; // handlebars;

  app.get(ROOT, async () => {
    try {
      const template = HB.templates[TEMPLATE_NAME];
      startPreload(CONTAINER);
      const { communities } = getSessionData();
      const community = communities.find(comm => comm.selected === true)._id;
      const admins = await getMainApi({}, `communities/${community}/admins`);
      const rows = format(admins);
      const columns = Object.keys(rows[0]);
      loadTemplate(
        CONTAINER,
        TEMPLATE_NAME,
        template({
          id: "adminTable",
          rows,
          columns
        })
      );
      $("#adminTable").DataTable({
        dom: "Bfrtrip",
        buttons: [
          {
            extend: "copy",
            className: "btn-table btn-sm btn-info btn-no-style",
            titleAttr: "Copy to clipboard",
            text: "Copiar al portapapeles",
            init: function (api, node, config) {
              $(node).removeClass("btn-default");
              $(node).append("<i class='fa fa-clone'></i>");
            }
          },
          {
            extend: "pdf",
            className: "btn-table btn-sm btn-secondary btn-no-style",
            titleAttr: "Copy to clipboard",
            text: "Exportar a PDF",
            init: function (api, node) {
              $(node).removeClass("btn-default");
              $(node).append("<i class='fa fa-file-pdf-o'></i>");
            }
          },
          {
            extend: "excel",
            className: "btn-table btn-sm btn-success-dark btn-no-style",
            titleAttr: "Export to Excel",
            text: "Exportar a Excel",
            init: function (api, node) {
              $(node).removeClass("btn-default");
              $(node).append("<i class='fa fa-file-excel-o'></i>");
            }
          },
          {
            text: "Eliminar",
            className: "btn-table btn-sm btn-danger btn-no-style",
            action: function() {
              console.log("DELETE ");
            },
            init: function (api, node) {
              $(node).removeClass("btn-default");
              $(node).append("<i class='fa fa-times'></i>");
            }
          },
          {
            text: "Añadir",
            className: "btn-table btn-sm btn-success btn-no-style",
            action: function() {
              console.log("DELETE ");
            },
            init: function (api, node) {
              $(node).removeClass("btn-default");
              $(node).append("<i class='fa fa-plus-circle'></i>");
            }
          }
        ],
        language: DATATABLES_SPANISH
      });
      $("#adminTable tbody").on("click", "tr", function() {
        $(this).toggleClass("selected");
      });
    } catch (e) {
      toastr.error("Ocurrió un error al cargar la data", "Error");
    }
  });
})();

const format = items => items.map(formatItem);

const formatItem = item => {
  return {
    nombre: item.user.name,
    cedula: item.user.identification,
    localidad: item.reference
  };
};
