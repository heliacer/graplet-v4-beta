import { ObjectAdd } from './object/add'
import { ObjectTools } from './object/tools'

export function ObjectControls() {
  return (
    <div className="flex gap-2 absolute m-1.5">
      <ObjectTools />
      <nav>
        <ObjectAdd />
      </nav>
    </div>
  )
}
