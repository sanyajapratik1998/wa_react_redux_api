const {createActions, createReducer} = require('reduxsauce')

const INITIAL_STATE = [];

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setPromotion: ['data'],
  addPromotionInList: ['data'],
  updatePromotionInList: ['data'],
  deletePromotionInList: ['data'],
});

 const PromotionTypes = Types;

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

 const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_PROMOTION]: setPromotion,
  [Types.ADD_PROMOTION_IN_LIST]: addPromotionInList,
  [Types.UPDATE_PROMOTION_IN_LIST]: updatePromotionInList,
  [Types.DELETE_PROMOTION_IN_LIST]: deletePromotionInList,
});

// module.exports = Creators
module.exports = {...Creators,PromotionTypes,reducer}