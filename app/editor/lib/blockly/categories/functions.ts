import { WorkspaceSvg } from 'blockly'

export function functionsCategory(workspace: WorkspaceSvg) {
  const blockList = []

  blockList.push({
    kind: 'block',
    type: 'function_def'
  })

  for (const model of workspace.getProcedureMap().getProcedures()) {
    blockList.push({
      kind: 'block',
      type: 'function_call',
      extraState: {
        procedureId: model.getId()
      }
    })
  }

  return blockList
}
