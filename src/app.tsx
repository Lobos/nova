import { useCallback, useEffect, useRef } from "react"
import { useSnapshot } from "valtio"
import { store, toggleSystem } from "./store"
import Key from "./key"
import { System } from "./system"
import Chat from "./chat"
import Messages from "./messages"
import { useStyles } from "./styles"
import { useVisibleHeight } from "./hooks"

function App() {
  const state = useSnapshot(store)
  const styles = useStyles()
  const placeholderRef = useRef<HTMLDivElement>(null)
  const height = useVisibleHeight()

  useEffect(() => {
    if (placeholderRef.current) {
      placeholderRef.current.scrollIntoView()
    }
  }, [state.messages.length, height, state.current?.content])

  const handleHeaderClick = useCallback(() => {
    toggleSystem()
  }, [])

  if (!state.key) {
    return <Key />
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span onClick={handleHeaderClick}>NOVA</span>
      </div>

      {state.systemVisible && <System />}

      <Messages />

      <div ref={placeholderRef}></div>

      <Chat />
    </div>
  )
}

export default App
