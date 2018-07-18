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
