<template>
  <div 
    ref="containerRef"
    @keydown="handleKeyDown"
    class="bg-app-surface dark:bg-app-bg rounded-2xl border border-app-border dark:border-app-border/20 shadow-card flex flex-col h-full sm:h-auto"
  >
    <!-- Header -->
    <div class="p-4 border-b border-app-border dark:border-app-border/20 flex items-center justify-between flex-shrink-0">
      <h3 class="font-semibold text-app-text dark:text-white">Inbox</h3>
      <button @click="$emit('close')" class="p-1 text-app-muted hover:text-app-text sm:hidden">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="inboxStore.threads.length > 0" class="divide-y divide-app-border dark:divide-app-border/20">
        <a 
          href="#"
          v-for="thread in inboxStore.threads" 
          :key="thread.id" 
          role="menuitem"
          class="p-4 hover:bg-app-bg dark:hover:bg-app-surface/10 flex items-start space-x-3 focus:outline-none focus:bg-app-bg dark:focus:bg-app-surface/10"
        >
          <div class="w-8 h-8 rounded-full bg-app-primary flex-shrink-0 flex items-center justify-center text-white text-sm">
            {{ thread.initials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center">
              <p class="text-sm font-medium text-app-text dark:text-gray-200 truncate">{{ thread.name }}</p>
              <p class="text-xs text-app-muted flex-shrink-0 ml-2">{{ thread.time }}</p>
            </div>
            <p class="text-sm text-app-muted truncate">{{ thread.snippet }}</p>
          </div>
          <div v-if="thread.unread > 0" class="w-5 h-5 bg-app-primary text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
            {{ thread.unread }}
          </div>
        </a>
      </div>
      <div v-else class="p-8 text-center text-app-muted">
        <Inbox class="w-12 h-12 mx-auto mb-4" />
        <p>Your inbox is empty.</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-2 border-t border-app-border dark:border-app-border/20 flex-shrink-0">
      <a href="#" role="menuitem" class="w-full flex items-center justify-center p-2 text-sm text-app-primary hover:bg-app-bg dark:hover:bg-app-surface/10 rounded-lg focus:outline-none focus:bg-app-bg dark:focus:bg-app-surface/10">
        Open Messages
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInboxStore } from '../../stores/inbox'
import { Inbox, X } from 'lucide-vue-next'
import { useMenuNavigation } from '../../composables/useMenuNavigation'

defineEmits(['close'])

const inboxStore = useInboxStore()
const containerRef = ref<HTMLElement>()
const { handleKeyDown } = useMenuNavigation(containerRef)
</script>
