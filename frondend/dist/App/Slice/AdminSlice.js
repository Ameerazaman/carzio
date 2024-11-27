var _a;
import { createSlice } from "@reduxjs/toolkit";
var initialState = {
    currentAdmin: null,
    loading: false,
    error: false,
};
var adminSlice = createSlice({
    name: "Admin",
    initialState: initialState,
    reducers: {
        signInStartAdmin: function (state) {
            state.loading = true;
        },
        signInSuccessAdmin: function (state, action) {
            state.currentAdmin = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFailureAdmin: function (state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateAdminStart: function (state) {
            state.loading = true;
        },
        updateAdminSuccess: function (state, action) {
            state.currentAdmin = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateAdminFailure: function (state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteAdminStart: function (state) {
            state.loading = true;
        },
        deleteAdminSuccess: function (state) {
            state.currentAdmin = null;
            state.loading = false;
            state.error = false;
        },
        deleteAdminFailure: function (state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        signOutAdmin: function (state) {
            state.currentAdmin = null;
            state.loading = false;
            state.error = false;
        },
    },
});
export var signInFailureAdmin = (_a = adminSlice.actions, _a.signInFailureAdmin), signInSuccessAdmin = _a.signInSuccessAdmin, deleteAdminFailure = _a.deleteAdminFailure, signInStartAdmin = _a.signInStartAdmin, updateAdminFailure = _a.updateAdminFailure, updateAdminSuccess = _a.updateAdminSuccess, signOutAdmin = _a.signOutAdmin;
export default adminSlice.reducer;
