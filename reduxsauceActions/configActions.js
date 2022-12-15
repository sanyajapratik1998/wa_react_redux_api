const axios = require("axios");
const ConfigAction = require("../reduxsauce/configRedux");
const CommonActions = require("../reduxsauce/commonRedux");

const addNewBannerCard = (data) => async (dispatch, getState) => {
  const { config } = getState();
  console.log("config", config);
  try {
    let bannerCard =
      (config.appHomePage && config.appHomePage.bannerCard) || {};
    const response = await axios.patch(
      `/business/update/business-setting/${config["businessId"]}`,
      {
        app_home_page: {
          ...config["appHomePage"],
          bannerCard: [...bannerCard, data],
        },
      }
    );
    // await dispatch(ConfigAction.addBannerCard(data));
    dispatch(getAppConfig());
    console.log("response", response);
    return response;
  } catch (error) {
    console.log("error", error);
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error.response.message || "Something went wrong :(",
      })
    );
  }
};

const updateBannerCard = (data) => async (dispatch, getState) => {
  const { config } = getState();
  try {
    const response = await axios.patch(
      `/business/update/business-setting/${config['businessId']}`,
      {
        app_home_page: {
          ...config.appHomePage,
          bannerCard: data,
        },
      }
    );
    dispatch(getAppConfig());
    console.log("response", response);
    return response;
  } catch (error) {
    console.log("error", error);
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error.response.message || "Something went wrong :(",
      })
    );
  }
};

const removeBannerCard = (index) => async (dispatch, getState) => {
  const { config } = getState();

  let bannerCardList = [...config.appHomePage.bannerCard];
  bannerCardList = bannerCardList.filter((o, i) => i !== index);
  try {
    const response = await axios.patch(
      `/business/update/business-setting/${config['businessId']}`,
      {
        app_home_page: {
          ...config['appHomePage'],
          bannerCard: bannerCardList,
        },
      }
    );
    dispatch(getAppConfig());
    console.log("response", response);
    return response;
  } catch (error) {
    console.log("error", error);
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error.response.message || "Something went wrong :(",
      })
    );
  }
};

const updateTopProductList = (data) => async (dispatch, getState) => {
  console.log("data", data);
  const { config } = getState();
  try {
    const response = await axios.patch(
      `/business/update/business-setting/${config['businessId']}`,
      {
        app_home_page: {
          ...config['appHomePage'],
          topProducts: data,
        },
      }
    );
    dispatch(getAppConfig());
    console.log("response", response);
    return response;
  } catch (error) {
    console.log("error", error);
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error.response.message || "Something went wrong :(",
      })
    );
  }
};

const updateSliderList = (data) => async (dispatch, getState) => {
  console.log("data", data);
  const { config } = getState();
  try {
    const response = await axios.patch(
      `/business/update/business-setting/${config['businessId']}`,
      {
        app_home_page: {
          ...config.appHomePage,
          slider: data,
        },
      }
    );
    dispatch(getAppConfig());
    console.log("response", response);
    return response;
  } catch (error) {
    console.log("error", error);
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error.response.message || "Something went wrong :(",
      })
    );
  }
};

const updateSplashList = (data) => async (dispatch, getState) => {
  console.log("data", data);
  const { config } = getState();
  try {
    const response = await axios.patch(
      `/business/update/setting/${config['businessId']}`,
      {
        setting: {
          ...config,
          ...config.setting,
          splash: data,
        },
      }
    );
    const configData = {
      ...config,
      splash: data,
    };
    await dispatch(ConfigAction.setAppConfiguration(configData));
    console.log("response", response);
    return response;
  } catch (error) {
    console.log("error", error);
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error.response.message || "Something went wrong :(",
      })
    );
  }
};

const getAppConfig = () => async (dispatch, getState) => {
  const { config } = getState();
  dispatch(CommonActions.setLoading(true));

  try {
    await axios
      .get(`/business/app/config/${config['domain']}`)
      .then((response) => {
        console.log("response app config", response);
        response.data.success &&
          dispatch(ConfigAction.setAppConfiguration(response.data['data']));
        dispatch(CommonActions.setLoading(false));
      })
      .catch((error) => {
        console.log("error get config->", error);
        dispatch(CommonActions.setLoading(false));
      });
  } catch (error) {
    console.log("error get config->", error);
    dispatch(CommonActions.setLoading(false));
  }
};
module.exports = {
  addNewBannerCard,
  updateBannerCard,
  removeBannerCard,
  updateTopProductList,
  updateSliderList,
  updateSplashList,
  getAppConfig,
};
