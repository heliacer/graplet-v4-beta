import { useState } from 'react'
import { Color, Mesh, MeshStandardMaterial, Object3D } from 'three'

/**
 * @todo Chosen approach: wildcard, include all materials, just like in three.js editor
 * (they have separate files for each mat/geometry props)
 */

function MeshStandardMaterialPane({
  material
}: {
  material: MeshStandardMaterial
}) {
  const [color, setColor] = useState<string>(
    `#${material.color.getHexString()}`
  )

  return (
    <div className='flex justify-between'>
      <p>Color</p>
      <input
        id={`color-${material.uuid}`}
        value={color}
        className='w-32 h-6'
        type='color'
        onChange={(e) => {
          const newColor = e.target.value
          setColor(newColor)
          material.color = new Color(newColor)
        }}
      />
    </div>
  )
}

function MeshMaterialPane({ mesh }: { mesh: Mesh }) {
  if (Array.isArray(mesh.material)) {
    return <p>Mesh Material[] not yet supported</p>
  }

  if (mesh.material instanceof MeshStandardMaterial) {
    return <MeshStandardMaterialPane material={mesh.material} />
  }

  return <p>Unsupported Mesh Material type: {mesh.material.type}</p>
}

export function MaterialPane({ object }: { object: Object3D }) {
  if (object instanceof Mesh) {
    return <MeshMaterialPane mesh={object} />
  }

  return <p>MaterialPane for {object.name}</p>
}
