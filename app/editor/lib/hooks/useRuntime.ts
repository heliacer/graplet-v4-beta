import { useCallback, useRef } from 'react'
import { Expression, Thread } from '../blockly/engine/ast'
import { initProgram, step } from '../blockly/engine/interpreter'
import { useEditor } from '../EditorContext'

export function useRuntime() {
  const {
    objects,
    varEnv,
    funcEnv,
    setIsRunning,
    setIsPaused,
    setObjectVersion
  } = useEditor()

  /** @deprecated */
  const runState = useRef<RunState>({
    shouldPause: false,
    shouldStop: false,
    shouldStep: false
  })

  /**
   * @deprecated
   * Executes the program in the interpreter
   */
  const execute = useCallback(
    async (expression: Expression) => {
      setIsRunning(true)
      console.info('%cRunning...', 'color: aquamarine;')
      console.time('Done in')
      const state = {
        objects: objects.current,
        variables: varEnv.current,
        functions: funcEnv.current,
        runState
      }
      try {
        const result = await evaluateExpression(expression, state)
        console.info('%coutput:', 'color: deepskyblue;', result)
      } catch (error) {
        console.error(error)
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

  let running = false
  let paused = false
  let threads: Thread[] = []

  const state = {
    objects: objects.current,
    variables: varEnv.current,
    functions: funcEnv.current
  }

  function start(expression: Expression) {
    setIsRunning(true)

    threads = initProgram(expression, state)
    running = true
    loop()
  }

  function loop() {
    if (!running) return
    if (!paused) {
      for (const thread of threads) {
        step(thread, state)
      }
    }
    requestAnimationFrame(loop)
  }

  function pauseOrResume() {
    setIsPaused(p => {
      paused = !paused
      return !p
    })
  }

  function oneStep() {
    for (const thread of threads) {
      step(thread, state)
    }
  }

  function stop() {
    running = false
    setIsPaused(false)
    setIsRunning(false)
    setObjectVersion(v => v + 1)
  }

  return { execute, start, pauseOrResume, oneStep, stop }
}
