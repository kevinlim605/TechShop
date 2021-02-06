import * as ActionTypes from '../actiontypes/products';
import axios from 'axios';

export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(productsRequest());
    const { data } = await axios.get('/api/products');
    dispatch(productsSuccess(data));
  } catch (error) {
    dispatch(productsFailed(error));
  }
};

export const productsRequest = () => ({
  type: ActionTypes.PRODUCTS_REQUEST,
});

export const productsSuccess = (data) => ({
  type: ActionTypes.PRODUCTS_SUCCESS,
  payload: data,
});

export const productsFailed = (error) => ({
  type: ActionTypes.PRODUCTS_FAILED,
  payload:
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
});
