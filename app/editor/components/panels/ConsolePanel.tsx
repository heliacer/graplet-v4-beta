import { useState, useEffect } from 'react'
import { Hook, Unhook, Console } from 'console-feed'
import type { Message } from 'console-feed/lib/definitions/Component'

export default function CodePanel() {
  const [logs, setLogs] = useState<Message[]>([])

  useEffect(() => {
    const hookedConsole = Hook(
      window.console,
      (log) =>
        setLogs((currLogs) => [
          ...currLogs,
          { ...log, id: crypto.randomUUID(), data: log.data ?? [] }
        ]),
      false
    )
    return () => {
      Unhook(hookedConsole)
    }
  }, [])

  return (
    <div className="overflow-auto h-full">
      <Console logs={logs} variant="dark" />
    </div>
  )
}
