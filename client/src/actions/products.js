import * as ActionTypes from '../actiontypes/products';
import axios from 'axios';

export const fetchProductList = (keyword = '') => async (dispatch) => {
  try {
    dispatch(productListRequest());
    const { data } = await axios.get(`/api/products?keyword=${keyword}`);
    dispatch(productListSuccess(data));
  } catch (error) {
    dispatch(productListFailed(error));
  }
};

export const productListRequest = () => ({
  type: ActionTypes.PRODUCT_LIST_REQUEST,
});

export const productListSuccess = (data) => ({
  type: ActionTypes.PRODUCT_LIST_SUCCESS,
  payload: data,
});

export const productListFailed = (error) => ({
  type: ActionTypes.PRODUCT_LIST_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});

export const fetchProductDetails = (id) => async (dispatch) => {
  try {
    dispatch(productDetailsRequest());
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch(productDetailsSuccess(data));
  } catch (error) {
    dispatch(productDetailsFailed(error));
  }
};

export const productDetailsRequest = () => ({
  type: ActionTypes.PRODUCT_DETAILS_REQUEST,
});

export const productDetailsSuccess = (data) => ({
  type: ActionTypes.PRODUCT_DETAILS_SUCCESS,
  payload: data,
});

export const productDetailsFailed = (error) => ({
  type: ActionTypes.PRODUCT_DETAILS_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});

export const clearProductDetails = () => ({
  type: ActionTypes.CLEAR_PRODUCT_DETAILS,
  payload: {},
});

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    // dispatch our request
    dispatch(productDeleteRequest());

    // getState allows us to get our state. We destructure twice to get access to the logged in
    // user's object
    const {
      userLogin: { userInfo },
    } = getState();

    // We can now use userInfo which we destructured from getState to get the bearer token from
    // userInfo so we can make the appropriate DELETE request without triggering the auth middleware
    // from the backend.
    const config = {
      headers: {
        // Authorization key needs no quotes
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // We'll delete the product in the backend by making a delete request
    await axios.delete(`/api/products/${id}`, config);

    // we'll dispatch our success action
    dispatch(productDeleteSuccess());
  } catch (error) {
    // we'll dispatch our failed action with the error as our payload
    dispatch(productDeleteFailed(error));
  }
};

export const productDeleteRequest = () => ({
  type: ActionTypes.PRODUCT_DELETE_REQUEST,
});

export const productDeleteSuccess = () => ({
  type: ActionTypes.PRODUCT_DELETE_SUCCESS,
});

export const productDeleteFailed = (error) => ({
  type: ActionTypes.PRODUCT_DELETE_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});

export const createProduct = () => async (dispatch, getState) => {
  try {
    // dispatch our request
    dispatch(productCreateRequest());

    // getState allows us to get our state. We destructure twice to get access to the logged in
    // user's object
    const {
      userLogin: { userInfo },
    } = getState();

    // We can now use userInfo which we destructured from getState to get the bearer token from
    // userInfo so we can make the appropriate DELETE request without triggering the auth middleware
    // from the backend.
    const config = {
      headers: {
        // Authorization key needs no quotes
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // We'll post the product to the backend by making a POST request.
    // We'll pass in an empty object because we are making a post request, but
    // are backend logic will make a sample product for us for now. Our backend
    // will send us the sample product as a response object which we'll destructure
    // as data
    const { data } = await axios.post(`/api/products/`, {}, config);

    // we'll dispatch our success action with the data as our payload
    dispatch(productCreateSuccess(data));
  } catch (error) {
    // we'll dispatch our failed action with the error as our payload
    dispatch(productCreateFailed(error));
  }
};

export const productCreateRequest = () => ({
  type: ActionTypes.PRODUCT_CREATE_REQUEST,
});

export const productCreateSuccess = (data) => ({
  type: ActionTypes.PRODUCT_CREATE_SUCCESS,
  payload: data,
});

export const productCreateFailed = (error) => ({
  type: ActionTypes.PRODUCT_CREATE_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});

export const productCreateReset = () => ({
  type: ActionTypes.PRODUCT_CREATE_RESET,
});

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    // dispatch our request
    dispatch(productUpdateRequest());

    // getState allows us to get our state. We destructure twice to get access to the logged in
    // user's object
    const {
      userLogin: { userInfo },
    } = getState();

    // We can now use userInfo which we destructured from getState to get the bearer token from
    // userInfo so we can make the appropriate DELETE request without triggering the auth middleware
    // from the backend.
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Authorization key needs no quotes
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // We'll update the product in the backend by making a PUT request.
    // We'll pass the product and the response will send us the updated product which
    // we will destructure as data
    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config
    );

    // we'll dispatch our success action with the data as our payload
    dispatch(productUpdateSuccess(data));
  } catch (error) {
    // we'll dispatch our failed action with the error as our payload
    dispatch(productUpdateFailed(error));
  }
};

export const productUpdateRequest = () => ({
  type: ActionTypes.PRODUCT_UPDATE_REQUEST,
});

export const productUpdateSuccess = (data) => ({
  type: ActionTypes.PRODUCT_UPDATE_SUCCESS,
  payload: data,
});

export const productUpdateFailed = (error) => ({
  type: ActionTypes.PRODUCT_UPDATE_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});

export const productUpdateReset = () => ({
  type: ActionTypes.PRODUCT_UPDATE_RESET,
});

export const createProductReview = (productId, review) => async (
  dispatch,
  getState
) => {
  try {
    // dispatch our request
    dispatch(productCreateReviewRequest());

    // getState allows us to get our state. We destructure twice to get access to the logged in
    // user's object
    const {
      userLogin: { userInfo },
    } = getState();

    // We can now use userInfo which we destructured from getState to get the bearer token from
    // userInfo so we can make the appropriate DELETE request without triggering the auth middleware
    // from the backend.
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // We'll post the review to the backend by making a POST request.
    // We'll pass in the review in our post request which will send us back
    // a message of 'Review Added' if successful.
    await axios.post(`/api/products/${productId}/reviews`, review, config);

    // we'll dispatch our success action
    dispatch(productCreateReviewSuccess());
  } catch (error) {
    // we'll dispatch our failed action with the error as our payload
    dispatch(productCreateReviewFailed(error));
  }
};

export const productCreateReviewRequest = () => ({
  type: ActionTypes.PRODUCT_CREATE_REVIEW_REQUEST,
});

export const productCreateReviewSuccess = () => ({
  type: ActionTypes.PRODUCT_CREATE_REVIEW_SUCCESS,
});

export const productCreateReviewFailed = (error) => ({
  type: ActionTypes.PRODUCT_CREATE_REVIEW_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});

export const productCreateReviewReset = () => ({
  type: ActionTypes.PRODUCT_CREATE_REVIEW_RESET,
});
