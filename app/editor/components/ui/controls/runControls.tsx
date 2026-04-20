import { Flag, Octagon, Pause, Play, StepForward } from 'lucide-react'
import { useEditorRefs } from '../../../lib/context'
import { useEditorStore } from '@/app/editor/lib/state'
import clsx from 'clsx'
import { useRuntime } from '@/app/editor/lib/hooks/useRuntime'
import { exprGenerator } from '@/app/editor/lib/engine/generator/index'

export function RunControls() {
  const { workspace } = useEditorRefs()
  const { start, stop, step, pauseOrResume } = useRuntime()
  const isRunning = useEditorStore(s => s.isRunning)
  const isPaused = useEditorStore(s => s.isPaused)

  async function handleRun() {
    if (!workspace.current) throw Error('Missing workspace')
    const expression = exprGenerator.workspaceToExpression(workspace.current)
    start(expression)
  }

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='flex gap-1'>
        <button
          onClick={handleRun}
          title='run'
          className={clsx(
            'p-1 rounded',
            isRunning ? 'bg-ui-700' : 'cursor-pointer bg-teal'
          )}
          disabled={isRunning}
        >
          <Flag size={16} />
        </button>
        <button
          onClick={pauseOrResume}
          title={isPaused ? 'resume' : 'pause'}
          className={clsx(
            'p-1 rounded',
            isRunning
              ? isPaused
                ? 'cursor-pointer bg-teal'
                : 'cursor-pointer bg-orange'
              : 'bg-ui-700'
          )}
          disabled={!isRunning}
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>
        <button
          onClick={stop}
          title='stop'
          className={clsx(
            'p-1 rounded',
            isRunning ? 'cursor-pointer bg-red' : 'bg-ui-700'
          )}
        >
          <Octagon size={16} />
        </button>
        <button
          disabled={!(isRunning && isPaused)}
          onClick={step}
          className={clsx(
            'p-1 rounded',
            isRunning && isPaused ? 'cursor-pointer bg-blue' : 'bg-ui-700'
          )}
          title='step'
        >
          <StepForward size={16} />
        </button>
      </div>
    </div>
  )
}
