<template>
  <!-- Mobile/Tablet Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="uiStore.sidebarOpen && uiStore.isMobile" 
      class="fixed inset-0 z-40 bg-black/60 lg:hidden" 
      @click="uiStore.close"
      aria-hidden="true"
    ></div>
  </Transition>

  <!-- Sidebar -->
  <aside 
    :class="[
      'fixed inset-y-0 left-0 z-50 bg-app-surface dark:bg-app-bg border-r border-app-border dark:border-app-border/20',
      'transition-all duration-300 ease-in-out',
      {
        'w-sidebar': !uiStore.sidebarRail,
        'w-[72px]': uiStore.sidebarRail && uiStore.isDesktop,
        'translate-x-0': uiStore.sidebarOpen || uiStore.isDesktop,
        '-translate-x-full': !uiStore.sidebarOpen && uiStore.isMobile
      }
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Logo & Close Button -->
      <div :class="[
        'flex items-center border-b border-app-border dark:border-app-border/20 transition-all duration-300 h-[81px]',
        uiStore.sidebarRail ? 'justify-center px-4' : 'justify-between px-6'
      ]">
        <router-link to="/" class="flex items-center">
          <div class="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap class="w-5 h-5 text-white" />
          </div>
          <span 
            v-show="!uiStore.sidebarRail" 
            class="ml-3 text-xl font-bold text-app-text dark:text-white transition-opacity duration-200"
          >
            Donezo
          </span>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav ref="navRef" @keydown="handleNavKeyDown" class="flex-1 py-6 space-y-2 overflow-y-auto" :class="uiStore.sidebarRail ? 'px-2' : 'px-4'">
        <router-link 
          v-for="item in navigationItems" 
          :key="item.key"
          :to="item.to" 
          :class="[
             'relative flex items-center text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2 dark:focus:ring-offset-app-bg',
             uiStore.sidebarRail ? 'justify-center p-3' : 'px-4 py-3',
             isActive(item.key) 
               ? 'bg-app-primary text-white shadow-sm'
               : 'text-app-muted hover:bg-app-primary/10 dark:hover:bg-app-surface/10 hover:text-app-primary dark:hover:text-app-primary'
           ]"
           :title="uiStore.sidebarRail ? item.name : undefined"
           @click="handleNavClick">
          <div v-if="isActive(item.key) && !uiStore.sidebarRail" class="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-white rounded-r-full"></div>
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" :class="uiStore.sidebarRail ? '' : 'mr-3'" />
          <span 
            v-show="!uiStore.sidebarRail" 
            class="transition-opacity duration-200"
          >
            {{ item.name }}
          </span>
        </router-link>
      </nav>

      <!-- User Profile -->
      <div :class="[
        'border-t border-app-border dark:border-app-border/20 transition-all duration-300',
        uiStore.sidebarRail ? 'px-2 py-4' : 'px-4 py-6'
      ]">
        <div :class="[
          'flex items-center transition-all duration-300',
          uiStore.sidebarRail ? 'justify-center' : ''
        ]">
          <div class="w-10 h-10 bg-app-primary rounded-full flex items-center justify-center flex-shrink-0">
            <User class="w-6 h-6 text-white" />
          </div>
          <div 
            v-show="!uiStore.sidebarRail" 
            class="ml-3 min-w-0 transition-opacity duration-200"
          >
            <p class="text-sm font-medium text-app-text dark:text-white truncate">Sarah Johnson</p>
            <p class="text-xs text-app-muted truncate">Product Manager</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { 
  LayoutDashboard, FolderOpen, CheckSquare, Users, Calendar, BarChart3, Settings, Zap, User
} from 'lucide-vue-next'
import { useUIStore } from '../stores/ui'
import { useNavigationStore } from '../stores/navigation'

const uiStore = useUIStore()
const navigationStore = useNavigationStore()
const navRef = ref<HTMLElement | null>(null)

const isActive = (key: string) => navigationStore.activeKey === key

// Watch sidebar state for body scroll locking
watch(() => uiStore.sidebarOpen, (isOpen) => {
  if (uiStore.isMobile) {
    if (isOpen) {
      uiStore.lockBodyScroll()
    } else {
      uiStore.unlockBodyScroll()
    }
  }
})

const navigationItems = ref([
  { name: 'Dashboard', key: 'dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Projects', key: 'projects', to: '/projects', icon: FolderOpen },
  { name: 'Tasks', key: 'tasks', to: '/tasks', icon: CheckSquare },
  { name: 'Team', key: 'team', to: '/team', icon: Users },
  { name: 'Calendar', key: 'calendar', to: '/calendar', icon: Calendar },
  { name: 'Analytics', key: 'analytics', to: '/analytics', icon: BarChart3 },
  { name: 'Settings', key: 'settings', to: '/settings', icon: Settings },
])

const handleNavClick = () => {
  if (uiStore.isMobile) {
    uiStore.close()
  }
}

const handleNavKeyDown = (e: KeyboardEvent) => {
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return

  e.preventDefault()
  const links = Array.from(navRef.value?.querySelectorAll('a') || [])
  const activeIndex = links.findIndex(link => document.activeElement === link)

  let nextIndex = activeIndex
  if (e.key === 'ArrowDown') {
    nextIndex = activeIndex + 1
  } else if (e.key === 'ArrowUp') {
    nextIndex = activeIndex - 1
  }

  if (nextIndex < 0) {
    nextIndex = links.length - 1
  } else if (nextIndex >= links.length) {
    nextIndex = 0
  }

  links[nextIndex]?.focus()
}
</script>
