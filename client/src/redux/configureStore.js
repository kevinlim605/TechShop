import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

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
    combineReducers({}),
    initialState,
    composeWithDevTools(applyMiddleware(thunk, logger))
  );
  return store;
};

export default ConfigureStore;
