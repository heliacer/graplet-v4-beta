import { inject, Events } from 'blockly'
import { useEffect } from 'react'
import { useEditorRefs } from '../context/editor'
import { blocklyOptions } from '../blockly/options'
import { resize } from '../utils/blockly'
import { exprGenerator } from '../engine/generator'
import { useRuntime } from './useRuntime'
import { createFunction } from '../blockly/utils/createFunction'
import { useEditorStore } from '../state'
import { upsertPanel } from '../utils/dockview'

export function useBlocklyWorkspace(
  blocklyDiv: React.RefObject<HTMLDivElement>
) {
  const { workspace } = useEditorRefs()
  const dvApi = useEditorStore(s => s.dvApi)
  const setHasChanges = useEditorStore(s => s.setHasChanges)
  const setAutoClose = useEditorStore(s => s.setAutoClose)
  const { start } = useRuntime()

  useEffect(() => {
    if (!blocklyDiv.current || workspace.current) return

    const ws = inject(blocklyDiv.current, blocklyOptions)
    workspace.current = ws

    function listener(event: Events.Abstract) {
      if (
        !(
          event instanceof Events.ViewportChange ||
          event instanceof Events.FinishedLoading ||
          event instanceof Events.ToolboxItemSelect ||
          event instanceof Events.Selected ||
          event instanceof Events.BlockDrag ||
          event instanceof Events.CommentDrag
        )
      ) {
        setHasChanges(true)
      }
      if (
        event instanceof Events.VarCreate ||
        event instanceof Events.VarDelete ||
        event instanceof Events.VarRename
      ) {
        ws.refreshToolboxSelection()
      }
    }

    function blockListener(event: Events.Abstract) {
      if (event instanceof Events.Click && event.targetType === 'block') {
        if (event.blockId) {
          const block = event.getEventWorkspace_().getBlockById(event.blockId)
          if (block) {
            const expression = exprGenerator.blockToExpression(block)
            start(expression, true, threads => {
              const output = threads[0].valueStack[0]
              if (output === undefined) return
              alert(output)
            })
          }
        }
      }
    }

    ws.addChangeListener(listener)
    ws.addChangeListener(blockListener)
    const flyout = ws.getFlyout()
    if (flyout) {
      flyout.getWorkspace().addChangeListener(blockListener)
      setAutoClose(flyout.autoClose)
    }
    ws.registerButtonCallback('createFunction', createFunction)
    ws.registerButtonCallback('wipCreateFunction', () =>
      upsertPanel(
        dvApi,
        'createFunction',
        'Create function',
        'Wrench',
        true,
        500,
        300
      )
    )

    const resizeObserver = new ResizeObserver(() => resize(ws))
    resizeObserver.observe(blocklyDiv.current)
    function cleanup() {
      resizeObserver.disconnect()
      ws.removeChangeListener(listener)
      ws.removeChangeListener(blockListener)
      ws.getFlyout()?.getWorkspace().removeChangeListener(blockListener)
      ws.dispose()
      workspace.current = null
    }

    return cleanup
  }, [blocklyDiv, setAutoClose, workspace, start, setHasChanges])
}
