/*exported postMainApi putMainApi deleteMainApi getMainApi */

const postMainApi = (data, endpoint) => {
  const app = Sammy.apps.body;
  const {
    apiBasePath,
    username
  } = getCurrentData().session;
  const url = `${MAIN_API}${apiBasePath}/${username}${endpoint}`;
  return $.ajax({
    data: JSON.stringify(data),
    type: "POST",
    headers: {
      "content-type": "application/json",
      "x-auth-token": app.getAccessToken()
    },
    url
  });
};

const putMainApi = (data, endpoint) => {
  const app = Sammy.apps.body;
  const {
    apiBasePath,
    username
  } = getCurrentData().session;
  const url = `${MAIN_API}${apiBasePath}/${username}${endpoint}`;
  return $.ajax({
    data: JSON.stringify(data),
    type: "PUT",
    headers: {
      "content-type": "application/json",
      "x-auth-token": app.getAccessToken()
    },
    url
  });
};

const deleteMainApi = endpoint => {
  const app = Sammy.apps.body;
  const {
    apiBasePath,
    username
  } = getCurrentData().session;
  const url = `${MAIN_API}${apiBasePath}/${username}${endpoint}`;
  const request = {
    type: "DELETE",
    headers: {
      "content-type": "application/json",
      "x-auth-token": app.getAccessToken()
    },
    url: url
  };
  return $.ajax(request);
};

const getMainApi = (data, endpoint) => {
  const app = Sammy.apps.body;
  const {
    apiBasePath,
    username
  } = getCurrentData().session;
  const url = `${MAIN_API}${apiBasePath}/${username}${endpoint}`;
  const request = {
    type: "GET",
    headers: {
      "content-type": "application/json",
      "x-auth-token": app.getAccessToken()
    },
    url
  };
  if (Object.keys(data).length > 0) request.data = data;
  return $.ajax(request);
};