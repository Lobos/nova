import { Configuration, OpenAIApi } from "openai"
import { Chat, ImportData, Message } from "./interface"

export const checkKey = async (key: string) => {
  const openai = new OpenAIApi(new Configuration({ apiKey: key }))

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "hello gpt." }],
  })

  if (res.data.created) {
    return true
  }

  throw new Error("send error")
}

export const chatsToMessages = (chats: Chat[], current: Message) => {
  const messages: Message[] = []
  chats.forEach((chat) => {
    if (chat.user) {
      messages.push({ role: "user", content: chat.user })
    }
    if (chat.assistant) {
      messages.push({ role: "assistant", content: chat.assistant })
    }
  })

  messages.push(current)
  return messages
}

export const messagesToChats = (messages: Message[]) => {
  const chats: Chat[] = []

  let currentChat: Chat = {} as Chat
  for (const message of messages) {
    if (message.role === 'user') {
      currentChat = { user: message.content, assistant: '' }
      chats.push(currentChat)
    } else {
      currentChat.assistant = message.content
    }
  }
  return chats
}

export const getPrompt = (chats: Chat[], message: string, system = "") => {
  let prompt: string = "<|im_start|>system " + system + "<|im_end|>"

  chats.forEach((chat) => {
    if (chat.user) {
      prompt += "<|im_start|>user " + chat.user + "<|im_end|>"
    }
    if (chat.assistant) {
      prompt += "<|im_start|>assistant " + chat.assistant + "<|im_end|>"
    }
  })

  prompt += "<|im_start|>user " + message + "<|im_end|><|im_start|>assistant"

  return prompt
}

export const setStorage = (key: string, item: any) => {
  localStorage.setItem(key, JSON.stringify(item))
}

export const getStorage = <T>(key: string, def: T): T => {
  const item = localStorage.getItem(key)
  if (!item) return def
  return JSON.parse(item)
}

export const downloadData = (data: ImportData): void => {
  const jsonString = JSON.stringify(data)
  const base64String = btoa(encodeURIComponent(jsonString))
  const blob = new Blob([base64String], { type: 'application/base64' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `chat-${Date.now()}.nov`
  link.click()
}

export const importFromFile = (file: File): Promise<ImportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64String = reader.result?.toString().split(',')[1]
      if (base64String) {
        // 导入的文件会被 base64 处理一次，这里需要2次 atob
        const jsonString = decodeURIComponent(atob(atob(base64String)))
        const data = JSON.parse(jsonString)

        if (Array.isArray(data.messages) && Array.isArray(data.chats)) {
          resolve(data)
        } else {
          reject(new Error('Invalid chat file'))
        }
      } else {
        reject(new Error('Invalid Base64 string'))
      }
    }
    reader.onerror = () => {
      reject(reader.error)
    }
  })
}
