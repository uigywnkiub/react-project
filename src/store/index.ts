import { createSlice } from '@reduxjs/toolkit'

interface MainState {
  counter: number
  isModalOpen: boolean | null
}

const initialState: MainState = {
  counter: 0,
  isModalOpen: !false,
}

const AppSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    increment: (state: MainState): void => {
      state.counter += 1
    },
    decrement: (state: MainState): void => {
      state.counter -= 1
    },
    updateIsModalValue: (
      state: MainState,
      action: { payload: boolean | null }
    ): void => {
      state.isModalOpen = action.payload
    },
  },
})

export const { increment, decrement, updateIsModalValue } = AppSlice.actions

export default AppSlice.reducer
