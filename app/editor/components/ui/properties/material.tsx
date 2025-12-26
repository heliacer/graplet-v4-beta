import { useState } from 'react'
import { Color, Mesh, MeshStandardMaterial, Object3D } from 'three'

/**
 * @todo
 *
 * this approach includes a go-for-all-approach, what I mean with that is,
 * that every single Material, in every single possibility is covered. That is good,
 * but there's not really a dynamic. some props will be repeated, e.g color obviously exists
 * both on standardmaterial and meshtoonmaterial for example. we need to find a solution to "wildcard"
 * add all props that one instance has, like "interpret" all props and handle each prop, not each instance
 * */

function MeshStandardMaterialProps({
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

function MeshMaterialProps({ mesh }: { mesh: Mesh }) {
  if (Array.isArray(mesh.material)) {
    return <p>Multiple materials not yet supported</p>
  }

  if (mesh.material instanceof MeshStandardMaterial) {
    return <MeshStandardMaterialProps material={mesh.material} />
  }

  return <p>Unsupported material type: {mesh.material.type}</p>
}

export default function MaterialProps({ object }: { object: Object3D }) {
  if (object instanceof Mesh) {
    return <MeshMaterialProps mesh={object} />
  }

  return <p>MaterialProps for {object.name}</p>
}
