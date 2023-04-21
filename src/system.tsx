import { useState } from "react"
import { setSystem } from "./store"
import Textarea from './textarea'
import { useStyles } from "./styles"

interface SystemProps {
  system?: string
}

export const System = (props: SystemProps) => {
  const [text, setText] = useState<string>(props.system || "")
  const styles = useStyles()

  return (
    <div className={styles.system}>
      <label>背景设定</label>
      <Textarea className={styles.input} value={text} onChange={setText} />
      <button className={styles.button} onClick={() => setSystem(text)}>保存设定</button>
    </div>
  )
}
