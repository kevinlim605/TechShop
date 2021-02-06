import * as ActionTypes from '../actiontypes/products';
import axios from 'axios';

export const fetchProductList = () => async (dispatch) => {
  try {
    dispatch(productListRequest());
    const { data } = await axios.get('/api/products');
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
