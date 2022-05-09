import axios from 'axios';
import {createActions, createReducer} from 'reduxsauce';

const INITIAL_STATE = {
  user: null,
  address: [],
  pickupLocation: [],
  lang: 'en',
};

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setUser: ['user'],
  logout: null,
  setTouchId: ['useTouchId'],
  setVerify: ['verify'],
  setProfile: ['profile'],
  setLanguage: ['lang'],
  setAddress: ['address'],
  setPickupLocation: ['pickupLocation'],
});

export const AuthTypes = Types;
export default Creators;

/* ------------- Reducers ------------- */

const setUser = (state, {user}) => {
  axios.defaults.headers.common['Authorization'] = `Token ${user.token}`;
  return {
    ...state,
    user,
  };
};

const setTouchId = (state, {useTouchId}) => ({
  ...state,
  useTouchId,
});

const setVerify = (state, {verify}) => ({
  ...state,
  verify,
});

const setProfile = (state, {profile}) => ({
  ...state,
  profile,
});

const setLanguage = (state, {lang}) => ({
  ...state,
  lang,
});

const setAddress = (state, {address}) => ({
  ...state,
  address,
});
const setPickupLocation = (state, {pickupLocation}) => ({
  ...state,
  pickupLocation,
});
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_USER]: setUser,
  [Types.SET_TOUCH_ID]: setTouchId,
  [Types.SET_VERIFY]: setVerify,
  [Types.SET_PROFILE]: setProfile,
  [Types.SET_LANGUAGE]: setLanguage,
  [Types.SET_ADDRESS]: setAddress,
  [Types.SET_PICKUP_LOCATION]: setPickupLocation,
});
