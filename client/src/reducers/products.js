import * as ActionTypes from '../actiontypes/products';

export const productsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case ActionTypes.PRODUCTS_REQUEST:
      return { loading: true, products: [] };
    case ActionTypes.PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload };
    case ActionTypes.PRODUCTS_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
