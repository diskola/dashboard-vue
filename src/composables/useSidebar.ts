import { ref, computed, onMounted, onUnmounted } from 'vue'

const isSidebarOpen = ref(false)
const windowWidth = ref(1024) // Default to desktop size

export function useSidebar() {
  const updateWindowWidth = () => {
    if (typeof window !== 'undefined') {
      windowWidth.value = window.innerWidth
    }
  }

  onMounted(() => {
    // Set initial window width
    updateWindowWidth()
    
    // Listen for resize events
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateWindowWidth)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateWindowWidth)
    }
  })

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  const openSidebar = () => {
    isSidebarOpen.value = true
  }

  const isDesktop = computed(() => windowWidth.value >= 1024)
  const isMobile = computed(() => windowWidth.value < 1024)

  // Computed property to determine if content should be offset
  const shouldOffsetContent = computed(() => {
    // On desktop (lg+), always offset for sidebar
    // On mobile/tablet, only offset when sidebar is open
    return isDesktop.value || isSidebarOpen.value
  })

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    shouldOffsetContent,
    isDesktop,
    isMobile,
    windowWidth
  }
}
