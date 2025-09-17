import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { faker } from '@faker-js/faker'

export interface Thread {
  id: string
  name: string
  initials: string
  snippet: string
  time: string
  unread: number
}

export const useInboxStore = defineStore('inbox', () => {
  const threads = ref<Thread[]>([])

  const generateMockThreads = () => {
    return Array.from({ length: 8 }, () => {
      const name = faker.person.fullName()
      return {
        id: faker.string.uuid(),
        name,
        initials: name.split(' ').map(n => n[0]).join(''),
        snippet: faker.lorem.sentence(),
        time: `${faker.number.int({ min: 1, max: 59 })}m`,
        unread: faker.helpers.arrayElement([0, 0, 0, 1, 2, 3]),
      }
    })
  }

  const fetchThreads = () => {
    threads.value = generateMockThreads()
  }

  const unreadCount = computed(() => threads.value.reduce((sum, t) => sum + t.unread, 0))

  fetchThreads()

  return {
    threads,
    unreadCount,
    fetchThreads,
  }
})
