const {createActions, createReducer} = require('reduxsauce')

const INITIAL_STATE = {
  categories: [],
  products: [],
  productsV1:null,
  productSearchLoading: false,
};

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getCategories: ['data'],
  getProducts: ['data'],
  getProductsV1: ['data'],
  productSearchLoading: ['productSearchLoading'],
});

 const CartTypes = Types;

/* ------------- Reducers ------------- */
const getCategories = (state, {data}) => ({
  ...state,
  categories: data.categories,
});

const getProducts = (state, {data}) => ({
  ...state,
  products: data.products,
});

const getProductsV1 = (state, {data}) => ({
  ...state,
  productsV1: data.productsV1,
});

const productSearchLoading = (state, {productSearchLoading}) => ({
  ...state,
  productSearchLoading,
});

/* ------------- Hookup Reducers To Types ------------- */

 const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CATEGORIES]: getCategories,
  [Types.GET_PRODUCTS]: getProducts,
  [Types.GET_PRODUCTS_V1]: getProductsV1,
  [Types.PRODUCT_SEARCH_LOADING]: productSearchLoading,
});

// module.exports = Creators
module.exports = {...Creators,CartTypes,reducer}