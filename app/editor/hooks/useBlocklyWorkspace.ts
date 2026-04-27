import { inject, Events } from 'blockly'
import { useEffect } from 'react'
import { useEditorRefs } from '../context'
import { blocklyOptions } from '../blockly/options'
import { resize } from '../utils/blockly'
import { exprGenerator } from '../engine/generator'
import { useRuntime } from './useRuntime'
import { createFunction } from '../blockly/utils/createFunction'

export function useBlocklyWorkspace(
  blocklyDiv: React.RefObject<HTMLDivElement>
) {
  const { workspace } = useEditorRefs()
  const { start } = useRuntime()

  useEffect(() => {
    if (!blocklyDiv.current || workspace.current) return

    const ws = inject(blocklyDiv.current, blocklyOptions)
    workspace.current = ws

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
    ws.registerButtonCallback('createFunction', createFunction)

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
