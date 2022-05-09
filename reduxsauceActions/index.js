
export {newRegisterAccount,emailPassWOrdLogin,verifyOTP,verifyCode,logout,resendVerificationCode,createPickupLocation,updateAddress,addressList,deleteAddress,pickupLocationList,deletePickupLocation,updateUserData} from './authActions';
export {getCartList,addToCart,addQty,removeQty,removeToCart} from './cartAction';
export {addNewBannerCard,updateBannerCard,removeBannerCard,updateTopProductList,updateSliderList,updateSplashList,getAppConfig} from './configActions';
export {addFranchise,franchiseList,updateFranchise,deleteFranchise} from './franchiseAction';
// export {getAppConfig} from './homeActions';// not used
export {getMenuDates,getMenu} from './menuActions';
export {getNotificationList,addNotificationInList,updateNotificationInList,deleteNotification,deleteNotificationByList} from './notificationActions';
export {createOrder} from './orderActions';
export {getCategories,getProducts} from './productActions';
export {uploadProfilePicture,removeProfilePicture,editProfile} from './profileActions';
export {getPromotionList,addPromotionInList,updatePromotionInList,deletePromotion} from './promotionActions';
export {getServicesCategories,getServices,onUpdateServices,onCreateServices} from './servicesActions';

