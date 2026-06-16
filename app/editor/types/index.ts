import { SObject3D } from './sobject'

export type StateFunc<T> = React.Dispatch<React.SetStateAction<T>>

export type Updater<T> = T | ((old: T) => T)

export interface ProjectData {
  workspace: Record<string, unknown>
  /** @todo convert all saved state to snapshots, load from snapshots */
  snapshots: Record<string, SObject3D>
  selectedItems?: string[]
}

export * from './blockly'
export * from './object'
export * from './sobject'
export * from './ui'
