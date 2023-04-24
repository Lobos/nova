import { useEffect, useRef, useState } from "react"
import { useSnapshot } from "valtio"
import {
  store,
  clearMessages,
  setSystem,
  setSummary,
  toggleSystem,
  importData,
} from "./store"
import Textarea from "./textarea"
import Key from "./key"
import { useStyles } from "./styles"
import { Chat, ImportData, Message } from "./interface"
import { downloadData, importFromFile } from "./utils"

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
      <label>
        <span>{label}</span>

        <button className={styles.smallButton} onClick={() => onChange(text)}>
          保存设定
        </button>
      </label>
      <Textarea className={styles.input} value={text} onChange={setText} />
    </div>
  )
}

export const System = () => {
  const styles = useStyles()
  const state = useSnapshot(store)
  const systemRef = useRef<HTMLDivElement>(null)

  let summary = ""
  if (state.chats[0] && state.chats[0].user == null) {
    summary = state.chats[0].assistant
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!systemRef?.current?.contains(event.target as Node)) {
        toggleSystem(false)
      }
    }

    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [])

  const handleExport = () => {
    const data: ImportData = {
      messages: state.messages as Message[],
      chats: state.chats as Chat[],
      system: state.system,
    }

    downloadData(data)
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const data = await importFromFile(file)
        importData(data)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div ref={systemRef} className={styles.system}>
      <Key />

      <Block label="System" value={state.system || ""} onChange={setSystem} />

      {summary && (
        <Block label="Summary" value={summary} onChange={setSummary} />
      )}

      <div>
        <button className={styles.button} onClick={clearMessages}>
          清除会话
        </button>

        <button className={styles.button} onClick={handleExport}>
          导出
        </button>

        <label
          htmlFor="file-input"
          className={styles.button}
          style={{ display: "inline-block" }}
        >
          导入
        </label>
        <input
          type="file"
          id="file-input"
          accept=".nov"
          onChange={handleFileChange}
          className="file-input"
          style={{ display: "none" }}
        />
      </div>
    </div>
  )
}
