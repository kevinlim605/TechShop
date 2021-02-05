import * as ActionTypes from '../actiontypes/products';
import axios from 'axios';

export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(productsRequest());
    const { data } = await axios('/api/products');
    dispatch(productsSuccess());
  } catch (error) {
    dispatch(productsFailed());
  }
};

export const productsRequest = () => ({
  type: ActionTypes.PRODUCTS_REQUEST,
});

export const productsSuccess = () => ({
  type: ActionTypes.PRODUCTS_SUCCESS,
  payload: data,
});

export const productsFailed = () => ({
  type: ActionTypes.PRODUCTS_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});
