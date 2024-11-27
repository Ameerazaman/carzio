var _a;
import { createSlice } from "@reduxjs/toolkit";
var initialState = {
    currentProvider: null,
    loading: false,
    error: false,
};
var providerSlice = createSlice({
    name: "Provider",
    initialState: initialState,
    reducers: {
        signInStartProvider: function (state) {
            state.loading = true;
        },
        signInSuccessProvider: function (state, action) {
            state.currentProvider = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFailureProvider: function (state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateProviderStart: function (state) {
            state.loading = true;
        },
        updateProviderSuccess: function (state, action) {
            state.currentProvider = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateProviderFailure: function (state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteProviderStart: function (state) {
            state.loading = true;
        },
        deleteProviderSuccess: function (state) {
            state.currentProvider = null;
            state.loading = false;
            state.error = false;
        },
        deleteProviderFailure: function (state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        signOutProvider: function (state) {
            state.currentProvider = null;
            state.loading = false;
            state.error = false;
        },
    },
});
export var signInFailureProvider = (_a = providerSlice.actions, _a.signInFailureProvider), signInSuccessProvider = _a.signInSuccessProvider, deleteProviderFailure = _a.deleteProviderFailure, signInStartProvider = _a.signInStartProvider, updateProviderStart = _a.updateProviderStart, updateProviderSuccess = _a.updateProviderSuccess, signOutProvider = _a.signOutProvider;
export default providerSlice.reducer;
