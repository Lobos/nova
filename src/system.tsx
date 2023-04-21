import { useState } from "react"
import { setSystem } from "./store"

interface SystemProps {
  system?: string
}

export const System = (props: SystemProps) => {
  const [text, setText] = useState<string>(props.system || "")

  return (
    <div>
      System
      <div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <button onClick={() => setSystem(text)}>ok</button>
    </div>
  )
}
