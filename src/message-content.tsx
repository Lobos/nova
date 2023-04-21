import { useRef, useState } from "react"
import { Message } from "./interface"
import { useStyles } from "./styles"
import { modifyMessage } from "./store"

interface Props {
  index: number
  message: Message
}

export default function MessageContent({ index, message }: Props) {
  const [editable, setEditable] = useState(false)
  const styles = useStyles()
  const contentRef = useRef<HTMLDivElement>(null)

  const handleEditable = () => {
    if (!editable) {
      setEditable(true)
      return
    }

    if (contentRef.current && message.role !== 'system') {
    modifyMessage(index, message.content, contentRef.current.innerText, message.role)
    }
    setEditable(false)
  }

  return (
    <div key={index} className={styles[message.role]}>
      <div className={styles.avatar}>{message.role === 'user' ? '我' : 'N'}</div>
      <div ref={contentRef} contentEditable={editable} className={styles.message}>{message.content}</div>

      <a onClick={handleEditable}>{editable?'可':'编'}</a>
    </div>
  )
}