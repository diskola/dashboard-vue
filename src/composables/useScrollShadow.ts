import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollShadow() {
  const hasScrollShadow = ref(false)

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      hasScrollShadow.value = window.scrollY > 0
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      // Check initial scroll position
      handleScroll()
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    hasScrollShadow
  }
}
