import { useState } from 'react'
import { Color, Mesh, MeshStandardMaterial } from 'three'

/**
 * @todo (#57) Propertypanel: serialize inputs & panes and allow multiselect
 *
 * Every piece of editing UI needs to have proper config path,
 * so that every single material type is supported with it's proper inputs.
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
        onChange={e => {
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

export function MaterialPane() {
  if (object instanceof Mesh) {
    return <MeshMaterialPane mesh={object} />
  }

  return <p>MaterialPane for {object.name}</p>
}
