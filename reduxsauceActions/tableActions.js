const axios = require("axios");
const CommonActions = require("../reduxsauce/commonRedux");

const getAvailableTables = (body, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.post(
      `/restaurant/tablebooking/available/list`,
      body
    );
    console.log("getAvailableTable response -->>", response);
    callback && callback("success", response["data"]);
    dispatch(CommonActions.setLoading(false));
  } catch (error) {
    console.log("error getAvailableTable response-->", error);
    dispatch(CommonActions.setLoading(false));
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error["response"]["message"],
      })
    );
    callback && callback("error", error["response"]["data"]);
  }
};

const createTableBooking = (body, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.post(`/restaurant/tablebooking/create`, body);
    console.log("createTableBooking response -->>", response);
    callback && callback("success", response["data"]);
    dispatch(CommonActions.setLoading(false));
  } catch (error) {
    console.log("error createTableBooking response-->", error);
    dispatch(CommonActions.setLoading(false));
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error["response"]["message"],
      })
    );
    callback && callback("error", error["response"]["data"]);
  }
};

const getUserTableBookingList = (callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.get(`/restaurant/tablebooking/user/list`);
    console.log("getUserTableBookingList response -->>", response);
    callback && callback("success", response["data"]);
    dispatch(CommonActions.setLoading(false));
  } catch (error) {
    console.log("error getUserTableBookingList response-->", error);
    dispatch(CommonActions.setLoading(false));
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error["response"]["message"],
      })
    );
    callback && callback("error", error["response"]["data"]);
  }
};

const getTableBookingDetail = (id, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.get(
      `/restaurant/tablebooking/get/details/${id}`
    );
    console.log("getTableBookingDetail response -->>", response);
    callback && callback("success", response["data"]);
    dispatch(CommonActions.setLoading(false));
  } catch (error) {
    console.log("error getTableBookingDetail response-->", error);
    dispatch(CommonActions.setLoading(false));
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error["response"]["message"],
      })
    );
    callback && callback("error", error["response"]["data"]);
  }
};

module.exports = {
  getAvailableTables,
  createTableBooking,
  getUserTableBookingList,
  getTableBookingDetail,
};
