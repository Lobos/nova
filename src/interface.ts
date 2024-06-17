export interface Message {
  role: "system" | "user" | "assistant"
  content: string
}

export interface Chat {
  user?: string
  assistant: string
}

export type AiName = "openai" | "deepseek" | "cloudflare"

export interface Store {
  keys: Record<AiName, string>
  key: string
  system?: string
  messages: Message[]
  model: string
  chats: Chat[]
  current?: Message & { abort?: () => void }
  apiUrl: string
  sending: boolean
  systemVisible: boolean
  temperature: number
  modelList: string[]
}

export interface ImportData {
  system?: string
  messages: Message[]
  chats: Chat[]
}
