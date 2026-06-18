import { serialization, WorkspaceSvg } from 'blockly'
import { ProjectData, SObjectSnapshot } from '../types'

export function createProjectData(
  workspace: WorkspaceSvg,
  snapshots: Record<string, SObjectSnapshot>,
  selectedItems: string[]
): ProjectData {
  return {
    workspace: serialization.workspaces.save(workspace),
    snapshots,
    selectedItems
  }
}
