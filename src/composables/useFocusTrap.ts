import { onMounted, onUnmounted, type Ref } from 'vue'

export function useFocusTrap(container: Ref<HTMLElement | undefined>) {
  const focusableElementsSelector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !container.value) return

    const focusableElements = Array.from(
      container.value.querySelectorAll(focusableElementsSelector)
    ) as HTMLElement[]

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    const activeElement = document.activeElement as HTMLElement

    if (e.shiftKey) {
      // Shift + Tab
      if (activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}
