import { create } from 'zustand'
import { createEngineSlice, EngineSlice } from './slices/engineSlice'

/** @future zustand impl! (hyped) */

/**
 * @todo new cleaner "index.ts - like" pattern approach:
 * have one index.ts, side files in a separate folder.
 * e.g state/index.ts state/slices/...
 */

/** combine all slices from different logical locations */

type EditorStore = EngineSlice // later & OtherSlice

export const useEditorStore = create<EditorStore>()((...a) => ({
  ...createEngineSlice(...a)
}))
