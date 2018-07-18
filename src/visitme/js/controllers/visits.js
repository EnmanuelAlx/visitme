/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/visits";
  const TEMPLATE_NAME = "visits";
  const HB = MyApp; // handlebars;


  app.get(ROOT, () => {
    const template = HB.templates[TEMPLATE_NAME];
    loadTemplate(CONTAINER, TEMPLATE_NAME, template());
    handleVisits();
  });

  const handleVisits = () => {
    $("#add-visit").click(()=>{
      $("div.add-visit").show();
    });

    $("#visit-type").click(()=>{
      const type = $("input[name='visit-type']").val();
      $("div.visit-container").html(Handlebars.partials["visit-data"]({
        type
      }));
    });

    listenDates();
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
        .prepend("<option value='' disabled>Day</option>");

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
        for (let i = currentYear - 18; i > currentYear - 100; i--) {
          yearOptions += `<option value="${i}">${i}</option>`;
        }
        yearSelector
          .html(yearOptions)
          .prepend("<option value='' disabled selected>Year</option>");
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
        lastDay = moment(
          `${day.getFullYear()}-${selectedMonth}`,
          "YYYY-M"
        ).daysInMonth();
        setDays(daySelector, lastDay);
      });
    }


  };

})();
