/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/dashboard";
  const TEMPLATE_NAME = "dashboard";
  const HB = MyApp; // handlebars;


  app.get(ROOT, async context => {
    if (!app.getAccessToken()) return context.redirect("#/login");
    const { userType } = getSessionData();

    if(userType === "RESIDENT")
      return context.redirect("#/visits");

    if (userType === "SECURITY")
      return context.redirect("#/security");

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
      .then(async res => {
        res.status = "APPROVED";
        res.selected = true;
        let { communities } = getSessionData();
        communities = communities.map(comm => {
          comm.selected = false;
          return comm;
        });
        communities.push(res);
        app.store.set("communities", communities);
        app.store.set("userType", "ADMINISTRATOR");
        stopPreload();
        toastr.info("La comunidad ha sido añadida exitosamente");
        await delay(500);
        location.reload();
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
        context.redirect("#/unverified");
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
    location.reload();
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


  const initDashboard = () => {
    initCharts();
  };

})();
