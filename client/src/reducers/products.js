import * as ActionTypes from '../actiontypes/products';

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case ActionTypes.PRODUCT_LIST_REQUEST:
      return { loading: true, ...state };
    case ActionTypes.PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload };
    case ActionTypes.PRODUCT_LIST_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productDetailsReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case ActionTypes.PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state };
    case ActionTypes.PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case ActionTypes.PRODUCT_DETAILS_FAILED:
      return { loading: false, error: action.payload };
    case ActionTypes.CLEAR_PRODUCT_DETAILS:
      return { loading: false, product: action.payload };
    default:
      return state;
  }
};
