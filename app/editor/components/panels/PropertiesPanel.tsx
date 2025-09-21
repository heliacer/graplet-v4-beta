import { useEffect, useState } from 'react'
import { useEditor } from '../../lib/EditorContext'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { Layers2, Trash } from 'lucide-react'

export default function PropertiesPanel() {
  const { objects, currentObject, objectVersion } = useEditor()
  const { deleteObject, duplicateObject } = useObjectActions()
  const obj = objects.current.get(currentObject)

  const [formData, setFormData] = useState({
    name: obj?.name || '',
    positionX: obj?.position.x || 0,
    positionY: obj?.position.y || 0,
    positionZ: obj?.position.z || 0
  })

  useEffect(() => {
    if (obj) {
      setFormData({
        name: obj.name,
        positionX: obj.position.x,
        positionY: obj.position.y,
        positionZ: obj.position.z
      })
    }
  }, [currentObject, obj, objectVersion])

  if (!obj) return <div className="p-1.5 italic">Select an object</div>

  return (
    <div className="p-1.5 flex flex-col gap-2 text-sm">
      <div className="flex gap-2">
        <p className="text-nowrap">Object Name</p>
        <input
          className="rounded border outline-none w-full px-1"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }))
            obj.name = e.target.value
          }}
        />
      </div>
      <div className="flex justify-between">
        <p className="text-nowrap">Position</p>
        <div className="flex gap-1.5">
          <p>X</p>
          <input
            className="rounded border outline-none px-1 w-10"
            type="number"
            name="x"
            value={formData.positionX}
            onChange={(e) => {
              const value = Number(e.target.value)
              setFormData((prev) => ({ ...prev, positionX: value }))
              obj.position.x = value
            }}
          />
          <p>Y</p>
          <input
            className="rounded border outline-none px-1 w-10"
            type="number"
            name="y"
            value={formData.positionY}
            onChange={(e) => {
              const value = Number(e.target.value)
              setFormData((prev) => ({ ...prev, positionY: value }))
              obj.position.y = value
            }}
          />
          <p>Z</p>
          <input
            className="rounded border outline-none px-1 w-10"
            type="number"
            name="z"
            value={formData.positionZ}
            onChange={(e) => {
              const value = Number(e.target.value)
              setFormData((prev) => ({ ...prev, positionZ: value }))
              obj.position.z = value
            }}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="flex gap-1 items-center cursor-pointer"
          onClick={() => deleteObject(currentObject)}
        >
          <Trash size={14} />
          <p>Delete</p>
        </button>
        <button
          className="flex gap-1 items-center cursor-pointer"
          onClick={() => duplicateObject(currentObject)}
        >
          <Layers2 size={14} />
          <p>Duplicate</p>
        </button>
      </div>
    </div>
  )
}
