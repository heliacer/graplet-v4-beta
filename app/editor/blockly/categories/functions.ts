import { WorkspaceSvg } from 'blockly'

export function functionsCategory(workspace: WorkspaceSvg) {
  const blockList = []
  const procedures = workspace.getProcedureMap().getProcedures()

  blockList.push({
    kind: 'button',
    text: 'Create function...',
    callbackKey: 'createFunction'
  })

  for (const model of procedures) {
    blockList.push({
      kind: 'block',
      type: 'function_call',
      extraState: {
        id: model.getId()
      }
    })
  }

  return blockList
}
