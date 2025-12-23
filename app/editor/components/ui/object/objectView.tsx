import { useEditor } from '@/app/editor/lib/EditorContext'
import { getObjectsByTypes } from '@/app/editor/lib/utils/three'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { Rows2 } from 'lucide-react'
import { useReducer, useState } from 'react'
import {
  Camera,
  CameraHelper,
  DirectionalLightHelper,
  GridHelper,
  Light,
  Object3D,
  Scene
} from 'three'

type HelperActionT = 'gridHelper' | 'cameraHelpers' | 'lightHelpers'

interface HelperAction {
  type: HelperActionT
  scene: Scene
  currentCamera: Camera | null
}
interface HelperState {
  gridHelper: boolean
  cameraHelpers: boolean
  lightHelpers: boolean
}

function toggleCameraHelpers(value: boolean, currentCamera: Camera | null, scene: Scene) {
  const helpers = scene.getObjectsByProperty(
    'type',
    'CameraHelper'
  ) as CameraHelper[]
  const cameras = getObjectsByTypes(scene, [
    'PerspectiveCamera',
    'OrthographicCamera'
  ]) as Camera[]

  for (const helper of helpers) {
    if (helper.camera === currentCamera) {
      helper.visible = false
    } else {
      helper.visible = !value
    }
    /** ignore those who have a helper */
    const index = cameras.indexOf(helper.camera)
    if (index !== -1) cameras.splice(index, 1)
  }

  for (const camera of cameras) {
    /** add new helpers */
    const helper = new CameraHelper(camera)
    helper.name = 'CameraHelper'
    scene.add(helper)
    if (helper.camera === currentCamera) {
      helper.visible = false
    } else {
      helper.visible = !value
    }
  }
}



/** @todo this will look horrible once done, needs some good rearrangement */
function viewReducer(state: HelperState, action: HelperAction) {
  const { type, scene, currentCamera } = action
  const newState = { ...state, [type]: !state[type] }

  switch (type) {
    case 'cameraHelpers': toggleCameraHelpers(state[type], currentCamera, scene)
    case 'gridHelper': {
      const helper = scene.getObjectByProperty('type', 'GridHelper')
      if (helper) {
        helper.visible = !state[type]
      } else {
        const newHelper = new GridHelper()
        newHelper.name = 'GridHelper'
        newHelper.visible = !state[type]
        scene.add(newHelper)
      }
    }
    case 'lightHelpers': {

    }
  }
  return newState
}

/** @todo REVAMP: only make view for selected object -> narrow it down */
export function ObjectView() {
  const { scene, camera, currentObject } = useEditor()
  const [helperMap, setHelperMap] = useState<Map<number, boolean>>(new Map())



  const [helpers, toggleHelper] = useReducer(viewReducer, {
    gridHelper: false,
    cameraHelpers: false,
    lightHelpers: false
  })

  const items: DropdownItemProps[] = [
    {
      label: 'Grid Helper',
      checked: helpers.gridHelper,
      onClick: () => toggleHelper({
        type: 'gridHelper',
        scene: scene.current,
        currentCamera: camera
      })
    },
    {
      label: 'Light Helpers',
      checked: helpers.lightHelpers,
      onClick: () => toggleHelper({
        type: 'lightHelpers',
        scene: scene.current,
        currentCamera: camera
      })
    },
    {
      label: 'Camera Helpers',
      checked: helpers.cameraHelpers,
      onClick: () => toggleHelper({
        type: 'cameraHelpers',
        scene: scene.current,
        currentCamera: camera
      })
    }
  ]

  /** individualisation progress */
  if (currentObject instanceof Camera) {
    console.log('im a cam')
    items.push({
      label: 'Camera Helper',
      checked: helperMap.get(currentObject.id) ?? false,
      onClick: () => {
        const helpers = scene.current.getObjectsByProperty(
          'type',
          'CameraHelper'
        ) as CameraHelper[]
        for (const helper of helpers) {
          if (helper.camera === currentObject) {
            helper.visible = !helper.visible
            return
          }
        }
        const helper = new CameraHelper(currentObject)
        scene.current.add(helper)
        setHelperMap(prev => {
          const newMap = new Map(prev)
          newMap.set(currentObject.id, true)
          return newMap
        })
      }
    })


  }
  if (currentObject instanceof Light) {
    console.log('im a light')
    items.push({
      label: 'Light Helper',
      /** might wanna add */
      checked: (scene.current.getObjectsByProperty('type', 'DirectionalLightHelper') as DirectionalLightHelper[]).some(helper => helper.light === currentObject),
      onClick: () => {



      }
    })
  }

  return <Dropdown Icon={Rows2} label='View' items={items} />
}
