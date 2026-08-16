import { TransformControlsMode } from 'three/addons/controls/TransformControls.js'
import { StateCreator } from 'zustand'
import { SObject3D, SObjectSnapshot, Updater } from '../../types'
import { serializeObject } from '../../utils/sobject'
import { Scene } from 'three'

type State = {
  selectedItems: string[]
  hoveredItem: string | null
  activeLevelId: string // default: 'scene'
  objectSnapshots: Record<string, SObjectSnapshot>
  objectSnapping: {
    scale: number
    translate: number
    rotate: number /* degrees */
  }
  objectSelections: {
    meshes: boolean
    cameras: boolean
    lights: boolean
  }
  autoClose: boolean
  localTransform: boolean
}

type Actions = {
  setSelectedItems: (items: Updater<string[]>) => void
  setHoveredItem: (items: Updater<string | null>) => void
  setActiveLevelId: (sharedId: Updater<string>) => void
  setSnapshots: (snapshots: Updater<Record<string, SObjectSnapshot>>) => void
  toggleObjectSelection: (selection: keyof State['objectSelections']) => void
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
  activeLevelId: 'scene',
  objectSnapshots: {
    scene: {
      ...serializeObject(new Scene()),
      sharedId: 'scene',
      parentId: '',
      childIds: []
    }
  },
  objectSelections: {
    meshes: true,
    cameras: false,
    lights: false
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

  setActiveLevelId: items => {
    set(state => ({
      activeLevelId:
        typeof items === 'function' ? items(state.activeLevelId) : items
    }))
  },

  setSnapshots: snapshots =>
    set(state => ({
      objectSnapshots:
        typeof snapshots === 'function'
          ? snapshots(state.objectSnapshots)
          : snapshots
    })),

  updateSnapshot: (sharedId, snapshot) =>
    set(state => {
      const update =
        typeof snapshot === 'function'
          ? snapshot(state.objectSnapshots[sharedId])
          : snapshot
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

  toggleObjectSelection: selection =>
    set(state => ({
      objectSelections: {
        ...state.objectSelections,
        [selection]: !state.objectSelections[selection]
      }
    })),

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
