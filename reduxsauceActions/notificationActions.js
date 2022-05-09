import axios from 'axios';
import CommonActions from '../reduxsauce/commonRedux';
import NotificationActions from '../reduxsauce/notificationRedux';

const limitPage = 10;

export const getNotificationList = data => async (dispatch, getState) => {
  const {config} = getState();
  dispatch(CommonActions.setLoading(true));
  await axios
    .get('/notification/list/'+config?.businessId)
    .then(response => {
      dispatch(NotificationActions.setNotification(response.data));
      dispatch(CommonActions.setLoading(false));
    })
    .catch(error => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error?.response?.message,
        }),
      );
      console.log('error >> ', error?.response?.message);
    });
};

export const addNotificationInList = data => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  await axios
    .post('/notification/create', data)
    .then(response => {
      dispatch(NotificationActions.addNotificationInList(response.data));
      dispatch(CommonActions.setLoading(false));
    })
    .catch(error => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error?.response?.message,
        }),
      );
      console.log('error >> ', error?.response);
    });
};
export const updateNotificationInList = (data, id) => async (
  dispatch,
  getState,
) => {
  dispatch(CommonActions.setLoading(true));
  await axios
    .put('/notification/update/' + id, data)
    .then(response => {
      dispatch(NotificationActions.updateNotificationInList(response.data));
      dispatch(CommonActions.setLoading(false));
    })
    .catch(error => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error?.response?.message,
        }),
      );
      console.log('error >> ', error?.response);
    });
};

// export const getNotificationByPage = page => async (dispatch, getState) => {
//   const {
//     auth: {user},
//     notification,
//   } = getState();

//   const memberId = get(user, 'memberId', undefined);
//   const token = get(user, 'token', undefined);
//   dispatch(NotificationActions.setNotification({fetching: true}));
//   const response = await getNotificationByPageApi(
//     {
//       type: 'USER',
//       limit: limitPage,
//       page,
//     },
//     memberId,
//     token,
//   );
//   console.log('getNotificationByPage', response);

//   const totalPage = Math.ceil(response.count / limitPage);
//   if ((totalPage >= page || totalPage === 0) && response.result.length) {
//     const newData = [...notification.notificationList, ...response.result];
//     dispatch(
//       NotificationActions.setNotification({
//         fetching: false,
//         notificationList: page === 1 ? response.result : newData,
//       }),
//     );
//   } else {
//     dispatch(NotificationActions.setNotification({fetching: false}));
//   }
// };

export const deleteNotification = id => async (dispatch, getState) => {
  console.log('deleting notification id ======================>', id);
  await axios
    .delete('/notification/delete/' + id)
    .then(response => {
      console.log('response delete notification >', response);
      dispatch(CommonActions.setLoading(false));
      dispatch(NotificationActions.deleteNotificationInList(id));
    })
    .catch(error => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error?.response?.message,
        }),
      );
      console.log('error >> ', error?.response?.message);
    });
  // const {
  //   auth: { user },
  //   notification: { notificationList }
  // } = getState();
  // dispatch(NotificationActions.setNotification({ fetching: true }));

  // const response = await deleteNotificationApi(id, user.token);

  // if (response.error) {
  //   dispatch(NotificationActions.setNotification({ fetching: false }));
  // } else {
  //   const newData = notificationList.filter(i => i.id !== id);
  //   dispatch(NotificationActions.setNotification({ fetching: false, notificationList: newData }));
  // }
};

export const deleteNotificationByList = ids => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  console.log('selectd ids =============================>', ids);
  await axios
    .delete('/notification/delete/multiple/' + ids)
    .then(response => {
      dispatch(getNotificationList());
      dispatch(CommonActions.setLoading(false));
      console.log(
        'delete multiple notification response ===============================>',
        response,
      );
    })
    .catch(error => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error?.response?.message,
        }),
      );
      console.log('error', error?.response?.message);
    });
  // const {
  //   auth: {user},
  //   notification: {notificationList},
  // } = getState();

  // dispatch(NotificationActions.setNotification({fetching: true}));

  // const res = await new Promise(resolve => {
  //   const itemRemoved = [];
  //   ids.forEach(async id => {
  //     const response = await deleteNotificationApi(id, user.token);
  //     itemRemoved.push(response.status);
  //     if (itemRemoved.length === ids.length) {
  //       resolve('success');
  //     }
  //   });
  // });

  // if (res === 'success') {
  //   const newData = notificationList.filter(i => !ids.includes(i.id));
  //   dispatch(
  //     NotificationActions.setNotification({
  //       fetching: false,
  //       notificationList: newData,
  //     }),
  //   );
  // } else {
  //   dispatch(NotificationActions.setNotification({fetching: false}));
  // }
  // dispatch(CommonActions.setLoading(false));
};

// export const getTransactionHistoryVC = id => async (dispatch, getState) => {
//   const {
//     auth: {user},
//   } = getState();

//   dispatch(NotificationActions.setNotification({fetching: false}));
//   dispatch(CommonActions.setLoading(true));
//   const response = await getTransactionHistoryVCApi(id, user.token);
//   dispatch(CommonActions.setLoading(false));
//   dispatch(
//     NotificationActions.setNotification({
//       fetching: false,
//       transactionHistory: response,
//     }),
//   );
// };

// export const getPointHistoryAction = transactionID => async (
//   dispatch,
//   getState,
// ) => {
//   const {
//     auth: {user},
//   } = getState();

//   dispatch(NotificationActions.setNotification({fetching: false}));
//   dispatch(CommonActions.setLoading(true));

//   const response = await getPointHistoryApi(transactionID, user.token);

//   if (!response.code) {
//     dispatch(
//       NotificationActions.setNotification({
//         fetching: false,
//         pointHistory: response,
//       }),
//     );
//   } else if (response.code) {
//     dispatch(CommonActions.setAlert({visible: true, content: response.error}));
//   }

//   dispatch(CommonActions.setLoading(false));
// };

// export const resetTransactionHistoryVC = () => async dispatch => {
//   dispatch(
//     NotificationActions.resetTransactionHistoryVC({
//       transactionHistory: null,
//     }),
//   );
// };

// export const memberMessageAsRead = messageId => async (dispatch, getState) => {
//   const {
//     auth: {user},
//   } = getState();

//   const response = await putMemberMessageAsRead(messageId, user.token);
//   dispatch(HomeActions.setTabBadge(response));
// };
