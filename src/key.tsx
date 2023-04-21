import { proxy, useSnapshot } from "valtio"
import { checkKey } from "./utils"
import { setKey } from "./store"

interface KeyStore {
  key: string
  error?: string
  loading?: boolean
}

const keyStore = proxy<KeyStore>({
  key: "",
  loading: false,
})

export default function Key() {
  const { key, error, loading } = useSnapshot(keyStore)

  const handleCheck = async () => {
    // 处理 loading
    keyStore.loading = true
    try {
      await checkKey(key)
      setKey(key)
    } catch (e: any) {
      keyStore.loading = false
      keyStore.error = e.message
    }
  }

  return (
    <div>
      Please input key.
      <input value={key} onChange={(e) => (keyStore.key = e.target.value)} />
      <button onClick={handleCheck}>ok</button>
      {error && <div>{error}</div>}
      {loading && <div>checking...</div>}
    </div>
  )
}
