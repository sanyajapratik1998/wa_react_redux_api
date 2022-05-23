const {createActions, createReducer} = require('reduxsauce')

const INITIAL_STATE = {count: 0, list: []};

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setCart: ['data'],
  addToCart: ['data'],
  removeToCart: ['data'],
  AddQtyInCart: ['data'],
  RemoveQtyInCart: ['data'],
  updateCart: ['data'],
  emptyCart: ['data'],
});

 const CartTypes = Types;

/* ------------- Reducers ------------- */
const setCart = (state, {data}) => {
  console.log('data', data);
  // state = data;
  // return {...state, list: data};
  return {...state, list: data.data, count: data.count};
};

const addToCart = (state, {data}) => ({
  ...state,
  list: [...state.list, data],
  count: state.count + 1,
});

//remove then add
// const updateCart = (state, {data}) => ({
//   ...state,
//   list: [...state.list.filter(o => o.id !== data.id), data],
// });

const updateCart = (state, {data}) => {
  let list = [...state.list];
  let index = list.findIndex(
    o =>
      o.id == data.id &&
      JSON.stringify(data.selectedVariants) ==
        JSON.stringify(o.selectedVariants),
  );
  list[index] = {...data};
  return {...state, list: list};
};
// const addToCart = (state, {data}) => [...state, data];

const removeToCart = (state, {data}) => ({
  ...state,
  list: state.list.filter(item => item !== data),
  count: state.count - 1,
});

const AddQtyInCart = (state, {data}) => {
  console.log('state is', state[data]);
  let arr = [...state];
  arr[data] = {
    ...arr[data],
    cart_qty: arr[data].cart_qty + 1,
  };
  return arr;
};

const RemoveQtyInCart = (state, {data}) => {
  let arr = [...state];
  arr[data] = {
    ...arr[data],
    cart_qty: arr[data].cart_qty - 1,
  };
  return arr;
};

const emptyCart = (state, {data}) => {
  state = {...state, count: 0, list: []};
  return state;
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CART]: setCart,
  [Types.ADD_TO_CART]: addToCart,
  [Types.UPDATE_CART]: updateCart,
  [Types.REMOVE_TO_CART]: removeToCart,
  [Types.ADD_QTY_IN_CART]: AddQtyInCart,
  [Types.REMOVE_QTY_IN_CART]: RemoveQtyInCart,
  [Types.EMPTY_CART]: emptyCart,
});

// module.exports = 
module.exports = {...Creators,CartTypes,reducer}