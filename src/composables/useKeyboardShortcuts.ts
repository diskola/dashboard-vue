import { onMounted, onUnmounted } from 'vue'
import { useUIStore } from '../stores/ui'

export function useKeyboardShortcuts() {
  const uiStore = useUIStore()

  const handleKeydown = (event: KeyboardEvent) => {
    // Ctrl/Cmd + B to toggle sidebar
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault()
      uiStore.toggle()
    }
    
    // Escape to close sidebar on mobile
    if (event.key === 'Escape') {
      if (uiStore.isMobile && uiStore.sidebarOpen) {
        uiStore.close()
      }
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeydown)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown)
    }
  })

  return {
    handleKeydown
  }
}
