import { useSnapshot } from "valtio"
import { store } from "./store"

export default function Messages() {
  const { messages } = useSnapshot(store)

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>
          <div>{msg.role}</div>
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
