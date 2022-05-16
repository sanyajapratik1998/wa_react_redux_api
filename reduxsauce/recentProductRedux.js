const {createActions, createReducer} = require('reduxsauce')

const INITIAL_STATE = [];

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setRecentProduct: ['data'],
});

 const CartTypes = Types;

/* ------------- Reducers ------------- */

const setRecentProduct = (state, {data}) => [...state, data];

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_RECENT_PRODUCT]: setRecentProduct,
});

// module.exports = Creators
module.exports = {...Creators,CartTypes,reducer}