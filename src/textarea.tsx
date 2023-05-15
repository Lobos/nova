import { useState, ChangeEvent, useEffect, useRef } from "react"

interface DynamicTextareaProps {
  className?: string
  value: string
  onChange: (value: string) => void
  onKeyUp?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  style?: React.CSSProperties
}

interface DynamicTextareaState {
  height: number
}

function DynamicTextarea(props: DynamicTextareaProps) {
  const { className, value, onChange, onKeyUp, style } = props
  const [state, setState] = useState<DynamicTextareaState>({
    height: 0,
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      // set height to 0 when value is empty else set it to scrollHeight
      const height = value ? textareaRef.current.scrollHeight + 2 : 0
      setState({ height })
    }
  }, [value])

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      onKeyUp={onKeyUp}
      style={{ height: `${state.height}px`, ...style }}
      className={className}
    />
  )
}

export default DynamicTextarea
