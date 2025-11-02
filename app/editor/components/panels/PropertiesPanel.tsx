import { useEffect, useState } from 'react'
import { useEditor } from '../../lib/EditorContext'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { Layers2, Orbit, SwitchCamera, Trash } from 'lucide-react'
import { Camera, OrthographicCamera, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

/** @todo make this better, this sucks */
export default function PropertiesPanel() {
  const {
    currentObject,
    objectVersion,
    setObjectVersion,
    setCamera,
    orbitControls
  } = useEditor()
  const { deleteObject, duplicateObject } = useObjectActions()

  const [formData, setFormData] = useState({
    name: currentObject?.name || '',
    positionX: currentObject?.position.x || 0,
    positionY: currentObject?.position.y || 0,
    positionZ: currentObject?.position.z || 0
  })

  useEffect(() => {
    if (currentObject) {
      setFormData({
        name: currentObject.name,
        positionX: currentObject.position.x,
        positionY: currentObject.position.y,
        positionZ: currentObject.position.z
      })
    }
  }, [currentObject, objectVersion])

  if (!currentObject) return

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
          }}
          onBlur={() => {
            if (formData.name) {
              currentObject.name = formData.name
            }
            setObjectVersion((prev) => prev + 1)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (formData.name) {
                currentObject.name = formData.name
                event.currentTarget.blur()
              }
              setObjectVersion((prev) => prev + 1)
            }
          }}
        />
      </div>
      <div className="flex justify-between">
        <p className="text-nowrap">Position</p>
        <div className="flex gap-1.5 text-xs">
          <input
            className="text-teal-500 text-center rounded border outline-none px-1 w-8 overflow-ellipsis"
            type="number"
            name="x"
            value={formData.positionX}
            onChange={(e) => {
              const value = Number(e.target.value)
              setFormData((prev) => ({ ...prev, positionX: value }))
              currentObject.position.x = value
            }}
          />
          <input
            className="text-teal-500 text-center rounded border outline-none px-1 w-8"
            type="number"
            name="y"
            value={formData.positionY}
            onChange={(e) => {
              const value = Number(e.target.value)
              setFormData((prev) => ({ ...prev, positionY: value }))
              currentObject.position.y = value
            }}
          />
          <input
            className="text-teal-500 text-center rounded border outline-none px-1 w-8"
            type="number"
            name="z"
            value={formData.positionZ}
            onChange={(e) => {
              const value = Number(e.target.value)
              setFormData((prev) => ({ ...prev, positionZ: value }))
              currentObject.position.z = value
            }}
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          className="flex gap-1 items-center cursor-pointer p-1 rounded bg-zinc-750 hover:bg-zinc-650"
          onClick={() => deleteObject(currentObject)}
        >
          <Trash size={14} />
          <p className="leading-0">Delete</p>
        </button>
        <button
          className="flex gap-1 items-center cursor-pointer p-1 rounded bg-zinc-750 hover:bg-zinc-650"
          onClick={() => duplicateObject(currentObject)}
        >
          <Layers2 size={14} />
          <p className="leading-0">Duplicate</p>
        </button>
        {(currentObject instanceof PerspectiveCamera ||
          currentObject instanceof OrthographicCamera) && (
          <>
            <button
              className="flex wrap gap-1 items-center p-1 rounded bg-zinc-750 cursor-pointer hover:bg-zinc-650"
              onClick={() => {
                setCamera(currentObject)
              }}
            >
              <SwitchCamera size={14} />
              <p className="leading-0">Set</p>
            </button>
            <button
              className="flex wrap gap-1 items-center p-1 rounded bg-zinc-750 cursor-pointer hover:bg-zinc-650"
              onClick={() =>
                (orbitControls.current = new OrbitControls(currentObject))
              }
            >
              <Orbit size={14} />
              <p className="leading-0">Attach</p>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
