export interface Message {
  role: "system" | "user" | "assistant"
  content: string
}

export interface Chat {
  user?: string
  assistant: string
}

export interface Store {
  key: string
  system?: string
  messages: Message[]
  chats: Chat[]
  current?: Message & { abort?: () => void }
  sending: boolean
  systemVisible: boolean
}

export interface ImportData {
  system?: string
  messages: Message[]
  chats: Chat[]
}
