import { inject, Variables, Events, WorkspaceSvg } from 'blockly'
import { useEffect, useRef } from 'react'
import { useEditor } from '../EditorContext'
import { blocklyOptions } from '../blockly/options'
import { variableCategory } from '../blockly/categories/variables'
import { procedureCategory } from '../blockly/categories/procedures'
import { resize } from '../utils'

export function useBlocklyWorkspace(
  containerRef: React.RefObject<HTMLDivElement>
) {
  const workspaceRef = useRef<WorkspaceSvg | null>(null)
  const { setWorkspace, objects } = useEditor()
  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return

    const ws = inject(containerRef.current, blocklyOptions)
    workspaceRef.current = ws
    setWorkspace(ws)

    ws.getVariableMap().createVariable('my variable')
    ws.registerToolboxCategoryCallback('VARIABLE', variableCategory)
    ws.registerToolboxCategoryCallback('PROCEDURE', procedureCategory)
    ws.registerButtonCallback('CREATE_VARIABLE', function (button) {
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

    ws.addChangeListener(variableListener)

    const resizeObserver = new ResizeObserver(() => resize(ws))
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      ws.removeChangeListener(variableListener)
      ws.dispose()
      workspaceRef.current = null
      setWorkspace(null)
    }
  }, [containerRef, setWorkspace, objects])
  return workspaceRef.current
}
