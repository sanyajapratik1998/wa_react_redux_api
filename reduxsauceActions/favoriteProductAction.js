import ProductActions from '../reduxsauce/productRedux';
import FavoriteActions from '../reduxsauce/favoriteRedux';

export const addFavoriteProduct = (item) => async (dispatch, getState) => {
  let {products} = getState().products;
  let {favoriteProduct} = getState().favorite;

  let newList = [];
  let productExiest = favoriteProduct.find((o) => o == item.id);
  let newFavoriteList = [];
  if (productExiest) {
    newFavoriteList = favoriteProduct.filter((items) => items != item.id);
  } else {
    newFavoriteList = [...favoriteProduct, item.id];
  }
  dispatch(
    FavoriteActions.setFavoriteProduct({
      favoriteProduct: newFavoriteList,
    }),
  );
};
