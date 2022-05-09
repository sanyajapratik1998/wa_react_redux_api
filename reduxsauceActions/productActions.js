import axios from 'axios';
import CommonActions from '../reduxsauce/commonRedux';
import ProductActions from '../reduxsauce/productRedux';

export const getCategories = () => async (dispatch, getState) => {
  const {order, config} = getState();
  dispatch(CommonActions.setLoading(true));
  try {
    console.log('--categories----');
    const response = await axios
      .get('/products/product-category/list/' + config.businessId)
      .then((response) => response.data);
    console.log('checking response : ', response);
    if (response.error) {
      dispatch(
        CommonActions.setAlert({visible: true, content: response.error}),
      );
    } else {
      dispatch(
        ProductActions.getCategories({
          categories: response,
        }),
      );
    }
  } catch (error) {
    console.log('message', error?.response?.message);

    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error?.response?.message,
      }),
    );
  }
  dispatch(CommonActions.setLoading(false));
};

let cancelToken = axios.CancelToken.source();
export const getProducts =
  (search = false, category = false) =>
  async (dispatch, getState) => {
    const {
      auth: {user},
      order,
      config,
    } = getState();

    search || category
      ? dispatch(ProductActions.productSearchLoading(true))
      : dispatch(CommonActions.setLoading(true));

    let url =
      search && category
        ? '/products/list/' +
          config.businessId +
          '?search=' +
          search +
          '&category=' +
          category
        : category
        ? '/products/list/' + config.businessId + '?category=' + category
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
            ProductActions.getProducts({
              fetching: false,
              products: response.data,
            }),
          );
          dispatch(ProductActions.productSearchLoading(false));
          dispatch(CommonActions.setLoading(false));
          return response.data;
        })
        .catch((error) => {
          console.log('error', error);
          // dispatch(
          //   CommonActions.setAlert({
          //     visible: true,
          //     content: error?.response?.message,
          //   }),
          // );
          dispatch(ProductActions.productSearchLoading(false));
          dispatch(CommonActions.setLoading(false));
        });
    } catch ({message}) {
      dispatch(CommonActions.setAlert({visible: true, content: message}));
      dispatch(ProductActions.productSearchLoading(false));
      dispatch(CommonActions.setLoading(false));
    }
 
  };
