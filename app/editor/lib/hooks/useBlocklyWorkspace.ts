import { inject, Events } from 'blockly'
import { useEffect } from 'react'
import { useEditorRefs } from '../context'
import { blocklyOptions } from '../blockly/options'
// import { variableCategory } from '../blockly/categories/variables'
// import { procedureCategory } from '../blockly/categories/procedures'
import { resize } from '../utils/blockly'
import { exprGenerator } from '../blockly/engine/generator'
import { useRuntime } from './useRuntime'

export function useBlocklyWorkspace(
  blocklyDiv: React.RefObject<HTMLDivElement>
) {
  const { workspace } = useEditorRefs()
  const { start } = useRuntime()

  useEffect(() => {
    if (!blocklyDiv.current || workspace.current) return

    const ws = inject(blocklyDiv.current, blocklyOptions)
    workspace.current = ws

    ws.getVariableMap().createVariable('my variable')

    /** @todo Completely revamp variable callback */
    // ws.registerToolboxCategoryCallback('VARIABLE', variableCategory)
    // ws.registerButtonCallback('CREATE_VARIABLE', (button) => {
    //   Variables.createVariableButtonHandler(button.getTargetWorkspace())
    // })

    /**
     * @todo Add custom Functions using the data model
     * -> first make custom function blocks (not use built in, -> config.ts)
     */
    // ws.registerToolboxCategoryCallback('PROCEDURE', procedureCategory)

    const variableListener = (event: Events.Abstract) => {
      if (
        event instanceof Events.VarCreate ||
        event instanceof Events.VarDelete ||
        event instanceof Events.VarRename
      ) {
        ws.refreshToolboxSelection()
      }
    }

    /** listen to instant block clicks and run them */
    const blockListener = async (event: Events.Abstract) => {
      if (event instanceof Events.Click && event.targetType === 'block') {
        if (event.blockId) {
          const block = event.getEventWorkspace_().getBlockById(event.blockId)
          if (block) {
            const expression = exprGenerator.blockToExpression(block)
            start(expression, true)
          }
        }
      }
    }

    ws.addChangeListener(variableListener)
    ws.addChangeListener(blockListener)
    ws.getFlyout()?.getWorkspace().addChangeListener(blockListener)

    const resizeObserver = new ResizeObserver(() => resize(ws))
    resizeObserver.observe(blocklyDiv.current)

    function cleanup() {
      resizeObserver.disconnect()
      ws.removeChangeListener(variableListener)
      ws.removeChangeListener(blockListener)
      ws.dispose()
      workspace.current = null
    }

    return cleanup
  }, [blocklyDiv, workspace, start])
}
