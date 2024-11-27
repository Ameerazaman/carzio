import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { store, persistor } from "./App/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';
// Get the root element
var rootElement = document.getElementById("root");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(_jsx(Provider, { store: store, children: _jsxs(PersistGate, { persistor: persistor, loading: null, children: [_jsx(App, {}), _jsx(Toaster, {})] }) }));
}
else {
    console.error("Root element not found");
}
