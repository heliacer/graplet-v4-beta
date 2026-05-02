import { IDockviewHeaderActionsProps } from 'dockview-react'
import { useState, useEffect } from 'react'

export function useHeaderControls(props: IDockviewHeaderActionsProps) {
  const containerApi = props.containerApi
  const api = props.api

  const [state, setState] = useState(() => ({
    isMaximised: containerApi.hasMaximizedGroup(),
    isFloating: api.location.type === 'floating'
  }))

  useEffect(() => {
    const updateState = () =>
      setState({
        isMaximised: containerApi.hasMaximizedGroup(),
        isFloating: api.location.type === 'floating'
      })

    const disposables = [
      containerApi.onDidMaximizedGroupChange?.(updateState),
      api.onDidLocationChange?.(updateState)
    ].filter(Boolean)

    return () => disposables.forEach(d => d?.dispose())
  }, [api, containerApi])

  const toggleMaximized = () => {
    if (state.isMaximised) {
      containerApi.exitMaximizedGroup()
    } else {
      props.activePanel?.api.maximize()
    }
  }

  const toggleFloating = () => {
    if (state.isFloating) {
      api.moveTo({ position: 'right' })
    } else {
      containerApi.addFloatingGroup(props.group)
    }
  }

  return {
    ...state,
    toggleMaximized,
    toggleFloating
  }
}
