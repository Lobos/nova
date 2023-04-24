import { useSnapshot } from "valtio"
import { store } from "./store"
import { useStyles } from "./styles"
import MessageContent from "./message-content"
import Current from "./current"

export default function Messages() {
  const { messages } = useSnapshot(store)
  const styles = useStyles()

  return (
    <div className={styles.messages}>
      {messages.map((msg, i) => (
        <MessageContent key={i} index={i} message={msg} />
      ))}

      <Current />
    </div>
  )
}
