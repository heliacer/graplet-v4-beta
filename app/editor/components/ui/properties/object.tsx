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
  const { canvas, setCamera, orbitMap } = useEditor()

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
        <div className='flex gap-2'>
          <label className='cursor-pointer select-none' htmlFor='orbit'>OrbitControls</label>
          <input className='cursor-pointer accent-teal-600' type='checkbox' id='orbit' />
        </div>
        <div className="flex gap-2 flex-wrap">
          <PropButton
            label="Set Active"
            Icon={SwitchCamera}
            action={() => setCamera(object)}
          />
          <PropButton
            /** @todo this needs to be a checkbox, not a button */
            label="Set Orbit"
            Icon={Orbit}
            action={() => {
              if (!orbitMap.current.get(object.id)) {
                orbitMap.current.set(
                  object.id,
                  new OrbitControls(object, canvas.current)
                )
              }
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
