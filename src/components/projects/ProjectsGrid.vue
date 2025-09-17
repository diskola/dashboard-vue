<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div 
      v-for="project in projects" 
      :key="project.id"
      class="bg-app-surface rounded-card border border-app-border p-6 hover:shadow-lg transition-all cursor-pointer group"
      @click="$emit('openDetails', project)"
    >
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center">
          <div :class="[
            'w-3 h-3 rounded-full mr-3',
            `bg-${project.color || 'app-primary'}`
          ]"></div>
          <input 
            type="checkbox" 
            :checked="selectedProjects.includes(project.id)"
            @click.stop
            @change="$emit('selectProject', project.id)"
            class="rounded border-app-border text-app-primary focus:ring-app-primary"
          />
        </div>
        
        <button 
          @click.stop
          class="opacity-0 group-hover:opacity-100 p-1 text-app-muted hover:text-app-text transition-all"
        >
          <MoreHorizontal class="w-4 h-4" />
        </button>
      </div>

      <!-- Project Info -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-app-text mb-2">{{ project.name }}</h3>
        <div class="flex flex-wrap gap-2 mb-3">
          <span 
            v-if="project.client"
            class="inline-flex px-2 py-1 text-xs font-medium bg-app-bg text-app-muted rounded-full"
          >
            {{ project.client }}
          </span>
          <span 
            v-for="tag in project.tags?.slice(0, 2)" 
            :key="tag"
            class="inline-flex px-2 py-1 text-xs font-medium bg-app-primary/10 text-app-primary rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Progress Ring -->
      <div class="flex items-center justify-center mb-4">
        <div class="relative w-16 h-16">
          <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#E6E8EC"
              stroke-width="4"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#1E8E64"
              stroke-width="4"
              fill="transparent"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="getStrokeDashoffset(project.progress)"
              stroke-linecap="round"
              class="transition-all duration-300"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-sm font-semibold text-app-text">{{ project.progress }}%</span>
          </div>
        </div>
      </div>

      <!-- Status & Due Date -->
      <div class="flex items-center justify-between mb-4">
        <span :class="[
          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
          getStatusColor(project.status)
        ]">
          {{ getStatusLabel(project.status) }}
        </span>
        <span class="text-xs text-app-muted">Due {{ formatDate(project.dueDate) }}</span>
      </div>

      <!-- Team Avatars -->
      <div class="flex items-center justify-between">
        <div class="flex -space-x-1">
          <div 
            v-for="member in project.team.slice(0, 4)" 
            :key="member.id"
            class="w-6 h-6 bg-app-muted rounded-full flex items-center justify-center border-2 border-app-surface"
            :title="member.name"
          >
            <span class="text-xs text-white font-medium">{{ member.initials }}</span>
          </div>
          <div 
            v-if="project.team.length > 4"
            class="w-6 h-6 bg-app-border rounded-full flex items-center justify-center border-2 border-app-surface"
          >
            <span class="text-xs text-app-muted font-medium">+{{ project.team.length - 4 }}</span>
          </div>
        </div>

        <!-- Tasks Summary -->
        <span class="text-xs text-app-muted">
          {{ project.completedTasks }}/{{ project.totalTasks }} tasks
        </span>
      </div>
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

defineProps<Props>()

defineEmits<{
  selectProject: [projectId: string]
  openDetails: [project: any]
}>()

const circumference = 2 * Math.PI * 28

const getStrokeDashoffset = (progress: number) => {
  return circumference - (progress / 100) * circumference
}

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
</script>
