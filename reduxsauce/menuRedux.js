const {createActions, createReducer} = require('reduxsauce')

const INITIAL_STATE = {
  menuDates: [],
  menu: [],
  menuSearchLoading: false,
};

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getMenuDates: ['data'],
  getMenu: ['data'],
  menuSearchLoading: ['menuSearchLoading'],
});

 const CartTypes = Types;

/* ------------- Reducers ------------- */
const getMenuDates = (state, {data}) => {
  return {
    ...state,
    menuDates: data.menuDates,
  };
};

const getMenu = (state, {data}) => ({
  ...state,
  menu: data.menu,
});

const menuSearchLoading = (state, {menuSearchLoading}) => ({
  ...state,
  menuSearchLoading,
});

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_MENU_DATES]: getMenuDates,
  [Types.GET_MENU]: getMenu,
  [Types.MENU_SEARCH_LOADING]: menuSearchLoading,
});

// module.exports = Creators
module.exports = {...Creators,CartTypes,reducer}