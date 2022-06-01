const axios = require('axios')
const CommonActions = require('../reduxsauce/commonRedux')
const OrderActions = require('../reduxsauce/orderRedux')

const createOrder = params => async (dispatch, getState) => {
  console.log('params', params);
  const {config, cart} = getState();
  dispatch(CommonActions.setLoading(true));
  let products = cart.list.map(
    o =>
      new Object({
        product: o.id,
        qty: parseInt(o.cart_qty),
        price: parseFloat(o.price),
        selected_variants: o.selectedVariants ? o.selectedVariants : null,
        final_price: o.final_price,
      }),
  );
  // console.log(cart.list);
  console.log({
    business: config['businessId'],
    products,
    type: params.type,
    ...params,
  });
  return await axios
    .post('/order/create', {
      business: config['businessId'],
      products,
      type: params.type,
      ...params,
    })
    .then(response => {
      dispatch(CommonActions.setLoading(false));
      console.log('response---<>', response.data);
      dispatch(
        OrderActions.setOrders({
          ...response.data,
        }),
      );
      return response.data;
    })
    .catch(error => {
      console.log('error catch', error);
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error.response['message'],
        }),
      );

      return false;
    });
};

const isOfferAvailable = (item,callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  axios
    .get('/promotion/availability/' + item['id'])
    .then((response) => {
      console.log('apply promotion', response);
      // props.navigation.navigate('place-order', {promoCode: item});
      dispatch(
        CommonActions.setShowToast({
          visible: true,
          content: 'Applied successfully',
        }),
      );
      dispatch(CommonActions.setLoading(false));
      if (callback) {
        callback('success',{promoCode: item})
      }
    })
    .catch((error) => {
      console.log('error apply promotion->', error.response);
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error['response']['data']['message'],
        }),
      );
      dispatch(CommonActions.setLoading(false));
    });
};


module.exports = {createOrder,isOfferAvailable}