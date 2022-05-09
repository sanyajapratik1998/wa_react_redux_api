import AsyncStorage from '@react-native-async-storage/async-storage';
import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';
import rootReducer from './reduxsauce/';
// import Constants from 'expo-constants';

// const ENV = Constants.manifest.extra?.ENV;
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['common', 'order', 'cart'],
  whitelist: ['auth', 'config', 'promotion', 'recentProducts'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  applyMiddleware(thunk, logger),
  // ['local', 'development'].includes(ENV)
  //   ? applyMiddleware(thunk, logger)
  //   : applyMiddleware(thunk),
);

const persistor = persistStore(store, {}, () => {
  const {user} = store.getState().auth;
  if (user?.token) {
    axios.defaults.headers.common['Authorization'] = `Token ${user.token}`;
  } else {
    axios.defaults.headers.common['Authorization'] = '';
    delete axios.defaults.headers.common['Authorization'];
  }
});

export {store, persistor};
