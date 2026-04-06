import { Object3D } from 'three'
import { StateCreator } from 'zustand'

/**
 * @todo the new object versioning pattern, specific to each object :D
 * 
 * i might optimise this further, and have a separate property-specific versioning table, 
 * next to the general object-specific versioning
 */
export type ObjectSlice = {
  objectVersions: Record<string, number>

  updateObject: (object: Object3D, update: (draft: Object3D) => void) => void
  invalidateObject: (sharedId: string) => void
}

export const createObjectSlice: StateCreator<ObjectSlice> = (set, get) => ({
  objectVersions: {},

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
  }
})
