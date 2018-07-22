class Table {
  constructor(id) {
    this.events = [];
    this.tableInstance = null;
    this.buttons = [
      {
        extend: "copy",
        className: "btn-table btn-sm btn-info btn-no-style",
        titleAttr: "Copy to clipboard",
        text: "Copiar al portapapeles",
        init: function(api, node) {
          $(node).removeClass("btn-default");
          $(node).append("<i class='fa fa-clone'></i>");
        }
      },
      {
        extend: "pdf",
        className: "btn-table btn-sm btn-secondary btn-no-style",
        titleAttr: "Copy to clipboard",
        text: "Exportar a PDF",
        init: function(api, node) {
          $(node).removeClass("btn-default");
          $(node).append("<i class='fa fa-file-pdf-o'></i>");
        }
      },
      {
        extend: "excel",
        className: "btn-table btn-sm btn-success-dark btn-no-style",
        titleAttr: "Export to Excel",
        text: "Exportar a Excel",
        init: function(api, node) {
          $(node).removeClass("btn-default");
          $(node).append("<i class='fa fa-file-excel-o'></i>");
        }
      },
      {
        text: "Eliminar",
        className: "btn-table btn-sm btn-danger btn-no-style",
        action: () => {
          const data = this.tableInstance.rows(".selected")[0];
          this.events["Eliminar"](data);
        },
        init: function(api, node) {
          $(node).removeClass("btn-default");
          $(node).append("<i class='fa fa-times'></i>");
        }
      },
      {
        text: "Añadir",
        className: "btn-table btn-sm btn-success btn-no-style",
        action: () => {
          const data = this.tableInstance.rows(".selected")[0];
          this.events["Add"](data);
        },
        init: function(api, node) {
          $(node).removeClass("btn-default");
          $(node).append("<i class='fa fa-plus-circle'></i>");
        }
      }
    ];
    this.id = id;
  }

  init() {
    this.tableInstance = $("#" + this.id).DataTable({
      dom: "Bfrtrip",
      buttons: this.buttons,
      language: DATATABLES_SPANISH
    });
    this.tableInstance.columns.adjust().draw();
    $("#" + this.id + " tbody").on("click", "tr", function() {
      $(this).toggleClass("selected");
    });
  }

  addEvent(eventName, trigger) {
    this.events[eventName] = trigger;
  }

  remove(pos) {
    pos.forEach(i => {
      this.tableInstance
        .row(i)
        .remove()
        .draw(false);
    });
    $("tr.selected").removeClass("selected");
  }

  add(items) {
    items.forEach(item => {
      this.tableInstance.row.add(this.toArrayOfValues(item)).draw(false);
    });
  }

  toArrayOfValues(obj) {
    const keys = Object.keys(obj);
    return keys.map(key => renderByTypeOfValue(obj[key]));
  }

  addButton(button) {
    this.buttons.push({
      text: button,
      className: "btn-table btn-sm btn-success btn-no-style",
      action: () => {
        const data = this.tableInstance.rows(".selected")[0];
        this.events[button](data);
      },
      init: function(api, node) {
        $(node).removeClass("btn-default");
        $(node).append("<i class='fa fa-plus-circle'></i>");
      }
    });
  }

  removeButton(buttonName) {
    this.buttons = this.buttons.filter(button => button.text !== buttonName);
  }
}
