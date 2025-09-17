<template>
  <header :class="[
    'sticky top-0 z-30 bg-app-surface/80 dark:bg-app-bg/80 backdrop-blur-sm border-b border-app-border dark:border-app-border/20 px-4 lg:px-6 h-[81px] flex items-center transition-shadow duration-200',
    hasScrollShadow ? 'shadow-lg' : ''
  ]">
    <div class="flex items-center justify-between w-full">
      <!-- Left Section: Hamburger + Title -->
      <div class="flex items-center space-x-4">
        <!-- Hamburger Menu Button -->
        <button 
          @click="handleToggle"
          :class="[
            'p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2 dark:focus:ring-offset-app-bg',
            'text-app-muted hover:bg-app-bg dark:hover:bg-app-surface/10 hover:text-app-text dark:hover:text-white'
          ]"
          :aria-label="getAriaLabel()"
          :aria-expanded="uiStore.sidebarOpen"
          title="Toggle sidebar (Ctrl+B)"
        >
          <div class="relative w-6 h-6">
            <PanelLeftClose 
              :class="['absolute inset-0 w-6 h-6 transition-all duration-300', shouldShowCloseIcon ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90']" 
            />
            <Menu 
              :class="['absolute inset-0 w-6 h-6 transition-all duration-300', !shouldShowCloseIcon ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90']" 
            />
          </div>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="flex-1 max-w-md mx-4 hidden sm:block">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search projects, tasks..."
            class="w-full pl-10 pr-4 py-2 bg-app-bg dark:bg-app-surface/10 border border-app-border dark:border-app-border/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-transparent text-sm transition-all duration-200 dark:text-white"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-1 lg:space-x-2">
        <!-- Notifications Popover -->
        <UiPopover popover-id="notifications-popover">
          <template #trigger="{ toggle, isOpen }">
            <button 
              @click="toggle"
              :class="['relative w-10 h-10 flex items-center justify-center rounded-full text-app-muted hover:bg-app-bg dark:hover:bg-app-surface/10 hover:text-app-text dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-app-bg', isOpen ? 'ring-app-primary' : 'ring-transparent']"
              aria-label="View notifications"
            >
              <Bell class="w-5 h-5" />
              <span v-if="notificationsStore.unreadCount > 0" class="absolute top-2 right-2 flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </button>
          </template>
          <template #content="{ close }">
            <NotificationsPopover @close="close" />
          </template>
        </UiPopover>

        <!-- Inbox Popover -->
        <UiPopover popover-id="inbox-popover">
          <template #trigger="{ toggle, isOpen }">
            <button 
              @click="toggle"
              :class="['w-10 h-10 flex items-center justify-center rounded-full text-app-muted hover:bg-app-bg dark:hover:bg-app-surface/10 hover:text-app-text dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-app-bg', isOpen ? 'ring-app-primary' : 'ring-transparent']"
              aria-label="View inbox"
            >
              <MessageSquare class="w-5 h-5" />
               <span v-if="inboxStore.unreadCount > 0" class="absolute top-2 right-2 w-2 h-2 bg-app-primary rounded-full"></span>
            </button>
          </template>
          <template #content="{ close }">
            <InboxPopover @close="close" />
          </template>
        </UiPopover>

        <!-- Profile Popover -->
        <UiPopover popover-id="profile-popover">
          <template #trigger="{ toggle, isOpen }">
            <button 
              @click="toggle"
              :class="['w-10 h-10 flex items-center justify-center rounded-full text-app-muted hover:bg-app-bg dark:hover:bg-app-surface/10 hover:text-app-text dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-app-bg', isOpen ? 'ring-app-primary' : 'ring-transparent']"
              aria-label="Open user menu"
            >
              <div class="w-8 h-8 bg-app-primary rounded-full flex items-center justify-center">
                <User class="w-5 h-5 text-white" />
              </div>
            </button>
          </template>
          <template #content="{ close }">
            <ProfilePopover @close="close" />
          </template>
        </UiPopover>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Menu, Search, Bell, MessageSquare, User, PanelLeftClose } from 'lucide-vue-next'
import { useUIStore } from '../stores/ui'
import { useNotificationsStore } from '../stores/notifications'
import { useInboxStore } from '../stores/inbox'
import { useScrollShadow } from '../composables/useScrollShadow'
import UiPopover from './ui/UiPopover.vue'
import NotificationsPopover from './popovers/NotificationsPopover.vue'
import InboxPopover from './popovers/InboxPopover.vue'
import ProfilePopover from './popovers/ProfilePopover.vue'

const uiStore = useUIStore()
const notificationsStore = useNotificationsStore()
const inboxStore = useInboxStore()
const { hasScrollShadow } = useScrollShadow()

const shouldShowCloseIcon = computed(() => {
  if (uiStore.isMobile) return uiStore.sidebarOpen
  return uiStore.sidebarOpen
})

const getAriaLabel = () => {
  if (uiStore.isMobile) return uiStore.sidebarOpen ? 'Close sidebar' : 'Open sidebar'
  if (!uiStore.sidebarOpen) return 'Open sidebar'
  if (uiStore.sidebarRail) return 'Close sidebar'
  return 'Collapse to rail'
}

const handleToggle = () => {
  uiStore.toggle()
}
</script>
