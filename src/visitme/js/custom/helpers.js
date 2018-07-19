Handlebars.registerHelper("ifCond", function (v1, v2, options) {
  return v1 == v2 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifCondOr", function (v1, v2, v3, v4, options) {
  return v1 == v2 || v3 == v4 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("select", function (value, options) {
  const element = $("<select />").html(options.fn(this));
  element.find(`[value='${value}']`).attr({
    selected: "selected"
  });
  element.find("[value='']").removeAttr("selected");
  return element.html();
});

Handlebars.registerHelper("fillMonths", function () {
  const currentMonth = moment().month();
  return new Handlebars.SafeString(
    MONTHS_NAMES.map(
      (month, index) =>
        `<option value="${index + 1}" ${
          currentMonth == index + 1 ? "selected" : ""
        }>${month}</option>`
    ).join(" ")
  );
});


Handlebars.registerHelper("getTimezone", function () {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
});

Handlebars.registerHelper("daysInWeek", function () {
  moment.locale("es");
  return moment.weekdays(true).map(week => _.capitalize(week));
});

Handlebars.registerHelper("daysInWeekSelect", function (currentWeek) {
  moment.locale("es");
  return new Handlebars.SafeString(
    moment.weekdays(true).map(
      (week, index) =>
        `<option value="${index + 1}" ${
          currentWeek && currentWeek.toLowerCase() == week ? "selected" : ""
        }>${_.capitalize(week)}</option>`
    ).join(" ")
  );
});

Handlebars.registerHelper("limit", function (arr, limit) {
  if (!_.isArray(arr)) {
    return [];
  } // remove this line if you don't want the lodash/underscore dependency
  return arr.slice(0, limit);
});





