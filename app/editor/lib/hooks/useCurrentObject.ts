import { useEditor } from "../EditorContext"
import { NotFoundError } from "../types"

/** 
 * This IS temporary, as long as some tool doesn't support multiselect yet.
 * No, we are NOT keeping this.
 */
export function useCurrentObject() {
  const { selectedItems, objects } = useEditor()
  
  if (selectedItems.length !== 1) return
  
  const id = selectedItems[0]
  const object = objects.current.get(id)
  if (!object) throw new NotFoundError(id)
  
  return object
}