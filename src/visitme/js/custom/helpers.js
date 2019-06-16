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
          currentMonth == index ? "selected" : ""
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
  const htmlStr = columns
    .map((column, idx) =>
      idx === 0 ? `<th width="5%">${column}</th>` : `<th>${column}</th>`
    )
    .join(" ");
  return new Handlebars.SafeString(htmlStr);
});

Handlebars.registerHelper("tableRows", rows => {
  const htmlStr = rows.map(row => `<tr>${renderRow(row)}</tr>`).join(" ");
  return new Handlebars.SafeString(htmlStr);
});

const renderRow = row => {
  const keys = Object.keys(row).filter(r => r !== "timestamp");
  return keys
    .map(key => renderByTypeOfValue(row[key], key, row["timestamp"]))
    .join(" ");
};

const renderByTypeOfValue = (data, key, timestamp) => {
  const safeNull = data ? data : "N/A";
  if (key === "lastIn" && timestamp) {
    const unixTimestamp =
      moment(timestamp)
        .local()
        .valueOf() || 0;
    return `<td data-order='${unixTimestamp}'>${safeNull}</td>`;
  }
  return safeNull.match(/\.(jpeg|jpg|gif|png)$/) != null
    ? `<td class="p-1"><img src="${safeNull}" class="img-fluid"></img></td>`
    : `<td>${safeNull}</td>`;
};

Handlebars.registerHelper("formatTimeAgo", timestamp => {
  const _moment = moment(timestamp).local();
  return `${_moment.fromNow()}`;
});

Handlebars.registerHelper("formatHour", hour => {
  hour = hour.toString();
  if (hour.length === 3) hour = `0${hour}`;
  return moment(hour, "hhmm").format("hh:mm a");
});

Handlebars.registerHelper("momentDateFormat", (timestamp, format) =>
  moment(timestamp).format(format)
);

Handlebars.registerHelper("getWeekName", weekNumber =>
  _.capitalize(moment.weekdays(true)[weekNumber - 1])
);
Handlebars.registerHelper("timeOfDay", partOfDay => {
  const days = {
    MORNING: "Mañana",
    AFTERNOON: "Tarde",
    NIGH: "Noche",
    "ALL DAY": "Todo el día"
  };
  return days[partOfDay];
});

Handlebars.registerHelper("timeOfDay", partOfDay => {
  const days = {
    MORNING: "Mañana",
    AFTERNOON: "Tarde",
    NIGH: "Noche",
    "ALL DAY": "Todo el día"
  };
  return days[partOfDay];
});

Handlebars.registerHelper("activeVisit", (dayOfVisit, timezone) => {
  return moment(dayOfVisit)
    .tz(timezone)
    .isSameOrAfter(moment());
});

Handlebars.registerHelper("fillFrequents", intervals => {
  const arr = new Array(7 - intervals.length).fill("<td></td>");
  return new Handlebars.SafeString(arr.join(""));
});
