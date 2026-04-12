import { Camera, Object3D } from 'three'
import { TransformControlsMode } from 'three/examples/jsm/Addons.js'
import { StateCreator } from 'zustand'

type Updater<T> = T | ((old: T) => T)

type State = {
  selectedItems: string[]
  objectVersions: Record<string, number>
  objectSnapping: {
    translate: number
    rotate: number /* degrees */
    scale: number
  }
  camera: Camera | null
}

type Actions = {
  setSelectedItems: (updater: Updater<string[]>) => void
  updateObject: (object: Object3D, update: (draft: Object3D) => void) => void
  invalidateObject: (object: Object3D) => void
  invalidateObjectsAll: () => void
  setObjectSnapping: (tool: TransformControlsMode, value: number) => void
  setCamera: (camera: Camera | null) => void
}

export type ObjectSlice = State & Actions

export const objectInitialState: State = {
  selectedItems: [],
  objectVersions: {},
  objectSnapping: {
    translate: 0.5,
    rotate: 45,
    scale: 1
  },
  camera: null
}

export const createObjectSlice: StateCreator<ObjectSlice> = (set, get) => ({
  ...objectInitialState,

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

  setObjectSnapping: (tool, value) =>
    set(state => ({
      objectSnapping: {
        ...state.objectSnapping,
        [tool]: value
      }
    })),

  setCamera: v => set({ camera: v })
})
