import {
  bumpObjects,
  common,
  DropDownDiv,
  Tooltip,
  WidgetDiv,
  WorkspaceSvg
} from 'blockly'
import { Expression, ProgramState } from '../blockly/engine/ast'
import { evaluateExpression } from '../blockly/engine/interpreter'

export function resize(workspace: WorkspaceSvg) {
  Tooltip.hide()
  workspace.hideComponents(true)
  DropDownDiv.repositionForWindowResize()
  WidgetDiv.repositionForWindowResize()
  common.svgResize(workspace)
  bumpObjects.bumpTopObjectsIntoBounds(workspace)
}

/**
 * Executes the program in the interpreter
 */
export async function execute(
  expr: Expression,
  state: ProgramState,
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
) {
  setIsRunning(true)
  console.log('%cRunning...', 'color: lightseagreen;')
  console.time('Done in')
  try {
    const result = await evaluateExpression(expr, state)
    console.log('%coutput:', 'color: cornflowerblue;', result)
  } catch (err) {
    console.error(err)
  } finally {
    console.timeEnd('Done in')
    setIsRunning(false)
    state.runState.current.shouldStop = false
    state.runState.current.shouldPause = false
  }
}