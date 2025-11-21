import { useEditor } from '../../lib/EditorContext'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { Layers2, Orbit, SwitchCamera, Trash } from 'lucide-react'
import { OrthographicCamera, PerspectiveCamera } from 'three'
import {
  PropButton,
  TextProperty,
  Vec3AngleProperty,
  Vec3Property
} from '../ui/PropertyInput'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

/** @todo update: this is actually starting to get peak, need to have dynamic props for each object tho */
export default function PropertiesPanel() {
  const { currentObject, canvas, setCamera, orbitMap } = useEditor()
  const { deleteObject, duplicateObject } = useObjectActions()

  if (!currentObject) return

  return (
    <div className="p-1.5 flex flex-col gap-2 text-xs">
      <TextProperty
        label='Object Name'
        object={currentObject}
        property='name'
      />
      <Vec3Property
        label='Position'
        object={currentObject}
        property='position'
      />
      <Vec3AngleProperty
        label='Rotation'
        object={currentObject}
        property='rotation'
      />
      <Vec3Property
        label='Scale'
        object={currentObject}
        property='scale'
      />

      {/* this needs some work */}
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
