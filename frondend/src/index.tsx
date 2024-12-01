import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster  } from 'react-hot-toast';
import { persistor, store } from './App/Store';
// Get the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  );
} else {
  console.error("Root element not found");
}
