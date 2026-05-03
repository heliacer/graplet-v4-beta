import { useEditorRefs } from '@/app/editor/context/editor'
import { useEditorStore } from '@/app/editor/state'
import {
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  MOUSE,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera
} from 'three'
import {
  CheckBoxProperty,
  PropButton,
  TextProperty,
  Vec3AngleProperty,
  Vec3Property
} from '../PropertyInput'
import { Crosshair, SwitchCamera } from 'lucide-react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function BaseObjectProps({ object }: { object: Object3D }) {
  return (
    <>
      <div className='flex justify-between'>
        <p>Type</p>
        <div className='w-32 flex justify-between'>
          <em>{object.type}</em>
          <p className='text-ui-400'>{object.id}</p>
        </div>
      </div>
      <TextProperty label='Name' object={object} property='name' />
      <Vec3Property label='Position' object={object} property='position' />
      <Vec3AngleProperty label='Rotation' object={object} property='rotation' />
      <Vec3Property label='Scale' object={object} property='scale' />
    </>
  )
}

export function ObjectPane({ object }: { object: Object3D }) {
  const { canvas, orbitMap } = useEditorRefs()
  const invalidateObject = useEditorStore(s => s.invalidateObject)
  const setCamera = useEditorStore(s => s.setCamera)

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
    const orbit = orbitMap.current.get(object.id)

    /**
     * @todo (#57) Propertypanel: serialize inputs & panes and allow multiselect
     *
     * Generalise orbit attach / detach, refactor to an util,
     * other one is in applyHelpers in useObjectActions
     */
    const orbitAction = (checked: boolean) => {
      if (checked) {
        if (orbit)
          throw Error(`There already exists an OrbitControls for ${object.id}`)
        const controls = new OrbitControls(object, canvas.current)
        controls.mouseButtons = {
          MIDDLE: MOUSE.PAN,
          RIGHT: MOUSE.ROTATE
        }
        orbitMap.current.set(object.id, controls)
      } else {
        if (!orbit)
          throw Error(`There's no OrbitControls for object ${object.id}`)
        orbitMap.current.delete(object.id)
        orbit.disconnect()
        orbit.dispose()
      }
      invalidateObject(object)
    }

    return (
      <>
        <BaseObjectProps object={object} />
        <div className='flex gap-2 flex-wrap'>
          <PropButton
            label='Set Active'
            Icon={SwitchCamera}
            action={() => setCamera(object)}
          />
          {orbit && (
            <PropButton
              label='Orbit to center'
              Icon={Crosshair}
              action={() => orbit.target.set(0, 0, 0)}
            />
          )}
        </div>
        <CheckBoxProperty
          label='Enable OrbitControls'
          checked={!!orbitMap.current.get(object.id)}
          action={orbitAction}
        />
      </>
    )
  }
  if (object instanceof OrthographicCamera) {
    return <BaseObjectProps object={object} />
  }
  return <p>ObjectPane for {object.name}</p>
}
