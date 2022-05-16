const {createActions, createReducer} = require('reduxsauce')

const INITIAL_STATE = {};

const {Types, Creators} = createActions({
  setAppConfiguration: ['data'],
  addBannerCard: ['data'],
  removeConfig: ['data'],
});

const ConfigTypes = Types;

const addBannerCard = (state, {data}) => {
  return {
    ...state,
    homePage: {
      ...state.homePage,
      bannerCard: [...state?.homePage?.bannerCard, data],
    },
  };
};
const setAppConfiguration = (state, {data}) => ({
  // ...state,
  ...data,
});

const removeConfig = (state, {data}) => {
  state = null;
  return state;
};

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_APP_CONFIGURATION]: setAppConfiguration,
  [Types.ADD_BANNER_CARD]: addBannerCard,
  [Types.REMOVE_CONFIG]: removeConfig,
});

// module.exports = 
module.exports = {...Creators,ConfigTypes,reducer}