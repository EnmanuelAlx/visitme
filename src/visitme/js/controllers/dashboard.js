/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/dashboard";
  const TEMPLATE_NAME = "dashboard";
  const HB = MyApp; // handlebars;


  app.get(ROOT, async context => {
    if (!app.getAccessToken()) return context.redirect("#/login");
    const { communities, allCommunities } = getSessionData();
    stopPreload();
    const hasSelected = communities.filter(comm => comm.selected === true).length > 0;
    if (!hasSelected)
      return communitySelection(communities, allCommunities);
    
    app.runRoute("put", "#/dashboard");
  });


  app.put(ROOT, () => {
    const template = HB.templates[TEMPLATE_NAME];
    loadTemplate(CONTAINER, TEMPLATE_NAME, template());
    initDashboard();
  });

  app.post("#/add-community", context => {
    const data = $(context.target).serializeJSON();
    const addComunity = postMainApi(data, "communities");
    startPreload("#add-community-form");
    addComunity
      .then(res => {
        res.status = "APPROVED";
        app.store.set("communities", [res]);
        stopPreload();
        toastr.info("La comunidad ha sido añadida exitosamente");
        context.redirect("#/dashboard");
      })
      .catch(e=>{
        stopPreload();
        toastr.error(e.responseJSON.error.name, "Error");
      });
  });


  app.post("#/join-community", context => {
    const { community, reference } = $(context.target).serializeJSON();
    const joinCommunity = postMainApi({ reference }, `communities/${community}/join`);
    startPreload("#join-community-form");
    const name = $("#join-community-select option:selected").text();
    joinCommunity
      .then(() => {
        stopPreload();
        app.store.set("communities", [{
          name,
          selected: true,
          status: "pending",
          kind: "RESIDENT"
        }]);
        app.store.set("userType", "RESIDENT");
        toastr.info("Te has unido exitosamente a la comunidad");
        context.redirect("#/dashboard");
      })
      .catch(e => {
        stopPreload();
        toastr.error(e.responseJSON.error.name, "Error");
      });
  });


  app.post("#/select-community", context => {
    const { community } = $(context.target).serializeJSON();
    let { communities } = getSessionData();
    let name;
    communities = communities.map(comm => {
      comm.selected = false;
      if (comm._id === community){
        name = comm.name;
        comm.selected = true;
        app.store.set("userType", comm.kind);
      }
      return comm;
    });
    app.store.set("communities", communities);
    $("#community-modal").modal("hide");
    $("#community-name").text(name);
    app.runRoute("put", "#/dashboard");
  });

  const initCharts = () => {
    new Chart($("#visits-hour"), {
      type: "bar",
      data: {
        datasets: [{
          backgroundColor: [
            "#209ECE",
            "#FF4A55",
            "#ff9f1c"
          ],
          hoverBackgroundColor: [
            "#209ECE",
            "#FF4A55",
            "#ff9f1c"
          ],
          data: [15, 25, 50, 52]
        }],
        labels: ["Mañana", "Tarde", "Noche"]
      },
      options:{
        legend: {
          display: false,
        }
      }
    });
    new Chart($("#visits-type"), {
      type: "pie",
      data: {
        datasets: [{
          backgroundColor: [
            "#209ECE",
            "#FF4A55",
            "#ff9f1c",
            "#2ec4b6",
            "#046589"
          ],
          hoverBackgroundColor: [
            "#209ECE",
            "#FF4A55",
            "#ff9f1c",
            "#2ec4b6",
            "#046589"
          ],
          data: [15, 25, 50, 52]
        }],
        labels: ["Esperada", "Inesperada", "Esporádica", "Recurrente"]
      },
      options: {
        elements: {
          arc: {
            borderWidth: 3
          }
        },
        legend: {
          display: false,
        },
        pieceLabel: {
          render: "percentage",
          fontColor: "#FFF",
          precision: 2,
        },
        tooltips: {
          mode: "label",
        }
      }});
    new Chart($("#visits"), {
      type: "line",
      data: {
        labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
        datasets: [{
          pointRadius: 0,
          label: false,
          data: [78, 60, 79, 15],
          borderColor: "#20a0ce",
          backgroundColor: "#20a0ce",
          borderWidth: 3,
          lineTension: 0
        }]
      },
      options: {
        elements: {
          line: {
            tension: 0, // disables bezier curves
            fill: false
          }
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true, // minimum value will be 0.
              stepsize: 2,
              maxTicksLimit: 5,
              max: 100,
              callback: value => {
                if (Number.isInteger(value)) {
                  return value;
                }
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.yLabel;
            }
          }
        }
      }
    });
  };

  const communitySelection = (communities, allCommunities) => {
    const template = Handlebars.partials["community-selection"];
    communities = communities.filter(com => com.status === "APPROVED");
    const data = {
      communities,
      allCommunities
    };

    $("body").append(template(data));
    $("#community-modal").modal("show");
    $(".no-community").click(event => {

      $(".community-choice").hide();
      $(`#${event.currentTarget.id}-div`).show();
      $("#add-community-form").validate({
        focusCleanup: true,
        errorPlacement: (label, element) => {
          label.addClass("invalid-feedback");
          label.insertAfter(element);
        },
        lang: "es",
        wrapper: "div"
      });

    
      validateForms();

      $("#join-community-select").select2({
        language: {
          noResults: () => "No se encontraron resultados",
          searching: () => "Buscando..."
        }
      });
    });


    $("#community-modal").on("hidden.bs.modal", () => {
      const { communities } = getSessionData();
      const hasSelected = communities.filter(comm => comm.selected === true).length > 0;
      if (!hasSelected)
        $("#community-modal").modal("show");
    });

  };


  const initDashboard = () => {
    initCharts();
  };

  $(document).on("click", ".property-option img", event => {
    const target = $(event.currentTarget);
    const radioInput = target.prev();
    radioInput[0].checked = true;
    $("img").removeClass("checked");
    target.addClass("checked");
  });


})();
