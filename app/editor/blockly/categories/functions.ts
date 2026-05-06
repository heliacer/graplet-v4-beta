import { WorkspaceSvg } from 'blockly'

export function functionsCategory(workspace: WorkspaceSvg) {
  const blockList = []
  const procedures = workspace.getProcedureMap().getProcedures()

  blockList.push({
    kind: 'button',
    text: 'Create function...',
    callbackKey: 'createFunction'
  })

  blockList.push({
    kind: 'button',
    text: '(wip) Create function...',
    callbackKey: 'wipCreateFunction'
  })

  for (const model of procedures) {
    blockList.push({
      kind: 'block',
      type: 'function_call',
      extraState: {
        id: model.getId(),
        params: true
      }
    })
  }

  return blockList
}
