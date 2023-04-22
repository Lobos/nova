import { useState } from "react"
import { clearMessages, setSystem } from "./store"
import Textarea from './textarea'
import Key from './key'
import { useStyles } from "./styles"

interface SystemProps {
  system?: string
}

export const System = (props: SystemProps) => {
  const [text, setText] = useState<string>(props.system || "")
  const styles = useStyles()

  return (
    <div className={styles.system}>
      <Key />

      <div>
        <label>背景设定</label>
        <Textarea className={styles.input} value={text} onChange={setText} />
        <button className={styles.button} onClick={() => setSystem(text)}>保存设定</button>
      </div>

      <div>
        <button className={styles.button} onClick={clearMessages}>清除当前会话</button>
      </div>
    </div>
  )
}
