import { SScene } from './sobject'

export type StateFunc<T> = React.Dispatch<React.SetStateAction<T>>

export interface ProjectData {
  workspace: Record<string, unknown>
  scene: SScene
}

export * from './blockly'
export * from './object'
export * from './sobject'
export * from './ui'
