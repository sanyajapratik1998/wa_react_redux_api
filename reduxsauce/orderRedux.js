const {createActions, createReducer} = require('reduxsauce')

const INITIAL_STATE = {
  id: null,
  orders: [],
};

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getOrders: ['data'],
  setOrders: ['data'],
});

 const OrderTypes = Types;


/* ------------- Reducers ------------- */

// const setOrderSettings = (state, {data}) => ({
//   ...state,
//   orderingSettings: data.orderingSettings || state.orderingSettings,
// });

// const cancelOrder = state => INITIAL_STATE;

const getOrders = (state, {data}) => ({
  ...state,
  orders: data,
});
const setOrders = (state, {data}) => ({
  ...state,
  ...data,
});

/* ------------- Hookup Reducers To Types ------------- */

 const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_ORDERS]: getOrders,
  [Types.SET_ORDERS]: setOrders,
});


// module.exports = Creators
module.exports = {...Creators,OrderTypes,reducer}