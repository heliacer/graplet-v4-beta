import { inject, Variables, Events, WorkspaceSvg } from "blockly"
import { useEffect, useRef } from "react"
import { useEditor } from "../EditorContext"
import { blocklyOptions } from "../blockly/options"
import { variableCategory } from "../blockly/variables"
import { Backpack } from "@blockly/workspace-backpack"
import { resize } from "../blockly/utils"
import { useTrigger } from "../TriggerContext"
import { objectRegistry } from "../blockly/blocks"

export function useBlocklyWorkspace(containerRef: React.RefObject<HTMLDivElement>) {
  const workspaceRef = useRef<WorkspaceSvg | null>(null)
  const { setWorkspace, objects } = useEditor()
  const emitter = useTrigger()
  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return

    const ws = inject(containerRef.current, blocklyOptions)
    workspaceRef.current = ws
    setWorkspace(ws)

    ws.getVariableMap().createVariable('foo')
    ws.registerToolboxCategoryCallback('VARIABLE', variableCategory)
    ws.registerButtonCallback('CREATE_VARIABLE', function (button) {
      Variables.createVariableButtonHandler(button.getTargetWorkspace())
    })

    const variableListener = (event: Events.Abstract) => {
      if (event.type === Events.VAR_CREATE || event.type === Events.VAR_DELETE || event.type === Events.VAR_RENAME) {
        ws.refreshToolboxSelection()
      }
    }

    ws.addChangeListener(variableListener)

    const resizeObserver = new ResizeObserver(() => resize(ws))
    resizeObserver.observe(containerRef.current)

    const backpack = new Backpack(ws)
    backpack.init()

    const handleObjectCreated = () => {
      let newOptions: [string, string][] = []
      objects.current.forEach((object, key) => {
        newOptions.push([object.name, key])
      })
      
      if (newOptions.length === 0){
        newOptions.push(['',''])
      }
      
      objectRegistry.options = newOptions
      ws.getToolbox()?.refreshSelection()
    }

    emitter.on('objectCreated', handleObjectCreated)

    return () => {
      emitter.off('objectCreated', handleObjectCreated)
      resizeObserver.disconnect()
      ws.removeChangeListener(variableListener)
      ws.dispose()
      workspaceRef.current = null
      setWorkspace(null)
    }
  }, [containerRef, setWorkspace])

  return workspaceRef.current
}