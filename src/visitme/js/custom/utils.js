/*exported delay loadTemplate*/

const delay = (t, v) => {
  return new Promise(resolve => {
    setTimeout(resolve.bind(null, v), t);
  });
};

const loadTemplate = (container, template) => {

  if (!$(container).exists()) {
    const session = getCurrentData().session;

    const index = Global.templates["index"];
    $("body").html(index({ session }));
  }
  $(container)
    .hide()
    .html(template)
    .fadeIn(500);
};