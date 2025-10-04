import { useEditor } from '@/app/editor/lib/EditorContext'
import { Object3D } from 'three'

interface TreeItem {
  name: string
  children: TreeItem[]
}

function getObjectTree(object: Object3D): TreeItem {
  const children = []
  for (const child of object.children) {
    children.push(getObjectTree(child))
  }
  return {
    name: object.name,
    children
  }
}

export default function Outline() {
  const { objects, currentObject } = useEditor()
  const obj = objects.current.get(currentObject)

  return <>{obj && getObjectTree(obj)}</>
}
