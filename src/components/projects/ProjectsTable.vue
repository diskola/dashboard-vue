<template>
  <div class="bg-app-surface rounded-lg border border-app-border overflow-hidden">
    <!-- Table Header -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-app-bg border-b border-app-border">
          <tr>
            <th class="w-12 px-4 py-3">
              <input 
                type="checkbox" 
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="$emit('selectAll')"
                class="rounded border-app-border text-app-primary focus:ring-app-primary"
              />
            </th>
            <th class="text-left px-4 py-3 text-sm font-medium text-app-text">Project</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-app-text hidden lg:table-cell">Owner</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-app-text hidden xl:table-cell">Team</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-app-text">Status</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-app-text hidden md:table-cell">Progress</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-app-text hidden lg:table-cell">Due Date</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-app-text hidden xl:table-cell">Tasks</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-app-text hidden lg:table-cell">Updated</th>
            <th class="w-12 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-app-border">
          <tr 
            v-for="project in projects" 
            :key="project.id"
            class="hover:bg-app-bg cursor-pointer transition-colors"
            @click="$emit('openDetails', project)"
          >
            <td class="px-4 py-4" @click.stop>
              <input 
                type="checkbox" 
                :checked="selectedProjects.includes(project.id)"
                @change="$emit('selectProject', project.id)"
                class="rounded border-app-border text-app-primary focus:ring-app-primary"
              />
            </td>
            
            <td class="px-4 py-4">
              <div class="flex items-center">
                <div :class="[
                  'w-3 h-3 rounded-full mr-3',
                  `bg-${project.color || 'app-primary'}`
                ]"></div>
                <div>
                  <p class="text-sm font-medium text-app-text">{{ project.name }}</p>
                  <p class="text-xs text-app-muted">{{ project.client || 'No client' }}</p>
                </div>
              </div>
            </td>
            
            <td class="px-4 py-4 hidden lg:table-cell">
              <div class="flex items-center">
                <div class="w-6 h-6 bg-app-primary rounded-full flex items-center justify-center mr-2">
                  <span class="text-xs text-white font-medium">{{ project.owner.initials }}</span>
                </div>
                <span class="text-sm text-app-text">{{ project.owner.name }}</span>
              </div>
            </td>
            
            <td class="px-4 py-4 hidden xl:table-cell">
              <div class="flex -space-x-1">
                <div 
                  v-for="member in project.team.slice(0, 3)" 
                  :key="member.id"
                  class="w-6 h-6 bg-app-muted rounded-full flex items-center justify-center border-2 border-app-surface"
                  :title="member.name"
                >
                  <span class="text-xs text-white font-medium">{{ member.initials }}</span>
                </div>
                <div 
                  v-if="project.team.length > 3"
                  class="w-6 h-6 bg-app-border rounded-full flex items-center justify-center border-2 border-app-surface"
                >
                  <span class="text-xs text-app-muted font-medium">+{{ project.team.length - 3 }}</span>
                </div>
              </div>
            </td>
            
            <td class="px-4 py-4">
              <span :class="[
                'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                getStatusColor(project.status)
              ]">
                {{ getStatusLabel(project.status) }}
              </span>
            </td>
            
            <td class="px-4 py-4 hidden md:table-cell">
              <div class="flex items-center">
                <div class="flex-1 bg-app-bg rounded-full h-2 mr-2">
                  <div 
                    class="bg-app-primary h-2 rounded-full"
                    :style="{ width: `${project.progress}%` }"
                  ></div>
                </div>
                <span class="text-xs text-app-muted">{{ project.progress }}%</span>
              </div>
            </td>
            
            <td class="px-4 py-4 hidden lg:table-cell">
              <span class="text-sm text-app-text">{{ formatDate(project.dueDate) }}</span>
            </td>
            
            <td class="px-4 py-4 hidden xl:table-cell">
              <span class="text-sm text-app-text">{{ project.completedTasks }}/{{ project.totalTasks }}</span>
            </td>
            
            <td class="px-4 py-4 hidden lg:table-cell">
              <span class="text-sm text-app-muted">{{ formatRelativeDate(project.updatedAt) }}</span>
            </td>
            
            <td class="px-4 py-4" @click.stop>
              <button class="p-1 text-app-muted hover:text-app-text">
                <MoreHorizontal class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'

interface Props {
  projects: any[]
  selectedProjects: string[]
}

const props = defineProps<Props>()

defineEmits<{
  selectProject: [projectId: string]
  selectAll: []
  openDetails: [project: any]
}>()

const isAllSelected = computed(() => {
  return props.projects.length > 0 && props.selectedProjects.length === props.projects.length
})

const isIndeterminate = computed(() => {
  return props.selectedProjects.length > 0 && props.selectedProjects.length < props.projects.length
})

const getStatusColor = (status: string) => {
  const colors = {
    planning: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    review: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    on_hold: 'bg-gray-100 text-gray-700'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status: string) => {
  const labels = {
    planning: 'Planning',
    'in-progress': 'In Progress',
    review: 'Review',
    completed: 'Completed',
    on_hold: 'On Hold'
  }
  return labels[status as keyof typeof labels] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })
}

const formatRelativeDate = (date: string) => {
  const now = new Date()
  const target = new Date(date)
  const diffTime = now.getTime() - target.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return formatDate(date)
}
</script>
