import { useCallback, useRef } from 'react'
import { Expression, ProgramState, Thread } from '../blockly/engine/ast'
import { initProgram, threadStep } from '../blockly/engine/interpreter'
import { useEditorRefs } from '../context'
import { useEditorStore } from '../state'

const STEPS_PER_FRAME = 100 /** should make this globally tweakable, this is peak */

export function useRuntime() {
  const { objects, varEnv, funcEnv } = useEditorRefs()
  const setRunning = useEditorStore(s => s.setRunning)
  const setPaused = useEditorStore(s => s.setPaused)
  const invalidateAllObjects = useEditorStore(s => s.invalidateObjectsAll)
  const running = useRef(false)
  const paused = useRef(false)
  const threads = useRef<Thread[]>([])

  /** @private */
  const finalize = useCallback(() => {
    console.timeEnd('Time elapsed')
    setRunning(false)
    setPaused(false)
    invalidateAllObjects()
  }, [setPaused, setRunning, invalidateAllObjects])

  const start = useCallback(
    (expression: Expression, single?: boolean) => {
      if (running.current) return

      const state = {
        objects: objects.current,
        variables: varEnv.current,
        functions: funcEnv.current
      }

      setRunning(true)
      console.info('%cRunning...', 'color: aquamarine;')
      console.time('Time elapsed')

      if (single) {
        threads.current = [
          {
            stack: [{ expression, stage: 0 }],
            valueStack: [],
            done: false
          }
        ]
      } else {
        threads.current = initProgram(expression, state)
      }

      running.current = true

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

      loop(state)
    },
    [objects, varEnv, funcEnv, setRunning, finalize]
  )

  function pauseOrResume() {
    const next = !paused.current
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

  return { start, pauseOrResume, step, stop }
}
