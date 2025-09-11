import type { WorkspaceSvg, utils } from 'blockly'

/**
 * @override procedure category
 */

export function procedureCategory(
  workspace: WorkspaceSvg
): utils.toolbox.FlyoutItemInfoArray {
  const blockList: utils.toolbox.FlyoutItemInfoArray = []

  blockList.push({
    kind: 'block',
    type: 'procedures_defnoreturn',
    gap: 16,
    fields: {
      NAME: 'do something'
    }
  })

  blockList.push({
    kind: 'block',
    type: 'procedures_defreturn',
    gap: 16,
    fields: {
      NAME: 'evaluate something'
    },
    inputs: {
      RETURN: {
        shadow: {
          type: 'math_number'
        }
      }
    }
  })

  blockList.push({
    kind: 'block',
    type: 'procedures_ifreturn',
    gap: 16,
    inputs: {
      VALUE: {
        shadow: {
          type: 'math_number'
        }
      }
    }
  })

  blockList.push({ kind: 'sep', gap: 24 })

  const allProcedures = workspace
    .getBlocksByType('procedures_defnoreturn', false)
    .concat(workspace.getBlocksByType('procedures_defreturn', false))

  allProcedures.forEach((block) => {
    const name = block.getFieldValue('NAME')
    const hasReturn = block.type === 'procedures_defreturn'
    blockList.push({
      kind: 'block',
      type: hasReturn ? 'procedures_callreturn' : 'procedures_callnoreturn',
      gap: 16,
      fields: {
        NAME: name
      },
    })
  })

  return blockList
}
