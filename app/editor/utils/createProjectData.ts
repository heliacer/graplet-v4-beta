import { serialization, WorkspaceSvg } from 'blockly'
import { Scene } from 'three'
import { ProjectData, SScene } from '../types'
import { serializeObject } from './sobject'

export function createProjectData(
  workspace: WorkspaceSvg,
  scene: Scene,
  selectedItems: string[]
): ProjectData {
  return {
    workspace: serialization.workspaces.save(workspace),
    scene: serializeObject(scene, true) as SScene,
    selectedItems
  }
}
