/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/visits";
  const TEMPLATE_NAME = "visits";
  const HB = MyApp; // handlebars;


  app.get(ROOT, async context => {
    if (!app.getAccessToken()) return context.redirect("#/login");
    if ($(CONTAINER).exists()) startPreload(CONTAINER);
    else startPreload("body", "Cargando tu experiencia...");
    const template = HB.templates[TEMPLATE_NAME];
    const { communities } = getSessionData();
    const community = communities.find(comm => comm.selected === true)._id;
    let sporadic = (await getMainApi({}, "user/me/visits/SPORADIC")).visits;
    let scheduled = (await getMainApi({}, "user/me/visits/SCHEDULED")).visits;
    let frequent = (await getMainApi({}, "user/me/visits/FREQUENT")).visits;
    sporadic = sporadic.filter(item => filterAlert(item, community));
    scheduled = scheduled.filter(item => filterAlert(item, community));
    frequent = frequent.filter(item => filterAlert(item, community));

    loadTemplate(CONTAINER, TEMPLATE_NAME, template({
      sporadic,
      scheduled,
      frequent
    }));
    handleVisits();
  });

  app.post(ROOT, context => {
    startPreload(CONTAINER);
    const data = $(context.target).serializeJSON();
    if(data.intervals)
      data.intervals = data.intervals.map(item => {
        item.from = item.from.replace(":","");
        item.to = item.to.replace(":","");
        return item;
      });
    if (data.visit){
      const { year, month, day } = data.visit;
      data.dayOfVisit = `${year}-${month}-${day}`;
    }
    const { communities } = getSessionData();
    data.community = communities.find(comm => comm.selected === true)._id;
    postMainApi(data,"visits")
      .then(()=> {
        stopPreload();
        notify.info("Visita creada exitosamente", "Éxito");
        app.refresh();
      })
      .catch(() => {
        stopPreload();
        notify.error("No se pudo crear visita", "Error");
      });
  });

  const filterAlert = (element, community) => element.community._id === community;

  const handleVisits = () => {
    $("button.add-visit").click(()=>{
      $("div.add-visit").toggle();
      $("div.list-visits").toggle();
    });

    $("#visit-type").click(()=>{
      const type = $("input[name='visit-type']:checked").val();
      $("div.visit-container").html(Handlebars.partials["visit-data"]({
        type
      }));
      listenDates();
      listenIntervals();
    });
  };

  const listenIntervals = () => {
    $(".add-interval").click(()=>{
      $("div.intervals").append(Handlebars.partials["interval"]("Lunes"));
      bindRemove();
    });

    const bindRemove = () => 
      $(".remove-interval").click(async event => {
        const row = $(event.currentTarget).closest(".form-row");
        row.hide(()=>{
          row.remove();
        });
      });
    bindRemove();
  };

  const listenDates = () => {
    const setDays = (daySelector, lastDay) => {
      let selected = daySelector.find(":selected").attr("value");
      const dayOptions = Array.from(
        Array(lastDay).keys(),
        val => `<option value="${val + 1}">${val + 1}</option>`
      ).join(" ");
      daySelector
        .html(dayOptions)
        .prepend("<option value='' disabled>Día</option>");

      if (!daySelector.find(`[value='${selected}']`).exists()) selected = "1";
      daySelector.val(selected);
    };

    if ($("#visit-day").length > 0) {
      let daySelector = $("#visit-day"),
        yearSelector = $("#visit-year"),
        monthSelector = $("#visit-month");

      let day = new Date(),
        lastDay = 0,
        currentYear = moment().year();

      if (!$("#visit-year :selected:not(:disabled)").exists()) {
        let yearOptions = "";
        for (let i = currentYear; i <= currentYear+1; i++) {
          yearOptions += `<option value="${i}">${i}</option>`;
        }
        yearSelector
          .html(yearOptions)
          .prepend("<option value='' disabled selected>Año</option>");
      }

      if (!$("#visit-month :selected:not(:disabled)").exists()) {
        monthSelector
          .html(
            MONTHS_NAMES.map(
              (month, index) => `<option value="${index + 1}">${month}</option>`
            ).join(" ")
          )
          .prepend("<option value='' disabled selected>Month</option>");
      }

      monthSelector.change(function () {
        var selectedMonth = parseInt(this.value);
        console.log("selected", selectedMonth);
        lastDay = moment(
          `${day.getFullYear()}-${selectedMonth}`,
          "YYYY-M"
        ).daysInMonth();
        setDays(daySelector, lastDay);
      });
      monthSelector.trigger("change");
      daySelector.val(moment().date());
      yearSelector.val(moment().year());
    }


  };

})();
