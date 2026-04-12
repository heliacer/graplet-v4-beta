import { create } from 'zustand'
import { createUiSlice, uiInitialState, UiSlice } from './slices/ui'
import {
  createObjectSlice,
  objectInitialState,
  ObjectSlice
} from './slices/object'

type EditorStore = { reset: () => void } & UiSlice & ObjectSlice

export const useEditorStore = create<EditorStore>()((...a) => ({
  ...createUiSlice(...a),
  ...createObjectSlice(...a),
  reset: () => a[0]({ ...uiInitialState, ...objectInitialState })
}))
