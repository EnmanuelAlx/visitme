/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/dashboard";
  const TEMPLATE_NAME = "dashboard";
  const HB = MyApp; // handlebars;


  app.get(ROOT, context => {
    if (!app.getAccessToken()) return context.redirect("#/login");
    const { communities } = getSessionData();
    communitySelection(communities);
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
      .then(async data => {
        const { id } = data;
        const { user } = getSessionData();
        await postMainApi({ user: user.id }, `communities/${id}/administrator`);
        stopPreload();
        toastr.info("La comunidad ha sido añadida exitosamente");

      })
      .catch(e=>{
        stopPreload();
        toastr.error(e.responseJSON.error.name, "Error");
      });
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

  const communitySelection = communities => {
    const template = HB.templates["community-selection"];
    $("body").append(template(communities));
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
    });


    $("#community-modal").on("hidden.bs.modal", () => {
      $("#community-modal").modal("show");
    });

  };


  const initDashboard = () => {
    initCharts();
  };

})();
