import { Flag, Octagon, Pause, Play, StepForward } from 'lucide-react'
import { useState } from 'react'
import { useEditor } from '../../lib/EditorContext'
import { exprGenerator } from '../../lib/blockly/engine/generator'
import { execute } from '../../lib/utils/blockly'
import clsx from 'clsx'

export default function RunControls() {
  const {
    runState,
    workspace,
    isRunning,
    scene,
    funcEnv,
    varEnv,
    setIsRunning
  } = useEditor()
  const [isPaused, setIsPaused] = useState<boolean>(false)

  function togglePaused() {
    setIsPaused((prev) => {
      runState.current.shouldPause = !prev
      return !prev
    })
  }

  async function handleRun() {
    if (!workspace) return
    const expr = exprGenerator.workspaceToExpression(workspace)
    await execute(
      expr,
      {
        scene: scene.current,
        variables: varEnv.current,
        functions: funcEnv.current,
        runState: runState
      },
      setIsRunning
    )
  }

  function handleStop() {
    runState.current.shouldStop = true
    setIsPaused(false)
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex gap-1">
        <button
          onClick={handleRun}
          title="run"
          className={clsx(
            'p-1 rounded',
            isRunning ? 'bg-zinc-700' : 'cursor-pointer bg-teal-600'
          )}
          disabled={isRunning}
        >
          <Flag size={16} />
        </button>
        <button
          onClick={togglePaused}
          title={isPaused ? 'resume' : 'pause'}
          className={clsx(
            'p-1 rounded',
            isRunning
              ? isPaused
                ? 'cursor-pointer bg-teal-600'
                : 'cursor-pointer bg-orange-400'
              : 'bg-zinc-700'
          )}
          disabled={!isRunning}
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>
        <button
          onClick={handleStop}
          title="stop"
          className={clsx(
            'p-1 rounded',
            isRunning ? 'cursor-pointer bg-rose-500' : 'bg-zinc-700'
          )}
        >
          <Octagon size={16} />
        </button>
        <button
          onClick={() => (runState.current.shouldStep = true)}
          className={clsx(
            'p-1 rounded',
            isRunning && isPaused ? 'cursor-pointer bg-sky-600' : 'bg-zinc-700'
          )}
          title="step"
        >
          <StepForward size={16} />
        </button>
      </div>
    </div>
  )
}
