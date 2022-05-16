const {createActions, createReducer} = require('reduxsauce')

const INITIAL_STATE = [];

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setNotification: ['data'],
  addNotificationInList: ['data'],
  updateNotificationInList: ['data'],
  deleteNotificationInList: ['data'],
  resetTransactionHistoryVC: ['data'],
});

 const NotificationTypes = Types;


/* ------------- Reducers ------------- */

const setNotification = (state, {data}) => {
  state = data;
  return state;
};
const addNotificationInList = (state, {data}) => {
  let newList = [data, ...state];
  state = newList;
  return state;
};
const updateNotificationInList = (state, {data}) => {
  let newList = [];
  state.forEach(item => {
    item.id == data.id ? (item = data) : null;
    newList.push(item);
  });
  state = newList;
  return state;
};

const deleteNotificationInList = (state, {data}) => {
  state = state.filter((a, b) => a.id != data);
  return state;
};

const resetTransactionHistoryVC = (state, {data}) => ({
  ...state,
  transactionHistory: data.transactionHistory,
});

/* ------------- Hookup Reducers To Types ------------- */

 const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_NOTIFICATION]: setNotification,
  [Types.ADD_NOTIFICATION_IN_LIST]: addNotificationInList,
  [Types.UPDATE_NOTIFICATION_IN_LIST]: updateNotificationInList,
  [Types.DELETE_NOTIFICATION_IN_LIST]: deleteNotificationInList,
  [Types.RESET_TRANSACTION_HISTORY_VC]: resetTransactionHistoryVC,
});

// module.exports = Creators
module.exports ={ ...Creators,NotificationTypes,reducer}