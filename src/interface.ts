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
  chatIndex: number
  current?: Message
  sending: boolean
  systemVisible: boolean
}
