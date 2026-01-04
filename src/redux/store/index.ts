import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import sessionReducer from "../reducer/session";

const persistConfig = {
  key: "root",
  storage,
};

const persistedSessionReducer = persistReducer(
  persistConfig,
  sessionReducer
);

const store = configureStore({
  reducer: {
    session: persistedSessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// ✅ These types ONLY exist in TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
