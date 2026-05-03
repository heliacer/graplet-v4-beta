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
  const inputRef = useRef<HTMLInputElement>(null)
  const isDragging = useRef(false)
  const isEditing = useRef(false)
  const startY = useRef(0)
  const startValue = useRef(0)
  const lastValue = useRef(value)
  const currentValue = useRef(value)

  useEffect(() => {
    currentValue.current = value
    if (!isEditing.current && !isDragging.current) {
      setLocalText(value.toFixed(decimals))
      lastValue.current = value
    }
  }, [value, decimals])

  const clampNormalise = (v: number) => {
    const factor = Math.pow(10, decimals)
    return Math.round(Math.max(min, Math.min(max, v)) * factor) / factor
  }

  const update = (v: number) => {
    const normalised = clampNormalise(v)
    onChange(normalised)
    setLocalText(normalised.toFixed(decimals))
    lastValue.current = normalised
    currentValue.current = normalised
  }

  const commit = (v: number) => {
    update(v)
    onCommit?.()
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const dy = (startY.current - e.clientY) * dragSpeed
      const normalised = clampNormalise(
        Math.round((startValue.current + dy * step) / step) * step
      )
      if (normalised !== lastValue.current) {
        lastValue.current = normalised
        currentValue.current = normalised
        onChange(normalised)
        setLocalText(normalised.toFixed(decimals))
      }
    },
    [step, min, max, onChange, clampNormalise, dragSpeed, decimals]
  )

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.userSelect = ''
    if (isDragging.current) {
      isDragging.current = false
      inputRef.current?.blur()
      onCommit?.()
    }
  }, [handleMouseMove, onCommit])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      if (isEditing.current) return
      startY.current = e.clientY
      startValue.current = currentValue.current

      const onMove = (moveEvent: MouseEvent) => {
        if (Math.abs(moveEvent.clientY - startY.current) > DRAG_THRESHOLD) {
          isDragging.current = true
          document.body.style.userSelect = 'none'
          document.removeEventListener('mousemove', onMove)
          document.removeEventListener('mouseup', onCancel)
          document.addEventListener('mousemove', handleMouseMove)
          document.addEventListener('mouseup', handleMouseUp)
        }
      }
      const onCancel = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onCancel)
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onCancel)
    },
    [handleMouseMove, handleMouseUp]
  )

  return (
    <input
      ref={inputRef}
      type='text'
      inputMode='numeric'
      title={title}
      className={clsx('cursor-n-resize', className)}
      value={localText}
      onMouseDown={handleMouseDown}
      onFocus={() => {
        isEditing.current = true
        setLocalText(currentValue.current.toFixed(decimals))
      }}
      onChange={e => setLocalText(e.target.value)}
      onBlur={() => {
        const parsed = parseFloat(localText)
        commit(!isNaN(parsed) ? parsed : currentValue.current)
        isEditing.current = false
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') e.currentTarget.blur()
        if (e.key === 'Escape') {
          setLocalText(currentValue.current.toFixed(decimals))
          isEditing.current = false
          e.currentTarget.blur()
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault()
          update(currentValue.current + (e.key === 'ArrowUp' ? step : -step))
        }
      }}
    />
  )
}
