import clsx from "clsx"
import { useRef, useCallback } from "react"

interface DragNumberInputProps {
  value: number
  onChange: (value: number) => void
  step?: number
  decimals?: number
  dragSpeed?: number
  min?: number
  max?: number
  className?: string
}

export default function DragNumberInput({
  value,
  onChange,
  step = .1,
  decimals = 2,
  dragSpeed = 0.5,
  min = -Infinity,
  max = Infinity,
  className,
}: DragNumberInputProps) {
  const startY = useRef(0)
  const startValue = useRef(0)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const dy = (startY.current - e.clientY) * dragSpeed
      let newValue = startValue.current + dy * step
      newValue = Math.max(min, Math.min(max, newValue))
      onChange(newValue)
    },
    [step, min, max, onChange, dragSpeed]
  )

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }, [handleMouseMove])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      startY.current = e.clientY
      startValue.current = value
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [value, handleMouseMove, handleMouseUp]
  )

  return (
    <input
      type="number"
      className={clsx('cursor-n-resize', className)}
      value={value.toFixed(decimals)}
      onChange={(e) => onChange(Number(e.target.value))}
      onMouseDown={handleMouseDown}
    />
  )
}
