/*exported multipartApi postMainApi putMainApi deleteMainApi getMainApi */

const postMainApi = (data, endpoint) => {
  const app = Sammy.apps.body;
  const url = `${MAIN_API}/${endpoint}`;
  const token = app.getAccessToken();
  return $.ajax({
    data: JSON.stringify(data),
    type: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    url
  });
};

const multipartApi = (data, endpoint, method) => {
  const app = Sammy.apps.body;
  const url = `${MAIN_API}/${endpoint}`;
  const token = app.getAccessToken();
  return $.ajax({
    data: data,
    type: method,
    contentType: false,
    processData: false,
    headers: {
      "Authorization": `Bearer ${token}`
    },
    url
  });
};

const putMainApi = (data, endpoint) => {
  const app = Sammy.apps.body;
  const url = `${MAIN_API}/${endpoint}`;
  const token = app.getAccessToken();
  return $.ajax({
    data: JSON.stringify(data),
    type: "PUT",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    url
  });
};

const deleteMainApi = endpoint => {
  const app = Sammy.apps.body;
  const url = `${MAIN_API}/${endpoint}`;
  const token = app.getAccessToken();
  const request = {
    type: "DELETE",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    url: url
  };
  return $.ajax(request);
};

const getMainApi = (data, endpoint) => {
  const app = Sammy.apps.body;
  const url = `${MAIN_API}/${endpoint}`;
  const token = app.getAccessToken();
  const request = {
    type: "GET",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    url
  };
  if (Object.keys(data).length > 0) request.data = data;
  return $.ajax(request);
};