import React from 'react';
import Main from './components/Main';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConfigureStore from './redux/configureStore';

const store = ConfigureStore();

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Main />
      </Router>
    </Provider>
  );
}

export default App;
