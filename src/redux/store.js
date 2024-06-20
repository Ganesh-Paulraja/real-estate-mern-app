//npm i redux-persist -- update data on local storage
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {persistReducer, persistStore} from 'redux-persist';
import userReducer from './user/userSlice'
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({user: userReducer})

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}

const persistReducerGG = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  // reducer: {user: userReducer},
  reducer: persistReducerGG,
  //for avoiding error
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {
      serializableCheck: false,
    },
  )
})
export const persist = persistStore(store);