import { proxy, useSnapshot } from "valtio"
import { setKey } from "./store"
import { useStyles } from "./styles"
import { AiName } from "./interface"
import { useMemo } from "react"
import { getStorage } from "./utils"

interface KeyStore {
  key: string
  error?: string
  loading?: boolean
}

interface Props {
  name: AiName
}

export default function Key(props: Props) {
  const { name } = props

  const keyStore = useMemo(() => {
    const keys = getStorage("keys", {}) as Record<AiName, string>
    return proxy<KeyStore>({
      key: keys[name] || "",
      loading: false,
    })
  }, [name])

  const { key, error, loading } = useSnapshot(keyStore)
  const styles = useStyles()

  const handleCheck = async () => {
    // 处理 loading
    keyStore.loading = true
    try {
      // await checkKey(key)
      keyStore.loading = false
      setKey(name, key)
    } catch (e: any) {
      keyStore.loading = false
      keyStore.error = e.message
    }
  }

  return (
    <div>
      <label>
        <span>{name.toUpperCase()} Key</span>

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
