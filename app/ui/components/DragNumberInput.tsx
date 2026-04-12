import clsx from 'clsx'
import { useRef, useCallback, useEffect, useState } from 'react'

interface DragNumberInputProps {
  value: number
  onChange: (value: number) => void
  onCommit?: () => void
  step?: number
  decimals?: number
  dragSpeed?: number
  min?: number
  max?: number
  className?: string
  title?: string
}

const DRAG_THRESHOLD = 3

export function DragNumberInput({
  value,
  onChange,
  onCommit,
  step = 0.1,
  decimals = 2,
  dragSpeed = 0.5,
  min = -Infinity,
  max = Infinity,
  className,
  title
}: DragNumberInputProps) {
  const [localText, setLocalText] = useState(() => value.toFixed(decimals))
  const [isEditing, setIsEditing] = useState(false)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startValue = useRef(0)
  const lastValue = useRef(value)

  useEffect(() => {
    if (!isEditing && !isDragging.current) {
      setLocalText(value.toFixed(decimals))
      lastValue.current = value
    }
  }, [value, decimals, isEditing])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const dy = (startY.current - e.clientY) * dragSpeed
      let newValue = startValue.current + dy * step
      newValue = Math.round(newValue / step) * step
      newValue = Math.max(min, Math.min(max, newValue))
      const factor = Math.pow(10, decimals)
      const normalised = Math.round(newValue * factor) / factor
      if (normalised !== lastValue.current) {
        lastValue.current = normalised
        onChange(normalised)
        setLocalText(normalised.toFixed(decimals))
      }
    },
    [step, min, max, onChange, dragSpeed, decimals]
  )

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.userSelect = ''
    if (isDragging.current) {
      isDragging.current = false
      onCommit?.()
    }
  }, [handleMouseMove, onCommit])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      if (isEditing) return

      startY.current = e.clientY
      startValue.current = value

      const onThresholdMove = (moveEvent: MouseEvent) => {
        if (Math.abs(moveEvent.clientY - startY.current) > DRAG_THRESHOLD) {
          isDragging.current = true
          document.body.style.userSelect = 'none'
          document.removeEventListener('mousemove', onThresholdMove)
          document.removeEventListener('mouseup', onThresholdCancel)
          document.addEventListener('mousemove', handleMouseMove)
          document.addEventListener('mouseup', handleMouseUp)
        }
      }

      const onThresholdCancel = () => {
        document.removeEventListener('mousemove', onThresholdMove)
        document.removeEventListener('mouseup', onThresholdCancel)
      }

      document.addEventListener('mousemove', onThresholdMove)
      document.addEventListener('mouseup', onThresholdCancel)
    },
    [value, handleMouseMove, handleMouseUp, isEditing]
  )

  const tryCommitText = useCallback(() => {
    const parsed = parseFloat(localText)
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed))
      const factor = Math.pow(10, decimals)
      const normalised = Math.round(clamped * factor) / factor
      onChange(normalised)
      onCommit?.()
      setLocalText(normalised.toFixed(decimals))
    } else {
      setLocalText(value.toFixed(decimals))
    }
    setIsEditing(false)
  }, [localText, min, max, decimals, onChange, onCommit, value])

  return (
    <input
      type='text'
      inputMode='numeric'
      title={title}
      className={clsx('cursor-n-resize', className)}
      value={localText}
      onMouseDown={handleMouseDown}
      onFocus={() => {
        setIsEditing(true)
        setLocalText(value.toFixed(decimals))
      }}
      onChange={e => setLocalText(e.target.value)}
      onBlur={tryCommitText}
      onKeyDown={e => {
        if (e.key === 'Enter') e.currentTarget.blur()
        if (e.key === 'Escape') {
          setLocalText(value.toFixed(decimals))
          setIsEditing(false)
          e.currentTarget.blur()
        }
      }}
    />
  )
}
