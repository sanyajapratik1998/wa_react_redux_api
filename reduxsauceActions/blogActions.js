const axios = require("axios");
const CommonActions = require("../reduxsauce/commonRedux");

const getBlogList = (callback) => async (dispatch, getState) => {
  const { config } = getState();
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.get(`/blog/list/${config["businessId"]}`);
    console.log("blog list response -->>", response);
    callback && callback("success", response["data"]);
    dispatch(CommonActions.setLoading(false));
  } catch (error) {
    console.log("error blog list response-->", error);
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

const getBlogDetail = (slug, callback) => async (dispatch, getState) => {
  const { config } = getState();
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.get(`/blog/get/${slug}`);
    console.log("blog detail response -->>", response);
    callback && callback("success", response["data"]);
    dispatch(CommonActions.setLoading(false));
  } catch (error) {
    console.log("error blog detail response-->", error);
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

const getGalleryList = async (dispatch, getState) => {
  const { config } = getState();
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.get(
      `/business/gallery/list/${config["slug"]}`
    );
    console.log("gallery list response -->>", response);
    callback && callback("success", response["data"]);
    dispatch(CommonActions.setLoading(false));
  } catch (error) {
    console.log("error gallery list response-->", error);
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
  getBlogList,
  getBlogDetail,
  getGalleryList,
};
