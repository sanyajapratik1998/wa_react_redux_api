const axios = require("axios");
const CommonActions = require("../reduxsauce/commonRedux");
const ProductActions = require("../reduxsauce/productRedux");

const getCategories = () => async (dispatch, getState) => {
  const { order, config } = getState();
  dispatch(CommonActions.setLoading(true));
  try {
    console.log("--categories----");
    const response = await axios
      .get("/products/product-category/list/" + config["businessId"])
      .then((response) => response.data);
    console.log("checking response : ", response);
    if (response.error) {
      dispatch(
        CommonActions.setAlert({ visible: true, content: response.error })
      );
    } else {
      dispatch(
        ProductActions.getCategories({
          categories: response,
        })
      );
    }
  } catch (error) {
    console.log("message", error.response.message);

    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error.response.message,
      })
    );
  }
  dispatch(CommonActions.setLoading(false));
};

let cancelToken = axios.CancelToken.source();
const getProducts =
  (search = false, category = false, subCategory = false) =>
  async (dispatch, getState) => {
    const {
      auth: { user },
      order,
      config,
    } = getState();

    search || category || subCategory
      ? dispatch(ProductActions.productSearchLoading(true))
      : dispatch(CommonActions.setLoading(true));

    let url = "/products/list/" + config["businessId"];

    if (search) {
      if (url.includes("?")) {
        url += "&search=" + search;
      } else {
        url += "?search=" + search;
      }
    }
    if (category) {
      if (url.includes("?")) {
        url += "&category=" + category;
      } else {
        url += "?category=" + category;
      }
    }
    if (subCategory) {
      if (url.includes("?")) {
        url += "&sub_category=" + subCategory;
      } else {
        url += "?sub_category=" + subCategory;
      }
    }

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
            ProductActions.getProducts({
              fetching: false,
              products: response.data,
            })
          );
          dispatch(ProductActions.productSearchLoading(false));
          dispatch(CommonActions.setLoading(false));
          return response.data;
        })
        .catch((error) => {
          console.log("error", error);
          // dispatch(
          //   CommonActions.setAlert({
          //     visible: true,
          //     content: error?.response?.message,
          //   }),
          // );
          dispatch(ProductActions.productSearchLoading(false));
          dispatch(CommonActions.setLoading(false));
        });
    } catch ({ message }) {
      dispatch(CommonActions.setAlert({ visible: true, content: message }));
      dispatch(ProductActions.productSearchLoading(false));
      dispatch(CommonActions.setLoading(false));
    }
  };
module.exports = { getCategories, getProducts };
