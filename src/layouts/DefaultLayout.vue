<template>
  <div :class="[
    'min-h-screen bg-app-bg font-inter',
    uiStore.theme
  ]">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <div :class="[
      'transition-all duration-300 ease-in-out min-h-screen',
      uiStore.contentMargin
    ]">
      <!-- Top Navigation -->
      <TopBar />
      
      <!-- Router View for nested routes -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import TopBar from '../components/TopBar.vue'
import { useUIStore } from '../stores/ui'
import { useNavigationStore } from '../stores/navigation'
import { usePopoverStore } from '../stores/popover'
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts'

const uiStore = useUIStore()
const navigationStore = useNavigationStore()
const popoverStore = usePopoverStore()
const route = useRoute()

// Setup global keyboard shortcuts
useKeyboardShortcuts()

// Watch route changes to update navigation state
watch(() => route.path, () => {
  // Update active sidebar item based on route meta
  if (route.meta.activeKey) {
    navigationStore.setActiveKey(route.meta.activeKey as string)
  }
  // Close all popovers on route change
  popoverStore.close()
}, { immediate: true })


// Handle window resize for responsive UI
const handleResize = () => {
  if (typeof window !== 'undefined') {
    uiStore.updateWindowWidth(window.innerWidth)
  }
}

onMounted(() => {
  handleResize()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
  uiStore.unlockBodyScroll()
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
