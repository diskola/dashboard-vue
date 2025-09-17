<template>
  <div class="bg-app-surface rounded-card p-6 shadow-sm border border-app-border">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-app-text">Reminders</h2>
      <button class="text-app-primary text-sm hover:underline">View all</button>
    </div>

    <div class="space-y-4">
      <div v-for="reminder in reminders" :key="reminder.id" class="flex items-start space-x-3 p-3 bg-app-bg rounded-lg">
        <div :class="[
          'w-2 h-2 rounded-full mt-2 flex-shrink-0',
          reminder.priority === 'high' ? 'bg-red-500' :
          reminder.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
        ]"></div>
        
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-app-text">{{ reminder.title }}</p>
          <p class="text-xs text-app-muted mt-1">{{ reminder.time }}</p>
        </div>
        
        <button class="text-app-muted hover:text-app-text">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Add Reminder -->
    <button class="w-full mt-4 py-2 border-2 border-dashed border-app-border rounded-lg text-app-muted hover:border-app-primary hover:text-app-primary transition-colors">
      <Plus class="w-4 h-4 inline mr-2" />
      Add reminder
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Plus } from 'lucide-vue-next'

interface Reminder {
  id: number
  title: string
  time: string
  priority: 'high' | 'medium' | 'low'
}

const reminders = ref<Reminder[]>([
  {
    id: 1,
    title: 'Review design mockups',
    time: 'Today at 2:00 PM',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Team standup meeting',
    time: 'Tomorrow at 9:00 AM',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Submit weekly report',
    time: 'Friday at 5:00 PM',
    priority: 'low'
  }
])
</script>
