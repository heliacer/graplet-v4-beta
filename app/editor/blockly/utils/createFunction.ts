import { FlyoutButton, serialization } from 'blockly'
import { ProcedureModel } from '../models/procedure'
import { ParameterModel } from '../models/parameter'
import { ProcedureInputType } from '../../types'

function createInputs() {
  const inputs: ParameterModel[] = []
  let shouldContinue = true
  while (shouldContinue) {
    const type = prompt(
      'Provide input type (Label, String, Number, Boolean):'
    )?.trim()

    if (type === undefined) {
      alert('You need to specify an input type.')
      break
    }

    if (!['Label', 'String', 'Number', 'Boolean'].includes(type)) {
      alert(`${type} is not a valid input type.`)
      break
    }

    const name = prompt(`Give your ${type} a display name:`)?.trim()

    if (name === undefined) {
      alert('You need to specify an input name.')
      break
    }

    const model = new ParameterModel(name, type as ProcedureInputType)
    inputs.push(model)
    shouldContinue = confirm('Add another input?')
  }
  return inputs
}

export function createFunction(button: FlyoutButton) {
  const inputs = createInputs()
  if (inputs.length < 1) return
  const workspace = button.getTargetWorkspace()
  const procedureMap = workspace.getProcedureMap()
  const model = new ProcedureModel(workspace)
  inputs.forEach((input, i) => {
    model.insertParameter(
      new ParameterModel(input.getName(), input.getTypes()[0]),
      i
    )
  })

  procedureMap.add(model)
  serialization.blocks.append(
    {
      type: 'function_def',
      extraState: {
        id: model.getId(),
        params: true
      }
    },
    workspace
  )
}
