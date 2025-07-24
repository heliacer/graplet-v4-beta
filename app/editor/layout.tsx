export default function EditorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-medium">
      {children}
    </main>
  )
}