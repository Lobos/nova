import { useEffect, useRef } from "react"
import { useSnapshot } from "valtio"
import { store } from "./store"
import Key from "./key"
import { System } from "./system"
import Chat from "./chat"
import Messages from "./messages"
import { useStyles } from "./styles"

function App() {
  const state = useSnapshot(store)
  const styles = useStyles()
  const placeholderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    //setTimeout(() => {
      if (placeholderRef.current) {
        placeholderRef.current.scrollIntoView()
      }
    //}, 10)
  }, [state.messages.length + (state.current ? 1 : 0)])

  if (!state.key) {
    return <Key />
  }

  return (
    <div className={styles.root}>
      <System system={state.system} />

      <Messages />

      <div ref={placeholderRef}></div>

      <Chat />
    </div>
  )
}

export default App
