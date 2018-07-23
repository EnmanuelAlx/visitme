/*exported showAdditionModal*/
// TODO
//cancel on callback success
// CLEAN FIELD
const showAdditionModal = callback => {
  if (!$("#addition-modal").exists()) {
    const template = Handlebars.partials["addition-modal"];
    $("body").append(template());
    listenClick();
    listenSelect();
    $("#addition-form").validate(FORM_VALIDATION_DEFAULTS);
    validateForms();
  }

  $("#addition-modal").modal("show");


  function listenSelect() {
    const token = Sammy.apps.body.getAccessToken();
    $("#user-select").select2({
      ajax: {
        url: `${MAIN_API}/user`,
        dataType: "json",
        delay: 250,
        data: params => ({
          query: params.term,
          page: params.page
        }),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      },
      results: function (data, params) {
        params.page = params.page || 1;
        return {
          results: data,
          pagination: {
            more: params.page * 30 < data.length
          }
        };
      },
      placeholder: "Buscar un usuario",
      escapeMarkup: function (markup) {
        return markup;
      },
      minimumInputLength: 3,
      templateResult: formatRepo,
      templateSelection: formatRepoSelection
    });

    $("#user-select").change(event => {
      const user = $("#user-select").select2("data")[0];
      if (!user) return;
      const inputs = $(`#${event.target.form.id} :input`);
      inputs.each((idx, element) =>
        $(`input[name='${element.name}'`).val(user[element.name])
      );
    });
  };


  function formatRepo(user) {
    if (user.loading) {
      return "Cargando resultados...";
    }
    return Handlebars.partials["user-list"](user);
  }

  function formatRepoSelection(user) {
    return user.name;
  }

  function listenClick() {
    $(".addition-cb").click(async event => {
      try{
        startPreload("#addition-modal");
        const form = $(event.target.form);
        const result = form.serializeJSON();
        let user = $("#user-select").select2("data")[0];
        if (!user) {
          user = (await postMainApi(result, "user")).user;
        };

        result.user = user;
        form.trigger("reset");
        $("#user-select").val("");
        $("#user-select").trigger("change");
        await callback(result);
        $("#addition-modal").modal("hide");
        toastr.info("Solicitud exitosa", "Éxito");
      }catch (error){
        toastr.error("Ocurrió un error al agregar", "Error");
      }finally{
        stopPreload();
      }
    });
  };
};