var _a;
import { createSlice } from "@reduxjs/toolkit";
var initialState = {
    currentUser: null,
    loading: false,
    error: false,
};
var userSlice = createSlice({
    name: "provider",
    initialState: initialState,
    reducers: {
        signInStart: function (state) {
            state.loading = true;
        },
        signInSuccess: function (state, action) {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFailure: function (state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart: function (state) {
            state.loading = true;
        },
        updateUserSuccess: function (state, action) {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateUserFailure: function (state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: function (state) {
            state.loading = true;
        },
        deleteUserSuccess: function (state) {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        deleteUserFailure: function (state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        signOut: function (state) {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
    },
});
export var signInFailure = (_a = userSlice.actions, _a.signInFailure), signInSuccess = _a.signInSuccess, signInStart = _a.signInStart, updateUserFailure = _a.updateUserFailure, updateUserStart = _a.updateUserStart, updateUserSuccess = _a.updateUserSuccess, deleteUserFailure = _a.deleteUserFailure, deleteUserStart = _a.deleteUserStart, deleteUserSuccess = _a.deleteUserSuccess, signOut = _a.signOut;
export default userSlice.reducer;
