const CommonActions = require('../reduxsauce/commonRedux')
const cartAction = require('../reduxsauce/cartRedux')
const axios = require('axios')

 const getCartList = (cartList) => async (dispatch) => {
  dispatch(CommonActions.setLoading(true));
  await axios
    .get('/order/cart/list')
    .then((response) => {
      console.log('response', response.data);
      let countBadge = data.reduce(function (quantity, item) {
        return (quantity = quantity + item.cart_qty);
      }, 0);
      dispatch(cartAction.setCart({data: response.data, count: countBadge}));
      dispatch(CommonActions.setLoading(false));
    })
    .catch((error) => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: 'Something went wrong!',
        }),
      );
    });
  return cartList;
};

 const addToCart =
  (product, qty = 1, message) =>
  (dispatch, getState) => {
    const {
      // auth: {user},
      // home: {appConfig},
      // order,
      cart,
    } = getState();
    dispatch(CommonActions.setLoading(true));
    // try {
    if (
      cart.list.length &&
      cart.list.some(
        (o) =>
          o.id === product.id &&
          (o.selectedVariants == undefined ||
            o.selectedVariants.length == 0 ||
            JSON.stringify(product.selectedVariants) ==
              JSON.stringify(o.selectedVariants)),
      )
    ) {
      console.log('product-----------exists', product);
      let oldCart_qty = 0;
      cart.list.map((o) => {
        if (
          o.id == product.id &&
          JSON.stringify(product.selectedVariants) ==
            JSON.stringify(o.selectedVariants)
        ) {
          oldCart_qty = o.cart_qty;
        }
      });
      if (
        product.always_available_stock ||
        parseInt(oldCart_qty) + parseInt(qty) <= parseInt(product.stock_qty)
      ) {
        dispatch(
          cartAction.updateCart({
            ...product,
            cart_qty: parseInt(oldCart_qty) + parseInt(qty),
          }),
        );
        dispatch(
          CommonActions.setShowToast({
            visible: true,
            content: message
              ? message
              : qty < 0
              ? 'Reduced Successfully '
              : 'Added successfully',
          }),
        );
        
      } else {
        dispatch(CommonActions.setLoading(false));
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content:
              'You cannot add more than ' +
              parseInt(product.stock_qty).toString() +
              ' quantity',
          }),
        );
      }
    } else {
      if (
        product.always_available_stock ||
        parseInt(qty) <= parseInt(product.stock_qty)
      ) {
        dispatch(cartAction.addToCart({...product, cart_qty: qty}));
        dispatch(
          CommonActions.setShowToast({
            visible: true,
            content: qty < 0 ? 'Reduced Successfully ' : 'Added successfully',
          }),
        );
      } else {
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content:
              'You cannot add more than ' +
              parseInt(product.stock_qty).toString() +
              ' quantity',
          }),
        );
      }
    }
    dispatch(CommonActions.setLoading(false));
    // dispatch(CommonActions.setLoading(false));
    // console.log('cart add --->', cart);

    // check crart item exist or not if true then upadata threw api

    //     if (cart.length > 0 && cart.some(x => x.id === product.id)) {
    //       console.log('product inside cart ..', product.resposeData.id);
    //       let index = cart.findIndex(x => x.id === product.id);
    //       // qty update api

    //       axios
    //         .put('/order/cart/update/'+ product.resposeData.id, { qty: Number(product.resposeData.qty) + 1 , product: product.id })
    //         .then(res => console.log('update data =======================>', res.data))
    //         .catch(err => console.log(err.response));
    //       dispatch(cartAction.AddQtyInCart(index));
    // } else {
    // dispatch(cartAction.addToCart(1));
    // axios
    //   .post('/order/cart/create', {
    //     qty: quantites ? quantites : 1,
    //     product: product.id,
    //   })
    //   .then(res => {
    //     dispatch(CommonActions.setLoading(false));
    //     // dispatch(getCartList());
    //     console.log(res);
    //   })
    //   .catch(err => {
    //     dispatch(CommonActions.setLoading(false));
    //     dispatch(
    //       CommonActions.setAlert({
    //         visible: true,
    //         content: 'Something went wrong!',
    //       }),
    //     );
    //     console.log(err.response);
    //   });
    // }
    // navigation.push('Cart', {product});
    // } catch ({message}) {
    //   dispatch(
    //     CommonActions.setAlert({visible: true, content: 'Something went wrong'}),
    //   );
    //   dispatch(CommonActions.setLoading(false));
    // }
    // dispatch(CommonActions.setLoading(false));
  };

 const addQty = (product) => async (dispatch) => {
  dispatch(CommonActions.setLoading(true));
  await axios
    .put('/order/cart/update/' + product.id, {
      qty: Number(product.qty) + 1,
    })
    .then((res) => {
      dispatch(CommonActions.setLoading(false));
      dispatch(getCartList());
      console.log('update data =======================>', res.data);
    })
    .catch((err) => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: 'Something went wrong',
        }),
      );
      console.log(
        'error =========================================>',
        err.response,
      );
    });
  // dispatch(cartAction.AddQtyInCart(product));
  return product;
};

 const removeQty = (product) => async (dispatch) => {
  dispatch(CommonActions.setLoading(true));
  await axios
    .put('/order/cart/update/' + product.id, {
      qty: Number(product.qty) - 1,
    })
    .then((res) => {
      dispatch(CommonActions.setLoading(false));
      dispatch(getCartList());
      console.log('update data =======================>', res.data);
    })
    .catch((err) => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: 'Something went wrong',
        }),
      );
      console.log(
        'error =========================================>',
        err.response,
      );
    });
  // dispatch(cartAction.RemoveQtyInCart(product));
  console.log('product', product);
  return product;
};

 const removeToCart = (item) => (dispatch, getState) => {
  // const {cart} = getState();
  // const filterData = cart.filter(x => x?.id === product.id);
  // const filterData = cart.filter(x => x?.resposeData?.product === product.id);
  // console.log('filterData ===================================>', filterData);
  dispatch(CommonActions.setLoading(true));
  dispatch(cartAction.removeToCart(item));
  dispatch(CommonActions.setLoading(false));

  // axios
  //   .delete('/order/cart/delete/' + item.id)
  //   // .delete('/order/cart/delete/' + filterData[0].cart_id)
  //   .then(response => {
  //     dispatch(CommonActions.setLoading(false));
  //     // dispatch(getCartList());
  //     dispatch(cartAction.removeToCart(item));
  //   })
  //   .catch(err => {
  //     dispatch(
  //       CommonActions.setAlert({
  //         visible: true,
  //         content: 'Something went wrong!',
  //       }),
  //     );
  //     dispatch(CommonActions.setLoading(false));
  //     console.log(err.response);
  //   });
  // dispatch(cartAction.removeToCart(product));
  // console.log('product removes', product);
  // return product;
};
module.exports= {getCartList,addToCart,addQty,removeQty,removeToCart}