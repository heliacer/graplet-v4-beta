import { StateCreator } from 'zustand'
import { ToolItem } from '../../types'
import { TransformControlsMode } from 'three/examples/jsm/Addons.js'

export type UiSlice = {
  isRunning: boolean
  isPaused: boolean
  currentTheme: string
  currentTool: TransformControlsMode | ToolItem

  setRunning: (bool: boolean) => void
  setPaused: (bool: boolean) => void
  setCurrentTheme: (theme: string) => void
  setCurrentTool: (tool: TransformControlsMode | ToolItem) => void
}

export const createUiSlice: StateCreator<UiSlice> = set => ({
  isRunning: false,
  isPaused: false,
  currentTheme: '',
  currentTool: 'translate',

  setRunning: v => set({ isRunning: v }),
  setPaused: v => set({ isPaused: v }),
  setCurrentTheme: v => set({ currentTheme: v }),
  setCurrentTool: v => set({ currentTool: v })
})
