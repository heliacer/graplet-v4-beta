import { WandSparkles } from 'lucide-react'
import { useEditor } from '../../lib/EditorContext'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { Object3D } from 'three'
import clsx from 'clsx'
import { ObjectDropdown } from '../ui/ObjectDropdown'
import { getIconT, ItemIcon } from '../../lib/utils/icons'

function ObjectListItem({ object }: { object: Object3D }) {
  const { currentObject, setCurrentObject } = useEditor()

  return (
    <button
      className={clsx(
        'rounded-md cursor-pointer border border-b-0 overflow-clip',
        currentObject?.id === object.id
          ? 'bg-zinc-800 border-zinc-700'
          : 'border-transparent hover:bg-zinc-800 hover:border-zinc-700'
      )}
      onClick={() => setCurrentObject(object)}
    >
      <div
        className={clsx(
          'flex gap-1 px-1 py-0.5 items-center border-b',
          currentObject?.id === object.id
            ? 'border-teal-600'
            : 'hover:border-zinc-700 border-transparent'
        )}
      >
        <ItemIcon size={16} iconType={getIconT(object.type)} />
        <p className="text-sm">{object.name}</p>
        <span className="text-zinc-400 text-sm ml-auto">{object.id}</span>
      </div>
    </button>
  )
}

export default function ExplorerPanel() {
  const { scene, objectVersion } = useEditor()

  return (
    <>
      <div
        key={objectVersion}
        className="h-full flex gap-1 flex-col p-1.5 overflow-y-auto"
      >
        {scene.current.children.map((obj) => (
          <ObjectListItem key={obj.id} object={obj} />
        ))}
        <br />
        <br />
      </div>
      <div className="flex gap-2 absolute bottom-3 left-2">
        <ObjectDropdown
          buttonStyle={() =>
            clsx(
              'flex items-center gap-1 px-1',
              'border rounded-md text-sm bg-zinc-800 border-zinc-600 cursor-pointer'
            )
          }
          side="top"
        />
      </div>
    </>
  )
}
