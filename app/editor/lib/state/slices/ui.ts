import { StateCreator } from 'zustand'
import { NotificationItemProps, ToolItem } from '../../types'
import { TransformControlsMode } from 'three/examples/jsm/Addons.js'
import { DockviewApi } from 'dockview-react'

export type UiSlice = {
  isRunning: boolean
  isPaused: boolean
  currentTheme: string
  currentTool: TransformControlsMode | ToolItem
  notifications: NotificationItemProps[]
  dvApi: DockviewApi | null

  setRunning: (bool: boolean) => void
  setPaused: (bool: boolean) => void
  setCurrentTheme: (theme: string) => void
  setCurrentTool: (tool: TransformControlsMode | ToolItem) => void
  setNotifications: (notifications: NotificationItemProps[]) => void
  setDvApi: (api: DockviewApi) => void
}

export const createUiSlice: StateCreator<UiSlice> = set => ({
  isRunning: false,
  isPaused: false,
  currentTheme: '',
  currentTool: 'translate',
  notifications: [],
  dvApi: null,

  setRunning: v => set({ isRunning: v }),
  setPaused: v => set({ isPaused: v }),
  setCurrentTheme: v => set({ currentTheme: v }),
  setCurrentTool: v => set({ currentTool: v }),
  setNotifications: v => set({ notifications: v }),
  setDvApi: v => set({ dvApi: v })
})
