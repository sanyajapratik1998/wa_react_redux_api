import {createActions, createReducer} from 'reduxsauce';

const INITIAL_STATE = {};

const {Types, Creators} = createActions({
  setAppConfiguration: ['data'],
  addBannerCard: ['data'],
  removeConfig: ['data'],
});

export const ConfigTypes = Types;
export default Creators;

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

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_APP_CONFIGURATION]: setAppConfiguration,
  [Types.ADD_BANNER_CARD]: addBannerCard,
  [Types.REMOVE_CONFIG]: removeConfig,
});
