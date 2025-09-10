import mitt, { Emitter } from 'mitt'
import { createContext, useContext, useMemo } from 'react'
import { Object3D } from 'three'

type Events = {
  runScene: void
  stopScene: void
  createObject: void
  objectUpdated: void
  objectCreated: { object: Object3D }
}

const TriggerContext = createContext<Emitter<Events>>(null!)

export function useTrigger() {
  return useContext(TriggerContext)
}

export function TriggerProvider({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const emitter = useMemo(() => mitt<Events>(), [])
  return (
    <TriggerContext.Provider value={emitter}>
      {children}
    </TriggerContext.Provider>
  )
}
