import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

interface SidebarState {
  open: boolean
  rail: boolean
}

type Theme = 'light' | 'dark' | 'system'

export const useUIStore = defineStore('ui', () => {
  // Reactive state
  const sidebar = ref<SidebarState>({
    open: true,
    rail: false
  })
  const windowWidth = ref(1024)
  const theme = ref<Theme>('system')

  // Load initial state from localStorage
  const loadState = () => {
    if (typeof window !== 'undefined') {
      const savedSidebar = localStorage.getItem('donezo-sidebar-state')
      if (savedSidebar !== null) {
        try {
          const parsed = JSON.parse(savedSidebar)
          sidebar.value = { ...sidebar.value, ...parsed }
        } catch (e) {
          console.warn('Failed to parse sidebar state from localStorage')
        }
      }

      const savedTheme = localStorage.getItem('donezo-theme')
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        theme.value = savedTheme as Theme
      }
    }
  }

  // Save to localStorage when state changes
  watch(sidebar, (newValue) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('donezo-sidebar-state', JSON.stringify(newValue))
    }
  }, { deep: true })

  watch(theme, (newValue) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('donezo-theme', newValue)
      updateDOMTheme()
    }
  })

  // Computed properties
  const isDesktop = computed(() => windowWidth.value >= 1024)
  const isMobile = computed(() => windowWidth.value < 768)
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)

  // Sidebar state getters
  const sidebarOpen = computed(() => sidebar.value.open)
  const sidebarRail = computed(() => sidebar.value.rail)
  
  // Content margin calculations
  const contentMargin = computed(() => {
    if (isMobile.value || isTablet.value) {
      return 'ml-0' // Mobile/Tablet always uses overlay
    }
    
    if (!sidebar.value.open) {
      return 'ml-0'
    }
    
    if (sidebar.value.rail) {
      return 'ml-[72px]'
    }
    
    return 'ml-[240px]'
  })

  // Actions
  const toggle = () => {
    if (isDesktop.value) {
      // Desktop: cycle through states - open -> rail -> closed -> open
      if (sidebar.value.open && !sidebar.value.rail) {
        sidebar.value.rail = true
      } else if (sidebar.value.open && sidebar.value.rail) {
        sidebar.value.open = false
        sidebar.value.rail = false
      } else {
        sidebar.value.open = true
        sidebar.value.rail = false
      }
    } else {
      // Mobile: simple toggle
      sidebar.value.open = !sidebar.value.open
      sidebar.value.rail = false
    }
  }

  const close = () => {
    if (isMobile.value || isTablet.value) {
      sidebar.value.open = false
      sidebar.value.rail = false
    }
  }

  const open = () => {
    sidebar.value.open = true
    sidebar.value.rail = false
  }

  const setRail = (rail: boolean) => {
    if (isDesktop.value) {
      sidebar.value.rail = rail
      if (rail) {
        sidebar.value.open = true
      }
    }
  }

  const updateWindowWidth = (width: number) => {
    windowWidth.value = width
    
    // Auto-adjust sidebar state based on screen size
    if (width < 1024) {
      // On mobile, disable rail mode
      sidebar.value.rail = false
    }
  }

  // Body scroll locking for mobile overlay
  const lockBodyScroll = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
    }
  }

  const unlockBodyScroll = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  const updateDOMTheme = () => {
    const root = window.document.documentElement
    if (
      theme.value === 'dark' ||
      (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Initialize
  loadState()
  if (typeof window !== 'undefined') {
    updateDOMTheme()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateDOMTheme)
  }

  return {
    // State
    sidebar,
    windowWidth,
    theme,
    
    // Computed
    isDesktop,
    isMobile,
    isTablet,
    sidebarOpen,
    sidebarRail,
    contentMargin,
    
    // Actions
    toggle,
    close,
    open,
    setRail,
    updateWindowWidth,
    lockBodyScroll,
    unlockBodyScroll,
    setTheme,
  }
})
