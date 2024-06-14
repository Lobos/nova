import { proxy } from "valtio"
import { Store, Message, ImportData, AiName } from "./interface"
import {
  chatsToMessages,
  setStorage,
  getStorage,
  messagesToChats,
  getContentFromStream,
} from "./utils"

export const store = proxy<Store>({
  keys: getStorage("keys", {}) as any,
  key: localStorage.getItem("key") as string,
  system: localStorage.getItem("system") || undefined,
  model: localStorage.getItem("model") || "gpt-3.5-turbo",
  apiUrl: localStorage.getItem("apiUrl") || "",
  messages: getStorage("messages", []),
  chats: getStorage("chats", []),
  sending: false,
  systemVisible: getStorage("messages", []).length === 0,
  temperature: getStorage("temperature", 0.8),
})

const getKey = () => {
  switch (store.model) {
    case "deepseek-chat":
      return store.keys.deepseek
    default:
      return store.keys.cloudflare
  }
}

const getURL = () => {
  switch (store.model) {
    case "deepseek-chat":
      return "https://api.deepseek.com/chat/completions"
    default:
      return `${store.apiUrl}/${store.model}`
  }
}

const getReserveLength = () => {
  switch (store.model) {
    case "deepseek-chat":
      return 5
    default:
      return 2
  }
}

export const modelOptions = [
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0301",
  "gpt-4o",
  "deepseek-chat",
  "llama-3-8b-instruct",
  "qwen1.5-14b-chat-awq",
]

export const summary = async (length = 0) => {
  const { chats } = store
  const reserveLength = getReserveLength()
  const summaryLength = chats.length - reserveLength
  if (length < 1000 && chats.length < reserveLength * 2 + 1) {
    return
  }

  const sendMessages = chatsToMessages(chats.slice(0, summaryLength), {
    role: "user",
    content: '用50字以内总结以上对话，以你为第一视角，我为对话者"',
  })
  const response = await fetch(`${store.apiUrl}/qwen1.5-14b-chat-awq`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.keys.cloudflare}`,
    },
    body: JSON.stringify({
      messages: sendMessages,
    }),
  }).then((res) => res.json())

  if (response) {
    store.chats = [
      {
        assistant: response.result.response.replaceAll("对话者", "你"),
      },
      ...store.chats.slice(summaryLength),
    ]
  }
}

export const modifyMessage = (
  index: number,
  old: string,
  content: string,
  role: "user" | "assistant"
) => {
  // if (old === content) return

  if (role === "assistant") {
    store.messages[index] = { role, content }
    store.chats.forEach((chat) => {
      if (chat[role] === old) {
        chat[role] = content
      }
    })
    setStorage("messages", store.messages)
    setStorage("chats", store.chats)
  } else {
    // 如果修改用户信息，表示需要删除此后所有对话
    const messages: Message[] = [
      ...store.messages.slice(0, Math.floor(index / 2) * 2),
    ]
    store.messages = messages
    // 根据最近10条消息重建会话
    store.chats = messagesToChats(messages.slice(-10))

    // 如果 content 不为空，发送消息
    sendMessage(content)
  }
}

const fetchMessage = async (messages: Message[]) => {
  const decoder = new TextDecoder("utf-8")
  const controller = new AbortController()

  const response = await fetch(getURL(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getKey()}`,
    },
    body: JSON.stringify({
      model: store.model,
      messages,
      temperature: store.temperature,
      stream: true,
      safe_mode: false
    }),
    signal: controller?.signal,
  })

  if (!response.body) throw new Error("error")

  if (store.current) store.messages.push(store.current)
  store.current = {
    role: "assistant",
    content: "",
    abort: () => controller.abort(),
  }

  const reader = response.body.getReader()
  let done = false
  while (!done) {
    const read = await reader.read()
    done = read.done
    if (read.value) {
      store.current.content += getContentFromStream(read.value, decoder)
    }
  }

  delete store.current.abort

  return done && response.status === 200
}

export const sendMessage = async (content: string) => {
  // 一次只发一条消息
  if (store.sending) return

  const current: Message = { role: "user", content }
  const sendMessages: Message[] = chatsToMessages(store.chats, current)

  if (store.system) {
    sendMessages.unshift({ role: "assistant", content: store.system })
  }

  store.sending = true
  store.current = current
  store.systemVisible = false

  try {
    const done = await fetchMessage(sendMessages)
    if (!done) throw new Error("send message error")

    store.messages.push(store.current)
    store.chats.push({
      user: content,
      assistant: store.current.content,
    })

    store.current = undefined

    setStorage("messages", store.messages)
    setStorage("chats", store.chats)

    summary()
  } catch (e) {
    console.error(e)
    // 如果最后一条是用户消息，弹出
    if (store.messages[store.messages.length - 1].role === "user") {
      store.messages.pop()
    }
    store.current = current
  } finally {
    store.sending = false
  }
}

export const clearMessages = () => {
  store.messages = []
  store.chats = []
  setStorage("messages", [])
  setStorage("chats", [])
  toggleSystem(false)
}

export const importData = (data: ImportData) => {
  store.messages = data.messages
  store.chats = data.chats
  store.system = data.system
  toggleSystem(false)
}

export const setKey = (name: AiName, key: string) => {
  store.keys[name] = key
  setStorage("keys", store.keys)
}

export const setSystem = (system: string) => {
  store.system = system
  localStorage.setItem("system", system)
  toggleSystem(false)
}

export const setModel = (model: string) => {
  store.model = model
  localStorage.setItem("model", model)
  toggleSystem(false)
}

export const setApiUrl = (apiUrl: string) => {
  store.apiUrl = apiUrl
  localStorage.setItem("apiUrl", apiUrl)
}

export const setSummary = (summary: string) => {
  if (store.chats.length > 0) {
    store.chats[0].assistant = summary
  } else {
    store.chats.unshift({ assistant: summary })
  }
  toggleSystem(false)
}

export const toggleSystem = (visible?: boolean) => {
  store.systemVisible = visible == undefined ? !store.systemVisible : visible
}

export const setTemperature = (temperature: string) => {
  const temp = Math.round(Number(temperature) * 100) / 100
  if (isNaN(temp) || temp < 0 || temp > 2) {
    store.temperature = 0.8
  } else {
    store.temperature = temp
    setStorage("temperature", temp)
  }
}
