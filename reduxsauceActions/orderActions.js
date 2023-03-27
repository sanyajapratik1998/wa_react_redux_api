const axios = require("axios");
const CommonActions = require("../reduxsauce/commonRedux");
const OrderActions = require("../reduxsauce/orderRedux");
const CartActions = require("../reduxsauce/cartRedux");

const createOrder = (params) => async (dispatch, getState) => {
  console.log("params", params);
  const { config, cart } = getState();
  dispatch(CommonActions.setLoading(true));

  let products = cart.list.map(
    (o) =>
      new Object({
        product: o.id,
        qty: parseInt(o.cart_qty),
        price: parseFloat(o.price),
        selected_variants: o.selectedVariants ? o.selectedVariants : null,
        final_price: o.final_price,
      })
  );
  // console.log(cart.list);
  console.log({
    business: config["businessId"],
    products,
    type: params.type,
    ...params,
  });
  return await axios
    .post("/order/create", {
      business: config["businessId"],
      products,
      type: params.type,
      ...params,
    })
    .then((response) => {
      dispatch(CommonActions.setLoading(false));
      console.log("response---<>", response.data);
      dispatch(
        OrderActions.setOrders({
          ...response.data,
        })
      );
      return response.data;
    })
    .catch((error) => {
      console.log("error catch", error);
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error.response["message"],
        })
      );

      return false;
    });
};

const createOrderV3 = (params) => async (dispatch, getState) => {
  console.log("params", params);
  const { config, cart } = getState();
  dispatch(CommonActions.setLoading(true));

  let products = cart.list.map((o) => {
    let product_variants = o.selectedVariants
      ? o.selectedVariants.map((item) => {
          return item.id;
        })
      : [];

    return new Object({
      product: o.id,
      qty: parseInt(o.cart_qty),
      price: parseFloat(o.price),
      product_variants: product_variants,
      final_price: o.final_price,
    });
  });
  // console.log(cart.list);
  console.log({
    business: config["businessId"],
    products,
    type: params.type,
    ...params,
  });
  return await axios
    .post("/v3/order/create", {
      business: config["businessId"],
      products,
      type: params.type,
      ...params,
    })
    .then((response) => {
      dispatch(CommonActions.setLoading(false));
      console.log("response---<>", response.data);
      dispatch(
        OrderActions.setOrders({
          ...response.data,
        })
      );
      return response.data;
    })
    .catch((error) => {
      console.log("error catch", error);
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error.response["message"],
        })
      );

      return false;
    });
};

const isOfferAvailable = (item, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  axios
    .get("/promotion/availability/" + item["id"])
    .then((response) => {
      console.log("apply promotion", response);
      // props.navigation.navigate('place-order', {promoCode: item});
      dispatch(
        CommonActions.setShowToast({
          visible: true,
          content: "Applied successfully",
        })
      );
      dispatch(CommonActions.setLoading(false));
      if (callback) {
        callback("success", { promoCode: item });
      }
    })
    .catch((error) => {
      console.log("error apply promotion->", error.response);
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error["response"]["data"]["message"],
        })
      );
      dispatch(CommonActions.setLoading(false));
    });
};

const fetchOrderDetail = (orderId, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));

  await axios
    .get(`/order/detail/${orderId}`)
    .then(async (response) => {
      console.log("order Detail->", response["data"]["data"]);
      if (callback) {
        await callback("success", response["data"]["data"], async () =>
          dispatch(CommonActions.setLoading(false))
        );
      } else {
        dispatch(CommonActions.setLoading(false));
      }
    })
    .catch((error) => {
      console.log("error", error);
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error["response"]["message"],
        })
      );
    });
};

const fetchOrderStatusHistoryList =
  (orderId, callback, loading = true) =>
  async (dispatch, getState) => {
    dispatch(CommonActions.setLoading(loading));
    try {
      const response = await axios.get(`/order/status/history/list/${orderId}`);
      console.log("response order history", response);
      dispatch(CommonActions.setLoading(false));
      if (callback) {
        callback("success", response["data"]);
      }
    } catch (error) {
      console.log("error", error);
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error["response"]["message"],
        })
      );
    }
  };

const onUpdateOrderStatus =
  ({ id, status, deliveryMethod, statusMessage, deliveryInfo }, callback) =>
  async (dispatch, getState) => {
    dispatch(CommonActions.setLoading(true));
    try {
      const response = await axios.put(`/order/update/status/${id}`, {
        status: status,
        status_message: statusMessage,
        delivery_method: deliveryMethod ? deliveryMethod : null,
        delivery_information: deliveryInfo ? deliveryInfo : null,
      });
      callback("success", response);
      // dispatch(CommonActions.setLoading(false));
    } catch (error) {
      console.log("error", error);
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error["response"]["message"],
        })
      );
    }
  };

const onRequestToCancelOrder =
  ({ basicOrderDetail, statusMessage }, callback) =>
  async (dispatch, getState) => {
    dispatch(CommonActions.setLoading(true));
    try {
      await axios
        .post("/order/cancel/request/", {
          status: "requested",
          order: basicOrderDetail["id"],
          message: statusMessage,
        })
        .then((response) => {
          console.log("response->", response);
          // dispatch(CommonActions.setLoading(false));
          callback("success", response);
        });
    } catch (error) {
      console.log("error", error.response);
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error["response"]["message"],
        })
      );
    }
  };

const onUpdateCancellationOrder =
  (id, body, callback) => async (dispatch, getState) => {
    dispatch(CommonActions.setLoading(true));
    try {
      await axios
        .patch("/order/cancel/request/status/update/" + id, body)
        .then((response) => {
          console.log("response->", response);
          // dispatch(CommonActions.setLoading(false));
          if (callback) {
            callback("success", response);
          }
        });
    } catch (error) {
      console.log("error", error.response);
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error["response"]["message"],
        })
      );
    }
  };

module.exports = {
  createOrder,
  isOfferAvailable,
  fetchOrderDetail,
  fetchOrderStatusHistoryList,
  onUpdateOrderStatus,
  onRequestToCancelOrder,
  onUpdateCancellationOrder,
  createOrderV3,
};
