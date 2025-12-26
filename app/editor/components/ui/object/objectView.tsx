import { useEditor } from '@/app/editor/lib/EditorContext'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { Rows2 } from 'lucide-react'
import React, { useState } from 'react'
import {
  Camera,
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  Object3D,
  Scene
} from 'three'

function toggleHelper(
  type: 'CameraHelper' | 'DirectionalLightHelper',
  object: Object3D,
  scene: Scene,
  factory: (object: Object3D) => Object3D,
  compare: (helper: Object3D, object: Object3D) => boolean,
  setHelpers: React.Dispatch<React.SetStateAction<Map<number, boolean>>>
) {
  const helpers = scene.getObjectsByProperty('type', type) as CameraHelper[]
  const existing = helpers.find((h) => compare(h, object))

  if (existing) {
    const toggled = !existing.visible
    existing.visible = toggled
    setHelpers((prev) => new Map(prev).set(object.id, toggled))
  } else {
    const helper = factory(object)
    helper.name = type
    scene.add(helper)
    setHelpers((prev) => new Map(prev).set(object.id, true))
  }
}

export function ObjectView() {
  const { scene, currentObject } = useEditor()

  /** Helpers, some of them maps for helper n - object 1 */
  const [gridHelper, setGridHelper] = useState<boolean>(true)

  /** @todo could probably merge to one helpers, setHelpers */
  const [cameraHelpers, setCameraHelpers] = useState(new Map<number, boolean>())
  const [lightHelpers, setLightHelpers] = useState(new Map<number, boolean>())

  const items: DropdownItemProps[] = [
    {
      label: 'Grid Helper',
      checked: gridHelper,
      onClick: () => {
        const helper = scene.current.getObjectByProperty('type', 'GridHelper')
        console.log(helper)
        if (!helper) throw Error('Grid Helper does not exist')
        helper.visible = !gridHelper
        setGridHelper((prev) => !prev)
      }
    }
  ]

  if (currentObject instanceof Camera) {
    items.push({
      label: 'Camera Helper',
      checked:
        cameraHelpers.get(currentObject.id) ??
        scene.current
          .getObjectsByProperty('type', 'CameraHelper')
          .some((helper) => (helper as CameraHelper).camera === currentObject),
      onClick: () =>
        toggleHelper(
          'CameraHelper',
          currentObject,
          scene.current,
          (camera) => new CameraHelper(camera as Camera),
          (helper, camera) => (helper as CameraHelper).camera === camera,
          setCameraHelpers
        )
    })
  }
  if (currentObject instanceof DirectionalLight) {
    items.push({
      label: 'Light Helper',
      checked:
        lightHelpers.get(currentObject.id) ??
        scene.current
          .getObjectsByProperty('type', 'DirectionalLightHelper')
          .some(
            (helper) =>
              (helper as DirectionalLightHelper).light === currentObject
          ),
      onClick: () =>
        toggleHelper(
          'DirectionalLightHelper',
          currentObject,
          scene.current,
          (light) => new DirectionalLightHelper(light as DirectionalLight),
          (helper, light) => (helper as DirectionalLightHelper).light === light,
          setLightHelpers
        )
    })
  }

  return <Dropdown Icon={Rows2} label='View' items={items} />
}
