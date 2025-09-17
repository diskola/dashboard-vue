import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
  const activeKey = ref<string | null>('dashboard')

  function setActiveKey(key: string) {
    activeKey.value = key
  }

  return {
    activeKey,
    setActiveKey
  }
})
