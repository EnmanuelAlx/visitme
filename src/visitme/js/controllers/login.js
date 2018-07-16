/*global*/
(() => {
  const app = Sammy.apps.body;
  const store = app.store;
  const BODY = "body";
  const ROOT = "#/login";
  const TEMPLATE_NAME = "login";
  const HB = MyApp; // handlebars;
  const SESSION_DENIED = "oauth.denied";
  const SESSION_CONNECTED = "oauth.connected";
  const SESSION_ENDED = "oauth.disconnected";

  app.get(ROOT, async context => {
    if (app.getAccessToken()) return context.redirect("#/dashboard");
    const template = HB.templates[TEMPLATE_NAME];
    loadTemplate(BODY, TEMPLATE_NAME, template());
    handleLogin();
  });

  const handleLogin = () => {
    $("#login-form").validate({
      focusCleanup: true,
      errorPlacement: function (label, element) {
        label.addClass("invalid-feedback");
        label.insertAfter(element);
      },
      lang: "es",
      wrapper: "div",
      rules: {
        "email": {
          email: true
        }
      },
    });
    validateForms();
  };

  app.get("#/logout", context => {
    context.loseAccessToken();
    context.redirect("#/login");
  });

  app.post(ROOT, context => {
    const data = $(context.target).serializeJSON();

    let startUrl = unescape(getQuery(app.getLocation(), "state"));
    if (startUrl === "false") startUrl = "#/";
    startPreload(BODY);
    const login = postMainApi(data, "user/auth");
    login
      .then(async res => {
        initSession(res);
        const { communities } = await getMainApi({}, "user/me/communities");
        const allCommunities = await getMainApi({}, "communities");
        res.communities = communities;
        res.allCommunities = allCommunities;
        initSession(res);
        return context.redirect(startUrl);
      })
      .catch(e => {
        stopPreload();
        app.trigger(SESSION_DENIED, e.responseText);
      });
  });

  app.bind(SESSION_CONNECTED, () => {});

  app.bind(SESSION_ENDED, () => {
    store.clearAll();
  });

  app.bind(SESSION_DENIED, (evt, error) => toastr.error(error, ERROR_HEADER));
  
  const initSession = session => {
    const app = Sammy.apps.body;
    const store = app.store;
    Object.keys(session).forEach(key => store.set(key, session[key]));
    app.setAccessToken(session.token);
  };

})();
