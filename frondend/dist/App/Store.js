import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/UserSlice";
import providerReducer from "./Slice/ProviderSlice";
import adminReducer from './Slice/AdminSlice';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage as default storage engine
import persistStore from "redux-persist/es/persistStore";
// Combine reducers if you have more slices (e.g., auth, user, etc.)
var rootReducer = combineReducers({
    user: userReducer,
    provider: providerReducer,
    admin: adminReducer
    // Your user reducer, can add more here
});
// Redux persist configuration
var persistConfig = {
    key: "root",
    version: 1,
    storage: storage,
};
// Create the persisted reducer
var persistedReducer = persistReducer(persistConfig, rootReducer);
// Configure the store
export var store = configureStore({
    reducer: persistedReducer,
    middleware: function (getDefaultMiddleware) {
        return getDefaultMiddleware({
            serializableCheck: false, // Disable serializable checks for persist
        });
    },
});
// Create the persistor for persistence handling
export var persistor = persistStore(store);
