import type { WorkspaceSvg, utils } from 'blockly'

/**
 * @override variable category
 */

export function variableCategory(
  workspace: WorkspaceSvg
): utils.toolbox.FlyoutItemInfoArray {
  const variables = workspace.getVariableMap().getAllVariables()
  const blockList = []

  blockList.push({
    kind: 'button',
    text: '%{BKY_NEW_VARIABLE}',
    callbackKey: 'CREATE_VARIABLE'
  })

  if (variables.length === 0) return blockList

  const mostRecentVariable = variables[variables.length - 1]
  const sortedVariables = [...variables].sort((a, b) =>
    a.getName().localeCompare(b.getName(), undefined, { sensitivity: 'base' })
  )

  sortedVariables.forEach((variable) => {
    blockList.push({
      kind: 'block',
      type: 'variables_get',
      gap: 14,
      fields: {
        VAR: {
          name: variable.getName(),
          type: variable.getType()
        }
      }
    })
  })

  blockList.push({ kind: 'sep', gap: 24 })

  blockList.push({
    kind: 'block',
    type: 'variables_set',
    gap: 24,
    fields: {
      VAR: {
        name: mostRecentVariable.getName(),
        type: mostRecentVariable.getType()
      }
    },
    inputs: {
      VALUE: {
        shadow: {
          type: 'input',
          fields: { VALUE: '0' }
        }
      }
    }
  })

  blockList.push({
    kind: 'block',
    type: 'math_change',
    gap: 24,
    fields: {
      VAR: {
        name: mostRecentVariable.getName(),
        type: mostRecentVariable.getType()
      }
    },
    inputs: {
      DELTA: {
        shadow: {
          type: 'math_number',
          fields: { NUM: 1 }
        }
      }
    }
  })

  return blockList
}
