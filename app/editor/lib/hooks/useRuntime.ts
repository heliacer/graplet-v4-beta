import { useCallback, useRef } from 'react'
import { Expression, ProgramState, Thread } from '../blockly/engine/ast'
import { initProgram, threadStep } from '../blockly/engine/interpreter'
import { useEditor } from '../EditorContext'

const STEPS_PER_FRAME = 100 /** should make this globally tweakable, this is peak */

export function useRuntime() {
  const {
    objects,
    varEnv,
    funcEnv,
    setIsRunning,
    setIsPaused,
    setObjectVersion
  } = useEditor()

  const running = useRef(false)
  const paused = useRef(false)
  const threads = useRef<Thread[]>([])

  const start = useCallback(
    (expression: Expression) => {
      if (running.current) return

      const state = {
        objects: objects.current,
        variables: varEnv.current,
        functions: funcEnv.current
      }

      setIsRunning(true)
      console.info('%cRunning...', 'color: aquamarine;')
      console.time('Time elapsed')

      threads.current = initProgram(expression, state)
      running.current = true

      loop(state)
    },
    [objects, varEnv, funcEnv, setIsRunning]
  )

  function loop(state: ProgramState) {
    if (!running.current) return
    if (!paused.current) {
      try {
        for (let i = 0; i < STEPS_PER_FRAME; i++) {
          let allDone = true
          if (paused.current) break
          for (const thread of threads.current) {
            threadStep(thread, state)
            if (!thread.done) allDone = false
          }
          if (allDone) {
            running.current = false
            console.log('Done.')
            finalize()
            return
          }
        }
      } catch (error) {
        console.error(error)
        running.current = false
        console.log('Crashed.')
        finalize()
        return
      }
    }
    requestAnimationFrame(() => loop(state))
  }

  function pauseOrResume() {
    setIsPaused(prev => {
      const next = !prev
      paused.current = next
      return next
    })
  }
  function step() {
    const state = {
      objects: objects.current,
      variables: varEnv.current,
      functions: funcEnv.current
    }
    for (const thread of threads.current) {
      threadStep(thread, state)
    }
  }

  function stop() {
    if (!running.current) return
    running.current = false
    paused.current = false
    console.log('Stopped.')
    finalize()
  }

  /** @private */
  function finalize() {
    console.timeEnd('Time elapsed')
    setIsRunning(false)
    setIsPaused(false)
    setObjectVersion(v => v + 1)
  }

  return { start, pauseOrResume, step, stop }
}
