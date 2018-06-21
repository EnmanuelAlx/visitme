(() => {
  const app = Sammy("body");
  app.use(Sammy.Storage);
  app.use(Sammy.Session);
  app.use(Sammy.OAuth2);
  app.authorize = "#/login";

  const store = new Sammy.Store(SAMMY_STORE("session"));


  app.store = store;

  store.checkSession = () => {};

  const startApp = () => app.run("#/");

  app.get("#/", context => {
    if (!app.getAccessToken()) return context.redirect("#/login");
    context.redirect("#/dashboard");
  });

  $(document).ready(() => {
    toastr.options = TOASTR_OPTIONS;
    startApp();
    store.checkSession();

    setInterval(() => {
      store.checkSession();
    }, 3000);

  });
})();
