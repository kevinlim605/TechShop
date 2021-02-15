import * as ActionTypes from '../actiontypes/users';

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.USER_LOGIN_REQUEST:
      return { loading: true };
    case ActionTypes.USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case ActionTypes.USER_LOGIN_FAILED:
      return { loading: false, error: action.payload };
    case ActionTypes.USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.USER_REGISTER_REQUEST:
      return { loading: true };
    case ActionTypes.USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case ActionTypes.USER_REGISTER_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case ActionTypes.USER_DETAILS_REQUEST:
      return { loading: true, ...state };
    case ActionTypes.USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload };
    case ActionTypes.USER_DETAILS_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
