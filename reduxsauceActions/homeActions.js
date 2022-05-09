// import get from 'lodash.get';
import CommonActions from '../reduxsauce/commonRedux';
import HomeActions from '../reduxsauce/homeRedux';


export const getAppConfig = () => async dispatch => {
  dispatch(CommonActions.setLoading(true));
  try {
    // const response = await getAppConfigApi();

    // const response = await axios.get("/business/app/config").then(res => res.data)

    if (response) {
      // const latestOfferCardLimit = get(response, 'homePage.latestOfferCard.limit', null);
      // const topOfferCardLimit = get(response, 'homePage.topOfferCard.limit', null);
      // const companyIds = get(response, 'companyIds', null);

      // if (latestOfferCardLimit) {
      //   dispatch(getCampaignLatestOffer(Number(latestOfferCardLimit)));
      // }
      // if (topOfferCardLimit) {
      //   dispatch(getCampaignTopOffer(Number(topOfferCardLimit)));
      // }
      // if (companyIds) {
      //   dispatch(getCompanies(companyIds));
      // }
      
      dispatch(HomeActions.setAppConfig(response));
    }
    if (response.code) {
      dispatch(CommonActions.setAlert({ visible: true, content: response.error }));
    }
    dispatch(CommonActions.setLoading(false));
  } catch (error) {
    dispatch(CommonActions.setLoading(false));
  }
};

