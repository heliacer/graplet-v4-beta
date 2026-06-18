import { PaneItem, renderPaneItem } from '../PaneItem'

export function ObjectPane() {
  /**
   * @todo more serialization!!!!
   * 
   * -> make action registry, so that everything is component level 
   * and here everything is virtual :D
   * 
   * -> action 'orbitCamera'
   * -> action ...
   */


  const items: PaneItem[] = [
    {
      type: 'text',
      label: 'Name',
      property: 'name'
    },
    {
      type: 'vec3',
      label: 'Position',
      property: 'position'
    },
    {
      type: 'vec3angle',
      label: 'Rotation',
      property: 'rotation'
    },
    {
      type: 'vec3',
      label: 'Scale',
      property: 'scale'
    },
    {
      type: 'button',
      label: 'im a button'
    },
    {
      type: 'checkbox',
      label: 'im a checkbox',
    }
  ]

  const panes = items.map(renderPaneItem)
  return <>{...panes}</>
}

/**
 * OLD (kept for camera impl.)
 * 
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

export function ObjectPane() {
  const { canvasRef, orbitMapRef } = useEditorRefs()

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
    const orbit = orbitMapRef.current.get(object.id)


     * @todo (#57) Propertypanel: serialize inputs & panes and allow multiselect
     *
     * Generalise orbit attach / detach, refactor to an util,
     * other one is in applyHelpers in useObjectActions

    const orbitAction = (checked: boolean) => {
      if (checked) {
        if (orbit)
          throw Error(`There already exists an OrbitControls for ${object.id}`)
        const controls = new OrbitControls(object, canvasRef.current)
        controls.mouseButtons = {
          MIDDLE: MOUSE.PAN,
          RIGHT: MOUSE.ROTATE
        }
        orbitMapRef.current.set(object.id, controls)
      } else {
        if (!orbit)
          throw Error(`There's no OrbitControls for object ${object.id}`)
        orbitMapRef.current.delete(object.id)
        orbit.disconnect()
        orbit.dispose()
      }
    }

    return (
      <>
        <BaseObjectProps object={object} />
        <div className='flex gap-2 flex-wrap'>
          <PropButton
            label='Set Active'
            Icon={SwitchCamera}
            onClick={() => setCamera(object)}
          />
          {orbit && (
            <PropButton
              label='Orbit to center'
              Icon={Crosshair}
              onClick={() => orbit.target.set(0, 0, 0)}
            />
          )}
        </div>
        <CheckBoxProperty
          label='Enable OrbitControls'
          checked={!!orbitMapRef.current.get(object.id)}
          onClick={orbitAction}
        />
      </>
    )
  }
  if (object instanceof OrthographicCamera) {
    return <BaseObjectProps object={object} />
  }
  return <p>ObjectPane for {object.name}</p>
}
*/
