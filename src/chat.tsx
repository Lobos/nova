import React, { useState } from "react"
import { useSnapshot } from "valtio"
import { store, sendMessage } from "./store"
import { useStyles } from "./styles"
import TextArea from "./textarea"

export default function Chat() {
  const [content, setContent] = useState<string>("")
  const styles = useStyles()
  const { sending } = useSnapshot(store)

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault()
    if (sending || content.length === 0) return
    setContent("")
    await sendMessage(content)
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      handleSend(event)
    }
  }

  return (
    <div className={styles.chat}>
      <form onSubmit={handleSend}>
        <TextArea
          className={styles.input}
          style={{ paddingRight: 40 }}
          value={content}
          onChange={setContent}
          onKeyUp={handleKeyUp}
        />
        <button type="submit" disabled={sending}>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  )
}
