import { create } from 'zustand'
import { createUiSlice, UiSlice } from './slices/ui'

/** @future zustand impl! (hyped) */

/**
 * @todo new cleaner "index.ts - like" pattern approach:
 * have one index.ts, side files in a separate folder.
 * e.g state/index.ts state/slices/...
 */

/** combine all slices from different logical locations */

type EditorStore = UiSlice // later & OtherSlice

export const useEditor = create<EditorStore>()((...a) => ({
  ...createUiSlice(...a)
}))
