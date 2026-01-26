import { WorkspaceSvg } from 'blockly'

export function functionsCategory(workspace: WorkspaceSvg) {
  const blockList = []

  blockList.push({
    kind: 'block',
    type: 'function_def'
  })

  const procedures = workspace.getProcedureMap().getProcedures()
  // logs the right procedures
  console.log('procedures (functionsCategory)', procedures)

  for (const model of procedures) {
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
