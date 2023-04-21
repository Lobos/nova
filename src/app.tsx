import { useSnapshot } from "valtio"
import { store } from "./store"
import Key from "./key"
import { System } from "./system"
import Chat from "./chat"
import Messages from "./messages"

function App() {
  const state = useSnapshot(store)

  if (!state.key) {
    return <Key />
  }

  return (
    <>
      <System system={state.system} />

      <Messages />

      <Chat />
    </>
  )
}

export default App
