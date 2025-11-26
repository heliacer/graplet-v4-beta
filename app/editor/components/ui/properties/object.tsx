import {
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera
} from 'three'
import {
  PropButton,
  TextProperty,
  Vec3AngleProperty,
  Vec3Property
} from '../PropertyInput'
import { Layers2, Orbit, SwitchCamera, Trash } from 'lucide-react'
import { useObjectActions } from '@/app/editor/lib/hooks/useObjectActions'
import { useEditor } from '@/app/editor/lib/EditorContext'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

function BaseObjectProps({ object }: { object: Object3D }) {
  const { deleteObject, duplicateObject } = useObjectActions()

  return (
    <>
      <TextProperty label="Object Name" object={object} property="name" />
      <Vec3Property label="Position" object={object} property="position" />
      <Vec3AngleProperty label="Rotation" object={object} property="rotation" />
      <Vec3Property label="Scale" object={object} property="scale" />
      {/* not a fan of this, under airstrike watchlist */}
      <div className="flex gap-2 flex-wrap">
        <PropButton
          label="Delete this"
          Icon={Trash}
          action={() => deleteObject(object)}
        />
        <PropButton
          label="Duplicate this"
          Icon={Layers2}
          action={() => duplicateObject(object)}
        />
      </div>
    </>
  )
}

export default function ObjectProps({ object }: { object: Object3D }) {
  const { canvas, setCamera, orbitMap, setObjectVersion } = useEditor()

  if (object instanceof Group) {
    return <BaseObjectProps object={object} />
  }
  if (object instanceof Mesh) {
    return <BaseObjectProps object={object} />
  }
  if (object instanceof AmbientLight) {
    return <BaseObjectProps object={object} />
  }
  if (object instanceof DirectionalLight) {
    return <BaseObjectProps object={object} />
  }
  if (object instanceof PerspectiveCamera) {
    return (
      <>
        <BaseObjectProps object={object} />
        <div className="flex gap-2 flex-wrap">
          <PropButton
            label="Set Active"
            Icon={SwitchCamera}
            action={() => setCamera(object)}
          />
        </div>
        <div className='flex gap-2'>
          <label
            className='cursor-pointer select-none'
            htmlFor='orbit'
          >
            Enable OrbitControls
          </label>
          <input
            /** need to make a custom checkbox, this won't cut it */
            className='cursor-pointer accent-teal-600'
            type='checkbox'
            id='orbit'
            checked={!!orbitMap.current.get(object.id)}
            onChange={(e) => {
              if (e.target.checked) {
                const orbit = orbitMap.current.get(object.id)
                if (orbit) throw Error(`There already exists an OrbitControls for ${object.id}`)
                orbitMap.current.set(
                  object.id,
                  new OrbitControls(object, canvas.current)
                )
              } else {
                const orbit = orbitMap.current.get(object.id)
                if (!orbit) throw Error(`There's no OrbitControls for object ${object.id}`)
                orbit.disconnect()
                orbit.dispose()
                orbitMap.current.delete(object.id)
              }
              setObjectVersion(prev => prev + 1)
            }}
          />
        </div>
        {/* ... more orbit props */}
      </>
    )
  }
  if (object instanceof OrthographicCamera) {
    return <BaseObjectProps object={object} />
  }
}
