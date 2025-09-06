import { useReducer } from "react"
import { useEditor } from "../../lib/EditorContext"
import { useTrigger } from "../../lib/TriggerContext"

export default function PropertiesPanel() {
  // TODO: needs refactor + no direct state access, only commit on submit, to allow validate
  const { objects, currentObject } = useEditor()
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const emitter = useTrigger()
  const obj = objects.current.get(currentObject)

  if (!obj) return <div className="p-1.5 italic">Select an object</div>

  return (
    <div className="p-1.5 flex flex-col gap-2 text-sm">
      <div className="flex gap-2">
        <p className="text-nowrap">Object Name</p>
        <input
          className="rounded border outline-none w-full px-1"
          type="text"
          value={obj.name}
          onChange={(e) => {
            obj.name = e.target.value
            emitter.emit('objectUpdated')         
            forceUpdate()
          }}
        />
      </div>
      <div className="flex justify-between">
        <p className="text-nowrap">Position</p>
        <div className="flex gap-1.5">
          <p>X</p>
          <input
            className="rounded border outline-none px-1 w-10"
            type="number"
            name="x"
            value={obj.position.x}
            onChange={(e) => {
              obj.position.x = Number(e.target.value)
              emitter.emit('objectUpdated')         
              forceUpdate()
            }}
          />
        <p>Y</p>
        <input
            className="rounded border outline-none px-1 w-10"
            type="number"
            name="y"
            value={obj.position.y}
            onChange={(e) => {
              obj.position.y = Number(e.target.value)
              emitter.emit('objectUpdated')         
              forceUpdate()
            }}
          />
        <p>Z</p>
        <input
            className="rounded border outline-none px-1 w-10"
            type="number"
            name="z"
            value={obj.position.z}
            onChange={(e) => {
              obj.position.z = Number(e.target.value)
              emitter.emit('objectUpdated')         
              forceUpdate()
            }}
          />
        </div>
      </div>
    </div>
  )
}