import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from "redux-persist";
import userReducer from "./User/userSlice";

const rootReducer = combineReducers({ user: userReducer })

const persistConfig = {
    key: 'key',
    storage,
    version:1
}

const persistedReducer=persistReducer(persistConfig,rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor=persistStore(store)