import { useEditor } from '@/app/editor/lib/EditorContext'
import { Color, Mesh, Object3D } from 'three'

export default function GeometryProps({ object }: { object: Object3D }) {
  const { setObjectVersion } = useEditor()

  if (object instanceof Mesh) {
    return (
      <>
        <div className='flex justify-between'>
          <p>Color</p>
          <input
            value={`#${object.material.color.getHexString()}`}
            className='w-32 h-6'
            type='color'
            onChange={(e) => {
              object.material.color = new Color(e.target.value)
              setObjectVersion((prev) => prev + 1)
            }}
          />
        </div>
      </>
    )
  }
  return <p>GeometryProps for {object.name}</p>
}
