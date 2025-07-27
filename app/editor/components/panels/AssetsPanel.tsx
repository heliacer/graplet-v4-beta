export default function AssetsPanel() {
  /**
   * Asset Logic
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
    <div className="flex">
      <input 
        type="text"
        className="w-full"
        placeholder="type Asset URL or choose from Library"
      />
      <button className="text-nowrap">
        Add Empty
      </button>
    </div>
    </>
  )
}