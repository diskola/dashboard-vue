<template>
  <div class="flex space-x-6 overflow-x-auto pb-4">
    <div 
      v-for="column in kanbanColumns" 
      :key="column.id"
      class="flex-shrink-0 w-80"
    >
      <!-- Column Header -->
      <div class="bg-app-surface rounded-t-lg border border-app-border border-b-0 px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <h3 class="text-sm font-semibold text-app-text">{{ column.title }}</h3>
            <span class="ml-2 px-2 py-1 text-xs bg-app-bg text-app-muted rounded-full">
              {{ column.projects.length }}
            </span>
          </div>
          <button class="p-1 text-app-muted hover:text-app-text">
            <Plus class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Column Content -->
      <div class="bg-app-bg border border-app-border border-t-0 rounded-b-lg p-4 min-h-[600px]">
        <div class="space-y-3">
          <div 
            v-for="project in column.projects" 
            :key="project.id"
            class="bg-app-surface rounded-lg border border-app-border p-4 cursor-pointer hover:shadow-md transition-all"
            @click="$emit('openDetails', project)"
          >
            <!-- Project Header -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center">
                <div :class="[
                  'w-2 h-2 rounded-full mr-2',
                  `bg-${project.color || 'app-primary'}`
                ]"></div>
                <h4 class="text-sm font-medium text-app-text">{{ project.name }}</h4>
              </div>
              <button class="p-1 text-app-muted hover:text-app-text">
                <MoreHorizontal class="w-3 h-3" />
              </button>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1 mb-3" v-if="project.tags?.length">
              <span 
                v-for="tag in project.tags.slice(0, 2)" 
                :key="tag"
                class="inline-flex px-2 py-1 text-xs font-medium bg-app-primary/10 text-app-primary rounded"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Progress -->
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-app-muted">Progress</span>
                <span class="text-xs text-app-text font-medium">{{ project.progress }}%</span>
              </div>
              <div class="w-full bg-app-border rounded-full h-1.5">
                <div 
                  class="bg-app-primary h-1.5 rounded-full transition-all"
                  :style="{ width: `${project.progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between">
              <!-- Team -->
              <div class="flex -space-x-1">
                <div 
                  v-for="member in project.team.slice(0, 3)" 
                  :key="member.id"
                  class="w-5 h-5 bg-app-muted rounded-full flex items-center justify-center border border-app-surface"
                  :title="member.name"
                >
                  <span class="text-xs text-white font-medium">{{ member.initials }}</span>
                </div>
                <div 
                  v-if="project.team.length > 3"
                  class="w-5 h-5 bg-app-border rounded-full flex items-center justify-center border border-app-surface"
                >
                  <span class="text-xs text-app-muted font-medium">+{{ project.team.length - 3 }}</span>
                </div>
              </div>

              <!-- Due Date -->
              <div class="flex items-center text-xs text-app-muted">
                <Calendar class="w-3 h-3 mr-1" />
                {{ formatDate(project.dueDate) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus, MoreHorizontal, Calendar } from 'lucide-vue-next'

interface Props {
  projects: any[]
}

const props = defineProps<Props>()

defineEmits<{
  openDetails: [project: any]
}>()

const kanbanColumns = computed(() => {
  const columns = [
    { id: 'backlog', title: 'Backlog', status: 'planning' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'review', title: 'Review', status: 'review' },
    { id: 'done', title: 'Done', status: 'completed' }
  ]

  return columns.map(column => ({
    ...column,
    projects: props.projects.filter(project => project.status === column.status)
  }))
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })
}
</script>
