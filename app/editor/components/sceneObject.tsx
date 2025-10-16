import { Object3D } from 'three'
import { useState } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'

export default function SceneObject({
  object,
  onSelect = () => {},
  onDeselect = () => {}
}: {
  object: Object3D
  onSelect?: (object: Object3D) => void
  onDeselect?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  return (
    <primitive
      object={object}
      onClick={(e: ThreeEvent<MouseEvent>) => (
        e.stopPropagation(),
        onSelect(object)
      )}
      onPointerMissed={(e: MouseEvent) => e.type === 'click' && onDeselect()}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => (
        e.stopPropagation(),
        setHovered(true)
      )}
      onPointerOut={() => setHovered(false)}
    />
  )
}
