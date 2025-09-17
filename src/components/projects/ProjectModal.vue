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

  <!-- Modal -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-app-surface rounded-card border border-app-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-app-border">
          <h2 class="text-lg font-semibold text-app-text">
            {{ project ? 'Edit Project' : 'Create New Project' }}
          </h2>
          <button 
            @click="$emit('close')"
            class="p-2 text-app-muted hover:text-app-text rounded-lg hover:bg-app-bg"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-app-text mb-2">
                Project Name <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.name"
                type="text" 
                required
                class="w-full px-3 py-2 border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-transparent"
                placeholder="Enter project name"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-app-text mb-2">
                Description
              </label>
              <textarea 
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-transparent"
                placeholder="Project description..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-app-text mb-2">
                Client (Optional)
              </label>
              <input 
                v-model="form.client"
                type="text" 
                class="w-full px-3 py-2 border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-transparent"
                placeholder="Client name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-app-text mb-2">
                Status
              </label>
              <select 
                v-model="form.status"
                class="w-full px-3 py-2 border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-app-text mb-2">
                Priority
              </label>
              <select 
                v-model="form.priority"
                class="w-full px-3 py-2 border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-app-text mb-2">
                Color Badge
              </label>
              <div class="flex space-x-2">
                <button 
                  v-for="color in colorOptions" 
                  :key="color"
                  type="button"
                  @click="form.color = color"
                  :class="[
                    'w-8 h-8 rounded-full border-2 transition-all',
                    form.color === color ? 'border-app-text scale-110' : 'border-app-border',
                    `bg-${color}`
                  ]"
                ></button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-app-text mb-2">
                Start Date
              </label>
              <input 
                v-model="form.startDate"
                type="date" 
                class="w-full px-3 py-2 border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-app-text mb-2">
                Due Date
              </label>
              <input 
                v-model="form.dueDate"
                type="date" 
                class="w-full px-3 py-2 border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-app-text mb-2">
                Owner
              </label>
              <select 
                v-model="form.ownerId"
                class="w-full px-3 py-2 border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary"
              >
                <option value="">Select owner</option>
                <option value="1">Sarah Johnson</option>
                <option value="2">Michael Chen</option>
                <option value="3">Emily Davis</option>
                <option value="4">David Wilson</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-app-text mb-2">
                Tags
              </label>
              <input 
                v-model="tagsInput"
                type="text" 
                class="w-full px-3 py-2 border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary"
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-app-border">
            <button 
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-app-muted hover:text-app-text border border-app-border rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-6 py-2 bg-app-primary text-white text-sm font-medium rounded-lg hover:bg-app-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2"
            >
              {{ project ? 'Update Project' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  project?: any
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [projectData: any]
}>()

const form = ref({
  name: '',
  description: '',
  client: '',
  status: 'planning',
  priority: 'medium',
  color: 'app-primary',
  startDate: '',
  dueDate: '',
  ownerId: '',
  tags: [] as string[]
})

const tagsInput = ref('')

const colorOptions = [
  'app-primary',
  'red-500',
  'blue-500',
  'green-500',
  'purple-500',
  'yellow-500',
  'pink-500',
  'indigo-500'
]

// Watch for project changes to populate form
watch(() => props.project, (project) => {
  if (project) {
    form.value = {
      name: project.name || '',
      description: project.description || '',
      client: project.client || '',
      status: project.status || 'planning',
      priority: project.priority || 'medium',
      color: project.color || 'app-primary',
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      dueDate: project.dueDate ? project.dueDate.split('T')[0] : '',
      ownerId: project.owner?.id || '',
      tags: project.tags || []
    }
    tagsInput.value = (project.tags || []).join(', ')
  } else {
    // Reset form for new project
    form.value = {
      name: '',
      description: '',
      client: '',
      status: 'planning',
      priority: 'medium',
      color: 'app-primary',
      startDate: '',
      dueDate: '',
      ownerId: '',
      tags: []
    }
    tagsInput.value = ''
  }
}, { immediate: true })

// Watch tags input to update form
watch(tagsInput, (value) => {
  form.value.tags = value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : []
})

const handleSubmit = () => {
  // Emit save event with form data
  const projectData = {
    ...form.value,
    tags: form.value.tags
  }
  
  // Add validation here if needed
  if (!form.value.name.trim()) {
    return
  }
  
  // Emit the save event
  emit('save', projectData)
}
</script>
