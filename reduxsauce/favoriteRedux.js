const {createActions, createReducer} = require('reduxsauce')

const INITIAL_STATE = {
    favoriteProduct: [],
};

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setFavoriteProduct: ['favoriteProduct'],
});

const FavirioutsTypes = Types;

/* ------------- Reducers ------------- */

const setFavoriteProduct = (state, {favoriteProduct}) => ({
  ...state,
  favoriteProduct: favoriteProduct.favoriteProduct,
});
/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_FAVORITE_PRODUCT]: setFavoriteProduct,
});

module.exports = {...Creators, FavirioutsTypes, reducer}
