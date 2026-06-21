import { TransformControlsMode } from 'three/addons/controls/TransformControls.js'
import { StateCreator } from 'zustand'
import { SObject3D, SObjectSnapshot, Updater } from '../../types'
import { serializeObject } from '../../utils/sobject'
import { Scene } from 'three'

type State = {
  selectedItems: string[]
  hoveredItem: string | null
  objectSnapshots: Record<string, SObjectSnapshot>
  objectSnapping: {
    translate: number
    rotate: number /* degrees */
    scale: number
  }
  autoClose: boolean
  localTransform: boolean
}

type Actions = {
  setSelectedItems: (items: Updater<string[]>) => void
  setHoveredItem: (items: Updater<string | null>) => void
  setSnapshots: (snapshots: Updater<Record<string, SObjectSnapshot>>) => void
  updateSnapshot: (
    sharedId: string,
    updater: Updater<Partial<Omit<SObject3D, 'type'>>>
  ) => void
  setObjectSnapping: (tool: TransformControlsMode, value: number) => void
  setAutoClose: (autoClose: boolean) => void
  setLocalTransform: (localTransform: boolean) => void
}

export type ObjectSlice = State & Actions

export const objectInitialState: State = {
  selectedItems: [],
  hoveredItem: null,
  objectSnapshots: {
    scene: {
      ...serializeObject(new Scene()),
      sharedId: 'scene',
      childIds: []
    }
  },
  objectSnapping: {
    translate: 0.5,
    rotate: 45,
    scale: 1
  },
  autoClose: false,
  localTransform: false
}

export const createObjectSlice: StateCreator<ObjectSlice> = set => ({
  ...objectInitialState,

  setSelectedItems: items => {
    set(state => ({
      selectedItems:
        typeof items === 'function' ? items(state.selectedItems) : items
    }))
  },

  setHoveredItem: items => {
    set(state => ({
      hoveredItem:
        typeof items === 'function' ? items(state.hoveredItem) : items
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

  setObjectSnapping: (tool, value) =>
    set(state => ({
      objectSnapping: {
        ...state.objectSnapping,
        [tool]: value
      }
    })),

  setAutoClose: v => set({ autoClose: v }),
  setLocalTransform: v => set({ localTransform: v })
})
