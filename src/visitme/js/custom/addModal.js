/*exported showAdditionModal*/
// TODO
//cancel on callback success
// CLEAN FIELD
const showAdditionModal = callback => {
  const template = Handlebars.partials["addition-modal"];
  $("body").append(template());
  $("#addition-modal").modal("show");
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
    results: function(data, params) {
      params.page = params.page || 1;
      return {
        results: data,
        pagination: {
          more: params.page * 30 < data.length
        }
      };
    },
    placeholder: "Buscar un usuario",
    escapeMarkup: function(markup) {
      return markup;
    },
    minimumInputLength: 3,
    templateResult: formatRepo,
    templateSelection: formatRepoSelection
  });

  function formatRepo(user) {
    if (user.loading) {
      return "Cargando resultados...";
    }
    return Handlebars.partials["user-list"](user);
  }

  function formatRepoSelection(user) {
    return user.name;
  }
  $(".addition-cb").click(event => {
    const user = $("#user-select").select2("data")[0];
    const result = $(event.target.form).serializeJSON();
    result.user = user;
    callback(result);
  });
};
