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

function TreeNode({ node }: { node: TreeItem }) {
  return (
    <li>
      {node.name}
      {node.children.length > 0 && (
        <ul>
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function Outline() {
  const { objects, currentObject } = useEditor()
  const obj = objects.current.get(currentObject)

  if (!obj) return null

  const tree = getObjectTree(obj)

  console.log(tree.children)

  return (
    <ul>
      <TreeNode node={tree} />
    </ul>
  )
}
