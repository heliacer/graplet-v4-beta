import { Package, PenTool, Upload } from "lucide-react"
import { useTrigger } from "../../lib/TriggerContext"

export default function ExplorerPanel() {
  const emitter = useTrigger()


  /**
   * Asset Logic - Explorer
   */

  /*
    Possible options:
    1. Add Empty Asset
    2. Add Asset via URL
    3. Add Asset via library

    Add Empty Asset:
    - stores a native Three.JS Object -> cloud
    - directly editable with Model editor
    - e.g Box, Sphere, Torus, Torusknot ...

    Add Asset via URL
    - fetches custom asset via url
    - editing disabled*
    - Storage:
      - Option 1*: Lazy loaded from URL
      - Option 2: Store on cloud -> enable editing
    
    Add Asset via library
    - fetches library asset via cdn url, graplet.github.io/...
    - editing disabled*
    - Storage:
      - Option 1*: Lazy loaded from cdn
      - Option 2: Store on cloud -> enable editing
    
    * = default

    Storage Options
    - Setting (default): cache cloud / url objects locally, improve loading time
  */

  return (
    <>
      <div className="flex px-1.5 py-2 gap-1.5">
        {/* Opens the Model editor, adds empty asset */}
        <button
          onClick={() => emitter.emit('createObject')} 
          className="text-nowrap flex items-center gap-1 cursor-pointer rounded px-1.5 bg-zinc-800 border border-zinc-700"
        >
          <PenTool size={14} />
          New
        </button>
        {/* Accepts URLs (Button "New" changes to "Add Custom", if valid) or Text (Searches Asset Library, Button "New" changes to "Add ..." or "Add multiple") */}
        <input
          type="text"
          className="w-full focus:outline-none rounded px-1.5 border border-zinc-700"
          placeholder="Search for Assets or type URL"
        />
        {/* Directly opens Asset Library */}
        <button className="cursor-pointer rounded px-1.5 bg-zinc-800 border border-zinc-700">
          <Package size={14} />
        </button>
        {/* Upload Custom */}
        <button className="cursor-pointer rounded px-1.5 bg-zinc-800 border border-zinc-700">
          <Upload size={14} />
        </button>
      </div>
    </>
  )
}