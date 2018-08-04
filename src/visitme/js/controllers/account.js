/*global*/
(() => {
  const app = Sammy.apps.body;
  const CONTAINER = ".content";
  const ROOT = "#/account";
  const TEMPLATE_NAME = "account";
  const HB = MyApp; // handlebars;

  app.get(ROOT, async context => {
    if (!app.getAccessToken()) return context.redirect("#/login");
    const template = HB.templates[TEMPLATE_NAME];
    if ($(CONTAINER).exists()) startPreload(CONTAINER);
    else startPreload("body", "Cargando tu experiencia...");
    const data = await getMainApi({}, "user/me");
    data.address = data.address || {};
    loadTemplate(CONTAINER, TEMPLATE_NAME, template(data));
    initListeners();
  });

  app.post(ROOT, async context => {
    try{
      if (!app.getAccessToken()) return context.redirect("#/login");
      const data = $(context.target).serializeJSON();
      startPreload(CONTAINER);
      const image = $("#account-profile")[0].files[0];
      if (image) data.image=image;
      const formData = new FormData();
      Object.keys(data).map(key => {
        const value = key === "address" ? JSON.stringify(data[key]) : data[key];
        formData.append(key, value);
      });
      await multipartApi(formData, "user/me", "PUT");
      notify.info("Tus datos fueron modificados exitosamente", "Éxito");
      app.refresh();
    }catch(e){
      stopPreload();
      notify.error("Ocurrió un error al guardar tus datos", "Error");
    }
  });

  const initListeners = () =>{

    $("#account-form").submit(e=> e.preventDefault());
    $("#account-profile").change(event => {
      const input = event.currentTarget;
      if (!input.files || !input.files[0]) return;
      const reader = new FileReader();
      reader.onload = e => $(".avatar").attr("src", e.target.result);
      reader.readAsDataURL(input.files[0]);
    });

    $("#img-selection").click(() => $("#account-profile").click());
  };
})();