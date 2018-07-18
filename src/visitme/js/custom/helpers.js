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

Handlebars.registerHelper("fillMonths", function (selectedMonth) {
  return new Handlebars.SafeString(
    MONTHS_NAMES.map(
      (month, index) =>
        `<option value="${index + 1}" ${
          selectedMonth == index + 1 ? "selected" : ""
        }>${month}</option>`
    ).join(" ")
  );
});

