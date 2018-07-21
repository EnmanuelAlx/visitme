Handlebars.registerHelper("ifCond", function(v1, v2, options) {
  return v1 == v2 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifCondOr", function(v1, v2, v3, v4, options) {
  return v1 == v2 || v3 == v4 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("select", function(value, options) {
  const element = $("<select />").html(options.fn(this));
  element.find(`[value='${value}']`).attr({
    selected: "selected"
  });
  element.find("[value='']").removeAttr("selected");
  return element.html();
});

Handlebars.registerHelper("fillMonths", function() {
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

Handlebars.registerHelper("getTimezone", function() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
});

Handlebars.registerHelper("daysInWeek", function() {
  moment.locale("es");
  return moment.weekdays(true).map(week => _.capitalize(week));
});

Handlebars.registerHelper("daysInWeekSelect", function(currentWeek) {
  moment.locale("es");
  return new Handlebars.SafeString(
    moment
      .weekdays(true)
      .map(
        (week, index) =>
          `<option value="${index + 1}" ${
            currentWeek && currentWeek.toLowerCase() == week ? "selected" : ""
          }>${_.capitalize(week)}</option>`
      )
      .join(" ")
  );
});

Handlebars.registerHelper("limit", function(arr, limit) {
  if (!_.isArray(arr)) {
    return [];
  } // remove this line if you don't want the lodash/underscore dependency
  return arr.slice(0, limit);
});

Handlebars.registerHelper("tableColumns", columns => {
  const htmlStr = columns.map(column => `<th>${column}</th>`).join(" ");
  return new Handlebars.SafeString(htmlStr);
});

Handlebars.registerHelper("tableRows", rows => {
  const htmlStr = rows.map(row => `<tr>${renderRow(row)}</tr>`).join(" ");
  return new Handlebars.SafeString(htmlStr);
});

const renderRow = row => {
  return Object.keys(row)
    .map(key => renderByTypeOfValue(row[key]))
    .join(" ");
};

const renderByTypeOfValue = data => {
  const safeNull = data ? data : "N/A";
  return safeNull.match(/\.(jpeg|jpg|gif|png)$/) != null
    ? `<td style="padding:0;"><img src="${safeNull}" class="img-fluid w-25"></img></td>`
    : `<td>${safeNull}</td>`;
};
