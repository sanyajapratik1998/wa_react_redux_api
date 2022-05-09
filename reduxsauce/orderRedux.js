import {createActions, createReducer} from 'reduxsauce';

const INITIAL_STATE = {
  id: null,
  orders: [],
};

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getOrders: ['data'],
  setOrders: ['data'],
});

export const OrderTypes = Types;
export default Creators;

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

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_ORDERS]: getOrders,
  [Types.SET_ORDERS]: setOrders,
});
