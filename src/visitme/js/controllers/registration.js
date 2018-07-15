/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = "body";
  const ROOT = "#/registration";
  const TEMPLATE_NAME = "registration";
  const HB = MyApp; // handlebars;

  app.get(ROOT, () => {
    const template = HB.templates[TEMPLATE_NAME];
    loadTemplate(CONTAINER, TEMPLATE_NAME, template());
    handleRegistration();
  });

  const handleRegistration = () => {

    $("#registration-form").validate({
      focusCleanup: true,
      errorPlacement: function (label, element) {
        label.addClass("invalid-feedback");
        label.insertAfter(element);
      },
      lang: "es",
      wrapper: "div",
      rules: {
        password: {
          pattern: /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,24}$/
        },
        "repeat-password": {
          equalTo: "#password"
        },
        "email": {
          email: true
        }
      },
      messages: {
        passwordRepeat: {
          equalTo: "Both passwords must be the same."
        },
        password: {
          pattern: "The password must contain at least 8 characters, 1 uppercase, 1 digit and 1 special character(! @ # $ & *)"
        }
      }
    });
    validateForms();
  };


  app.post(ROOT, context => {
    const data = $(context.target).serializeJSON();

    startPreload("body");
    const login = postMainApi(data, "user");
    login
      .then(() => {
        toastr.info("Usuario registrado satisfactoriamente", "Petición exitosa");
        context.redirect("#/login");
      })
      .catch(e => {
        toastr.error(e.responseJSON.error.name, "Error");
        stopPreload();
      });
  });

})();