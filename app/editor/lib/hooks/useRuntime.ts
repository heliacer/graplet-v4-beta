import { useCallback, useRef } from 'react'
import { Expression, ProgramState, Thread } from '../blockly/engine/ast'
import { initProgram, threadStep } from '../blockly/engine/interpreter'
import { useOldEditor } from '../EditorContext'
import { useEditor } from '../state'

const STEPS_PER_FRAME = 100 /** should make this globally tweakable, this is peak */

export function useRuntime() {
  const { objects, varEnv, funcEnv, setObjectVersion } = useOldEditor()
  const setRunning = useEditor(s => s.setRunning)
  const setPaused = useEditor(s => s.setPaused)
  const isPaused = useEditor(s => s.isPaused)

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

      setRunning(true)
      console.info('%cRunning...', 'color: aquamarine;')
      console.time('Time elapsed')

      threads.current = initProgram(expression, state)
      running.current = true

      loop(state)
    },
    [objects, varEnv, funcEnv, setRunning, loop]
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
    const next = !isPaused
    paused.current = next
    setPaused(next)
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
    setRunning(false)
    setPaused(false)
    setObjectVersion(v => v + 1)
  }

  return { start, pauseOrResume, step, stop }
}
