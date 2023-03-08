import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MainState {
  counter: number
  isModalOpen: boolean
}

const initialState: MainState = {
  counter: 0,
  isModalOpen: !false,
}

const appSlice = createSlice({
  name: 'store',
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
      action: PayloadAction<boolean>
    ): void => {
      state.isModalOpen = action.payload
    },
  },
})

export const { increment, decrement, updateIsModalValue } = appSlice.actions

export default appSlice.reducer
