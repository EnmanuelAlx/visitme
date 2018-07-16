Handlebars.registerHelper("ifCond", function (v1, v2, options) {
  return v1 == v2 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifCondOr", function (v1, v2, v3, v4, options) {
  return v1 == v2 || v3 == v4 ? options.fn(this) : options.inverse(this);
});
