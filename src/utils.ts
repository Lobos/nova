import { Configuration, OpenAIApi } from "openai"
import { Chat, Message } from "./interface"

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

export const getChats = (chats: Chat[], current: Message) => {
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
