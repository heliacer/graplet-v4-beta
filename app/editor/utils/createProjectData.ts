import { serialization, WorkspaceSvg } from 'blockly'
import { ProjectData, SObject3D } from '../types'

export function createProjectData(
  workspace: WorkspaceSvg,
  snapshots: Record<string, SObject3D>,
  selectedItems: string[]
): ProjectData {
  return {
    workspace: serialization.workspaces.save(workspace),
    snapshots,
    selectedItems
  }
}
