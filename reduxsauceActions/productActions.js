const axios = require("axios");
const CommonActions = require("../reduxsauce/commonRedux");
const ProductActions = require("../reduxsauce/productRedux");

const getCategories =
  (search = "", loading = true, callback) =>
  async (dispatch, getState) => {
    const { order, config } = getState();
    dispatch(CommonActions.setLoading(loading));
    try {
      let url = "/products/product-category/list/" + config["businessId"];

      if (search && search != "") {
        if (url.includes("?")) {
          url += "&search=" + search;
        } else {
          url += "?search=" + search;
        }
      }

      console.log("--categories----");
      const response = await axios.get(url).then((response) => response.data);
      console.log("checking response : ", response);
      if (response.error) {
        dispatch(
          CommonActions.setAlert({ visible: true, content: response.error })
        );
        callback && callback("failed", response);
      } else {
        dispatch(
          ProductActions.getCategories({
            categories: response,
          })
        );
        callback && callback("success", response);
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

let cancelToken1 = axios.CancelToken.source();
const getProductsV1 =
  (item, callback, loading = false) =>
  async (dispatch, getState) => {
    const {
      auth: { user },
      order,
      config,
      products,
    } = getState();

    item.search || item.category || item.subCategory
      ? await dispatch(ProductActions.productSearchLoading(loading))
      : await dispatch(CommonActions.setLoading(loading));

    let url = "/products/list/" + config["businessId"];
    if (item.limit) {
      if (url.includes("?")) {
        url += "&limit=" + item.limit;
      } else {
        url += "?limit=" + item.limit;
      }
    }
    if (item.offset) {
      if (url.includes("?")) {
        url += "&offset=" + item.offset;
      } else {
        url += "?offset=" + item.offset;
      }
    }
    if (item.search) {
      if (url.includes("?")) {
        url += "&search=" + item.search;
      } else {
        url += "?search=" + item.search;
      }
    }
    if (item.category) {
      if (url.includes("?")) {
        url += "&category=" + item.category;
      } else {
        url += "?category=" + item.category;
      }
    }
    if (item.subCategory) {
      if (url.includes("?")) {
        url += "&sub_category=" + item.subCategory;
      } else {
        url += "?sub_category=" + item.subCategory;
      }
    }
    if (item.maxPrice && item.maxPrice != "") {
      if (url.includes("?")) {
        url += "&max_price=" + item.maxPrice;
      } else {
        url += "?max_price=" + item.maxPrice;
      }
    }
    if (item.minPrice && item.minPrice != "") {
      if (url.includes("?")) {
        url += "&min_price=" + item.minPrice;
      } else {
        url += "?min_price=" + item.minPrice;
      }
    }
    if (item.sortBy && item.sortBy != "") {
      if (url.includes("?")) {
        url += "&sorted_by=" + item.sortBy;
      } else {
        url += "?sorted_by=" + item.sortBy;
      }
    }

    if (cancelToken1) {
      cancelToken1.cancel();
      cancelToken1 = axios.CancelToken.source();
    }

    try {
      await axios
        .get(url, { cancelToken: cancelToken1.token })
        .then(async (response) => {
          console.log("response======================", response);
          await dispatch(
            ProductActions.getProducts({
              fetching: false,
              products:
                item["offset"] == 0
                  ? [...response["data"]["results"]]
                  : [...products.products, ...response["data"]["results"]],
            })
          );

          await dispatch(ProductActions.productSearchLoading(false));
          await dispatch(CommonActions.setLoading(false));
          callback && callback("success", response.data);
          return response.data;
        })
        .catch(async (error) => {
          console.log("error", error);
          // dispatch(
          //   CommonActions.setAlert({
          //     visible: true,
          //     content: error?.response?.message,
          //   }),
          // );
          await dispatch(ProductActions.productSearchLoading(false));
          await dispatch(CommonActions.setLoading(false));
        });
    } catch ({ message }) {
      dispatch(CommonActions.setAlert({ visible: true, content: message }));
      dispatch(ProductActions.productSearchLoading(false));
      dispatch(CommonActions.setLoading(false));
    }
  };

const fetchSubCategory = (id, callback) => async (dispatch, getState) => {
  const { config } = getState();
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.get(
      `/products/product-sub-category/list/${config["businessId"]}/${id}`
    );
    console.log("response", response);
    dispatch(CommonActions.setLoading(false));
    callback && callback("success", response["data"]);
  } catch (error) {
    console.log("error", error["response"]);
    dispatch(CommonActions.setLoading(false));
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error["response"]["message"],
      })
    );
  }
};

const getProductDetail = (id, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  await axios
    .get("/products/details/" + id)
    .then((response) => {
      console.log("detail response", response);
      dispatch(CommonActions.setLoading(false));
      callback && callback("success", response["data"]);
    })
    .catch((error) => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error["response"]["message"],
        })
      );
      console.log("error->", error["response"]);
    });
};

const fetchRecentProducts = (callback) => async (dispatch, getState) => {
  const {config,recentProducts} = getState()
  try {
    const response = await axios.get(
      `/products/list/${config['businessId']}?ids=` +
        recentProducts.map((o) => o),
    );
    console.log('recent prdct response-->>', response);
    callback && callback('success',response.data)
  } catch (error) {
    console.log('error', error);
  }
}

module.exports = {
  getCategories,
  getProducts,
  getProductsV1,
  fetchSubCategory,
  getProductDetail,
  fetchRecentProducts,
};
