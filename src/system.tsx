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
  setApiUrl,
} from "./store"
import Textarea from "./textarea"
import Key from "./key"
import { useStyles } from "./styles"
import { Chat, ImportData, Message } from "./interface"
import { downloadData, importFromFile } from "./utils"

interface Props {
  label: string
  value: string | string[]
  onChange: (value: any) => void
  options?: string[]
}

const Select = (props: Props) => {
  const value = props.value as string[]
  const options = props.options || []
  const { onChange } = props

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value
    if (value.includes(e.target.value)) {
      onChange(value.filter((v) => v !== t))
    } else {
      onChange([...value, t])
    }
  }

  return (
    <>
      {options.map((option) => (
        <label>
          <input
            type="checkbox"
            key={option}
            value={option}
            checked={value.includes(option)}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </>
  )
}

const Block = ({ label, value, onChange, options }: Props) => {
  const [text, setText] = useState<string | string[]>(value)
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
        <Select
          label=""
          value={text as string[]}
          onChange={setText}
          options={options}
        />
      ) : (
        <Textarea
          className={styles.input}
          value={text as string}
          onChange={setText}
        />
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
        value={state.models as string[]}
        onChange={setModel}
        options={store.modelList}
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
