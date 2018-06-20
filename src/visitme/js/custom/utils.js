/*exported delay loadTemplate*/

const delay = (t, v) => {
  return new Promise(resolve => {
    setTimeout(resolve.bind(null, v), t);
  });
};

$.fn.exists = function () {
  return this.length !== 0;
};

const loadTemplate = (container, name, template) => {

  if (!$(container).exists()) {
    //const session = getCurrentData().session;
    const index = MyApp.templates["main"];
    $("body").html(index());
  }

  $(container)
    .hide()
    .html(template)
    .fadeIn(500);
    
};