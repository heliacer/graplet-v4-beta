import { Camera, Object3D } from 'three'
import { StateCreator } from 'zustand'

/** might move this up somewhere */
type Updater<T> = T | ((old: T) => T)

/**
 * @todo the new object versioning pattern, specific to each object :D
 *
 * i might optimise this further, and have a separate property-specific versioning table,
 * next to the general object-specific versioning
 */
export type ObjectSlice = {
  selectedItems: string[]
  objectVersions: Record<string, number>
  camera: Camera | null

  setSelectedItems: (updater: Updater<string[]>) => void
  updateObject: (object: Object3D, update: (draft: Object3D) => void) => void
  invalidateObject: (sharedId: string) => void
  setCamera: (camera: Camera | null) => void
}

export const createObjectSlice: StateCreator<ObjectSlice> = (set, get) => ({
  selectedItems: [],
  objectVersions: {},
  camera: null,

  setSelectedItems: updater =>
    set(state => ({
      selectedItems:
        typeof updater === 'function' ? updater(state.selectedItems) : updater
    })),
  updateObject: (object, update) => {
    update(object)
    if (object.sharedId) {
      get().invalidateObject(object.sharedId)
    }
  },
  invalidateObject: sharedId => {
    set(state => ({
      objectVersions: {
        ...state.objectVersions,
        [sharedId]: (state.objectVersions[sharedId] || 0) + 1
      }
    }))
  },
  setCamera: v => set({ camera: v })
})
