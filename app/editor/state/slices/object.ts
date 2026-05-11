import { Camera, Object3D } from 'three'
import { TransformControlsMode } from 'three/examples/jsm/controls/TransformControls.js'
import { StateCreator } from 'zustand'
import { SObject3D } from '../../types'

type Updater<T> = T | ((old: T) => T)

type State = {
  selectedItems: string[]
  /** @deprecated */
  objectVersions: Record<string, number>
  snapshots: Record<string, SObject3D>
  objectSnapping: {
    translate: number
    rotate: number /* degrees */
    scale: number
  }
  camera: Camera | null
  autoClose: boolean
}

type Actions = {
  setSelectedItems: (updater: Updater<string[]>) => void
  setSnapshots: (updater: Updater<Record<string, SObject3D>>) => void
  updateSnapshot: (sharedId: string, update: Partial<SObject3D>) => void
  /** @deprecated needs to update to snapshots */
  updateObjectOld: (object: Object3D, update: (draft: Object3D) => void) => void
  /** @deprecated */
  invalidateObject: (object: Object3D) => void
  /** @deprecated */
  invalidateObjectsAll: () => void
  setObjectSnapping: (tool: TransformControlsMode, value: number) => void
  setCamera: (camera: Camera | null) => void
  setAutoClose: (autoClose: boolean) => void
}

export type ObjectSlice = State & Actions

export const objectInitialState: State = {
  selectedItems: [],
  objectVersions: {},
  snapshots: {},
  objectSnapping: {
    translate: 0.5,
    rotate: 45,
    scale: 1
  },
  camera: null,
  autoClose: false
}

export const createObjectSlice: StateCreator<ObjectSlice> = (set, get) => ({
  ...objectInitialState,

  setSelectedItems: updater => {
    set(state => ({
      selectedItems:
        typeof updater === 'function' ? updater(state.selectedItems) : updater
    }))
  },

  setSnapshots: (updater: Updater<Record<string, SObject3D>>) =>
    set(state => ({
      snapshots:
        typeof updater === 'function' ? updater(state.snapshots) : updater
    })),

  updateSnapshot: (sharedId: string, update: Partial<SObject3D>) =>
    set(state => ({
      snapshots: {
        ...state.snapshots,
        [sharedId]: {
          ...state.snapshots[sharedId],
          ...update
        } as SObject3D
      }
    })),

  updateObjectOld: (object, update) => {
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

  setCamera: v => set({ camera: v }),
  setAutoClose: v => set({ autoClose: v })
})
