import { ChangeEvent, useCallback, useState } from "react"
import { useSnapshot } from "valtio"
import { store, sendMessage } from "./store"
import { useStyles } from "./styles"

export default function Chat() {
  const [content, setContent] = useState<string>("")
  const styles = useStyles()
  const {sending} = useSnapshot(store)

  const handleContentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setContent(event.target.value)
    },
    [setContent]
  )

  const handleSend = async () => {
    if (sending) return
    setContent("")
    await sendMessage(content)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className={styles.chat}>
      <div className={styles.input}>
        <input value={content} onChange={handleContentChange} onKeyDown={handleKeyDown} />
        <button disabled={sending} onClick={handleSend}>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  )
}
