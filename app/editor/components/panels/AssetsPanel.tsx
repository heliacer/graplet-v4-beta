import { useEffect, useState } from "react"

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

  const [manifestData, setManifestData] = useState(null)

  useEffect(() => {
    fetch('https://graplet.github.io/assetlib/manifest.json')
      .then(response => response.json())
      .then(data => setManifestData(data))
      .catch(error => console.error('Error fetching manifest:', error))
  }, [])

  return (
    <>
      <div className="p-1.5">
        {manifestData &&
          <pre className="text-xs bg-zinc-900 p-2 rounded">
            {JSON.stringify(manifestData, null, 2)}
          </pre>}
      </div>
    </>
  )
}