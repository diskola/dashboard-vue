<template>
  <!-- Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 bg-black/50" 
      @click="$emit('close')"
    ></div>
  </Transition>

  <!-- Drawer -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div 
      v-if="isOpen && project" 
      class="fixed right-0 top-0 bottom-0 w-full md:w-96 lg:w-[480px] bg-app-surface border-l border-app-border z-50 overflow-y-auto"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-app-border">
        <div>
          <h2 class="text-lg font-semibold text-app-text">{{ project.name }}</h2>
          <p class="text-sm text-app-muted">{{ project.client || 'No client' }}</p>
        </div>
        <button 
          @click="$emit('close')"
          class="p-2 text-app-muted hover:text-app-text rounded-lg hover:bg-app-bg"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b border-app-border">
        <nav class="flex space-x-8 px-6">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id 
                ? 'border-app-primary text-app-primary' 
                : 'border-transparent text-app-muted hover:text-app-text'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <!-- Quick Stats -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-app-bg rounded-lg p-4">
              <p class="text-sm text-app-muted">Progress</p>
              <p class="text-2xl font-bold text-app-text">{{ project.progress }}%</p>
            </div>
            <div class="bg-app-bg rounded-lg p-4">
              <p class="text-sm text-app-muted">Tasks</p>
              <p class="text-2xl font-bold text-app-text">{{ project.completedTasks }}/{{ project.totalTasks }}</p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h3 class="text-sm font-medium text-app-text mb-2">Description</h3>
            <p class="text-sm text-app-muted">{{ project.description || 'No description available.' }}</p>
          </div>

          <!-- Dates -->
          <div>
            <h3 class="text-sm font-medium text-app-text mb-2">Timeline</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-app-muted">Start Date</span>
                <span class="text-sm text-app-text">{{ formatDate(project.startDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-app-muted">Due Date</span>
                <span class="text-sm text-app-text">{{ formatDate(project.dueDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div>
            <h3 class="text-sm font-medium text-app-text mb-2">Status</h3>
            <span :class="[
              'inline-flex px-3 py-1 text-sm font-medium rounded-full',
              getStatusColor(project.status)
            ]">
              {{ getStatusLabel(project.status) }}
            </span>
          </div>
        </div>

        <!-- Tasks Tab -->
        <div v-else-if="activeTab === 'tasks'" class="space-y-4">
          <div class="text-center py-8">
            <CheckSquare class="w-12 h-12 text-app-muted mx-auto mb-4" />
            <p class="text-app-muted">Task details would be loaded here</p>
          </div>
        </div>

        <!-- Activity Tab -->
        <div v-else-if="activeTab === 'activity'" class="space-y-4">
          <div class="text-center py-8">
            <Activity class="w-12 h-12 text-app-muted mx-auto mb-4" />
            <p class="text-app-muted">Project activity would be shown here</p>
          </div>
        </div>

        <!-- Files Tab -->
        <div v-else-if="activeTab === 'files'" class="space-y-4">
          <div class="text-center py-8">
            <FileText class="w-12 h-12 text-app-muted mx-auto mb-4" />
            <p class="text-app-muted">Project files would be listed here</p>
          </div>
        </div>

        <!-- Members Tab -->
        <div v-else-if="activeTab === 'members'" class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-app-text mb-3">Team Members</h3>
            <div class="space-y-3">
              <div 
                v-for="member in project.team" 
                :key="member.id"
                class="flex items-center justify-between p-3 bg-app-bg rounded-lg"
              >
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-app-primary rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm text-white font-medium">{{ member.initials }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-app-text">{{ member.name }}</p>
                    <p class="text-xs text-app-muted">{{ member.role || 'Team Member' }}</p>
                  </div>
                </div>
                <button class="p-1 text-app-muted hover:text-app-text">
                  <MoreHorizontal class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Reminders Tab -->
        <div v-else-if="activeTab === 'reminders'" class="space-y-4">
          <div class="text-center py-8">
            <Bell class="w-12 h-12 text-app-muted mx-auto mb-4" />
            <p class="text-app-muted">Project reminders would be shown here</p>
          </div>
        </div>
      </div>

      <!-- Actions Footer -->
      <div class="border-t border-app-border p-6">
        <div class="flex space-x-3">
          <button 
            @click="$emit('edit')"
            class="flex-1 px-4 py-2 bg-app-primary text-white text-sm font-medium rounded-lg hover:bg-app-primary-900 transition-colors"
          >
            Edit Project
          </button>
          <button class="px-4 py-2 text-sm font-medium text-app-muted hover:text-app-text border border-app-border rounded-lg">
            Archive
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  X, CheckSquare, Activity, FileText, Bell, MoreHorizontal 
} from 'lucide-vue-next'

interface Props {
  project: any
  isOpen: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
  edit: []
}>()

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'activity', label: 'Activity' },
  { id: 'files', label: 'Files' },
  { id: 'members', label: 'Members' },
  { id: 'reminders', label: 'Reminders' }
]

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
    month: 'long',
    year: 'numeric'
  })
}
</script>
