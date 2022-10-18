const CommonActions = require("../reduxsauce/commonRedux");
const axios = require("axios");

const createSubscription = (body, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.post(`/subcription/create`, body);
    console.log("createSubscription response -->>", response);
    callback && callback("success", response["data"]);
    dispatch(CommonActions.setLoading(false));
  } catch (error) {
    console.log("error createSubscription -->", error.response);
    dispatch(CommonActions.setLoading(false));
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error["response"]["message"],
      })
    );
    callback && callback("error", error["response"]);
  }
};

const userSubscriptionList = (callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.get(`/subcription/user`);
    console.log("userSubscriptionList response -->>", response);
    callback && callback("success", response["data"]);
    dispatch(CommonActions.setLoading(false));
  } catch (error) {
    console.log("error userSubscriptionList -->", error.response);
    dispatch(CommonActions.setLoading(false));
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error["response"]["message"],
      })
    );
    callback && callback("error", error["response"]);
  }
};

const getSubscriptionDetail = (id, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.get(`/subcription/get/details/${id}`);
    console.log("getSubscriptionDetail response -->>", response);
    callback && callback("success", response["data"]);
    dispatch(CommonActions.setLoading(false));
  } catch (error) {
    console.log("error getSubscriptionDetail -->", error.response);
    dispatch(CommonActions.setLoading(false));
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error["response"]["message"],
      })
    );
    callback && callback("error", error["response"]);
  }
};

module.exports = {
  createSubscription,
  userSubscriptionList,
  getSubscriptionDetail,
};
