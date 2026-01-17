import { useCallback } from 'react'
import { Expression } from '../blockly/engine/ast'
import { evaluateExpression } from '../blockly/engine/interpreter'
import { useEditor } from '../EditorContext'

export function useRuntime() {
  const {
    objects,
    varEnv,
    funcEnv,
    runState,
    setIsRunning,
    setIsPaused,
    setObjectVersion
  } = useEditor()

  /**
   * Executes the program in the interpreter
   *
   * If no specific expression is given, it will use the workspace expression
   */
  const execute = useCallback(
    async (expression: Expression) => {
      setIsRunning(true)
      console.log('%cRunning...', 'color: aquamarine;')
      console.time('Done in')
      const state = {
        objects: objects.current,
        variables: varEnv.current,
        functions: funcEnv.current,
        runState: runState
      }
      try {
        const result = await evaluateExpression(expression, state)
        console.log('%coutput:', 'color: deepskyblue;', result)
      } catch (err) {
        console.error(err)
      } finally {
        console.timeEnd('Done in')
        setIsRunning(false)
        runState.current.shouldStop = false
        runState.current.shouldPause = false
      }
      setObjectVersion(v => v + 1)
    },
    [objects, varEnv, funcEnv, runState, setIsRunning, setObjectVersion]
  )

  /**
   * Toggle pause / resume
   */
  function pauseOrResume() {
    setIsPaused(p => {
      runState.current.shouldPause = !p
      return !p
    })
  }

  function stop() {
    runState.current.shouldStop = true
    setObjectVersion(v => v + 1)
    setIsPaused(false)
  }

  return { execute, pauseOrResume, stop }
}
