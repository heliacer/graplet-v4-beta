import { StateCreator } from 'zustand'

export type UiSlice = {
  isRunning: boolean
  isPaused: boolean

  setRunning: (v: boolean) => void
  setPaused: (v: boolean) => void
}

export const createUiSlice: StateCreator<UiSlice> = set => ({
  isRunning: false,
  isPaused: false,

  setRunning: v => set({ isRunning: v }),
  setPaused: v => set({ isPaused: v })
})
