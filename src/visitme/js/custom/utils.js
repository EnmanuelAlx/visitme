/*exported delay getQuery loadTemplate*/

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


/*exported startPreload  stopPreload*/
const startPreload = (container, text = "") => {
  const contentClass = (container == ".content") ? "col-md-10 offset-md-2 position-fixed" : "position-absolute";
  const preloadContent = 
    `<div id="preload" class="preload ${contentClass}">
      <div class="row h-100 justify-content-center align-items-center">
        <div class="col-12 text-center">
          <div class="ld ld-ring ld-spin-fast huge text-primary">
        </div>
        <h6 class="mt-3 font-weight-s-bold">${text}</h6>
      </div>`;

  if (text) text = text + "...";
  stopPreload(container);

  $(container).append(preloadContent);
};

const stopPreload = (container) => {
  if (!container) container = "body";
  $(container).find("#preload").remove();
};

const getQuery = (path, query) => {
  const results = new RegExp("[?&]" + query + "=([^&#]*)").exec(path);
  if (results) return results[1];
  return false;
};
