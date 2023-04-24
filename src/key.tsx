import { proxy, useSnapshot } from "valtio"
import { checkKey } from "./utils"
import { setKey } from "./store"
import { useStyles } from "./styles"

interface KeyStore {
  key: string
  error?: string
  loading?: boolean
}

const keyStore = proxy<KeyStore>({
  key: localStorage.getItem("key") || "",
  loading: false,
})

export default function Key() {
  const { key, error, loading } = useSnapshot(keyStore)
  const styles = useStyles()

  const handleCheck = async () => {
    // 处理 loading
    keyStore.loading = true
    try {
      await checkKey(key)
      keyStore.loading = false
      setKey(key)
    } catch (e: any) {
      keyStore.loading = false
      keyStore.error = e.message
    }
  }

  return (
    <div>
      <label>
        <span>OpenAI Key</span>

        <button
          disabled={loading}
          className={styles.smallButton}
          onClick={handleCheck}
        >
          {loading ? "测试key是否有效中..." : "保存Key"}
        </button>
      </label>
      <input
        className={styles.input}
        value={key}
        onChange={(e) => (keyStore.key = e.target.value)}
      />
      {error && <div>{error}</div>}
    </div>
  )
}
