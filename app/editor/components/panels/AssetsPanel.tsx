import { useEffect, useState } from 'react'

export default function AssetsPanel() {
  const [manifestData, setManifestData] = useState(null)

  useEffect(() => {
    fetch('https://graplet.github.io/assetlib/manifest.json')
      .then(response => response.json())
      .then(data => setManifestData(data))
      .catch(error => console.error('Error fetching manifest:', error))
  }, [])

  return (
    <>
      <div className='p-1.5'>
        {manifestData && (
          <pre className='text-xs bg-ui-900 p-2 rounded'>
            {JSON.stringify(manifestData, null, 2)}
          </pre>
        )}
      </div>
    </>
  )
}
