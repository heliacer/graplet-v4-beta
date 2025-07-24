import { useState, useEffect } from 'react'
import { DockviewPanelApi } from 'dockview-react'

export function usePanelState(api: DockviewPanelApi) {
  const [state, setState] = useState(() => ({
    isActive: api.isActive,
    isFocused: api.isFocused,
    isVisible: api.isVisible,
    title: api.title,
    width: api.width,
    height: api.height,
    location: api.location
  }))

  useEffect(() => {
    const updateState = () => setState({
      isActive: api.isActive,
      isFocused: api.isFocused,
      isVisible: api.isVisible,
      title: api.title,
      width: api.width,
      height: api.height,
      location: api.location
    })

    const disposables = [
      api.onDidActiveChange?.(updateState),
      api.onDidFocusChange?.(updateState),
      api.onDidVisibilityChange?.(updateState),
      api.onDidTitleChange?.(updateState),
      api.onDidDimensionsChange?.(updateState),
      api.onDidLocationChange?.(updateState)
    ].filter(Boolean)

    return () => disposables.forEach(d => d?.dispose())
  }, [api])

  return state
}