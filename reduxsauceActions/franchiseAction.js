import axios from 'axios';
import CommonActions from '../reduxsauce/commonRedux';
import FranchiseAction from '../reduxsauce/franchiseRedux';

export const addFranchise =
  (body, navigation) => async (dispatch, getState) => {
    const {franchise} = getState();

    dispatch(CommonActions.setLoading(true));
    axios
      .post('/business/franchise/create', body)
      .then((response) => {
        dispatch(FranchiseAction.addFranchise(response.data));
        dispatch(CommonActions.setLoading(false));
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: 'Franchise added successfully',
          }),
        );
        navigation.goBack();
      })
      .catch((error) => {
        dispatch(CommonActions.setLoading(false));
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: error?.response?.message || 'Something went wrong!',
          }),
        );
      });
  };

export const franchiseList = () => async (dispatch, getState) => {
  const {franchise, config} = getState();

  console.log('calling-->');
  dispatch(CommonActions.setLoading(true));
  axios
    .get('/business/franchise/list/' + config?.businessId)
    .then((response) => {
      console.log('response franchies list', response.data);
      dispatch(FranchiseAction.setFranchise(response.data));
      dispatch(CommonActions.setLoading(false));
    })
    .catch((error) => {
      console.log('error->', error.response);
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error?.response?.message || 'Something went wrong!',
        }),
      );
    });
};

export const updateFranchise =
  (body, id, navigation) => async (dispatch, getState) => {
    const {franchise} = getState();

    dispatch(CommonActions.setLoading(true));
    axios
      .put('/business/franchise/update/' + id, body)
      .then((response) => {
        console.log('response->', response);
        dispatch(FranchiseAction.updateFranchise(response.data));
        dispatch(CommonActions.setLoading(false));
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: 'Franchise Updated successfully',
          }),
        );
        navigation.goBack();
      })
      .catch((error) => {
        dispatch(CommonActions.setLoading(false));
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: error?.response?.message || 'Something went wrong!',
          }),
        );
      });
  };

export const deleteFranchise = (id) => async (dispatch, getState) => {
  const {franchise} = getState();
  dispatch(CommonActions.setLoading(true));
  axios
    .delete('/business/franchise/delete/' + id)
    .then((response) => {
      console.log('response-->', response);
      // deleteFranchise
      dispatch(FranchiseAction.deleteFranchise(id));
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: 'Franchise Deleted successfully',
        }),
      );
    })
    .catch((error) => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error?.response?.message || 'Something went wrong!',
        }),
      );
    });
};
