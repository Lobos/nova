import { useRef, useState } from "react"
import { useSnapshot } from "valtio"
import {
  store,
  clearMessages,
  setSystem,
  setSummary,
  setTemperature,
  setModel,
  importData,
  modelOptions,
  setApiUrl,
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
  options?: string[]
}

const Block = ({ label, value, onChange, options }: Props) => {
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

      {options ? (
        <select
          className={styles.input}
          value={text}
          onChange={(event) => setText(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <Textarea className={styles.input} value={text} onChange={setText} />
      )}
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

  /*
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
  */

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
      <Block
        label="Temperature"
        value={state.temperature + ""}
        onChange={setTemperature}
      />

      <Block label="System" value={state.system || ""} onChange={setSystem} />

      <Block label="Summary" value={summary} onChange={setSummary} />

      <Block
        label="Model"
        value={state.model}
        onChange={setModel}
        options={modelOptions}
      />

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

        <Block label="API URL" value={state.apiUrl} onChange={setApiUrl} />

        <Key name="deepseek" />
        <Key name="cloudflare" />
      </div>
    </div>
  )
}
