import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store, { persistor } from './store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor as any}>
      <App />
    </PersistGate>
  </Provider>,
);
