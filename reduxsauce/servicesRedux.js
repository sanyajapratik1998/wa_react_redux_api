const {createActions, createReducer} = require('reduxsauce')

const INITIAL_STATE = {
  servicesCategories: [],
  services: [],
  serviceSearchLoading: false,
};

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getServicesCategories: ['data'],
  getServices: ['data'],
  serviceSearchLoading: ['serviceSearchLoading'],
});

const CartTypes = Types;

/* ------------- Reducers ------------- */
const getServicesCategories = (state, {data}) => {
  return {
    ...state,
    servicesCategories: data.servicesCategories,
  };
};

const getServices = (state, {data}) => ({
  ...state,
  services: data.services,
});

const serviceSearchLoading = (state, {serviceSearchLoading}) => ({
  ...state,
  serviceSearchLoading,
});

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_SERVICES_CATEGORIES]: getServicesCategories,
  [Types.GET_SERVICES]: getServices,
  [Types.SERVICE_SEARCH_LOADING]: serviceSearchLoading,
});

// module.exports = Creators
module.exports = {...Creators,CartTypes,reducer}