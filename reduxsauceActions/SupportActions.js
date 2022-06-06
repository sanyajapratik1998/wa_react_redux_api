const CommonActions = require("../reduxsauce/commonRedux");
const axios = require("axios");

const fetchActiveChatData =
  (orderId, callback, loading = false) =>
  (dispatch, getState) => {
    dispatch(CommonActions.setLoading(loading));
    axios
      .get(`/support/get/${orderId}/order`)
      .then((response) => {
        dispatch(CommonActions.setLoading(false));
        callback("success", response["data"]["data"]);
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(CommonActions.setLoading(false));
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: error["response"]["message"] || "Something went wrong.",
          })
        );
      });
  };

const onGetChatData = (id, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.get(`/support/chat/list/${id}`);
    dispatch(CommonActions.setLoading(false));
    callback && callback("success", response["data"]);
  } catch (error) {
    console.log("error -----------", error);
    dispatch(CommonActions.setLoading(false));
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error["response"]["message"] || "Something went wrong :(",
      })
    );
  }
};
const onSendMessageOnSupport =
  (body, callback) => async (dispatch, getState) => {
    try {
      const response = await axios.post("/support/chat/create", body);
      callback("success", response);
    } catch (error) {
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error["response"]["message"] || "Something went wrong :(",
        })
      );
      callback("failed", error["response"]["message"]);
    }
  };
module.exports = { fetchActiveChatData, onGetChatData, onSendMessageOnSupport };
