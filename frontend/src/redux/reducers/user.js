
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
    .addCase('clearError', (state) => {
        state.error = null;
    });
});
// import { createReducer } from "@reduxjs/toolkit";


// const initialState = {
//     user: null,
//   };
// export const userReducer = createReducer(initialState, {
//   LoadUserRequest: (state) => {
//     state.loading = true;
//   },
//   LoadUserSuccess: (state, action) => {
//     state.isAuthenticated = true;
//     state.loading = false;
//     state.user = action.payload;
//   },
//   LoadUserFail: (state, action) => {
//     state.loading = false;
//     state.error = action.payload;
//     state.isAuthenticated = false;
//   },
//   clearError: (state) => {
//     state.error = null;
//   },
// });