import { useEditorRefs } from '@/app/editor/lib/context'
import { useCurrentObject } from '@/app/editor/lib/hooks/useCurrentObject'
import { StateFunc } from '@/app/editor/lib/types'
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
  setHelpers: StateFunc<Map<number, boolean>>
) {
  const helpers = scene.getObjectsByProperty('type', type) as CameraHelper[]
  const existing = helpers.find(h => compare(h, object))

  if (existing) {
    const toggled = !existing.visible
    existing.visible = toggled
    setHelpers(prev => new Map(prev).set(object.id, toggled))
  } else {
    const helper = factory(object)
    helper.name = type
    scene.add(helper)
    setHelpers(prev => new Map(prev).set(object.id, true))
  }
}

export function ObjectView() {
  const { scene } = useEditorRefs()
  const object = useCurrentObject()

  /** Helpers, some of them maps for helper n - object 1 */
  const [gridHelper, setGridHelper] = useState<boolean>(true)

  /**
   * @todo Revamp how objects are bound to its helpers, register them in one Map<Object, Helper>
   * and set them global in context -> only gets the helper for the object needed, only one item handling it (Local Helper)
   */
  const [cameraHelpers, setCameraHelpers] = useState(new Map<number, boolean>())
  const [lightHelpers, setLightHelpers] = useState(new Map<number, boolean>())

  const items: DropdownItemProps[] = [
    {
      label: 'Grid Helper',
      checked: gridHelper,
      onClick: () => {
        const helper = scene.current.getObjectByProperty('type', 'GridHelper')
        if (!helper) throw Error('Grid Helper does not exist')
        helper.visible = !gridHelper
        setGridHelper(prev => !prev)
      }
    }
  ]

  if (object instanceof Camera) {
    items.push({
      label: 'Camera Helper',
      checked:
        cameraHelpers.get(object.id) ??
        scene.current
          .getObjectsByProperty('type', 'CameraHelper')
          .some(helper => (helper as CameraHelper).camera === object),
      onClick: () =>
        toggleHelper(
          'CameraHelper',
          object,
          scene.current,
          camera => new CameraHelper(camera as Camera),
          (helper, camera) => (helper as CameraHelper).camera === camera,
          setCameraHelpers
        )
    })
  }
  if (object instanceof DirectionalLight) {
    items.push({
      label: 'Light Helper',
      checked:
        lightHelpers.get(object.id) ??
        scene.current
          .getObjectsByProperty('type', 'DirectionalLightHelper')
          .some(helper => (helper as DirectionalLightHelper).light === object),
      onClick: () =>
        toggleHelper(
          'DirectionalLightHelper',
          object,
          scene.current,
          light => new DirectionalLightHelper(light as DirectionalLight),
          (helper, light) => (helper as DirectionalLightHelper).light === light,
          setLightHelpers
        )
    })
  }

  /**
   * @todo Add new categories:
   *
   * Cameras > Enable all helpers | Disable all helpers
   * Lights > Enable all helpers | Disable all helpers
   *
   * Local Helper (Camera | DirectionalLight)
   */

  return <Dropdown Icon={Rows2} label='View' items={items} />
}
