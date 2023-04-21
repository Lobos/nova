import { ChangeEvent, useCallback, useState } from "react"
import { sendMessage } from "./store"

export default function Chat() {
  const [loading, setLoading] = useState<boolean>(false)
  const [content, setContent] = useState<string>("")

  const handleContentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setContent(event.target.value)
    },
    [setContent]
  )

  const handleSend = async () => {
    if (loading) return
    setLoading(true)
    try {
      await sendMessage(content)
      setContent("")
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <div>
      <input value={content} onChange={handleContentChange} />
      <button disabled={loading} onClick={handleSend}>
        send
      </button>
    </div>
  )
}
