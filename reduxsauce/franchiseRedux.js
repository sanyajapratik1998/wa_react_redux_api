const {createActions, createReducer} = require('reduxsauce')

const INITIAL_STATE = [];

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setFranchise: ['data'],
  addFranchise: ['data'],
  updateFranchise: ['data'],
  deleteFranchise: ['data'],
});

 const CartTypes = Types;

/* ------------- Reducers ------------- */

const setFranchise = (state, {data}) => {
  state = data;
  return state;
};

const addFranchise = (state, {data}) => {
  let newList = [...state, data];
  state = newList;
  return state;
};
const updateFranchise = (state, {data}) => {
  let newList = [];
  state.forEach((item) => {
    item.id == data.id ? (item = data) : null;
    newList.push(item);
  });
  state = newList;
  return state;
};

const deleteFranchise = (state, {data}) => {
  state = state.filter((a, b) => a.id != data);
  return state;
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_FRANCHISE]: setFranchise,
  [Types.ADD_FRANCHISE]: addFranchise,
  [Types.UPDATE_FRANCHISE]: updateFranchise,
  [Types.DELETE_FRANCHISE]: deleteFranchise,
});

// module.exports = Creators
module.exports = {...Creators,CartTypes,reducer}