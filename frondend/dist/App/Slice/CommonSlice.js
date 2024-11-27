import { createSlice } from '@reduxjs/toolkit';
var initialState = {
    search: ''
};
export var commonSlice = createSlice({
    name: 'common',
    initialState: initialState,
    reducers: {
        setSearchText: function (state, action) {
            state.search = action.payload;
        }
    },
});
export var setSearchText = commonSlice.actions.setSearchText;
export default commonSlice.reducer;
