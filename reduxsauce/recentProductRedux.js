import {createActions, createReducer} from 'reduxsauce';

const INITIAL_STATE = [];

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setRecentProduct: ['data'],
});

export const CartTypes = Types;
export default Creators;

/* ------------- Reducers ------------- */

const setRecentProduct = (state, {data}) => [...state, data];

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_RECENT_PRODUCT]: setRecentProduct,
});
