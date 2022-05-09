import {createActions, createReducer} from 'reduxsauce';

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

export const CartTypes = Types;
export default Creators;

/* ------------- Reducers ------------- */
const getMenuDates = (state, {data}) => {
  return {
    ...state,
    menuDates: data?.menuDates,
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

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_MENU_DATES]: getMenuDates,
  [Types.GET_MENU]: getMenu,
  [Types.MENU_SEARCH_LOADING]: menuSearchLoading,
});
