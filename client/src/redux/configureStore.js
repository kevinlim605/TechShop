import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  productListReducer,
  productDetailsReducer,
} from '../reducers/products';
import { cartReducer } from '../reducers/cart';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
} from '../reducers/users';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListMyReducer,
} from '../reducers/order';

// const reducer = combineReducers({});

// const initialState = {};

// const middleware = [thunk];

// const store = createStore(
//   reducer,
//   initialState,
//   composeWithDevTools(applyMiddleware([...middleware]))
// );

const ConfigureStore = () => {
  // Here we check for any cart items in local storage. If cart items exist in local storage,
  // we parse the JSON string into a javascript object and store it in our const cartItemsFromStorage.
  // Then we pass it into initialState
  const cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [];

  const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {};

  const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
    ? JSON.parse(localStorage.getItem('paymentMethod'))
    : {};

  const initialState = {
    cart: {
      cartItems: cartItemsFromStorage,
      shippingAddress: shippingAddressFromStorage,
      paymentMethod: paymentMethodFromStorage,
    },
    userLogin: {
      userInfo: userInfoFromStorage,
    },
  };
  const store = createStore(
    combineReducers({
      productList: productListReducer,
      productDetails: productDetailsReducer,
      cart: cartReducer,
      userLogin: userLoginReducer,
      userRegister: userRegisterReducer,
      userDetails: userDetailsReducer,
      userUpdateProfile: userUpdateProfileReducer,
      orderCreate: orderCreateReducer,
      orderDetails: orderDetailsReducer,
      orderPay: orderPayReducer,
      orderListMy: orderListMyReducer,
    }),
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
  );
  return store;
};

export default ConfigureStore;
