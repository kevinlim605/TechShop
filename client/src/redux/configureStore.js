import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productsReducer } from '../reducers/products';

// const reducer = combineReducers({});

// const initialState = {};

// const middleware = [thunk];

// const store = createStore(
//   reducer,
//   initialState,
//   composeWithDevTools(applyMiddleware([...middleware]))
// );

const ConfigureStore = () => {
  const initialState = {};
  const store = createStore(
    combineReducers({
      products: productsReducer,
    }),
    initialState,
    composeWithDevTools(applyMiddleware(thunk, logger))
  );
  return store;
};

export default ConfigureStore;
