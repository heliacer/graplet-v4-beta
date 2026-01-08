import { inject, Variables, Events, WorkspaceSvg } from 'blockly'
import { useEffect, useRef } from 'react'
import { useEditor } from '../EditorContext'
import { blocklyOptions } from '../blockly/options'
import { variableCategory } from '../blockly/categories/variables'
import { procedureCategory } from '../blockly/categories/procedures'
import { resize } from '../utils/blockly'
import { exprGenerator } from '../blockly/engine/generator'
import { evaluateExpression } from '../blockly/engine/interpreter'

export function useBlocklyWorkspace(
  containerRef: React.RefObject<HTMLDivElement>
) {
  const workspaceRef = useRef<WorkspaceSvg | null>(null)
  const { setWorkspace, scene, varEnv, funcEnv, runState } = useEditor()
  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return

    const ws = inject(containerRef.current, blocklyOptions)
    workspaceRef.current = ws
    setWorkspace(ws)

    ws.getVariableMap().createVariable('my variable')
    ws.registerToolboxCategoryCallback('VARIABLE', variableCategory)
    ws.registerToolboxCategoryCallback('PROCEDURE', procedureCategory)
    ws.registerButtonCallback('CREATE_VARIABLE', (button) => {
      Variables.createVariableButtonHandler(button.getTargetWorkspace())
    })

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
    const blockListener = (event: Events.Abstract) => {
      if (event instanceof Events.Click && event.targetType === 'block') {
        if (event.blockId) {
          const block = event.getEventWorkspace_().getBlockById(event.blockId)
          if (block) {
            const expression = exprGenerator.blockToExpression(block)
            evaluateExpression(expression, {
              scene: scene.current,
              variables: varEnv.current,
              functions: funcEnv.current,
              runState: runState
            })
          }
        }
      }
    }

    ws.addChangeListener(variableListener)
    ws.addChangeListener(blockListener)
    ws.getFlyout()?.getWorkspace().addChangeListener(blockListener)

    const resizeObserver = new ResizeObserver(() => resize(ws))
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      ws.removeChangeListener(variableListener)
      ws.removeChangeListener(blockListener)
      ws.dispose()
      workspaceRef.current = null
      setWorkspace(null)
    }
  }, [containerRef, setWorkspace, funcEnv, runState, scene, varEnv])
  return workspaceRef.current
}
