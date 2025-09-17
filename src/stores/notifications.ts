import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { faker } from '@faker-js/faker'

export interface Notification {
  id: string
  type: 'comment' | 'mention' | 'update'
  title: string
  content: string
  time: string
  read: boolean
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  const generateMockNotifications = () => {
    const types: Notification['type'][] = ['comment', 'mention', 'update']
    return Array.from({ length: 15 }, () => ({
      id: faker.string.uuid(),
      type: faker.helpers.arrayElement(types),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(8),
      time: faker.date.recent({ days: 3 }).toISOString(),
      read: faker.datatype.boolean(0.7)
    }))
  }

  const fetchNotifications = () => {
    notifications.value = generateMockNotifications()
  }

  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  const allNotifications = computed(() => notifications.value)
  const mentionNotifications = computed(() => notifications.value.filter(n => n.type === 'mention'))

  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }
  
  // Initial fetch
  fetchNotifications()

  return {
    notifications,
    unreadCount,
    allNotifications,
    mentionNotifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  }
})
