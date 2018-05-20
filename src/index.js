import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { mainReducer } from './logic/board';
import bootstrapper from './bootstrapper';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

import App from './App';

const store = createStore(mainReducer);

bootstrapper(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
