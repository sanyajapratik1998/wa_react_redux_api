import {createActions, createReducer} from 'reduxsauce';

const INITIAL_STATE = [];

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setPromotion: ['data'],
  addPromotionInList: ['data'],
  updatePromotionInList: ['data'],
  deletePromotionInList: ['data'],
});

export const PromotionTypes = Types;
export default Creators;

/* ------------- Reducers ------------- */

const setPromotion = (state, {data}) => {
  state = data;
  return state;
};

const addPromotionInList = (state, {data}) => {
  let newList = [data, ...state];
  state = newList;
  return state;
};
const updatePromotionInList = (state, {data}) => {
  let newList = [];
  state.forEach(item => {
    item.id == data.id ? (item = data) : null;
    newList.push(item);
  });
  state = newList;
  return state;
};

const deletePromotionInList = (state, {data}) => {
  state = state.filter((a, b) => a.id != data);
  return state;
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_PROMOTION]: setPromotion,
  [Types.ADD_PROMOTION_IN_LIST]: addPromotionInList,
  [Types.UPDATE_PROMOTION_IN_LIST]: updatePromotionInList,
  [Types.DELETE_PROMOTION_IN_LIST]: deletePromotionInList,
});
