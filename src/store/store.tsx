import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../src/store/slices/userSlice.tsx"
import notificationsReducer from "../../src/store/slices/notificationSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;