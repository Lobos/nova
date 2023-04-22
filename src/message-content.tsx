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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && editable) {
      handleEditable()
    }
  }

  return (
    <div className={styles[message.role]}>
      <div onClick={handleEditable} className={`${styles.avatar} ${editable ? styles.god : ''}`}>
        {editable ? 'G' : (message.role === 'user' ? '我' : 'N')}
      </div>
      <div ref={contentRef} onKeyDown={handleKeyDown} contentEditable={editable} className={styles.message}>
        {message.content}
      </div>
    </div>
  )
}