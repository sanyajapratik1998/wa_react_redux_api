import axios from 'axios';
import CommonActions from '../reduxsauce/commonRedux';
import MenuRedux from '../reduxsauce/menuRedux';
import moment from 'moment';

 const isDateValid = (date) =>
  date?.split('-')[0] &&
  date?.split('-')[1] &&
  date?.split('-')[2] &&
  date?.split('-')[0].length >= 4 &&
  date?.split('-')[1].length >= 1 &&
  date?.split('-')[2].length >= 1 &&
  moment(date, 'YYYY-M-D').isValid();


export const getMenuDates = () => async (dispatch, getState) => {
  
  let days = [];
  days.push("Show All")
  for (let i = 0; i <= 6; i++) {

      days.push(moment().add(i, 'days').format("DD MMM YYYY"));

  };
  dispatch(
    MenuRedux.getMenuDates({
      menuDates: days,
    }),
  );
};

let cancelToken = axios.CancelToken.source();

export const getMenu =
  (search = false, available_at = false) =>
  async (dispatch, getState) => {
    const {
      auth: {user},
      config,
    } = getState();

    search || available_at
      ? dispatch(MenuRedux.menuSearchLoading(true))
      : dispatch(CommonActions.setLoading(true));
    let url =
      search && isDateValid(available_at)
        ? '/products/list/' +
          config.businessId +
          '?search=' +
          search +
          '&available_at=' +
          available_at
        : available_at && available_at != "Show All"
        ? '/products/list/' + config.businessId + '?available_at=' + available_at
        : search
        ? '/products/list/' + config.businessId + '?search=' + search
        : '/products/list/' + config.businessId;

    if (cancelToken) {
      cancelToken.cancel();
      cancelToken = axios.CancelToken.source();
    }

    try {
      axios
        .get(url, {cancelToken: cancelToken.token})
        .then((response) => {
          console.log('response======================', response);
          dispatch(
            MenuRedux.getMenu({
              menu: response.data,
            }),
          );
          dispatch(CommonActions.setLoading(false));
          dispatch(MenuRedux.menuSearchLoading(false));
          return response.data;
        })
        .catch((error) => {
          console.log('error', error);
          dispatch(
            CommonActions.setAlert({
              visible: true,
              content: error?.response?.message,
            }),
          );
          dispatch(MenuRedux.menuSearchLoading(false));
          dispatch(CommonActions.setLoading(false));
        });
    } catch ({message}) {
      dispatch(CommonActions.setAlert({visible: true, content: message}));
      dispatch(MenuRedux.menuSearchLoading(false));
      dispatch(CommonActions.setLoading(false));
    }
  };


