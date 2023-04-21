import { useState, ChangeEvent, useEffect, useRef } from 'react'

interface DynamicTextareaProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

interface DynamicTextareaState {
  height: number;
}

function DynamicTextarea({
  className,
  value,
  onChange,
}: DynamicTextareaProps) {
  const [state, setState] = useState<DynamicTextareaState>({
    height: 0,
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      setState({
        height: textareaRef.current.scrollHeight,
      })
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
      style={{ height: `${state.height}px` }}
      className={className}
    />
  )
}

export default DynamicTextarea
