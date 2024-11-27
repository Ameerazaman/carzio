import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentAdmin: null,
  loading: false,
  error: false,
};

const adminSlice = createSlice({
  name: "Admin",
  initialState,
  reducers: {
    signInStartAdmin: (state) => {
      state.loading = true;
    },
    signInSuccessAdmin: (state, action) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = false;
    },
    signInFailureAdmin: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateAdminStart: (state) => {
      state.loading = true;
    },
    updateAdminSuccess: (state, action) => {
      state.currentAdmin= action.payload;
      state.loading = false;
      state.error = false;
    },
    updateAdminFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteAdminStart: (state) => {
      state.loading = true;
    },
    deleteAdminSuccess: (state) => {
      state.currentAdmin = null;
      state.loading = false;
      state.error = false;
    },
    deleteAdminFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    signOutAdmin: (state) => {
      state.currentAdmin= null;
      state.loading = false;
      state.error = false;
    },
  },
});

export const {
 signInFailureAdmin,
 signInSuccessAdmin,
 deleteAdminFailure,
 signInStartAdmin,
 updateAdminFailure,
 updateAdminSuccess,
 signOutAdmin,


} = adminSlice.actions;
export default adminSlice.reducer;