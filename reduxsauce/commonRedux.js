import { REHYDRATE } from 'redux-persist';
import { createActions, createReducer } from 'reduxsauce';

const INITIAL_STATE = {
  alert: {
    visible: false,
    title: '',
    content: '',
    rightButton: '',
    leftButton: '',
    rightPress: null,
    leftPress: null
  },
  alertFullScreen: {
    visible: false,
    content: '',
    content2: ''
  },
  alertWebView: {
    visible: false,
    content: ''
  },
  showToast: {
    visible: false,
    content: ''
  },
  loginFrom: null,
  loading: false,
  isMenuShow: false,
  countryCode: 'in',
  connect: true
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setLoginFrom: ['loginFrom'],
  setLoading: ['loading'],
  setAlert: ['alert'],
  setAlertFullScreen: ['alertFullScreen'],
  setAlertWebView: ['alertWebView'],
  setShowToast: ['showToast'],
  setMenu: ['isShow'],
  setCountryCode: ['countryCode'],
  setConnected: ['connect']
});

export const CommonTypes = Types;
export default Creators;

/* ------------- Reducers ------------- */

const setLoading = (state, { loading }) => ({
  ...state,
  loading
});

const setLoginFrom = (state, { loginFrom }) => ({
  ...state,
  loginFrom
});

const setAlert = (state, { alert }) => ({
  ...state,
  alert: {
    ...INITIAL_STATE.alert,
    ...alert
  }
});

const setAlertFullScreen = (state, { alertFullScreen }) => ({
  ...state,
  alertFullScreen
});
const setShowToast = (state, { showToast }) => ({
  ...state,
  showToast: {
    ...INITIAL_STATE.showToast,
    ...showToast
  }
});

const setAlertWebView = (state, { alertWebView }) => ({
  ...state,
  alertWebView
});

const setMenu = (state, { isShow }) => ({
  ...state,
  isMenuShow: isShow
});

const setCountryCode = (state, { countryCode }) => ({
  ...state,
  countryCode
});

const setConnected = (state, { connect }) => ({
  ...state,
  connect
});

const rehydrate = () => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_LOADING]: setLoading,
  [Types.SET_LOGIN_FROM]: setLoginFrom,
  [Types.SET_ALERT]: setAlert,
  [Types.SET_SHOW_TOAST]: setShowToast,
  [Types.SET_ALERT_FULL_SCREEN]: setAlertFullScreen,
  [Types.SET_ALERT_WEB_VIEW]: setAlertWebView,
  [Types.SET_MENU]: setMenu,
  [Types.SET_COUNTRY_CODE]: setCountryCode,
  [Types.SET_CONNECTED]: setConnected,
  [REHYDRATE]: rehydrate
});
