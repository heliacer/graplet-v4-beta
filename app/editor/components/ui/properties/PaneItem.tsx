import { LucideIcon } from 'lucide-react'
import { useId } from 'react'
import { useEditorStore } from '@/app/editor/state'
import { Vec3 } from '@/app/editor/types'
import { getObject } from '@/app/editor/utils/three'
import { useEditorRefs } from '@/app/editor/context/EditorContext'
import clsx from 'clsx'
import { DragNumberInput } from '../DragNumberInput'

export type PaneItem =
  | TextPaneInput
  | Vec3PaneInput
  | Vec3AnglePaneInput
  | ButtonPaneInput
  | CheckboxPaneInput

type TextPaneInput = {
  type: 'text'
  property: 'name'
}

type Vec3PaneInput = {
  type: 'vec3'
  property: 'position' | 'scale'
}

type Vec3AnglePaneInput = {
  type: 'vec3angle'
  property: 'rotation'
}

type ButtonPaneInput = {
  label: string
  type: 'button'
  Icon?: LucideIcon
  onClick?: () => void
}

type CheckboxPaneInput = {
  label: string
  type: 'checkbox'
  checked?: boolean
  onClick?: (checked: boolean) => void
}

interface Vec3PropertyProps {
  property: 'position' | 'scale' | 'rotation'
  display?: (value: number) => number
  store?: (value: number) => number
  suffix?: string
  step?: number
  decimals?: number
}

function TextProperty({ property }: { property: 'name' }) {
  const { objectsRef } = useEditorRefs()
  const updateSnapshot = useEditorStore(s => s.updateSnapshot)
  const sharedId = useEditorStore(s => s.selectedItems[0])
  const objectName = useEditorStore(s =>
    sharedId ? s.objectSnapshots[sharedId]?.name : ''
  )
  if (sharedId === undefined) return

  const update = (newValue: string) => {
    const object = getObject(objectsRef, sharedId)
    object[property] = newValue
    updateSnapshot(sharedId, prev => ({ ...prev, [property]: newValue }))
  }

  return (
    <label className='flex justify-between'>
      <span className='text-nowrap'>
        ({sharedId})-{property.charAt(0).toUpperCase() + property.slice(1)}
      </span>
      <input
        type='text'
        className='rounded border outline-none px-1 w-32'
        key={objectName}
        defaultValue={objectName}
        onBlur={e => update(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') update(e.currentTarget.value)
        }}
      />
    </label>
  )
}

function Vec3Property({
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
      <p className='text-nowrap'>
        {property.charAt(0).toUpperCase() + property.slice(1)}
      </p>
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

function PropButton({
  label,
  Icon,
  onClick
}: {
  label: string
  Icon?: LucideIcon
  onClick?: () => void
}) {
  return (
    <button
      className={clsx(
        'self-start',
        'flex gap-1 px-1 items-center',
        'border rounded-md',
        'border-ui-700',
        'hover:bg-ui-750 bg-ui-800'
      )}
      onClick={onClick}
    >
      {Icon && <Icon size={12} />}
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
  checked?: boolean
  onClick?: (checked: boolean) => void
}) {
  const uuid = useId()
  return (
    <label className='flex gap-2 cursor-pointer select-none'>
      <input
        id={uuid}
        className='cursor-pointer'
        type='checkbox'
        checked={checked}
        onChange={e => onClick?.(e.target.checked)}
      />
      <p>{label}</p>
    </label>
  )
}

export function renderPaneItem(item: PaneItem) {
  switch (item.type) {
    case 'text':
      return <TextProperty {...item} />
    case 'vec3':
      return <Vec3Property {...item} />
    case 'vec3angle':
      return (
        <Vec3Property
          property='rotation'
          display={x => (x * 180) / Math.PI}
          store={x => (x * Math.PI) / 180}
          suffix='°'
          step={1}
          decimals={0}
        />
      )
    case 'button':
      return <PropButton {...item} />
    case 'checkbox':
      return <CheckBoxProperty {...item} />
  }
}
