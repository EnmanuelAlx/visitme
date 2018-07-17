/*global*/
(() => {
  const app = Sammy.apps.body;
  const BODY = "body";
  const ROOT = "#/forgot-password";
  const TEMPLATE_NAME = "forgot-password";
  const HB = MyApp; // handlebars;
  const SUBCONTENT = ".forgot-content";

  app.get(ROOT, async context => {
    if (app.getAccessToken()) return context.redirect("#/dashboard");
    const template = HB.templates[TEMPLATE_NAME];
    loadTemplate(BODY, TEMPLATE_NAME, template());
    handlePassword();
  });

  app.get(`${ROOT}/code`, context => {
    const details = context.params;
    const template = HB.templates["validate-code"];
    loadTemplate(SUBCONTENT, "validate-code", template(details));
    handlePassword();
  });

  app.post(ROOT, context => {
    const details = $(context.target).serializeJSON();
    startPreload(BODY);
    postMainApi(details, "/forgotPassword")
      .then(()=>{
        stopPreload();
        toastr.info("Correo enviado satisfactoriamente");
        app.runRoute("get", `${ROOT}/code`, details);
      })
      .catch(()=>{
        stopPreload();
        toastr.error("No se pudo enviar el correo de recuperación", "Error");
      });

  });


  const handlePassword = () => {
    $("#forgot-password-form").validate(FORM_VALIDATION_DEFAULTS);
  };
})();