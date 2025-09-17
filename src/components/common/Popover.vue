<template>
  <div class="relative">
    <div ref="triggerRef" @click="popoverStore.toggle(popoverId)">
      <slot name="trigger" :is-open="isOpen" :aria-props="ariaProps"></slot>
    </div>

    <teleport to="body">
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-95"
      >
        <div
          v-if="isOpen"
          ref="contentRef"
          :id="popoverId"
          :style="positionStyles"
          class="fixed z-50"
          role="dialog"
          aria-modal="true"
        >
          <slot name="content"></slot>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePopoverStore } from '../../stores/popover'
import { onClickOutside } from '../../composables/onClickOutside'
import { useFocusTrap } from '../../composables/useFocusTrap'

const props = defineProps<{
  popoverId: string
}>()

const popoverStore = usePopoverStore()
const isOpen = popoverStore.isOpen(props.popoverId)

const triggerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

const positionStyles = ref({})

const calculatePosition = () => {
  if (!triggerRef.value || !contentRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  
  positionStyles.value = {
    top: `${triggerRect.bottom + 8}px`,
    right: `${window.innerWidth - triggerRect.right}px`,
  }
}

watch(isOpen, (newValue) => {
  if (newValue) {
    // Wait for content to be rendered and then calculate position
    onMounted(() => {
      calculatePosition()
      // Set initial focus
      const focusable = contentRef.value?.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement
      focusable?.focus()
    })
  }
})

// Close on escape
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    popoverStore.close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onClickOutside(contentRef, () => {
  if (isOpen.value) {
    popoverStore.close()
  }
})

useFocusTrap(contentRef)

const ariaProps = computed(() => ({
  'aria-haspopup': 'true',
  'aria-expanded': isOpen.value,
  'aria-controls': props.popoverId,
}))
</script>
