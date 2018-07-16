/*exported delay getSessionData validateForms getQuery loadTemplate*/

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
    const session =  getSessionData();
    const { communities } = session;
    const approvedCommunities = communities.find(comm => comm.status === "APPROVED");
    const community = communities.find(comm => comm.selected === true);
    const data = {
      session,
      community,
      approvedCommunities
    };
    const index = MyApp.templates["main"];
    $("body").html(index(data));
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

$.fn.getType = function () {
  return this[0].tagName == "INPUT" ?
    this[0].type.toLowerCase() :
    this[0].tagName.toLowerCase();
};

$.fn.exists = function () {
  return this.length !== 0;
};


const validateForms = () => {
  $(":input").on("focus", event => {
    validateInputForms(event.currentTarget);
  });

  const validateInputForms = input => {
    const form = $(input)
      .closest("form")
      .attr("id");

    $(`#${form} :input`).each((idx, element) => {
      if (element == input) return false;
      if (!$(element).val()) $(element).valid();
      if ($(element).getType() === "radio") $(element).valid();
    });
  };
};

const getSessionData = () => {
  const app = Sammy.apps.body;
  const session = app.store;
  const sessionData = {};
  session.each((key, value) => {
    sessionData[key] = value;
  });
  return sessionData;
};

$.fn.select2.defaults.set("theme", "bootstrap4");