const axios = require('axios')
const CommonActions = require('../reduxsauce/commonRedux')
const PromotionActions = require('../reduxsauce/promotionRedux')

const limitPage = 10;

 const getPromotionList = (data) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  const { config } = getState();
  await axios
    .get("/promotion/list/" + config['businessId'])
    .then((response) => {
      dispatch(CommonActions.setLoading(false));
      dispatch(PromotionActions.setPromotion(response.data));
      // return response.data;
    })
    .catch((error) => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: "Something went wrong!",
        })
      );
      console.log("error >>", error.response);
    });
};

 const addPromotionInList =
  (data, navigation) => async (dispatch, getState) => {
    dispatch(CommonActions.setLoading(true));
    await axios
      .post("/promotion/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        dispatch(PromotionActions.addPromotionInList(response.data));
        dispatch(CommonActions.setLoading(false));
        navigation.goBack();
      })
      .catch((error) => {
        dispatch(CommonActions.setLoading(false));
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content:  error.response['message'],
          })
        );
        console.log("error >> ", error.response['message']);
      });
  };
 const updatePromotionInList =
  (data, id, navigation) => async (dispatch, getState) => {
    dispatch(CommonActions.setLoading(true));
    await axios
      .put("/promotion/update/" + id, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        dispatch(PromotionActions.updatePromotionInList(response.data));
        dispatch(CommonActions.setLoading(false));
        navigation.goBack();
      })
      .catch((error) => {
        dispatch(CommonActions.setLoading(false));
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: error.response['message'],
          })
        );
        console.log("error >> ", error);
      });
  };

 const deletePromotion =
  (id, navigation) => async (dispatch, getState) => {
    console.log("deleting promotion id ======================>", id);
    dispatch(CommonActions.setLoading(true));
    await axios
      .delete("/promotion/delete/" + id)
      .then((response) => {
        console.log("response delete promotion >", response);
        dispatch(CommonActions.setLoading(false));
        dispatch(PromotionActions.deletePromotionInList(id));
        navigation && navigation.goBack();
      })
      .catch((error) => {
        dispatch(CommonActions.setLoading(false));
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content:  error.response['message'],
          })
        );
        console.log("error >> ", error.response['message']);
      });
  };

  module.exports = {getPromotionList,addPromotionInList,updatePromotionInList,deletePromotion}