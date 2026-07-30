import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./slices/locationSlice";
import discoveryReducer from "./slices/discoverySlice";

export const store = configureStore({
  reducer: {
    location: locationReducer,
    discovery: discoveryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
