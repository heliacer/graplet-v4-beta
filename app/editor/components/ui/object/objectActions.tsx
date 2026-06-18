import { useEditorRefs } from '@/app/editor/context/EditorContext'
import { useEditorStore } from '@/app/editor/state'
import { getObject } from '@/app/editor/utils/three'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { ArrowDownToDot, Hammer } from 'lucide-react'

export function ObjectActions() {
  const selectedItems = useEditorStore(s => s.selectedItems)
  const { objectsRef } = useEditorRefs()

  const items: DropdownItemProps[] = []

  if (selectedItems.length > 0) {
    items.push({
      label: 'Center Object',
      Icon: ArrowDownToDot,
      onClick: () => {
        const object = getObject(objectsRef, selectedItems[0])
        object.position.set(0, 0, 0)
      }
    })
  }

  return (
    <Dropdown
      Icon={Hammer}
      label='Actions'
      items={items}
      iconStyle='text-purple'
    />
  )
}
