import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,

}

export const eventReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('eventCreateRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('eventCreateSuccess', (state, action) => {
            state.isLoading = false;
            state.event = action.payload;
            state.success = true;
        })
        .addCase('eventCreateFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        // get all events
        .addCase('getAlleventsShopRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAlleventsShopSuccess', (state, action) => {
            state.isLoading = false;
            state.events = action.payload;
        })
        .addCase('getAlleventsShopFailed', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        //delete event

        .addCase('deleteeventRequest', (state) => {
            state.isLoading = true;

        })
        .addCase('deleteeventSuccess', (state, action) => {
            state.isLoading = false;
            state.message = action.payload;

        })
        .addCase('deleteeventFailed', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;

        })
        // clear error
        .addCase('clearError', (state) => {
            state.error = null;
        })

        // clear success
        .addCase('clearSuccess', (state) => {
            state.success = false;
        });
});