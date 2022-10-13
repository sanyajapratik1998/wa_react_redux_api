const axios = require("axios");
const { store } = require("../index");

const PaymentNow = async (object, callback) => {
  const { type, payment } = object;

  const business = store.getState().config;
  const auth = store.getState().auth;

  const payWithCashfree = () => {
    console.log("pay with cashfree");

    let left = window.innerWidth / 2 - 850 / 2;
    let top = window.innerHeight / 2 - 500 / 2;
    var new_window = window.open(
      payment.payment_url,
      "Payment",
      "width=850,height=500,toolbar=0,status=0,left=" + left + ", top=" + top
    );
    var timer = setInterval(checkChild, 500);
    function checkChild() {
      if (new_window.closed) {
        callback && callback();
        clearInterval(timer);
      }
    }
  };

  const payWithRazorpay = () => {
    const options = {
      key: business.paymentKey,
      currency: "INR",
      amount: payment.paid_amount * 100,
      name: business.businessName,
      description: business.businessDescription.slice(0, 240),
      image: business.logo,
      order_id: payment.payment_order_key,
      modal: {
        ondismiss: () => {
          console.log("on dismiss");
          document.getElementById("razorpay").remove();
          document
            .querySelectorAll(".razorpay-container")
            .forEach(function (a) {
              a.remove();
            });
          callback();
        },
      },
      handler: (response) => {
        axios
          .post("/payment/razorpay/web/success/" + payment.id, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          })
          .then((res) => {
            console.log("response- razorpay ->", res);
            callback && callback();
            document.getElementById("razorpay").remove();
            document
              .querySelectorAll(".razorpay-container")
              .forEach(function (a) {
                a.remove();
              });
          })
          .catch((error) => {
            console.log("error- razorpay-> ", error.response);
            callback && callback();
            document.getElementById("razorpay").remove();
            document
              .querySelectorAll(".razorpay-container")
              .forEach(function (a) {
                a.remove();
              });
            alert("Something went wrong. Your order is not updated.");
          });
      },
      prefill: {
        name: auth.user.first_name + " " + auth.user.last_name,
        email: auth.user.email,
        contact: auth.user.phone,
      },
      theme: {
        color: business.theme.themeColor,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const payWithPaytm = (direct) => {
    const transactionDone = () => {
      console.log("vcalll fun", window.Paytm);
      window.Paytm.CheckoutJS.close();
      callback();
    };

    var payConfig = {
      root: "",
      style: {
        themeBackgroundColor: business.theme.themeColor,
        headerBackgroundColor: business.theme.themeColor,
        headerColor: business.theme.primaryColor,
        themeColor: business.theme.primaryColor,
      },
      flow: "DEFAULT",
      data: {
        orderId: payment.id.toString(),
        token: payment.payment_order_key,
        tokenType: "TXN_TOKEN",
        amount: payment.paid_amount.toString(),
      },
      hidePaymodeLabel: true,
      merchant: {
        redirect: false,
      },
      handler: {
        transactionStatus: (paymentStatus) => {
          console.log(paymentStatus);
          axios
            .post("/payment/paytm/web/success/" + payment.id, {
              paymentStatus,
            })
            .then((res) => {
              console.log("response- paytm ->", res);
              transactionDone();
            })
            .catch((error) => {
              console.log("error- paytm ->", error.response);
              transactionDone();
            });
        },
        notifyMerchant: function notifyMerchant(eventName, data) {
          console.log("Closed", eventName, data);
          eventName == "APP_CLOSED" && transactionDone();
        },
      },
    };

    const initPaytm = () => {
      window.Paytm.CheckoutJS.init(payConfig)
        .then(function onSuccess() {
          window.Paytm.CheckoutJS.invoke();
        })
        .catch(function onError(error) {
          console.log("error => ", error.response);
          console.log("error => ", error);
          transactionDone();
        });
    };

    if (window.Paytm && window.Paytm.CheckoutJS) {
      if (direct) {
        initPaytm();
      }
      window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad(data) {
        initPaytm();
      });
    }
  };

  let paytmBaseURL =
    business.ENV == "local" || business.ENV == "development"
      ? "https://securegw-stage.paytm.in"
      : business.slug == "demo-retail" || business.slug == "demo-restaurants"
      ? "https://securegw-stage.paytm.in"
      : "https://securegw.paytm.in";

  if (type == "cashfree") {
    let script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/core/1.0.26/bundle.sandbox.js";
    script.async = true;
    script.id = "cashfree";
    if (document.getElementById("cashfree")) {
      payWithCashfree();
    } else {
      document.body.appendChild(script);
      script.onload = payWithCashfree;
    }
  } else if (type == "upi") {
    document.body.onload = payWithCashfree;
  } else if (type == "razorpay") {
    let script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.id = "razorpay";
    script.async = true;
    document.body.appendChild(script);
    script.onload = payWithRazorpay;
  } else if (type == "paytm") {
    let script = document.createElement("script");
    script.src =
      paytmBaseURL +
      "/merchantpgpui/checkoutjs/merchants/" +
      business.paymentKey +
      ".js";
    script.id = "paytm";
    script.async = true;
    if (document.getElementById("paytm")) {
      payWithPaytm(true);
    } else {
      document.body.appendChild(script);

      script.onload = () => payWithPaytm(false);
    }
  }
};

module.exports = { PaymentNow };
