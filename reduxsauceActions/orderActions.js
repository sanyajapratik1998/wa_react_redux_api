const axios = require("axios");
const CommonActions = require("../reduxsauce/commonRedux");
const OrderActions = require("../reduxsauce/orderRedux");

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

const onProceedToPay =
  (body, callback, cashOnDelivery, theme = null, platform = "web") =>
  async (dispatch, getState) => {
    const appConfig = getState().config;
    const user = getState().auth["user"];

    try {
      dispatch(CommonActions.setLoading(true));
      let order = await dispatch(createOrder(body));
      if (order) {
        if (cashOnDelivery) {
          dispatch(CommonActions.setLoading(false));
          callback &&
            callback("success", "order-history-detail", {
              id: order["id"],
            });
          dispatch(CartActions.emptyCart());
          return;
        } else {
          if (appConfig["paymentType"].toLowerCase() == "cashfree") {
            console.log("calling to cashfree");
            dispatch(CommonActions.setLoading(false));
            if (platform == "web") {
              let left = window.innerWidth / 2 - 850 / 2;
              let top = window.innerHeight / 2 - 500 / 2;
              var new_window = window.open(
                order.cashfree_payment_url,
                "Ratting",
                "width=850,height=500,toolbar=0,status=0,left=" +
                  left +
                  ", top=" +
                  top
              );

              var timer = setInterval(checkChild, 500);

              function checkChild() {
                if (new_window.closed) {
                  callback &&
                    callback("success", "order-history-detail/" + order.id);
                  clearInterval(timer);
                }
              }
            } else {
              callback &&
                callback("success", "cashfree-payment", {
                  url: order["cashfree_payment_url"],
                  id: order["id"],
                });
            }
            dispatch(CartActions.emptyCart());
            return;
          } else if (appConfig["paymentType"].toLowerCase() == "stripe") {
            console.log("---------------------stripe");
            const paymentStatus = await context.sendPaymentByStripe(
              order,
              this.props.navigation
            );
            console.log("paymentStatus", paymentStatus);
            // get response after payemnt done in Boolean
            if (paymentStatus) {
              dispatch(CartActions.emptyCart());
              callback &&
                callback("success", "order-history-detail", {
                  id: order["id"],
                });
            } else {
              dispatch(CommonActions.setLoading(true));
              // this.setState({ rePayment: true });
              // Re pay
              //  neeed to repay order if cancel by user
            }
          } else if (appConfig["paymentType"].toLowerCase() == "razorpay") {
            dispatch(CartActions.emptyCart());
            console.log("calling to razorpay");
            if (platform == "web") {
              const options = {
                key: appConfig["paymentKey"],
                currency: "INR",
                amount: order["total"] * 100,
                name: appConfig["businessName"],
                description: appConfig["businessDescription"],
                image: appConfig["logo"],
                order_id: order["payment_order_key"],
                modal: {
                  ondismiss: () => {
                    callback &&
                      callback("success", "order-history-detail", {
                        id: order["id"],
                      });
                  },
                },
                handler: (response) => {
                  // alert(response.razorpay_payment_id);
                  // alert(response.razorpay_order_id);
                  // alert(response.razorpay_signature);
                  axios
                    .post("/order/pay/razorpay/success/" + order.id, {
                      razorpay_payment_id: response["razorpay_payment_id"],
                      razorpay_order_id: response["razorpay_order_id"],
                      razorpay_signature: response["razorpay_signature"],
                      order_id: order["id"],
                    })
                    .then((res) => {
                      console.log("response- razorpay ->", res);
                      dispatch(CommonActions.setLoading(false));
                      callback &&
                        callback("success", "order-history-detail", {
                          id: order["id"],
                        });
                    })
                    .catch((error) => {
                      dispatch(CommonActions.setLoading(false));
                      console.log("error- razorpay-> ", error["response"]);
                      dispatch(
                        CommonActions.setAlert({
                          visible: true,
                          content:
                            "Something went wrong. Your order is not updated.",
                        })
                      );
                    });
                },
                prefill: {
                  name: user["first_name"] + " " + user["last_name"],
                  email: user["email"],
                  contact: user["phone"],
                },
                theme: theme,
                // {
                //   color: Colors.theme_color,
                // },
              };

              const paymentObject = new window.Razorpay(options);
              paymentObject.open();
              return;
            } else {
              // if (this.state.cashOnDelivery) {
              //   this.setState({loading: false});
              //   this.props.navigation.replace('order-history-detail', {
              //     id: order['id'],
              //   });
              // } else {
              dispatch(CommonActions.setLoading(false));
              callback && callback("success", "payment", { id: order["id"] });
            }
            dispatch(CartActions.emptyCart());
            return;
            // }
          }
        }
      } else {
        // stop pay loading
        dispatch(CommonActions.setLoading(false));
        //  order is not created from backend
        return;
      }
    } catch (error) {
      dispatch(CommonActions.setLoading(false));
      console.log("error", error);
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error["response"]["message"],
        })
      );
    }
  };

