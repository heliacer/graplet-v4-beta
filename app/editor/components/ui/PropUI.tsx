import clsx, { ClassValue } from 'clsx'
import { LucideIcon } from 'lucide-react'
import { useEditor } from '../../lib/EditorContext'

interface NumberPropInput {
  value: number
  action: (newValue: number) => void
  className?: ClassValue
}

interface StringPropInput {
  value: string
  action: (newValue: string) => void
  className?: ClassValue
}

export function StringPropInput({ value, action, className }: StringPropInput) {
  const { setObjectVersion } = useEditor()
  return (
    <input
      type="text"
      className={clsx('rounded border outline-none px-1', className)}
      key={value}
      defaultValue={value}
      onBlur={(e) => {
        action(e.target.value)
        setObjectVersion((prev) => prev + 1)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          action(e.currentTarget.value)
          setObjectVersion((prev) => prev + 1)
        }
      }}
    />
  )
}

export function NumberPropInput({ value, action, className }: NumberPropInput) {
  /**
   * @todo upgrade state model, it hardcore syncs, which isn't ideal
   *
   * should: const [value, setValue] = useState() // local
   */
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
