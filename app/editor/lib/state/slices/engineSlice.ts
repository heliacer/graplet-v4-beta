import { StateCreator } from 'zustand'

export type EngineSlice = {
  isRunning: boolean
  isPaused: boolean

  setRunning: (v: boolean) => void
  setPaused: (v: boolean) => void
}

export const createEngineSlice: StateCreator<EngineSlice> = set => ({
  isRunning: false,
  isPaused: false,

  setRunning: v => set({ isRunning: v }),
  setPaused: v => set({ isPaused: v })
})
