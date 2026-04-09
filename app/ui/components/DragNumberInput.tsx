import clsx from 'clsx'
import { useRef, useCallback, useEffect } from 'react'

interface DragNumberInputProps {
  value: number
  onChange: (value: number) => void
  step?: number
  decimals?: number
  dragSpeed?: number
  min?: number
  max?: number
  className?: string
  title?: string
}

/**
 * Draggable "Slider" number input (similar to three.js editor)
 *
 * @todo Support horizontal sliding
 */
export function DragNumberInput({
  value,
  onChange,
  step = 0.1,
  decimals = 2,
  dragSpeed = 0.5,
  min = -Infinity,
  max = Infinity,
  className,
  title
}: DragNumberInputProps) {
  const startY = useRef(0)
  const startValue = useRef(0)
  const lastValue = useRef(value)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const dy = (startY.current - e.clientY) * dragSpeed

      let newValue = startValue.current + dy * step
      newValue = Math.round(newValue / step) * step
      newValue = Math.max(min, Math.min(max, newValue))

      const factor = Math.pow(10, decimals)
      const normalizedNew = Math.round(newValue * factor) / factor

      if (normalizedNew !== lastValue.current) {
        lastValue.current = normalizedNew
        onChange(normalizedNew)
      }
    },
    [step, min, max, onChange, dragSpeed, decimals]
  )

  useEffect(() => {
    lastValue.current = value
  }, [value])

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      startY.current = e.clientY
      startValue.current = value
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [value, handleMouseMove, handleMouseUp]
  )

  return (
    <input
      type='number'
      title={title}
      className={clsx('cursor-n-resize', className)}
      value={value.toFixed(decimals)}
      onChange={e => onChange(Number(e.target.value))}
      onMouseDown={handleMouseDown}
    />
  )
}
