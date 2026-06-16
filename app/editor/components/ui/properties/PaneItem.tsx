import { LucideIcon } from 'lucide-react'
import { DragNumberInput } from '@/app/ui/components/DragNumberInput'
import { useId } from 'react'
import { useEditorStore } from '../../../state'
import { Vec3 } from '../../../types'
import { getObject } from '@/app/editor/utils/three'
import { useEditorRefs } from '@/app/editor/context/EditorContext'
import clsx from 'clsx'

export type PaneItem = { label: string } & (
  | PaneInput
  | PaneButton
  | PaneCheckbox
)

type PaneInput = TextPaneInput | Vec3PaneInput | Vec3AnglePaneInput

type TextPaneInput = {
  type: 'text'
  property: 'name'
}

type Vec3PaneInput = {
  type: 'vec3'
  property: 'position' | 'scale'
}

type Vec3AnglePaneInput = {
  type: 'vec3'
  property: 'rotation'
}

type PaneButton = {
  type: 'button'
  Icon: LucideIcon
  onClick: () => void
}

type PaneCheckbox = {
  type: 'checkbox'
  checked: boolean
  onClick: (checked: boolean) => void
}

interface Vec3PropertyProps {
  label: string
  property: 'position' | 'scale'
  display: (value: number) => number
  store: (value: number) => number
  suffix: string
  step: number
  decimals: number
}

export function Vec3Property({
  label,
  property,
  display = (x: number) => x,
  store = (x: number) => x,
  suffix = '',
  step = 0.1,
  decimals = 2
}: Vec3PropertyProps) {
  const { objectsRef } = useEditorRefs()
  const updateSnapshot = useEditorStore(s => s.updateSnapshot)
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)
  const selectedItems = useEditorStore(s => s.selectedItems)
  if (selectedItems.length < 1) return
  const firstSObject = objectSnapshots[selectedItems[0]]

  return (
    <div className='flex justify-between w-full'>
      <p className='text-nowrap'>{label}</p>
      <div className='flex gap-1'>
        {[0, 1, 2].map(axis => (
          <label key={axis} className='relative'>
            <DragNumberInput
              className={clsx(
                'rounded border outline-none',
                'w-10 text-center text-cyan',
                suffix && 'pr-1'
              )}
              value={display(firstSObject[property][axis])}
              onChange={newVal => {
                for (const sharedId of selectedItems) {
                  const sobject = objectSnapshots[sharedId]
                  const newProp: Vec3 = [...sobject[property]]
                  newProp[axis] = store(newVal)
                  const object = getObject(objectsRef, sharedId)
                  object[property].set(...newProp)
                  updateSnapshot(sharedId, prev => ({
                    ...prev,
                    [property]: newProp
                  }))
                }
              }}
              step={step}
              decimals={decimals}
            />
            {suffix && (
              <span className='absolute right-1.5 top-0.5 text-xs select-none'>
                {suffix}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  )
}

export function TextProperty({
  label,
  property
}: {
  label: string
  property: 'name'
}) {
  const { objectsRef } = useEditorRefs()
  const updateSnapshot = useEditorStore(s => s.updateSnapshot)
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)
  const selectedItems = useEditorStore(s => s.selectedItems)
  if (selectedItems.length < 1) return
  const firstSObject = objectSnapshots[selectedItems[0]]

  const update = (newValue: string) => {
    for (const sharedId of selectedItems) {
      const object = getObject(objectsRef, sharedId)
      object[property] = newValue
      updateSnapshot(sharedId, prev => ({
        ...prev,
        [property]: newValue
      }))
    }
  }

  return (
    <label className='flex justify-between'>
      <span className='text-nowrap'>{label}</span>
      <input
        type='text'
        className='rounded border outline-none px-1 w-32'
        defaultValue={firstSObject[property]}
        onBlur={e => update(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') update(e.currentTarget.value)
        }}
      />
    </label>
  )
}

export function PropButton({
  label,
  Icon,
  onClick
}: {
  label: string
  Icon: LucideIcon
  onClick: () => void
}) {
  return (
    <button
      className={clsx(
        'flex gap-1 px-1 items-center',
        'border rounded-md',
        'border-ui-700',
        'hover:bg-ui-750 bg-ui-800'
      )}
      onClick={onClick}
    >
      <Icon size={12} />
      <p>{label}</p>
    </button>
  )
}

export function CheckBoxProperty({
  label,
  checked,
  onClick
}: {
  label: string
  checked: boolean
  onClick: (checked: boolean) => void
}) {
  const uuid = useId()
  return (
    <label className='flex gap-2 cursor-pointer select-none'>
      <input
        id={uuid}
        className='cursor-pointer'
        type='checkbox'
        checked={checked}
        onChange={e => onClick(e.target.checked)}
      />
      <p>{label}</p>
    </label>
  )
}
