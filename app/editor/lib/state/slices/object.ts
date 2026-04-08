import { Camera, Object3D } from 'three'
import { StateCreator } from 'zustand'

type Updater<T> = T | ((old: T) => T)

export type ObjectSlice = {
  selectedItems: string[]
  objectVersions: Record<string, number>
  camera: Camera | null

  setSelectedItems: (updater: Updater<string[]>) => void
  updateObject: (object: Object3D, update: (draft: Object3D) => void) => void
  invalidateObject: (object: Object3D) => void
  invalidateObjectsAll: () => void
  setCamera: (camera: Camera | null) => void
}

export const createObjectSlice: StateCreator<ObjectSlice> = (set, get) => ({
  selectedItems: [],
  objectVersions: {},
  camera: null,

  setSelectedItems: updater => {
    set(state => ({
      selectedItems:
        typeof updater === 'function' ? updater(state.selectedItems) : updater
    }))
  },

  updateObject: (object, update) => {
    update(object)
    if (object.sharedId) {
      get().invalidateObject(object)
    }
  },

  invalidateObject: object => {
    const sharedId = object.sharedId
    console.log(object.name)
    if (sharedId === undefined) return
    set(state => ({
      objectVersions: {
        ...state.objectVersions,
        [sharedId]: (state.objectVersions[sharedId] || 0) + 1
      }
    }))
  },

  invalidateObjectsAll: () => {
    set(state => {
      const objectVersions = { ...state.objectVersions }
      for (const key in objectVersions) {
        objectVersions[key]++
      }
      return { objectVersions }
    })
  },

  setCamera: v => set({ camera: v })
})
