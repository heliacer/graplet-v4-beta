import clsx from 'clsx'
import { BlocklyOptions, inject, serialization, WorkspaceSvg } from 'blockly'
import { useEffect, useRef, useState } from 'react'
import { theme } from '../../blockly/theme'
import { IDockviewPanelProps } from 'dockview-react'
import { resize } from '../../utils/blockly'
import { DiamondPlus } from 'lucide-react'

const blocklyOptions: BlocklyOptions = {
  theme: theme,
  renderer: 'graplet',
  comments: false,
  trashcan: false,
  grid: {
    length: 2,
    spacing: 20,
    snap: true
  },
  move: {
    wheel: false,
    scrollbars: {
      horizontal: true
    }
  },
  oneBasedIndex: false,
  sounds: false
}

function BooleanVector() {
  return (
    <svg
      width={45}
      height={15}
      fill='none'
      viewBox='0 0 46 15'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='m37.864 14.5h-30.52c-0.26978 0-0.52811-0.109-0.71635-0.3023l-5.8442-6c-0.3782-0.38828-0.3782-1.0072-1e-6 -1.3955l5.8442-6c0.18824-0.19326 0.44657-0.30226 0.71635-0.30226h30.52c0.2698 0 0.5281 0.109 0.7163 0.30226l5.8442 6c0.3782 0.38828 0.3782 1.0072 0 1.3955l-5.8442 6c-0.1882 0.1933-0.4465 0.3023-0.7163 0.3023z'
        fill='#C2524C'
        stroke='#923530'
      />
    </svg>
  )
}

function LabelVector() {
  return (
    <svg
      width={40}
      height={15}
      fill='none'
      viewBox='0 0 41 15'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='m37.5 14.5h-34c-1.6568 0-3-1.3431-3-3v-8c0-1.6568 1.3432-3 3-3h34c1.6569 0 3 1.3432 3 3v8c0 1.6569-1.3431 3-3 3z'
        fill='#C2524C'
        stroke='#923530'
      />
    </svg>
  )
}

function InputVector() {
  return (
    <svg
      width={40}
      height={15}
      fill='none'
      viewBox='0 0 41 15'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='m33.5 14.5h-26c-3.866 0-7-3.134-7-7 0-3.866 3.134-7 7-7h26c3.866 0 7 3.134 7 7 0 3.866-3.134 7-7 7z'
        fill='#C2524C'
        stroke='#923530'
      />
    </svg>
  )
}

export default function CreateFunctionPanel(props: IDockviewPanelProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null)
  const workspace = useRef<WorkspaceSvg | null>(null)
  const [inputOption, setInputOption] = useState('number')

  useEffect(() => {
    if (!blocklyDiv.current || workspace.current) return
    const ws = inject(blocklyDiv.current, blocklyOptions)
    workspace.current = ws

    const block = serialization.blocks.append(
      {
        type: 'function_call',
        y: 50
      },
      ws
    )
    ws.scrollCenter()
    block.setMovable(false)
    block.setDeletable(false)

    const resizeObserver = new ResizeObserver(() => resize(ws))
    resizeObserver.observe(blocklyDiv.current)

    function cleanup() {
      resizeObserver.disconnect()
      ws.dispose()
      workspace.current = null
    }

    return cleanup
  })

  return (
    <>
      <div className='w-full h-32 mx-1' ref={blocklyDiv}></div>
      <div className='flex items-center flex-col gap-3 m-2 text-sm '>
        <div className='flex gap-2'>
          <button
            className={clsx(
              'flex flex-col gap-1 p-2 px-3 items-center justify-center',
              'border rounded',
              'border-ui-700',
              'hover:bg-ui-750 bg-ui-800'
            )}
          >
            <LabelVector />
            <p>Add Label</p>
          </button>
          <button
            className={clsx(
              'flex flex-col gap-1 p-2 px-3 items-center justify-center',
              'border rounded',
              'border-ui-700',
              'hover:bg-ui-750 bg-ui-800'
            )}
          >
            <BooleanVector />
            <p>Add Boolean</p>
          </button>
          <button
            className={clsx(
              'flex gap-3 p-2 px-3 items-center justify-center',
              'border rounded',
              'border-ui-700',
              'hover:bg-ui-750 bg-ui-800'
            )}
          >
            <div className='flex flex-col items-center gap-1'>
              <InputVector />
              <p>Add Input</p>
            </div>
            <div className='h-8 mx-2 border-l border-ui-600 border-dashed' />
            <div className='flex flex-col items-center gap-1'>
              <p>Input type:</p>
              <select
                className={clsx(
                  'border rounded',
                  'border-ui-600',
                  'hover:bg-ui-650 bg-ui-700',
                  'focus:outline-none'
                )}
                value={inputOption}
                onChange={e => setInputOption(e.target.value)}
              >
                <option>number</option>
                <option>string</option>
                <option>object</option>
              </select>
            </div>
          </button>
        </div>
        <button
          className={clsx(
            'flex gap-1 px-1 items-center',
            'border rounded-md',
            'border-ui-700',
            'hover:bg-ui-750 bg-ui-800'
          )}
          onClick={() => {
            props.api.close()
          }}
        >
          <DiamondPlus size={14} />
          <p>Add to workspace</p>
        </button>
      </div>
    </>
  )
}
