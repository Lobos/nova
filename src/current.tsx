import { useSnapshot } from "valtio"
import { sendMessage, store } from "./store"
import { useStyles } from "./styles"
import Loading from "./loading"

export default function Current() {
  const { current, sending, model } = useSnapshot(store)
  const styles = useStyles()

  if (current) {
    return (
      <>
        <div className={styles[current.role]}>
          <div className={styles.avatar}>
            {current.role === "user" ? "我" : "N"}
          </div>
          <div className={styles.message}>
            {current.content}
            {current.role === "assistant" && (
              <span className={styles.cursorEffect}>&ensp;</span>
            )}
          </div>
        </div>
        {current.role === "user" && (
          <div className={styles.currentStatus}>
            {sending ? (
              <Loading />
            ) : (
              <button
                className={styles.button}
                onClick={() => sendMessage(current.content)}
              >
                retry
              </button>
            )}
          </div>
        )}
        {current.role === "assistant" && (
          <div className={styles.currentStatus}>
            {model}
            <button
              className={styles.button}
              onClick={() => {
                if (store.current?.abort) store.current.abort()
              }}
            >
              Stop
            </button>
          </div>
        )}
      </>
    )
  }

  return null
}
