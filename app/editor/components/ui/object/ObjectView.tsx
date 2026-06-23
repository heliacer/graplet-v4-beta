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
   * @todo revamp all helpers! need to add them to sobjects.
   * those are treated as normal objects, and here only sobject data
   * should be accessed in stateful ui.
   *
   * -> keeping old grid helper as it doesn't
   * require any ui, just an action which happens directly on the ref
   */

  return (
    <Dropdown Icon={View} label='View' items={items} iconStyle='text-mint' />
  )
}
