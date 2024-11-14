
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
    .addCase('LoadUserRequest', (state) => {
      state.loading = true;
    })
    .addCase('LoadUserSuccess', (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    })
    .addCase('LoadUserFail', (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    })
    .addCase('updateUserInfoRequest', (state) => {
        state.loading = true;
    })
    .addCase('updateUserInfoSuccess', (state, action) => {
        state.loading = false;
        state.user = action.payload;
    })
    .addCase('updateUserInfoFailed', (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase('clearError', (state) => {
        state.error = null;
    });
});
