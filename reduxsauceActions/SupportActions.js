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

module.exports = { fetchActiveChatData };
