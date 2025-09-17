<template>
  <div 
    ref="containerRef"
    @keydown="handleKeyDown"
    class="bg-app-surface dark:bg-app-bg rounded-2xl border border-app-border dark:border-app-border/20 shadow-card flex flex-col h-full sm:h-auto"
  >
    <!-- Header -->
    <div class="p-4 border-b border-app-border dark:border-app-border/20 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-app-primary rounded-full flex items-center justify-center">
          <User class="w-6 h-6 text-white" />
        </div>
        <div>
          <p class="font-semibold text-app-text dark:text-white">Sarah Johnson</p>
          <p class="text-sm text-app-muted">s.johnson@example.com</p>
        </div>
      </div>
      <button @click="$emit('close')" class="p-1 text-app-muted hover:text-app-text sm:hidden">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Menu Items -->
    <div class="p-2 flex-1 overflow-y-auto">
      <a v-for="item in menuItems" :key="item.label" href="#" role="menuitem" class="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-app-text dark:text-gray-200 rounded-lg hover:bg-app-bg dark:hover:bg-app-surface/10 focus:outline-none focus:bg-app-bg dark:focus:bg-app-surface/10">
        <div class="flex items-center">
          <component :is="item.icon" class="w-4 h-4 mr-3 text-app-muted" />
          <span>{{ item.label }}</span>
        </div>
        <ChevronRight v-if="item.hasChevron" class="w-4 h-4 text-app-muted" />
      </a>
      
      <!-- Theme Toggle -->
      <div class="px-3 py-2 text-sm text-app-text dark:text-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Palette class="w-4 h-4 mr-3 text-app-muted" />
            <span>Theme</span>
          </div>
          <div class="flex items-center space-x-1 bg-app-bg dark:bg-app-surface/10 p-1 rounded-md">
            <button 
              v-for="themeOption in themes"
              :key="themeOption.key"
              @click="uiStore.setTheme(themeOption.key)"
              role="menuitemradio"
              :aria-checked="uiStore.theme === themeOption.key"
              :class="['p-1 rounded transition-colors', uiStore.theme === themeOption.key ? 'bg-app-surface dark:bg-app-bg text-app-text dark:text-white shadow-sm' : 'text-app-muted hover:text-app-text dark:hover:text-white']"
              :aria-label="`Set theme to ${themeOption.label}`"
            >
              <component :is="themeOption.icon" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div class="h-px bg-app-border dark:bg-app-border/20 my-2"></div>

      <a href="#" role="menuitem" class="w-full text-left flex items-center px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 focus:outline-none focus:bg-red-50 dark:focus:bg-red-500/10">
        <LogOut class="w-4 h-4 mr-3" />
        <span>Logout</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  User, Settings, Keyboard, ChevronRight, Palette, Sun, Moon, Laptop, LogOut, X
} from 'lucide-vue-next'
import { useUIStore } from '../../stores/ui'
import { useMenuNavigation } from '../../composables/useMenuNavigation'

defineEmits(['close'])

const uiStore = useUIStore()
const containerRef = ref<HTMLElement>()
const { handleKeyDown } = useMenuNavigation(containerRef)

const menuItems = [
  { label: 'Profile', icon: User, hasChevron: true },
  { label: 'Settings', icon: Settings, hasChevron: true },
  { label: 'Keyboard Shortcuts', icon: Keyboard, hasChevron: true },
]

const themes = [
  { key: 'light' as const, label: 'Light', icon: Sun },
  { key: 'dark' as const, label: 'Dark', icon: Moon },
  { key: 'system' as const, label: 'System', icon: Laptop },
]
</script>
