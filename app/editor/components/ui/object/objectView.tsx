import { useEditor } from '@/app/editor/lib/EditorContext'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { Rows2 } from 'lucide-react'
import { useState } from 'react'
import {
  Camera,
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper
} from 'three'

export function ObjectView() {
  const { scene, currentObject } = useEditor()

  const [helperMap, setHelperMap] = useState<Map<number, boolean>>(new Map())
  const [grid, setGrid] = useState<boolean>(true)

  const items: DropdownItemProps[] = [
    {
      label: 'Grid Helper',
      checked: grid,
      onClick: () => {
        const helper = scene.current.getObjectByProperty('type', 'GridHelper')
        console.log(helper)
        if (!helper) throw Error('Grid Helper does not exist')
        helper.visible = !grid
        setGrid((prev) => !prev)
      }
    }
  ]

  if (currentObject instanceof Camera) {
    items.push({
      label: 'Camera Helper',
      checked: helperMap.get(-10) ?? false,
      onClick: () => {
        const helpers = scene.current.getObjectsByProperty(
          'type',
          'CameraHelper'
        ) as CameraHelper[]
        for (const helper of helpers) {
          if (helper.camera === currentObject) {
            const toggled = !helper.visible
            helper.visible = toggled
            setHelperMap((prev) => {
              const newMap = new Map(prev)
              newMap.set(currentObject.id, toggled)
              return newMap
            })
            return
          }
        }
        const helper = new CameraHelper(currentObject)
        helper.name = 'Camera Helper'
        scene.current.add(helper)
        setHelperMap((prev) => {
          const newMap = new Map(prev)
          newMap.set(currentObject.id, true)
          return newMap
        })
      }
    })
  }
  if (currentObject instanceof DirectionalLight) {
    items.push({
      label: 'Light Helper',
      checked: helperMap.get(currentObject.id) ?? false,
      onClick: () => {
        const helpers = scene.current.getObjectsByProperty(
          'type',
          'DirectionalLightHelper'
        ) as DirectionalLightHelper[]
        for (const helper of helpers) {
          if (helper.light === currentObject) {
            const toggled = !helper.visible
            helper.visible = toggled
            setHelperMap((prev) => {
              const newMap = new Map(prev)
              newMap.set(currentObject.id, toggled)
              return newMap
            })
            return
          }
        }
        const helper = new DirectionalLightHelper(currentObject)
        helper.name = 'Light Helper'
        scene.current.add(helper)
        setHelperMap((prev) => {
          const newMap = new Map(prev)
          newMap.set(currentObject.id, true)
          return newMap
        })
      }
    })
  }

  return <Dropdown Icon={Rows2} label='View' items={items} />
}
