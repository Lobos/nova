import { Configuration, OpenAIApi } from "openai"
import { proxy } from "valtio"
import { Store, Message, ImportData } from "./interface"
import { chatsToMessages, setStorage, getStorage, messagesToChats } from "./utils"

export const store = proxy<Store>({
  key: localStorage.getItem("key") as string,
  system: localStorage.getItem("system") || undefined,
  messages: getStorage('messages', []),
  chats: getStorage('chats', []),
  sending: false,
  systemVisible: getStorage('messages', []).length === 0,
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
  const reserveLength = 2
  const summaryLength = chats.length - reserveLength
  if (length < 1000 && chats.length < reserveLength + 8) {
    return
  }

  const sendMessages = chatsToMessages(chats.slice(0, summaryLength), {
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
      { assistant: result.data.choices[0].message.content.replaceAll('对话者', '你') },
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

export const modifyMessage = (index: number, old: string, content: string, role: 'user' | 'assistant') => {
  if (old === content) return

  if (role === 'assistant') {
    store.messages[index] = { role, content }
    store.chats.forEach((chat) => {
      if (chat[role] === old) {
        chat[role] = content
      }
    })
    setStorage('messages', store.messages)
    setStorage('chats', store.chats)
  } else {
    // 如果修改用户信息，表示需要删除此后所有对话
    const messages: Message[] = [...store.messages.slice(0, Math.floor(index / 2) * 2)]
    store.messages = messages
    // 根据最近10条消息重建会话
    store.chats = messagesToChats(messages.slice(-10))

    // 如果 content 不为空，发送消息
    sendMessage(content)
  }

}

export const sendMessage = async (content: string) => {
  const current: Message = { role: "user", content }
  const sendMessages: Message[] = chatsToMessages(store.chats, current)

  if (store.system) {
    sendMessages.unshift({ role: "system", content: store.system })
  }

  store.sending = true
  store.current = current
  store.systemVisible = false

  try {
    const result = await getOpenai().createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: sendMessages,
    })

    store.current = undefined

    const msg = result.data.choices[0]?.message
    if (msg) {
      store.messages.push(current)
      store.messages.push(msg)

      store.chats.push({
        user: content,
        assistant: msg.content,
      })

      setStorage('messages', store.messages)
      setStorage('chats', store.chats)

      summary(result.data.usage?.total_tokens)
    }
  } catch (e) {
    console.error(e)
  } finally {
    store.sending = false
  }
}

export const clearMessages = () => {
  store.messages = []
  store.chats = []
  setStorage('messages', [])
  setStorage('chats', [])
  toggleSystem(false)
}

export const importData = (data: ImportData) => {
  store.messages = data.messages
  store.chats = data.chats
  store.system = data.system
  toggleSystem(false)
}

export const setKey = (key: string) => {
  store.key = key
  localStorage.setItem("key", key)
}

export const setSystem = (system: string) => {
  store.system = system
  localStorage.setItem("system", system)
  toggleSystem(false)
}

export const setSummary = (summary: string) => {
  store.chats[0].assistant = summary
  toggleSystem(false)
}

export const toggleSystem = (visible?: boolean) => {
  store.systemVisible = visible == undefined ? !store.systemVisible : visible
}