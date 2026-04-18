import { ObservableProcedureModel } from '@blockly/block-shareable-procedures'
import { FlyoutButton } from 'blockly'

export function createFunction(button: FlyoutButton) {
  const name = prompt('New function name:')?.trim()
  if (!name) return

  const workspace = button.getTargetWorkspace()
  const procedureMap = workspace.getProcedureMap()

  const exists = procedureMap.getProcedures().some(p => p.getName() === name)

  if (exists) {
    alert(`Function "${name}" already exists.`)
    return
  }

  const id = crypto.randomUUID()
  procedureMap.add(new ObservableProcedureModel(workspace, name, id))
  const block = workspace.newBlock('function_def')

  block.loadExtraState?.({
    procedureId: id
  })

  block.initSvg()
  block.render()
  workspace.addTopBlock(block)
}
