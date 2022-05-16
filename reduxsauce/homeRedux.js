const { createActions, createReducer } = require('reduxsauce')

const INITIAL_STATE = {
  referral: null,
  topOfferData: [],
  latestOfferData: [],
  fetching: false,
  detail: null,
  appConfig: null,
  companies: [],
  badge: {},
  feature: [],
  rewardMechanism: null,
  enableLPCP: false
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setCampaign: ['data'],
  setReferral: ['data'],
  setAppConfig: ['data'],
  setCompanies: ['data'],
  setTabBadge: ['data']
});

const HomeTypes = Types;

/* ------------- Reducers ------------- */

const setCampaign = (state, { data }) => ({
  ...state,
  topOfferData: data.topOfferData || state.topOfferData,
  latestOfferData: data.latestOfferData || state.latestOfferData,
  fetching: data.fetching,
  detail: data.detail
});

const setReferral = (state, { data }) => ({
  ...state,
  referral: data
});

const setAppConfig = (state, { data }) => ({
  ...state,
  appConfig: data
});

const setCompanies = (state, { data }) => ({
  ...state,
  companies: data,
  feature: data.feature || state.feature,
  rewardMechanism: data.rewardMechanism || state.rewardMechanism,
  enableLPCP: data.enableLPCP || state.enableLPCP
});

const setTabBadge = (state, { data }) => ({
  ...state,
  badge: data
});

/* ------------- Hookup Reducers To Types ------------- */

 const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_APP_CONFIG]: setAppConfig,
  [Types.SET_CAMPAIGN]: setCampaign,
  [Types.SET_REFERRAL]: setReferral,
  [Types.SET_COMPANIES]: setCompanies,
  [Types.SET_TAB_BADGE]: setTabBadge
});
// module.exports = Creators
module.exports = {...Creators,HomeTypes,reducer}