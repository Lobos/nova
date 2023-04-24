import { useSnapshot } from "valtio"
import { sendMessage, store } from "./store"
import { useStyles } from "./styles"
import Loading from "./loading"

export default function Current() {
  const { current, sending } = useSnapshot(store)
  const styles = useStyles()

  if (current) {
    return (
      <>
        <div className={styles[current.role]}>
          <div className={styles.avatar}>{current.role === 'user' ? '我' : 'N'}</div>
          <div className={styles.message}>{current.content}</div>
        </div>
        {current.role === 'user' &&
          <div className={styles.currentStatus}>
            {
              sending ?
                <Loading /> :
                <button className={styles.button} onClick={() => sendMessage(current.content)}>retry</button>
            }
          </div>
        }
      </>
    )
  }

  return null
}