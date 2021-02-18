import * as ActionTypes from '../actiontypes/order';
import axios from 'axios';

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    // dispatch our request
    dispatch(orderCreateRequest());

    // getState allows us to get our state. We destructure twice to get access to the logged in
    // user's object
    const {
      userLogin: { userInfo },
    } = getState();

    // We can now use userInfo which we destructured from getState to get the bearer token from
    // userInfo so we can make the appropriate PUT request without triggering the auth middleware
    // from the backend.
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Authorization key needs no quotes
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // We'll update the profile data in the backend by making a put request, and store the
    // the response in data which we destructure. (the put request will send us a response object
    // with the updated information)
    const { data } = await axios.post(`/api/orders`, order, config);

    // we'll dispatch our success action with the data as our payload
    dispatch(orderCreateSuccess(data));
  } catch (error) {
    // we'll dispatch our failed action with the error as our payload
    dispatch(orderCreateFailed(error));
  }
};

export const orderCreateRequest = () => ({
  type: ActionTypes.ORDER_CREATE_REQUEST,
});

export const orderCreateSuccess = (data) => ({
  type: ActionTypes.ORDER_CREATE_SUCCESS,
  payload: data,
});

export const orderCreateFailed = (error) => ({
  type: ActionTypes.ORDER_CREATE_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    // dispatch our request
    dispatch(orderDetailsRequest());

    // getState allows us to get our state. We destructure twice to get access to the logged in
    // user's object
    const {
      userLogin: { userInfo },
    } = getState();

    // We can now use userInfo which we destructured from getState to get the bearer token from
    // userInfo so we can make the appropriate PUT request without triggering the auth middleware
    // from the backend.
    const config = {
      headers: {
        // Authorization key needs no quotes
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // We'll update the profile data in the backend by making a put request, and store the
    // the response in data which we destructure. (the put request will send us a response object
    // with the updated information)
    const { data } = await axios.get(`/api/orders/${id}`, config);

    // we'll dispatch our success action with the data as our payload
    dispatch(orderDetailsSuccess(data));
  } catch (error) {
    // we'll dispatch our failed action with the error as our payload
    dispatch(orderDetailsFailed(error));
  }
};

export const orderDetailsRequest = () => ({
  type: ActionTypes.ORDER_DETAILS_REQUEST,
});

export const orderDetailsSuccess = (data) => ({
  type: ActionTypes.ORDER_DETAILS_SUCCESS,
  payload: data,
});

export const orderDetailsFailed = (error) => ({
  type: ActionTypes.ORDER_DETAILS_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});

export const payOrder = (orderId, paymentResult) => async (
  dispatch,
  getState
) => {
  try {
    // dispatch our request
    dispatch(orderPayRequest());

    // getState allows us to get our state. We destructure twice to get access to the logged in
    // user's object
    const {
      userLogin: { userInfo },
    } = getState();

    // We can now use userInfo which we destructured from getState to get the bearer token from
    // userInfo so we can make the appropriate PUT request without triggering the auth middleware
    // from the backend.
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Authorization key needs no quotes
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // We'll update the profile data in the backend by making a put request, and store the
    // the response in data which we destructure. (the put request will send us a response object
    // with the updated information)
    const { data } = await axios.put(
      `/api/orders/${orderId}/pay`,
      paymentResult,
      config
    );

    // we'll dispatch our success action with the data as our payload
    dispatch(orderPaySuccess(data));
  } catch (error) {
    // we'll dispatch our failed action with the error as our payload
    dispatch(orderPayFailed(error));
  }
};

export const orderPayRequest = () => ({
  type: ActionTypes.ORDER_PAY_REQUEST,
});

export const orderPaySuccess = (data) => ({
  type: ActionTypes.ORDER_PAY_SUCCESS,
  payload: data,
});

export const orderPayFailed = (error) => ({
  type: ActionTypes.ORDER_PAY_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});

export const orderPayReset = () => ({
  type: ActionTypes.ORDER_PAY_RESET,
});

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    // dispatch our request
    dispatch(orderListMyRequest());

    // getState allows us to get our state. We destructure twice to get access to the logged in
    // user's object
    const {
      userLogin: { userInfo },
    } = getState();

    // We can now use userInfo which we destructured from getState to get the bearer token from
    // userInfo so we can make the appropriate PUT request without triggering the auth middleware
    // from the backend.
    const config = {
      headers: {
        // Authorization key needs no quotes
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // We'll update the profile data in the backend by making a put request, and store the
    // the response in data which we destructure. (the put request will send us a response object
    // with the updated information)
    const { data } = await axios.get(`/api/orders/myorders`, config);

    // we'll dispatch our success action with the data as our payload
    dispatch(orderListMySuccess(data));
  } catch (error) {
    // we'll dispatch our failed action with the error as our payload
    dispatch(orderListMyFailed(error));
  }
};

export const orderListMyRequest = () => ({
  type: ActionTypes.ORDER_LIST_MY_REQUEST,
});

export const orderListMySuccess = (data) => ({
  type: ActionTypes.ORDER_LIST_MY_SUCCESS,
  payload: data,
});

export const orderListMyFailed = (error) => ({
  type: ActionTypes.ORDER_LIST_MY_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});
