import { useEditor } from '@/app/editor/lib/EditorContext'
import { getObjectsByTypes } from '@/app/editor/lib/utils/three'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { Rows2 } from 'lucide-react'
import { useReducer } from 'react'
import {
  Camera,
  CameraHelper,
  OrthographicCamera,
  PerspectiveCamera,
  Scene
} from 'three'

type HelperActionT = 'gridHelper' | 'cameraHelpers' | 'lightHelpers'

interface HelperAction {
  type: HelperActionT
  scene: Scene
  camera: PerspectiveCamera | OrthographicCamera | null
}
interface HelperState {
  gridHelper: boolean
  cameraHelpers: boolean
  lightHelpers: boolean
}

/** @todo this will look horrible once done, needs some good rearrangement */
function viewReducer(state: HelperState, action: HelperAction) {
  const { type, scene, camera } = action
  const newState = { ...state, [type]: !state[type] }

  if (!state[type]) {
    /** Enable Helper */
    switch (type) {
      case 'cameraHelpers': {
        const helpers = scene.getObjectsByProperty(
          'type',
          'CameraHelper'
        ) as CameraHelper[]
        const cameras = getObjectsByTypes(scene, [
          'PerspectiveCamera',
          'OrthographicCamera'
        ]) as Camera[]

        /** ignore cameras that already have a helper */
        for (const helper of helpers) {
          if (helper.camera !== camera) {
            helper.visible = true
          }
          const index = cameras.indexOf(helper.camera)
          if (index !== -1) cameras.splice(index, 1)
        }

        console.log('cameras returned:', cameras)

        /** add new helpers if needed */
        for (const camera of cameras) {
          const helper = new CameraHelper(camera)
          scene.add(helper)
          if (camera) {
            helper.visible = false
          }
        }
      }
      case 'gridHelper': {
      }
      case 'lightHelpers': {
      }
    }
    console.log(`${action.type} has been enabled`)
  } else {
    /** Disable Helper */

    console.log(`${action.type} has been disabled`)
  }
  return newState
}

export function ObjectView() {
  const { scene, camera } = useEditor()

  const [helpers, toggleHelper] = useReducer(viewReducer, {
    gridHelper: false,
    cameraHelpers: false,
    lightHelpers: false
  })

  const items: DropdownItemProps[] = [
    {
      label: 'Grid Helper',
      checked: helpers.gridHelper,
      onClick: () =>
        toggleHelper({ type: 'gridHelper', scene: scene.current, camera })
    },
    {
      label: 'Light Helper',
      checked: helpers.lightHelpers,
      onClick: () =>
        toggleHelper({ type: 'lightHelpers', scene: scene.current, camera })
    },
    {
      label: 'Camera Helpers',
      checked: helpers.cameraHelpers,
      onClick: () =>
        toggleHelper({ type: 'cameraHelpers', scene: scene.current, camera })
    }
  ]

  return <Dropdown Icon={Rows2} label='View' items={items} />
}
