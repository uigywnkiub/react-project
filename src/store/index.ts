import { configureStore } from '@reduxjs/toolkit'
import appSlice from './appSlice'

const store = configureStore({
  reducer: {
    store: appSlice,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
