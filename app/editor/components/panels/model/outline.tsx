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
        <ul className="pl-3">
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function Outline() {
  const { currentObject } = useEditor()

  if (!currentObject) return null

  const tree = getObjectTree(currentObject)

  return (
    <>
      <div className="flex w-full border-0 border-b border-zinc-700">
        <p>Outline</p>
      </div>
      <ul className="w-full h-full">
        <TreeNode node={tree} />
      </ul>
    </>
  )
}
