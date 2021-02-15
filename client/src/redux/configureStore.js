import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
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
} from '../reducers/users';

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

  const initialState = {
    cart: {
      cartItems: cartItemsFromStorage,
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
    }),
    initialState,
    composeWithDevTools(applyMiddleware(thunk, logger))
  );
  return store;
};

export default ConfigureStore;
