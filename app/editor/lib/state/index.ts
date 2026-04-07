import { create } from 'zustand'
import { createUiSlice, UiSlice } from './slices/ui'
import { createObjectSlice, ObjectSlice } from './slices/object'

/** @future zustand implementation! (hyped) */

type EditorStore = UiSlice & ObjectSlice

export const useEditorStore = create<EditorStore>()((...a) => ({
  ...createUiSlice(...a),
  ...createObjectSlice(...a)
}))
