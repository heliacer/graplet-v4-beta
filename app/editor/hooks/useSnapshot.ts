import { useEditorStore } from '../state'

export function useSnapshot(id: string) {
  return useEditorStore(s => s.objectSnapshots[id])
}
