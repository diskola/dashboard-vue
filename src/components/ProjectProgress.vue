<template>
  <div class="bg-app-surface rounded-card p-6 shadow-sm border border-app-border">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-app-text">Project Progress</h2>
      <button class="text-app-primary text-sm hover:underline">View details</button>
    </div>

    <!-- Radial Progress -->
    <div class="flex flex-col items-center mb-6">
      <div class="relative w-32 h-32 mb-4">
        <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          <!-- Background circle -->
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="#E6E8EC"
            stroke-width="8"
            fill="transparent"
          />
          <!-- Progress circle -->
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="url(#gradient)"
            stroke-width="8"
            fill="transparent"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            stroke-linecap="round"
            class="transition-all duration-500 ease-in-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#0B3D2E" />
              <stop offset="100%" style="stop-color:#1E8E64" />
            </linearGradient>
          </defs>
        </svg>
        
        <!-- Percentage in center -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl font-bold text-app-text">{{ progress }}%</span>
        </div>
      </div>
      
      <p class="text-sm text-app-muted text-center">Overall project completion</p>
    </div>

    <!-- Project List -->
    <div class="space-y-3">
      <div v-for="project in projects" :key="project.id" class="flex items-center justify-between p-3 bg-app-bg rounded-lg">
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-app-text">{{ project.name }}</span>
            <span class="text-xs text-app-muted">{{ project.dueDate }}</span>
          </div>
          <div class="w-full bg-app-border rounded-full h-2">
            <div 
              class="bg-app-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: `${project.progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Project {
  id: number
  name: string
  progress: number
  dueDate: string
}

const progress = ref(41)
const circumference = 2 * Math.PI * 54

const strokeDashoffset = computed(() => {
  return circumference - (progress.value / 100) * circumference
})

const projects = ref<Project[]>([
  {
    id: 1,
    name: 'Website Redesign',
    progress: 75,
    dueDate: '2 days'
  },
  {
    id: 2,
    name: 'Mobile App',
    progress: 45,
    dueDate: '1 week'
  },
  {
    id: 3,
    name: 'Brand Guidelines',
    progress: 90,
    dueDate: 'Tomorrow'
  }
])
</script>
