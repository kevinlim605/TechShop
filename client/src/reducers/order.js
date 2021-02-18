import * as ActionTypes from '../actiontypes/order';

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_CREATE_REQUEST:
      return { loading: true };
    case ActionTypes.ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ActionTypes.ORDER_CREATE_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case ActionTypes.ORDER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case ActionTypes.ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload };
    case ActionTypes.ORDER_DETAILS_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_PAY_REQUEST:
      return { loading: true };
    case ActionTypes.ORDER_PAY_SUCCESS:
      return { loading: false, success: true };
    case ActionTypes.ORDER_PAY_FAILED:
      return { loading: false, error: action.payload };
    case ActionTypes.ORDER_PAY_RESET:
      return {};
    default:
      return state;
  }
};

export const orderListMyReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_LIST_MY_REQUEST:
      return { loading: true };
    case ActionTypes.ORDER_LIST_MY_SUCCESS:
      return { loading: false, orders: action.payload };
    case ActionTypes.ORDER_LIST_MY_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
