import { useEffect, useRef, useState } from "react"
import { useSnapshot } from "valtio"
import { store, clearMessages, setSystem, setSummary, toggleSystem } from "./store"
import Textarea from './textarea'
import Key from './key'
import { useStyles } from "./styles"

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
}

const Block = ({ label, value, onChange }: Props) => {
  const [text, setText] = useState<string>(value)
  const styles = useStyles()

  return (
    <div>
      <label>{label}</label>
      <Textarea className={styles.input} value={text} onChange={setText} />
      <button className={styles.button} onClick={() => onChange(text)}>保存设定</button>
    </div>
  )
}

export const System = () => {
  const styles = useStyles()
  const state = useSnapshot(store)
  const systemRef = useRef<HTMLDivElement>(null)

  let summary = ''
  if (state.chats[0] && state.chats[0].user == null) {
    summary = state.chats[0].assistant
  }


  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!systemRef?.current?.contains(event.target as Node)) {
        toggleSystem(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  return (
    <div ref={systemRef} className={styles.system}>
      <Key />

      <Block label="System" value={state.system || ''} onChange={setSystem} />

      { summary && <Block label="Summary" value={summary} onChange={setSummary} /> }

      <div>
        <button className={styles.button} onClick={clearMessages}>清除当前会话</button>
      </div>
    </div>
  )
}
