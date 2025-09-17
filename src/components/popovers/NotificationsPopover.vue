<template>
  <div 
    ref="containerRef"
    @keydown="handleKeyDown"
    class="bg-app-surface dark:bg-app-bg rounded-2xl border border-app-border dark:border-app-border/20 shadow-card flex flex-col h-full sm:h-auto"
  >
    <!-- Header -->
    <div class="p-4 border-b border-app-border dark:border-app-border/20 flex items-center justify-between flex-shrink-0">
      <h3 class="font-semibold text-app-text dark:text-white">Notifications</h3>
      <button @click="$emit('close')" class="p-1 text-app-muted hover:text-app-text sm:hidden">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Tabs -->
    <div class="px-4 border-b border-app-border dark:border-app-border/20 flex-shrink-0">
      <div class="flex items-center justify-between">
        <nav class="flex space-x-4">
          <button 
            @click="activeTab = 'all'"
            role="menuitem"
            :class="['py-2 text-sm font-medium', activeTab === 'all' ? 'text-app-primary border-b-2 border-app-primary' : 'text-app-muted hover:text-app-text']"
          >
            All
          </button>
          <button 
            @click="activeTab = 'mentions'"
            role="menuitem"
            :class="['py-2 text-sm font-medium', activeTab === 'mentions' ? 'text-app-primary border-b-2 border-app-primary' : 'text-app-muted hover:text-app-text']"
          >
            Mentions
          </button>
        </nav>
        <button @click="notificationsStore.markAllAsRead()" role="menuitem" class="text-sm text-app-primary hover:underline">
          Mark all as read
        </button>
      </div>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="currentNotifications.length > 0" class="divide-y divide-app-border dark:divide-app-border/20">
        <a 
          href="#"
          v-for="notification in currentNotifications" 
          :key="notification.id" 
          role="menuitem"
          class="p-4 hover:bg-app-bg dark:hover:bg-app-surface/10 flex items-start space-x-3 focus:outline-none focus:bg-app-bg dark:focus:bg-app-surface/10"
          @click.prevent="notificationsStore.markAsRead(notification.id)"
        >
          <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" :class="notification.read ? 'bg-transparent' : 'bg-app-primary'"></div>
          <div class="flex-1">
            <p class="text-sm text-app-text dark:text-gray-200">{{ notification.title }}</p>
            <p class="text-xs text-app-muted mt-1">{{ formatRelativeDate(notification.time) }}</p>
          </div>
        </a>
      </div>
      <div v-else class="p-8 text-center text-app-muted">
        <BellOff class="w-12 h-12 mx-auto mb-4" />
        <p>No new notifications.</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-2 border-t border-app-border dark:border-app-border/20 flex-shrink-0">
       <a href="#" role="menuitem" class="w-full flex items-center justify-center p-2 text-sm text-app-muted hover:text-app-text rounded-lg hover:bg-app-bg dark:hover:bg-app-surface/10 focus:outline-none focus:bg-app-bg dark:focus:bg-app-surface/10">
        <Settings class="w-4 h-4 mr-2" />
        Notification settings
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotificationsStore } from '../../stores/notifications'
import { Settings, BellOff, X } from 'lucide-vue-next'
import { useMenuNavigation } from '../../composables/useMenuNavigation'

defineEmits(['close'])

const notificationsStore = useNotificationsStore()
const activeTab = ref('all')

const containerRef = ref<HTMLElement>()
const { handleKeyDown } = useMenuNavigation(containerRef)

const currentNotifications = computed(() => {
  return activeTab.value === 'all' 
    ? notificationsStore.allNotifications 
    : notificationsStore.mentionNotifications
})

const formatRelativeDate = (date: string) => {
  const now = new Date()
  const target = new Date(date)
  const diffTime = now.getTime() - target.getTime()
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}
</script>
