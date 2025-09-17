import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePopoverStore = defineStore('popover', () => {
  const activePopover = ref<string | null>(null)

  function open(id: string) {
    activePopover.value = id
  }

  function close() {
    activePopover.value = null
  }

  function toggle(id: string) {
    if (activePopover.value === id) {
      close()
    } else {
      open(id)
    }
  }

  const isOpen = (id: string) => computed(() => activePopover.value === id)

  return {
    activePopover,
    open,
    close,
    toggle,
    isOpen
  }
})
