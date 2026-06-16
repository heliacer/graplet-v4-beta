import { Camera, Object3D } from 'three'
import { TransformControlsMode } from 'three/examples/jsm/controls/TransformControls.js'
import { StateCreator } from 'zustand'
import { SObject3D, SObjectSnapshot, Updater } from '../../types'

type State = {
  selectedItems: string[]
  /** @deprecated, use snapshots */
  objectVersions: Record<string, number>
  objectSnapshots: Record<string, SObjectSnapshot>
  objectSnapping: {
    translate: number
    rotate: number /* degrees */
    scale: number
  }
  camera: Camera | null
  autoClose: boolean
}

type Actions = {
  setSelectedItems: (items: Updater<string[]>) => void
  setSnapshots: (snapshots: Updater<Record<string, SObjectSnapshot>>) => void
  updateSnapshot: (
    sharedId: string,
    updater: Updater<Partial<Omit<SObject3D, 'type'>>>
  ) => void
  /** @deprecated, use snapshots */
  invalidateObject: (object: Object3D) => void
  /** @deprecated, use snapshots */
  invalidateObjectsAll: () => void
  setObjectSnapping: (tool: TransformControlsMode, value: number) => void
  setCamera: (camera: Camera | null) => void
  setAutoClose: (autoClose: boolean) => void
}

export type ObjectSlice = State & Actions

export const objectInitialState: State = {
  selectedItems: [],
  objectVersions: {},
  objectSnapshots: {},
  objectSnapping: {
    translate: 0.5,
    rotate: 45,
    scale: 1
  },
  camera: null,
  autoClose: false
}

export const createObjectSlice: StateCreator<ObjectSlice> = set => ({
  ...objectInitialState,

  setSelectedItems: items => {
    set(state => ({
      selectedItems:
        typeof items === 'function' ? items(state.selectedItems) : items
    }))
  },

  setSnapshots: (snapshots: Updater<Record<string, SObjectSnapshot>>) =>
    set(state => ({
      objectSnapshots:
        typeof snapshots === 'function'
          ? snapshots(state.objectSnapshots)
          : snapshots
    })),

  updateSnapshot: (
    sharedId: string,
    updater: Updater<Partial<Omit<SObject3D, 'type'>>>
  ) =>
    set(state => {
      const update =
        typeof updater === 'function'
          ? updater(state.objectSnapshots[sharedId])
          : updater
      return {
        objectSnapshots: {
          ...state.objectSnapshots,
          [sharedId]: {
            ...state.objectSnapshots[sharedId],
            ...update
          }
        }
      }
    }),

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
