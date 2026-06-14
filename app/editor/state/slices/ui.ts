import { StateCreator } from 'zustand'
import {
  ContextMenuProps,
  NotificationItemProps,
  ToolItem,
  Updater
} from '../../types'
import { DockviewApi } from 'dockview-react'
import { TransformControlsMode } from 'three/examples/jsm/controls/TransformControls.js'

type State = {
  isRunning: boolean
  isPaused: boolean
  currentTheme: string
  currentTool: TransformControlsMode | ToolItem
  notifications: NotificationItemProps[]
  dvApi: DockviewApi | null
  contextMenu: ContextMenuProps | null
  hasProjectChanges: boolean
  treeVersion: number
}

type Actions = {
  setRunning: (bool: boolean) => void
  setPaused: (bool: boolean) => void
  setCurrentTheme: (theme: string) => void
  setCurrentTool: (tool: TransformControlsMode | ToolItem) => void
  setNotifications: (notifications: NotificationItemProps[]) => void
  setDvApi: (api: DockviewApi | null) => void
  setContextMenu: (contextMenu: ContextMenuProps | null) => void
  setHasProjectChanges: (hasProjectChanges: boolean) => void
  setTreeVersion: (version: Updater<number>) => void
}

export type UiSlice = State & Actions

export const uiInitialState: State = {
  isRunning: false,
  isPaused: false,
  currentTheme: '',
  currentTool: 'translate',
  notifications: [],
  dvApi: null,
  contextMenu: null,
  hasProjectChanges: false,
  treeVersion: 0
}

export const createUiSlice: StateCreator<UiSlice> = set => ({
  ...uiInitialState,

  setRunning: v => set({ isRunning: v }),
  setPaused: v => set({ isPaused: v }),
  setCurrentTheme: v => set({ currentTheme: v }),
  setCurrentTool: v => set({ currentTool: v }),
  setNotifications: v => set({ notifications: v }),
  setDvApi: v => set({ dvApi: v }),
  setContextMenu: v => set({ contextMenu: v }),
  setHasProjectChanges: v => set({ hasProjectChanges: v }),
  
  setTreeVersion: version =>
    set(state => ({
      treeVersion:
        typeof version === 'function' ? version(state.treeVersion) : version
    }))
})
