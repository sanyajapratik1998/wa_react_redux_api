const AuthActions = require("./reduxsauce/authRedux");
const { PersistGate } = require("redux-persist/integration/react");
const AsyncStorage =
  require("@react-native-async-storage/async-storage").default;
const { applyMiddleware, createStore } = require("redux");
const { persistReducer, persistStore } = require("redux-persist");
const thunk = require("redux-thunk").default;
const logger = require("redux-logger").default;
const axios = require("axios");
const { rootReducer } = require("./reduxsauce");

// import Constants from 'expo-constants';

// const ENV = Constants.manifest.extra?.ENV;
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["common", "order", "cart"],
  whitelist: ["auth", "config", "promotion", "recentProducts"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  applyMiddleware(thunk, logger)
  // ['local', 'development'].includes(ENV)
  //   ? applyMiddleware(thunk, logger)
  //   : applyMiddleware(thunk),
);

const initializeAxiosData = (url) => {
  console.log("call and set default url");
  axios.defaults.baseURL = url;
};

const setDefaultBaseURL = initializeAxiosData;
window.store = store;

const getErrorMessage = (data) => {
  // check for data is object

  if (data["message"] && data["message"] != undefined) {
    return data.message;
  }

  if (typeof data == "object" && !Array.isArray(data)) {
    return getErrorMessage(data[Object.keys(data)[0]]);
  }
  //  check for array
  if (Array.isArray(data)) {
    return getErrorMessage(
      data.length > 0 ? data[0] : "Error message not found."
    );
  }
  if (typeof data == "string") {
    return data;
  }
};

// call api using async function

// (async () => {
//   try {
//     const response = await WACall("https://jsonplaceholder.typicode.com/posts",'POST',{title:"this is the title",body:"sfhjffbdfbjhdfjfjk jfbgkjjsdfkskdjfk  kjfdgndmbnsdnknkbnbnklngklcnblks kdngnsdklbjklvnkldnbdnbklsdmm,nkbvkngvkdfbkvsdklbknkklgv je"});
//     console.log("repsonse--------------", response.data);
//   } catch (error) {
//     console.log("error---------",error);
//   }
// })();

const WACall = (url, method = "GET", body = {}, headers, params) => {
  return axios({
    method: method,
    url: url,
    data: body,
    headers: headers,
    params,
  });
};

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      axios.defaults.headers.common["Authorization"] = "";
      delete axios.defaults.headers.common["Authorization"];
      window.store.dispatch(AuthActions.logout());
      error = {
        ...error,
        response: { message: getErrorMessage(error.response.data) },
      };
    }

    if (typeof error.response === "undefined") {
      error = { ...error, response: { message: "Network error!" } };
    }

    if (error.response.status === 400) {
      error = {
        ...error,
        response: {
          ...error.response,
          message: getErrorMessage(error.response.data),
        },
      };
    }

    if (error.response.status === 403) {
      error = {
        ...error,
        response: {
          message: "You don't have permission to access this resource.",
        },
      };
    }

    if (error.response.status === 500) {
      error = { ...error, response: { message: "Internal server error!" } };
    }

    return Promise.reject(error);
  }
);

const persistor = persistStore(store, {}, () => {
  const { user } = store.getState().auth;
  if (user && user["token"]) {
    axios.defaults.headers.common["Authorization"] = `Token ${user["token"]}`;
  } else {
    axios.defaults.headers.common["Authorization"] = "";
    delete axios.defaults.headers.common["Authorization"];
  }
});

module.exports = {
  PersistGate,
  store,
  persistor,
  initializeAxiosData,
  setDefaultBaseURL,
  WACall,
};
