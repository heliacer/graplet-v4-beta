import clsx, { ClassValue } from 'clsx'
import { LucideIcon } from 'lucide-react'
import { useEditor } from '../../lib/EditorContext'
import { Object3D } from 'three'
import DragNumberInput from '@/app/ui/components/DragNumberInput'

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

/** @deprecated */
interface NumberPropInput {
  value: number
  action: (newValue: number) => void
  className?: ClassValue
}

export function Vec3Property({ label, object, property }: Vec3PropertyProps) {
  const { setObjectVersion } = useEditor()

  return (
    <div className="flex justify-between w-full">
      <p className="text-nowrap">{label}</p>
      <div className="flex gap-1.5">
        {(["x", "y", "z"] as const).map((axis) => (
          <div key={axis} className="relative">
            <DragNumberInput
              className="rounded border outline-none w-12 text-center text-sky-400"
              value={Number((object[property][axis]))}
              onChange={(newVal) => {
                object[property][axis] = newVal
                setObjectVersion((v) => v + 1)
              }}
              step={0.1}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function Vec3AngleProperty({ label, object, property }: Vec3AnglePropertyProps) {
  const { setObjectVersion } = useEditor()

  return (
    <div className="flex justify-between w-full">
      <p className="text-nowrap">{label}</p>
      <div className="flex gap-1.5">
        {(["x", "y", "z"] as const).map((axis) => (
          <div key={axis} className="relative">
            <DragNumberInput
              className="rounded border outline-none w-12 text-center pr-1 text-sky-400"
              value={Number((object[property][axis] * 180) / Math.PI)}
              step={1}
              decimals={0}
              onChange={(newVal) => {
                object[property][axis] = (newVal * Math.PI) / 180
                setObjectVersion((v) => v + 1)
              }}
            />
            <span className="absolute right-1.5 top-0.5 text-xs select-none text-sky-400">
              °
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TextProperty({ label, object, property }: TextPropertyProps) {
  const { setObjectVersion } = useEditor()
  return (
    <div className="flex gap-2">
      <p className="text-nowrap">{label}</p>
      <input
        type="text"
        className='rounded border outline-none px-1 w-full'
        key={object[property]}
        defaultValue={object[property]}
        onBlur={(e) => {
          object[property] = e.target.value
          setObjectVersion((prev) => prev + 1)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            object[property] = e.currentTarget.value
            setObjectVersion((prev) => prev + 1)
          }
        }}
      />
    </div>
  )
}


export function NumberPropInput({ value, action, className }: NumberPropInput) {
  const { setObjectVersion } = useEditor()
  return (
    <input
      type="number"
      className={clsx('rounded border outline-none px-1', className)}
      value={value}
      onChange={(e) => {
        if (!Number.isNaN(e.target.valueAsNumber)) {
          action(e.target.valueAsNumber)
          setObjectVersion((prev) => prev + 1)
        }
      }}
    />
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
      className="flex gap-1 items-center cursor-pointer p-1 rounded bg-zinc-750 hover:bg-zinc-650"
      onClick={action}
    >
      <Icon size={12} />
      <p className="leading-0">{label}</p>
    </button>
  )
}
