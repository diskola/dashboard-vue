<template>
  <div class="relative" ref="wrapperRef">
    <div ref="triggerRef" class="inline-flex">
      <slot name="trigger" :toggle="toggle" :is-open="isOpen" :aria-props="ariaProps"></slot>
    </div>

    <teleport to="body">
      <!-- Mobile Backdrop -->
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isOpen && isMobile" @click="close" class="fixed inset-0 z-40 bg-black/60 sm:hidden"></div>
      </Transition>
      
      <!-- Content -->
      <Transition
        :enter-active-class="isMobile ? 'transition-transform duration-300 ease-out' : 'transition-all duration-200 ease-out'"
        :enter-from-class="isMobile ? 'translate-y-full' : 'opacity-0 translate-y-2 scale-95'"
        :enter-to-class="isMobile ? 'translate-y-0' : 'opacity-100 translate-y-0 scale-100'"
        :leave-active-class="isMobile ? 'transition-transform duration-200 ease-in' : 'transition-all duration-150 ease-in'"
        :leave-from-class="isMobile ? 'translate-y-0' : 'opacity-100 translate-y-0 scale-100'"
        :leave-to-class="isMobile ? 'translate-y-full' : 'opacity-0 translate-y-2 scale-95'"
      >
        <div
          v-if="isOpen"
          ref="contentRef"
          :id="popoverId"
          :style="positionStyles"
          :class="[
            'fixed z-50',
            // Mobile bottom sheet
            'sm:hidden w-full bottom-0 left-0 rounded-t-2xl max-h-[70vh]',
            // Desktop popover
            'hidden sm:block w-80 rounded-2xl shadow-card'
          ]"
          role="dialog"
          aria-modal="true"
          @keydown="handleContentKeydown"
        >
          <slot name="content" :close="close"></slot>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { usePopoverStore } from '../../stores/popover'
import { useUIStore } from '../../stores/ui'

const props = defineProps<{
  popoverId: string
  placement?: 'bottom-end' | 'bottom-start'
  offset?: number
}>()

const popoverStore = usePopoverStore()
const uiStore = useUIStore()

const wrapperRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const positionStyles = ref({})

const isOpen = computed(() => popoverStore.activePopover === props.popoverId)
const isMobile = computed(() => uiStore.isMobile || uiStore.isTablet)

const toggle = () => popoverStore.toggle(props.popoverId)
const close = () => popoverStore.close()

const calculatePosition = () => {
  if (isMobile.value || !triggerRef.value?.firstElementChild || !contentRef.value) return

  const triggerRect = triggerRef.value.firstElementChild.getBoundingClientRect()
  const contentRect = contentRef.value.getBoundingClientRect()
  const viewWidth = window.innerWidth
  const offset = props.offset ?? 8

  let top = triggerRect.bottom + offset
  let left = triggerRect.left

  if (props.placement === 'bottom-end') {
    left = triggerRect.right - contentRect.width
  }
  
  // Boundary detection
  if (left < offset) left = offset
  if (left + contentRect.width > viewWidth - offset) {
    left = viewWidth - contentRect.width - offset
  }

  positionStyles.value = {
    top: `${top}px`,
    left: `${left}px`,
  }
}

// Focus Management
const trapFocus = (e: KeyboardEvent) => {
  if (e.key !== 'Tab' || !contentRef.value) return

  const focusable = Array.from(
    contentRef.value.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
  ) as HTMLElement[]

  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement

  if (e.shiftKey && active === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

const handleContentKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
  trapFocus(e)
}

// Outside Click
const handleOutsideClick = (e: MouseEvent) => {
  if (
    isOpen.value &&
    wrapperRef.value &&
    contentRef.value &&
    !wrapperRef.value.contains(e.target as Node) &&
    !contentRef.value.contains(e.target as Node)
  ) {
    close()
  }
}

watch(isOpen, (open) => {
  if (open) {
    // Wait for render to calculate position
    requestAnimationFrame(() => {
      calculatePosition()
      // Set initial focus
      const firstFocusable = contentRef.value?.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement
      firstFocusable?.focus()
    })
    document.addEventListener('mousedown', handleOutsideClick)
  } else {
    // Return focus to trigger
    const triggerButton = triggerRef.value?.querySelector('button')
    triggerButton?.focus()
    document.removeEventListener('mousedown', handleOutsideClick)
  }
})

onMounted(() => {
  window.addEventListener('resize', calculatePosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculatePosition)
  document.removeEventListener('mousedown', handleOutsideClick)
})

const ariaProps = computed(() => ({
  'aria-haspopup': 'true',
  'aria-expanded': isOpen.value,
  'aria-controls': props.popoverId,
}))
</script>
