import { useSnapshot } from "valtio"
import { store, sendMessage } from "./store"
import { useStyles } from "./styles"
import MessageContent from "./message-content"
import Loading from "./loading"

export default function Messages() {
  const { messages, current, sending } = useSnapshot(store)
  const styles = useStyles()

  const handleRetry = () => {
    if (current) sendMessage(current.content)
  }

  return (
    <div className={styles.messages}>
      {messages.map((msg, i) => (
        <MessageContent key={i} index={i} message={msg} />
      ))}

      {current && (
        <>
          <div className={styles.user}>
            <div className={styles.avatar}>我</div>
            <div className={styles.message}>{current.content}</div>
          </div>
          <div className={styles.currentStatus}>
            {sending ? <Loading /> : <button className={styles.button} onClick={handleRetry}>retry</button>}
          </div>
        </>
      )}
    </div>
  )
}
