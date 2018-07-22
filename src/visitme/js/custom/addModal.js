
/*exported showAdditionModal*/

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
        "Authorization": `Bearer ${token}`
      },
    },
    processResults: function (data, params) {
      params.page = params.page || 1;
      console.log("data", data);
      console.log("params", params);
      return {
        results: data,
        pagination: {
          more: (params.page * 30) < data.length
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

  function formatRepo(repo) {
    if (repo.loading) {
      return "Cargando resultados...";
    }

    console.log("repo", repo);

    var markup = "<div class='select2-result-repository clearfix'>" +
      "<div class='select2-result-repository__avatar'><img src='" + repo.owner.avatar_url + "' /></div>" +
      "<div class='select2-result-repository__meta'>" +
      "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";

    if (repo.description) {
      markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
    }

    markup += "<div class='select2-result-repository__statistics'>" +
      "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.forks_count + " Forks</div>" +
      "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.stargazers_count + " Stars</div>" +
      "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.watchers_count + " Watchers</div>" +
      "</div>" +
      "</div></div>";

    return markup;
  }

  function formatRepoSelection(repo) {
    return repo.full_name || repo.text;
  }

  $(".addition-cb").click(event=> callback($(event.target.form).serializeJSON()));
};



