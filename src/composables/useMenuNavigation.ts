import { type Ref } from 'vue'

export function useMenuNavigation(container: Ref<HTMLElement | undefined>) {
  const getFocusableItems = () => {
    if (!container.value) return []
    return Array.from(
      container.value.querySelectorAll(
        '[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]'
      )
    ) as HTMLElement[]
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = getFocusableItems()
    if (items.length === 0) return

    const activeIndex = items.findIndex(item => document.activeElement === item)

    let nextIndex = -1

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = activeIndex >= 0 ? (activeIndex + 1) % items.length : 0
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = items.length - 1
    }

    if (nextIndex !== -1) {
      items[nextIndex]?.focus()
    }
  }

  return {
    handleKeyDown,
  }
}
