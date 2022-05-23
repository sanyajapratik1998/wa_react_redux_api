const axios = require('axios')
const CommonActions = require('../reduxsauce/commonRedux')
const ServicesRedux = require('../reduxsauce/servicesRedux')

 const getServicesCategories = () => async (dispatch, getState) => {
  const { config } = getState();
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios
      .get("/services/services-category/list/" + config.businessId)
      .then((response) => response);
    dispatch(CommonActions.setLoading(false));
    if (response.error) {
      dispatch(
        CommonActions.setAlert({ visible: true, content: response.error })
      );
    } else {
      dispatch(
        ServicesRedux.getServicesCategories({
          servicesCategories: response.data,
        })
      );
    }
  } catch (error) {
    dispatch(CommonActions.setLoading(false));
    console.log("message",  error.response.message);
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content:  error.response.message,
      })
    );
  }
};

let cancelToken = axios.CancelToken.source();
 const getServices =
  (search = false, category = false) =>
  async (dispatch, getState) => {
    const {
      auth: { user },
      config,
    } = getState();

    search || category
      ? dispatch(ServicesRedux.serviceSearchLoading(true))
      : dispatch(CommonActions.setLoading(true));

    let url =
      search && category
        ? "/services/list/" +
          config['businessId'] +
          "?search=" +
          search +
          "&category=" +
          category
        : category
        ? "/services/list/" + config['businessId'] + "?category=" + category
        : search
        ? "/services/list/" + config['businessId'] + "?search=" + search
        : "/services/list/" + config['businessId'];

    if (cancelToken) {
      cancelToken.cancel();
      cancelToken = axios.CancelToken.source();
    }

    try {
      axios
        .get(url, { cancelToken: cancelToken.token })
        .then((response) => {
          console.log("response======================", response);
          dispatch(
            ServicesRedux.getServices({
              services: response.data,
            })
          );
          dispatch(CommonActions.setLoading(false));
          dispatch(ServicesRedux.serviceSearchLoading(false));
          return response.data;
        })
        .catch((error) => {
          console.log("error", error);
          dispatch(
            CommonActions.setAlert({
              visible: true,
              content:  error.response.message,
            })
          );
          dispatch(ServicesRedux.serviceSearchLoading(false));
          dispatch(CommonActions.setLoading(false));
        });
    } catch ({ message }) {
      dispatch(CommonActions.setAlert({ visible: true, content: message }));
      dispatch(ServicesRedux.serviceSearchLoading(false));
      dispatch(CommonActions.setLoading(false));
    }
  };

 const onUpdateServices = (body, id, navigation) => (dispatch) => {
  dispatch(CommonActions.setLoading(true));
  axios
    .put("/services/update/" + id, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(async (response) => {
      await dispatch(getServices());
      navigation.navigate("services-list");
      dispatch(CommonActions.setLoading(false));
    })
    .catch((error) => {
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error.response.message,
        })
      );
      dispatch(CommonActions.setLoading(false));
    });
};

 const onCreateServices = (body, navigation) => (dispatch) => {
  axios
    .post("/services/create", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(async (response) => {
      await dispatch(getServices());
      dispatch(CommonActions.setLoading(false));
      navigation.navigate("services-list");
    })
    .catch((error) => {
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content:  error.response.message,
        })
      );
      dispatch(CommonActions.setLoading(false));
    });
};

module.exports = {getServicesCategories,getServices,onUpdateServices,onCreateServices}