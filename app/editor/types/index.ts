import { SObjectSnapshot } from './sobject'

export type StateFunc<T> = React.Dispatch<React.SetStateAction<T>>

export type Updater<T> = T | ((old: T) => T)

export interface ProjectData {
  workspace: Record<string, unknown>
  snapshots: Record<string, SObjectSnapshot>
  selectedItems?: string[]
}

export * from './blockly'
export * from './object'
export * from './sobject'
export * from './ui'
