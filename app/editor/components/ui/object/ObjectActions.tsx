import { useEditorRefs } from '@/app/editor/context/EditorContext'
import { useEditorStore } from '@/app/editor/state'
import { getObject } from '@/app/editor/utils/three'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { ArrowDownToDot, Hammer } from 'lucide-react'

export function ObjectActions() {
  const selectedItems = useEditorStore(s => s.selectedItems)
  const updateSnapshot = useEditorStore(s => s.updateSnapshot)
  const { objectsRef } = useEditorRefs()

  if (selectedItems.length < 1) return

  const items: DropdownItemProps[] = [
    {
      label: 'Center Object',
      Icon: ArrowDownToDot,
      onClick: () => {
        const object = getObject(objectsRef, selectedItems[0])
        object.position.set(0, 0, 0)
        updateSnapshot(selectedItems[0], prev => ({
          ...prev,
          position: [0, 0, 0]
        }))
      }
    }
  ]

  return (
    <Dropdown
      Icon={Hammer}
      label='Actions'
      items={items}
      iconStyle='text-purple'
    />
  )
}
