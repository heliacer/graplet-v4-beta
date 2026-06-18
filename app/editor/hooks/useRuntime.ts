import { useCallback, useRef } from 'react'
import { Expression, ProgramState, Thread } from '../engine/ast'
import { initProgram, threadStep } from '../engine/interpreter'
import { useEditorRefs } from '../context/EditorContext'
import { useEditorStore } from '../state'

export function useRuntime() {
  const { objectsRef, varEnvRef, funcEnvRef, stepsPerFrameRef } =
    useEditorRefs()
  const setRunning = useEditorStore(s => s.setRunning)
  const setPaused = useEditorStore(s => s.setPaused)
  const running = useRef(false)
  const paused = useRef(false)
  const threads = useRef<Thread[]>([])

  /** @private */
  const finalize = useCallback(() => {
    console.timeEnd('Time elapsed')
    setRunning(false)
    setPaused(false)
  }, [setPaused, setRunning])

  const start = useCallback(
    (
      expression: Expression,
      single?: boolean,
      callback?: (threads: Thread[]) => void
    ) => {
      if (running.current) return

      const state = {
        objects: objectsRef.current,
        variables: varEnvRef.current,
        functions: funcEnvRef.current
      }

      setRunning(true)
      console.info('%cRunning...', 'color: aquamarine;')
      console.time('Time elapsed')

      if (single) {
        threads.current = [
          {
            stack: [{ expression, stage: 0 }],
            locals: {},
            valueStack: [],
            done: false
          }
        ]
      } else {
        threads.current = initProgram(expression, state)
      }

      running.current = true

      function loop(state: ProgramState, spf: number) {
        if (!running.current) return
        if (!paused.current) {
          try {
            for (let i = 0; i < spf; i++) {
              let allDone = true
              if (paused.current) break
              for (const thread of threads.current) {
                threadStep(thread, state)
                if (!thread.done) allDone = false
              }
              if (allDone) {
                running.current = false
                console.info('Done.')
                finalize()
                callback?.(threads.current)
                return
              }
            }
          } catch (error) {
            console.error(error)
            running.current = false
            console.info('Crashed.')
            finalize()
            return
          }
        }
        requestAnimationFrame(() => loop(state, spf))
      }

      loop(state, stepsPerFrameRef.current)
    },
    [objectsRef, varEnvRef, funcEnvRef, stepsPerFrameRef, setRunning, finalize]
  )

  function pauseOrResume() {
    const next = !paused.current
    paused.current = next
    setPaused(next)
  }
  function step() {
    const state = {
      objects: objectsRef.current,
      variables: varEnvRef.current,
      functions: funcEnvRef.current
    }
    for (const thread of threads.current) {
      threadStep(thread, state)
    }
  }

  function stop() {
    if (!running.current) return
    running.current = false
    paused.current = false
    console.info('Stopped.')
    finalize()
  }

  return { start, pauseOrResume, step, stop }
}
