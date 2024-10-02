import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice"; 
import providerReducer from "./slice/providerSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage as default storage engine
import persistStore from "redux-persist/es/persistStore";

// Combine reducers if you have more slices (e.g., auth, user, etc.)
const rootReducer = combineReducers({
  user: userReducer,
  provider:providerReducer // Your user reducer, can add more here
});

// Redux persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable checks for persist
    }),
});

// Create the persistor for persistence handling
export const persistor = persistStore(store);

// Type definitions
export type RootState = ReturnType<typeof store.getState>; // This provides the shape of the entire Redux state
export type AppDispatch = typeof store.dispatch;
