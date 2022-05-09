import {combineReducers} from 'redux';
import {resettableReducer} from 'reduxsauce';

import {AuthTypes} from './authRedux';

const resettable = resettableReducer(AuthTypes.LOGOUT);

const rootReducer = combineReducers({
  auth: resettable(require('./authRedux').reducer),
  common: resettable(require('./commonRedux').reducer),
  home: resettable(require('./homeRedux').reducer),
  notification: resettable(require('./notificationRedux').reducer),
  order: resettable(require('./orderRedux').reducer),
  products: resettable(require('./productRedux').reducer),
  recentProducts: resettable(require('./recentProductRedux').reducer),
  services: resettable(require('./servicesRedux').reducer),
  menu: resettable(require('./menuRedux').reducer),
  cart: resettable(require('./cartRedux').reducer),
  promotion: resettable(require('./promotionRedux').reducer),
  config: require('./configRedux').reducer,
  franchise: resettable(require('./franchiseRedux').reducer),
});

export default rootReducer;
