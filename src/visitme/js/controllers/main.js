/*global*/
(() => {

  const app = Sammy.apps.body;
  const HB = MyApp; // handlebars;
  app.get("#/", context => {
    if (!app.getAccessToken()) return context.redirect("#/login");
    const { communities, allCommunities } = getSessionData();
    stopPreload();
    const hasSelected = communities.filter(comm => comm.selected === true).length > 0;
    if (!hasSelected)
      return communitySelection(communities, allCommunities);

    return context.redirect("#/dashboard");
  });


  app.get("#/unverified", () => {
    const template = HB.templates["unverified"];
    loadTemplate("body", "Unverified", template());
    app.loseAccessToken();
  });

  const communitySelection = (communities, allCommunities) => {
    const template = Handlebars.partials["community-selection"];
    communities = communities.filter(com => com.status === "APPROVED");
    const data = {
      communities,
      allCommunities
    };

    $("body").append(template(data));
    $("#community-modal").modal("show");

    $("#community-modal").on("hidden.bs.modal", () => {
      const {
        communities
      } = getSessionData();
      const hasSelected = communities.filter(comm => comm.selected === true).length > 0;
      if (!hasSelected)
        $("#community-modal").modal("show");
    });

    $("#community-logo").change(event => {
      const input = event.currentTarget;
      if (!input.files || !input.files[0]) return;
      const reader = new FileReader();
      reader.onload = e => $(".input-img").attr("src", e.target.result);
      reader.readAsDataURL(input.files[0]);
    });

  };


  $(document).on("click", ".community-option img", event => {
    const target = $(event.currentTarget);
    const radioInput = target.prev();
    radioInput[0].checked = true;
    $("img").removeClass("checked");
    target.addClass("checked");
  });

  


  $(document).on("click", ".no-community", event => {
    $(".form-div").hide();
    $("#select-community-form").hide();
    $(`.${event.currentTarget.id}-div`).show();

    $("#add-community-form").validate(FORM_VALIDATION_DEFAULTS);
    $("#select-community-form").validate(FORM_VALIDATION_DEFAULTS);
    $("#join-community-form").validate(FORM_VALIDATION_DEFAULTS);

    validateForms();

    $("#join-community-select").select2({
      language: {
        noResults: () => "No se encontraron resultados",
        searching: () => "Buscando..."
      }
    });
  });
})();
