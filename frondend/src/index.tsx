import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { store, persistor } from "./App/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Toaster  } from 'react-hot-toast';
// Get the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <App />
        <Toaster />
        {/* <ToastContainer
      position="top-right"
      autoClose={1000} // Auto close after 3 seconds
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light" // Can also use 'dark'
    /> */}

      </PersistGate>
    </Provider>
  );
} else {
  console.error("Root element not found");
}
