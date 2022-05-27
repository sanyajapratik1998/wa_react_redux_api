const axios = require('axios')
const CommonActions = require('../reduxsauce/commonRedux')
const AuthActions = require('../reduxsauce/authRedux')

 const uploadProfilePicture = (image) => async (dispatch, getState) => {
  const {
    auth: { profile, user },
  } = getState();
  try {
    let body = new FormData();

    body.append("fcm_token", user.fcm_token);
    body.append("photo", {
      uri: image.uri,
      type: "image/jpeg",
      name: "imageName.jpg",
    });

    let response = await axios.put("/user/update/profile/" + user.id, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(
      AuthActions.setUser({
        ...user,
        photo: `${response.data.photo}`,
      })
    );
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: "Change profile picture successfully",
      })
    );
    return response.data['photo'];
  } catch ({ message }) {
    dispatch(CommonActions.setAlert({ visible: true, content: message }));
  }
};

 const removeProfilePicture = () => async (dispatch, getState) => {
  const {
    auth: { profile, user },
  } = getState();
  dispatch(CommonActions.setLoading(true));
  try {
    let result = await axios.put("/user/update/profile/" + user.id, {
      fcm_token: user.fcm_token,
      photo: null,
    });
    await dispatch(
      AuthActions.setUser({
        ...user,
        photo: "",
      })
    );
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: "Remove profile picture successfully",
      })
    );
    dispatch(CommonActions.setLoading(false));
    return result;
  } catch ({ message }) {
    dispatch(CommonActions.setAlert({ visible: true, content: message }));
  }
  dispatch(CommonActions.setLoading(false));
};

 const editProfile = (body, callback) => async (dispatch, getState) => {
  const {
    auth: { profile, user },
  } = getState();

  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.put("/user/update/profile/" + user.id, {
      first_name: body.name,
      last_name: body.lastName,
      gender: body.gender,
      fcm_token: user.fcm_token,
    });

    if (response.data) {
      await dispatch(
        AuthActions.setUser({
          ...user,
          first_name: body.name,
          last_name: body.lastName,
          gender: body.gender,
        })
      );
      console.log("update profile ", profile);

      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: "Update profile successfully",
        })
      );
      callback('success')
      // navigation.goBack();
    }
  } catch ({ message }) {
    dispatch(CommonActions.setAlert({ visible: true, content: message }));
  }
  dispatch(CommonActions.setLoading(false));
};
module.exports ={uploadProfilePicture,removeProfilePicture,editProfile}