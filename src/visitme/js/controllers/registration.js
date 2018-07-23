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
        password: {
          pattern: "La contraseña debe contener al menos 8 letras, 1 mayúscula, 1 número y un caracter especial (! @ # $ & *)"
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
        notify.info("Usuario registrado satisfactoriamente", "Petición exitosa");
        context.redirect("#/login");
      })
      .catch(e => {
        notify.error(e.responseJSON.error.name, "Error");
        stopPreload();
      });
  });

})();