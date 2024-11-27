import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentProvider: null,
  loading: false,
  error: false,
};

const providerSlice = createSlice({
  name: "Provider",
  initialState,
  reducers: {
    signInStartProvider: (state) => {
      state.loading = true;
    },
    signInSuccessProvider: (state, action) => {
      state.currentProvider = action.payload;
      state.loading = false;
      state.error = false;
    },
    signInFailureProvider: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProviderStart: (state) => {
      state.loading = true;
    },
    updateProviderSuccess: (state, action) => {
      state.currentProvider= action.payload;
      state.loading = false;
      state.error = false;
    },
    updateProviderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProviderStart: (state) => {
      state.loading = true;
    },
    deleteProviderSuccess: (state) => {
      state.currentProvider = null;
      state.loading = false;
      state.error = false;
    },
    deleteProviderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    signOutProvider: (state) => {
      state.currentProvider= null;
      state.loading = false;
      state.error = false;
    },
  },
});

export const {
 signInFailureProvider,
 signInSuccessProvider,
 deleteProviderFailure,
 signInStartProvider,
 updateProviderStart,
 updateProviderSuccess,
 signOutProvider,


} = providerSlice.actions;
export default providerSlice.reducer;