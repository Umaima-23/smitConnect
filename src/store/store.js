import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/AuthSlice'; // Check karein path sahi hai ya nahi

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});