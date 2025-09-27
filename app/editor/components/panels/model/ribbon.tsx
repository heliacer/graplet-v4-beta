import { useEditor } from "@/app/editor/lib/EditorContext"
import { Mesh, MeshStandardMaterial, SphereGeometry } from "three"

export default function Ribbon() {
  const { objects, currentObject, setObjectVersion } = useEditor()

  function addBall() {
    const group = objects.current.get(currentObject)
    const mesh = new Mesh(
      new SphereGeometry(1, 10, 10),
      new MeshStandardMaterial({ color: '#ffffff' })
    )
    mesh.position.set(Math.random() * 3, Math.random() * 3, Math.random() * 3)
    group?.add(mesh)
    setObjectVersion((p) => p + 1)
  }
  return (
    <div className="flex gap-1">
      <p>Ribbon</p>
      <button className="cursor-pointer underline" onClick={addBall}>Add ball</button>
    </div>
  )
}