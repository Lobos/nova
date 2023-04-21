import { Configuration, OpenAIApi } from "openai"
import { proxy } from "valtio"
import { Store, Chat, Message } from "./interface"
import { getChats, getPrompt } from "./utils"

export const store = proxy<Store>({
  key: localStorage.getItem("key") as string,
  system: localStorage.getItem("system") || undefined,
  messages: [],
  chats: [],
  chatIndex: 0,
})

let openai: OpenAIApi
const getOpenai = () => {
  if (openai == null) {
    openai = new OpenAIApi(new Configuration({ apiKey: store.key }))
  }

  return openai
}

export const summary = async (length = 0) => {
  console.log(length)
  const { chats } = store
  const reserveLength = 3
  const summaryLength = chats.length - reserveLength
  if (length < 1000 && chats.length < reserveLength + 8) {
    return
  }

  const sendMessages = getChats(chats.slice(0, summaryLength), {
    role: "user",
    content: '用50字以内总结以上对话，以你为第一视角，我为对话者"',
  })
  const result = await getOpenai().createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: sendMessages,
  })

  console.log(result)
  if (result.data.choices[0]?.message) {
    store.chats = [
      { assistant: result.data.choices[0].message.content },
      ...store.chats.slice(summaryLength),
    ]
  }

  /* prompt 有点傻，待挖掘
  const prompt: string = getPrompt(
    chats.slice(0, reserveLength),
    "用50字以内以第一人称总结以上对话",
    system
  )
  const result = await getOpenai().createCompletion({
    model: "text-curie-001",
    prompt,
  })

  console.log(result)

  if (result.data.choices[0]?.text) {
    store.chats = [
      { assistant: result.data.choices[0].text },
      ...store.chats.slice(reserveLength),
    ]
  }
  */
}

export const sendMessage = async (content: string) => {
  const current: Message = { role: "user", content }
  const sendMessages: Message[] = getChats(store.chats, current)
  if (store.system) {
    sendMessages.unshift({ role: "system", content: store.system })
  }

  // send to openai
  const result = await getOpenai().createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: sendMessages,
  })

  console.log(result)

  const msg = result.data.choices[0]?.message
  if (msg) {
    store.messages.push(current)
    store.messages.push(msg)

    store.chats.push({
      user: content,
      assistant: msg.content,
    })

    summary(result.data.usage?.total_tokens)
  }
}

export const setKey = (key: string) => {
  store.key = key
  localStorage.setItem("key", key)
}

export const setSystem = (system: string) => {
  store.system = system
  localStorage.setItem("system", system)
}
