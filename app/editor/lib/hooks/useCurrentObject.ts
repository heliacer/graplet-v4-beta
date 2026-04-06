import { useOldEditor } from '../EditorContext'
import { useEditor } from '../state'
import { NotFoundError } from '../types'

/**
 * This IS temporary, as long as some tool doesn't support multiselect yet.
 * No, we are NOT keeping this.
 * 
 * I'm afraid we're keeping this longer than I anticipated.
 */
export function useCurrentObject() {
  const { objects } = useOldEditor()
  const selectedItems = useEditor(s => s.selectedItems)

  if (selectedItems.length !== 1) return

  const id = selectedItems[0]
  const object = objects.current.get(id)
  if (!object) throw new NotFoundError(id)

  return object
}
