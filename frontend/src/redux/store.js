import { configureStore } from "@reduxjs/toolkit";
import badgeReducer from "./badgeSlice";

export const store = configureStore({
  reducer: {
    badge: badgeReducer,
  },
});
