import { inject, Events, WorkspaceSvg } from 'blockly'
import { useEffect, useRef } from 'react'
import { useEditor } from '../EditorContext'
import { blocklyOptions } from '../blockly/options'
// import { variableCategory } from '../blockly/categories/variables'
// import { procedureCategory } from '../blockly/categories/procedures'
import { resize } from '../utils/blockly'
import { exprGenerator } from '../blockly/engine/generator'
import { useRuntime } from './useRuntime'

export function useBlocklyWorkspace(
  containerRef: React.RefObject<HTMLDivElement>
) {
  const workspaceRef = useRef<WorkspaceSvg | null>(null)
  const { setWorkspace, objects, varEnv, funcEnv, runState, setIsRunning } =
    useEditor()
  const { execute } = useRuntime()

  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return

    const ws = inject(containerRef.current, blocklyOptions)
    workspaceRef.current = ws
    setWorkspace(ws)

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
            await execute(expression)
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
  }, [
    containerRef,
    setWorkspace,
    setIsRunning,
    execute,
    funcEnv,
    runState,
    objects,
    varEnv
  ])
  return workspaceRef.current
}
