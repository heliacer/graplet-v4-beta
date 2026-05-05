import { LucideIcon } from 'lucide-react'
import { Object3D } from 'three'
import { DragNumberInput } from '@/app/ui/components/DragNumberInput'
import { useId } from 'react'
import { useEditorStore } from '../../state'
import clsx from 'clsx'

interface BasePropertyProps {
  label: string
  object: Object3D
}

interface TextPropertyProps extends BasePropertyProps {
  property: 'name'
}

interface Vec3PropertyProps extends BasePropertyProps {
  property: 'position' | 'scale'
}

interface Vec3AnglePropertyProps extends BasePropertyProps {
  property: 'rotation'
}

export function Vec3Property({ label, object, property }: Vec3PropertyProps) {
  const invalidateObject = useEditorStore(s => s.invalidateObject)

  return (
    <div className='flex justify-between w-full'>
      <p className='text-nowrap'>{label}</p>
      <div className='flex gap-1'>
        {(['x', 'y', 'z'] as const).map(axis => (
          <label key={axis} className='relative'>
            <DragNumberInput
              className='rounded border outline-none w-10 text-center text-cyan'
              value={Number(object[property][axis])}
              onChange={newVal => {
                object[property][axis] = newVal
              }}
              onCommit={() => {
                invalidateObject(object)
              }}
              step={0.1}
            />
          </label>
        ))}
      </div>
    </div>
  )
}

export function Vec3AngleProperty({
  label,
  object,
  property
}: Vec3AnglePropertyProps) {
  const invalidateObject = useEditorStore(s => s.invalidateObject)

  return (
    <div className='flex justify-between w-full'>
      <p className='text-nowrap'>{label}</p>
      <div className='flex gap-1'>
        {(['x', 'y', 'z'] as const).map(axis => (
          <label key={axis} className='relative'>
            <DragNumberInput
              className='rounded border outline-none w-10 text-center pr-1 text-cyan'
              value={Number((object[property][axis] * 180) / Math.PI)}
              step={1}
              decimals={0}
              onChange={newVal => {
                object[property][axis] = (newVal * Math.PI) / 180
              }}
              onCommit={() => {
                invalidateObject(object)
              }}
            />
            <span className='absolute right-1.5 top-0.5 text-xs select-none'>
              °
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function TextProperty({ label, object, property }: TextPropertyProps) {
  const updateObject = useEditorStore(s => s.updateObject)

  const update = (newValue: string) => {
    if (object[property] !== newValue) {
      updateObject(object, o => (o[property] = newValue))
    }
  }

  return (
    <label className='flex justify-between'>
      <span className='text-nowrap'>{label}</span>
      <input
        type='text'
        className='rounded border outline-none px-1 w-32'
        key={object[property]}
        defaultValue={object[property]}
        onBlur={e => update(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') update(e.currentTarget.value)
        }}
      />
    </label>
  )
}

interface PropButtonProps {
  label: string
  Icon: LucideIcon
  action: () => void
}

export function PropButton({ label, Icon, action }: PropButtonProps) {
  return (
    <button
      className={clsx(
        'flex gap-1 px-1 items-center',
        'border rounded-md',
        'border-ui-700',
        'hover:bg-ui-750 bg-ui-800'
      )}
      onClick={action}
    >
      <Icon size={12} />
      <p>{label}</p>
    </button>
  )
}

interface CheckBoxPropertyProps {
  label: string
  checked: boolean
  action: (checked: boolean) => void
}

export function CheckBoxProperty({
  label,
  checked,
  action
}: CheckBoxPropertyProps) {
  const uuid = useId()
  return (
    <label className='flex gap-2 cursor-pointer select-none'>
      <input
        id={uuid}
        className='cursor-pointer'
        type='checkbox'
        checked={checked}
        onChange={e => action(e.target.checked)}
      />
      <p>{label}</p>
    </label>
  )
}