const fetchOrderDetail = (orderId, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));

  await axios
    .get(`/order/detail/${orderId}`)
    .then((response) => {
      console.log("order Detail->", response["data"]["data"]);
      if (callback) {
        callback("success", response["data"]["data"]);
      }
      dispatch(CommonActions.setLoading(false));
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
  (orderId, callback, loading = false) =>
  async (dispatch, getState) => {
    dispatch(CommonActions.setLoading(loading));
    try {
      const response = await axios.get(`/order/status/history/list/${orderId}`);
      console.log("response order history", response);
      if (callback) {
        callback("success", response["data"]);
      }
      dispatch(CommonActions.setLoading(false));
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

const onPayNow =
  (basicOrderDetail, callback, theme = null, platform = "web") =>
  async (dispatch, getState) => {
    const { config } = getState();
    const { user } = getState().auth;

    if (config["paymentType"] == "cashfree") {
      if (platform == "web") {
        let left = window.innerWidth / 2 - 850 / 2;
        let top = window.innerHeight / 2 - 500 / 2;
        var new_window = window.open(
          "https://payments-test.cashfree.com/order/#" +
            basicOrderDetail["payment_order_key"],
          "Ratting",
          "width=850,height=500,toolbar=0,status=0,left=" +
            left +
            ", top=" +
            top
        );

        var timer = setInterval(checkChild, 500);

        function checkChild() {
          if (new_window["closed"]) {
            clearInterval(timer);
            window.location.reload();
          }
        }
      } else {
        let baseurl =
          config['ENV'] == "local" || config['ENV'] == "development"
            ? "https://payments-test.cashfree.com/order/#"
            : "https://payments.cashfree.com/order/#";
        callback("success", "cashfree-payment", {
          url: baseurl + basicOrderDetail["payment_order_key"],
          id: basicOrderDetail["id"],
        });
      }
    } else if (config["paymentType"] == "razorpay") {
      if (platform == "web") {
        const options = {
          key: config["paymentKey"],
          currency: "INR",
          amount: basicOrderDetail["total"] * 100,
          name: config["businessName"],
          description: config["businessDescription"],
          image: config["logo"],
          order_id: basicOrderDetail["payment_order_key"],
          handler: (response) => {
            axios
              .post("/order/pay/razorpay/success/" + basicOrderDetail["id"], {
                razorpay_payment_id: response["razorpay_payment_id"],
                razorpay_order_id: response["razorpay_order_id"],
                razorpay_signature: response["razorpay_signature"],
                order_id: basicOrderDetail["id"],
              })
              .then((res) => {
                console.log("response- razorpay ->", res);
                callback("success", null, res);
              })
              .catch((error) => {
                console.log("error- razorpay-> ", error?.response);
                alert("Something went wrong. Your order is not updated.");
              });
          },
          prefill: {
            name: user["first_name"] + " " + user?.last_name,
            email: user["email"],
            contact: user["phone"],
          },
          theme: theme,
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        callback("success", "payment", {
          id: basicOrderDetail["id"],
        });
      }
    }
  };

module.exports = {
  createOrder,
  isOfferAvailable,
  onProceedToPay,
  onPayNow,
  fetchOrderDetail,
  fetchOrderStatusHistoryList,
  onUpdateOrderStatus,
  onRequestToCancelOrder,
  onUpdateCancellationOrder,
};
