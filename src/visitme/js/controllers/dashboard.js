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

    if (userType === "RESIDENT") return context.redirect("#/visits");

    if (userType === "SECURITY") return context.redirect("#/security");
    initOneSignal();
    app.runRoute("put", "#/dashboard");
  });

  app.put(ROOT, async () => {
    try {
      if ($(CONTAINER).exists()) startPreload(CONTAINER);
      else startPreload("body", "Cargando tu experiencia...");
      const template = HB.templates[TEMPLATE_NAME];
      loadTemplate(CONTAINER, TEMPLATE_NAME, template());
      await initDashboard();
    } catch (error) {
      console.log("E", error);
      notify.error("Ocurrió un error al cargar la data", "Error");
    }
  });

  app.post("#/add-community", context => {
    const data = $(context.target).serializeJSON();
    data.image = $("#community-logo")[0].files[0];
    const formData = new FormData();
    Object.keys(data).map(key => {
      const value = key === "image" ? data[key] : JSON.stringify(data[key]);
      formData.append(key, value);
    });
    const addComunity = multipartApi(formData, "communities", "POST");
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
        notify.info("La comunidad ha sido añadida exitosamente");
        await delay(500);
        location.reload();
      })
      .catch(e => {
        stopPreload();
        notify.error(e.responseJSON.error.name, "Error");
      });
  });

  app.post("#/join-community", context => {
    const { community, reference } = $(context.target).serializeJSON();
    const joinCommunity = postMainApi(
      { reference },
      `communities/${community}/join`
    );
    startPreload("#join-community-form");
    const name = $("#join-community-select option:selected").text();
    joinCommunity
      .then(() => {
        stopPreload();
        app.store.set("communities", [
          {
            name,
            selected: true,
            status: "pending",
            kind: "RESIDENT"
          }
        ]);
        app.store.set("userType", "RESIDENT");
        notify.info("Te has unido exitosamente a la comunidad");
        context.redirect("#/unverified");
      })
      .catch(e => {
        stopPreload();
        notify.error(e.responseJSON.error.name, "Error");
      });
  });

  app.post("#/select-community", context => {
    const { community } = $(context.target).serializeJSON();
    let { communities } = getSessionData();
    let name;
    communities = communities.map(comm => {
      comm.selected = false;
      if (comm._id === community) {
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

  const initCharts = async () => {
    const { communities } = getSessionData();
    const community = communities.find(comm => comm.selected === true)._id;
    await loadHourChart(community);
    await loadTypeChart(community);
    await loadWeeksChart(community);
  };

  const initDashboard = async () => {
    await initCharts();
  };

  const loadHourChart = async community => {
    const data = await getMainApi(
      {},
      `communities/stats/${community}/visitByPartOfDay?month=1`
    );
    new Chart($("#visits-hour"), {
      type: "bar",
      data: {
        datasets: [
          {
            backgroundColor: ["#209ECE", "#FF4A55", "#ff9f1c"],
            hoverBackgroundColor: ["#209ECE", "#FF4A55", "#ff9f1c"],
            data
          }
        ],
        labels: ["Mañana", "Tarde", "Noche", "Todo el dia", "Sin Especificar"]
      },
      options: {
        legend: {
          display: false
        }
      }
    });
  };

  const loadTypeChart = async community => {
    const data = await getMainApi(
      {},
      `communities/stats/${community}/visitsByType?month=1`
    );
    new Chart($("#visits-type"), {
      type: "pie",
      data: {
        datasets: [
          {
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
            data
          }
        ],
        labels: ["Esperada", "Frecuente", "Esporádica", "No Esperada"]
      },
      options: {
        elements: {
          arc: {
            borderWidth: 3
          }
        },
        legend: {
          display: false
        },
        pieceLabel: {
          render: "percentage",
          fontColor: "#FFF",
          precision: 2
        },
        tooltips: {
          mode: "label"
        }
      }
    });
  };

  const loadWeeksChart = async community => {
    const data = await getMainApi(
      {},
      `communities/stats/${community}/allVisitsByMonth?month=1`
    );
    new Chart($("#visits"), {
      type: "line",
      data: {
        labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
        datasets: [
          {
            pointRadius: 0,
            label: false,
            data,
            borderColor: "#20a0ce",
            backgroundColor: "#20a0ce",
            borderWidth: 3,
            lineTension: 0
          }
        ]
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
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
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
            }
          ]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.yLabel;
            }
          }
        }
      }
    });
  };

  const initOneSignal = () => {
    var OneSignal = window.OneSignal || [];

    OneSignal.push([
      "init",
      {
        appId: "3448c128-41d1-4813-a70f-14cb2ea55e9f",
        requiresUserPrivacyConsent: true,
        autoRegister: true /* Set to true to automatically prompt visitors */,
        notifyButton: {
          enable: false /* Set to false to hide */
        },
        welcomeNotification: {
          disable: true
        }
      }
    ]);

    OneSignal.isPushNotificationsEnabled(function(isEnabled) {
      console.log("ONE SIGNAL!", isEnabled);
      if (isEnabled) {
        OneSignal.getUserId(device => {
          const deviceSaved = app.store.get("device");
          if (!deviceSaved || device != deviceSaved) {
            postMainApi({ device }, "user/me/devices", "PUT").then(res =>
              app.store.set("device", device)
            );
          }
        });
        OneSignal.on("notificationDisplay", function(notification) {
          console.log("OneSignal notification displayed:", notification);
          handleNotification(notification);
        });
      }
    });
  };
})();
