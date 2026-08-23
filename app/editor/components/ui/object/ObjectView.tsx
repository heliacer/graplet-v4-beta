import { useEditorRefs } from '@/app/editor/context/EditorContext'
import { useState } from 'react'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { View } from 'lucide-react'
import { getObject } from '@/app/editor/utils/three'

export function ObjectView() {
  const { objectsRef } = useEditorRefs()
  const [gridHelper, setGridHelper] = useState<boolean>(true)

  const items: DropdownItemProps[] = [
    {
      label: 'Grid Helper',
      checked: gridHelper,
      onClick: () => {
        const scene = getObject(objectsRef, 'scene')
        const helper = scene.getObjectByProperty('type', 'GridHelper')
        if (!helper) throw Error('Grid Helper does not exist')
        helper.visible = !gridHelper
        setGridHelper(prev => !prev)
      }
    },
    {
      label: 'Controls',
      children: [
        {
          label: 'Move with WASD',

          checked: false
        },
        {
          label: 'Orbit around',
          checked: true
        }
      ]
    }
  ]

  /**
   * @todo (#65) Add new categories:
   *
   * Cameras > Enable all helpers | Disable all helpers
   * Lights > Enable all helpers | Disable all helpers
   *
   * Local Helper (Camera | DirectionalLight)
   *
   * @todo  (#65) revamp all helpers! need to add them to sobjects.
   * those are treated as normal objects, and here only sobject data
   * should be accessed in stateful ui.
   *
   * -> keeping old grid helper as it doesn't
   * require any ui, just an action which happens directly on the ref
   */

  /**
   * @todo  (#34) Scene UX Controls
   *
   * Add controls (wasd / orbit to View options)
   * Controls > WASD Controls | Orbit Controls
   *
   * + Save control method to project data,
   * with its relative positioning (e.g for orbit / wasd)
   */

  return (
    <Dropdown Icon={View} label='View' items={items} iconStyle='text-mint' />
  )
}
