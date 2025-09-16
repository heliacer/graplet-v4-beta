import { useState, useEffect, useRef } from 'react'
import { Hook, Unhook, Console } from 'console-feed'
import type { Message } from 'console-feed/lib/definitions/Component'

export default function CodePanel() {
  const [logs, setLogs] = useState<Message[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hookedConsole = Hook(
      window.console,
      (log) => {
        setLogs((currLogs) => [
          ...currLogs,
          { ...log, id: crypto.randomUUID(), data: log.data ?? [] }
        ])
      },
      false
    )
    return () => {
      Unhook(hookedConsole)
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div ref={scrollRef} className="overflow-auto h-full dvTabScrollBarColor">
      <Console logs={logs} variant="dark" />
    </div>
  )
}
