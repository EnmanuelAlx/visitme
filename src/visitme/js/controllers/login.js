/*global*/
(async () => {
  const app = Sammy.apps.body;
  const store = app.store;
  const BODY = "body";
  const ROOT = "#/login";
  const TEMPLATE_NAME = "login";
  const HB = Global; // handlebars;
  const SESSION_DENIED = "oauth.denied";
  const SESSION_CONNECTED = "oauth.connected";
  const SESSION_ENDED = "oauth.disconnected";


  /* ================  SAMPLE CODE   ============================ */

  app.get(ROOT, async context => {
    if (app.getAccessToken()) return context.redirect("#/dashboard");
    const template = HB.templates[TEMPLATE_NAME];
    loadTemplate(BODY, TEMPLATE_NAME, template());
  });

  app.get("#/logout", context => {
    context.loseAccessToken();
    context.redirect("#/login");
  });

  app.post(ROOT, context => {
    const data = $(context.target).serializeJSON();

    let startUrl = unescape(getQuery(app.getLocation(), "state"));
    if (startUrl === "false") startUrl = "#/";
    startPreload(BODY);
    const login = postMainApi(data, "/login");
    login
      .then(res => {
        initSession(res);
        return context.redirect(startUrl);
      })
      .catch(e => {
        stopPreload();
        app.trigger(SESSION_DENIED, e.responseJSON.message);
      });
  });

  app.bind(SESSION_CONNECTED, () => {});

  app.bind(SESSION_ENDED, () => {
    store.clearAll();
  });

  app.bind(SESSION_DENIED, (evt, error) => toastr.error(error, ERROR_HEADER));
  
})();
