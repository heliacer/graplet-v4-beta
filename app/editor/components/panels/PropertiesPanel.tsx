import { useEditor } from '../../lib/EditorContext'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { Layers2, Orbit, SwitchCamera, Trash } from 'lucide-react'
import { OrthographicCamera, PerspectiveCamera } from 'three'
import {
  NumberPropInput,
  PropButton,
  StringPropInput
} from '../ui/PropertyInput'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

/** @todo make this better, this sucks */
/** @todo update, this got a little better (made components) but got worse (added more shit) */
export default function PropertiesPanel() {
  const { currentObject, canvas, setCamera, orbitMap } = useEditor()
  const { deleteObject, duplicateObject } = useObjectActions()

  if (!currentObject) return

  /** future structure for transform tab */
  switch (currentObject.type) {
    case 'Group': {
      // <BaseTransform/>
    }
    case 'Mesh': {

    }
    case 'DirectionalLight': {

    }
    case 'AmbientLight': {

    }
    case 'PerspectiveCamera': {

    }
    case 'OrthographicCamera': {

    }
  }

  return (
    <div className="p-1.5 flex flex-col gap-2 text-xs">
      <div className="flex gap-2">
        <p className="text-nowrap">Object Name</p>
        <StringPropInput
          value={currentObject.name}
          action={(newValue) => (currentObject.name = newValue)}
          className="w-full"
        />
      </div>

      <div className="flex justify-between">
        <p className="text-nowrap">Position</p>
        <div className="flex gap-1.5">
          <NumberPropInput
            value={currentObject.position.x}
            action={(newValue) => (currentObject.position.x = newValue)}
            className="text-teal-500 text-center w-8 overflow-ellipsis"
          />
          <NumberPropInput
            value={currentObject.position.y}
            action={(newValue) => (currentObject.position.y = newValue)}
            className="text-teal-500 text-center w-8 overflow-ellipsis"
          />
          <NumberPropInput
            value={currentObject.position.z}
            action={(newValue) => (currentObject.position.z = newValue)}
            className="text-teal-500 text-center w-8 overflow-ellipsis"
          />
        </div>
      </div>

      {/** @todo make separate row for each value, also include mode (euler) + separate <Vec3RowInput label vec3> */}
      <div className="flex justify-between">
        <p className="text-nowrap">Rotation °</p>
        <div className="flex gap-1.5">
          <NumberPropInput
            value={(currentObject.rotation.x * 180) / Math.PI}
            action={(newValue) =>
              (currentObject.rotation.x = (newValue * Math.PI) / 180)
            }
            className="text-teal-500 text-center w-8 overflow-ellipsis"
          />
          <NumberPropInput
            value={(currentObject.rotation.y * 180) / Math.PI}
            action={(newValue) =>
              (currentObject.rotation.y = (newValue * Math.PI) / 180)
            }
            className="text-teal-500 text-center w-8 overflow-ellipsis"
          />
          <NumberPropInput
            value={(currentObject.rotation.z * 180) / Math.PI}
            action={(newValue) =>
              (currentObject.rotation.z = (newValue * Math.PI) / 180)
            }
            className="text-teal-500 text-center w-8 overflow-ellipsis"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <p className="text-nowrap">Scale</p>
        <div className="flex gap-1.5">
          <NumberPropInput
            value={currentObject.scale.x}
            action={(newValue) => (currentObject.scale.x = newValue)}
            className="text-teal-500 text-center w-8 overflow-ellipsis"
          />
          <NumberPropInput
            value={currentObject.scale.y}
            action={(newValue) => (currentObject.scale.y = newValue)}
            className="text-teal-500 text-center w-8 overflow-ellipsis"
          />
          <NumberPropInput
            value={currentObject.scale.z}
            action={(newValue) => (currentObject.scale.z = newValue)}
            className="text-teal-500 text-center w-8 overflow-ellipsis"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <PropButton
          label="Delete"
          Icon={Trash}
          action={() => deleteObject(currentObject)}
        />
        <PropButton
          label="Duplicate"
          Icon={Layers2}
          action={() => duplicateObject(currentObject)}
        />
        {(currentObject instanceof PerspectiveCamera ||
          currentObject instanceof OrthographicCamera) && (
            <>
              <PropButton
                label="Set Active"
                Icon={SwitchCamera}
                action={() => setCamera(currentObject)}
              />
              <PropButton
                label="Set Orbit"
                Icon={Orbit}
                action={() => {
                  // kinda stupid, really need checkbox for this
                  orbitMap.current.set(currentObject.id, new OrbitControls(currentObject, canvas.current))
                }}
              />
            </>
          )}
      </div>
    </div>
  )
}
