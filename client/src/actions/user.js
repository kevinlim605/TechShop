import axios from 'axios';
import * as ActionTypes from '../actiontypes/users';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(userLoginRequest());

    // when we send data to the backend, we need to send headers with a content-type of application/json.
    // thus, we create a config object like this.
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // We'll make our post request with axios which will send back our user info which we will destructure.
    // We'll pass in the email and password we type from the frontend to our post request.
    // We'll pass in our config object as our third argument to make sure our second argument that we
    // are posting in our post request get's passed as application/json type.
    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    );

    // After we make our post request, we'll dispatch our login success action and pass in the data
    // as our payload that we get back from the backend
    dispatch(userLoginSuccess(data));

    // We also want to store our user info that we get back from our post request in local storage
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(userLoginFailed(error));
  }
};

export const userLoginRequest = () => ({
  type: ActionTypes.USER_LOGIN_REQUEST,
});

export const userLoginSuccess = (data) => ({
  type: ActionTypes.USER_LOGIN_SUCCESS,
  payload: data,
});

export const userLoginFailed = (error) => ({
  type: ActionTypes.USER_LOGIN_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch(userLogout());
};

export const userLogout = () => ({
  type: ActionTypes.USER_LOGOUT,
});

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch(userRegisterRequest());

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users/',
      { name, email, password },
      config
    );

    dispatch(userRegisterSuccess(data));

    // We will login the user right away as soon as they login so we will also dispatch userLoginSuccess
    dispatch(userLoginSuccess(data));

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(userRegisterFailed(error));
  }
};

export const userRegisterRequest = () => ({
  type: ActionTypes.USER_REGISTER_REQUEST,
});

export const userRegisterSuccess = (data) => ({
  type: ActionTypes.USER_REGISTER_SUCCESS,
  payload: data,
});

export const userRegisterFailed = (error) => ({
  type: ActionTypes.USER_REGISTER_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch(userDetailsRequest());

    // getState allows us to get our state. We destructure twice to get access to the logged in
    // user's object
    const {
      userLogin: { userInfo },
    } = getState();

    // We can now use userInfo which we destructured from getState to get the bearer token from
    // userInfo so we can make the appropriate put request without triggering the auth middleware
    // from the backend.
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Authorization key needs no quotes
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // We'll first get the user data by destructuring from our get request
    const { data } = await axios.get(`/api/users/${id}`, config);

    // we'll dispatch our succes action with the data as our payload
    dispatch(userDetailsSuccess(data));
  } catch (error) {
    dispatch(userDetailsFailed(error));
  }
};

export const userDetailsRequest = () => ({
  type: ActionTypes.USER_DETAILS_REQUEST,
});

export const userDetailsSuccess = (data) => ({
  type: ActionTypes.USER_DETAILS_SUCCESS,
  payload: data,
});

export const userDetailsFailed = (error) => ({
  type: ActionTypes.USER_DETAILS_FAILED,
  payload: error,
});
