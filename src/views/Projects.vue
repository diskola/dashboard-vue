<template>
  <main class="max-w-screen-2xl mx-auto px-6 lg:px-10 py-4 lg:py-6">
    <!-- Page Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
      <div class="mb-4 lg:mb-0">
        <h1 class="text-xl lg:text-2xl xl:text-3xl font-bold text-app-text mb-2">Projects</h1>
        <p class="text-sm lg:text-base text-app-muted">Manage and track all your projects in one place</p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex items-center space-x-3">
        <button 
          class="px-4 py-2 text-sm font-medium text-app-muted hover:text-app-text transition-colors"
          @click="importProjects"
        >
          Import
        </button>
        
        <button 
          :disabled="!hasSelectedProjects"
          :class="[
            'px-4 py-2 text-sm font-medium transition-colors',
            hasSelectedProjects 
              ? 'text-app-text hover:bg-app-bg' 
              : 'text-app-muted cursor-not-allowed'
          ]"
          @click="openBulkActions"
        >
          Bulk Actions
        </button>
        
        <button 
          class="px-6 py-2 bg-app-primary text-white text-sm font-medium rounded-lg hover:bg-app-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2"
          @click="openCreateModal"
        >
          <Plus class="w-4 h-4 inline mr-2" />
          New Project
        </button>
      </div>
    </div>

    <!-- KPI Strip -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div v-for="kpi in kpiStats" :key="kpi.label" class="bg-app-surface rounded-lg p-4 border border-app-border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-app-muted">{{ kpi.label }}</p>
            <p class="text-2xl font-bold text-app-text">{{ kpi.value }}</p>
          </div>
          <span :class="[
            'text-xs px-2 py-1 rounded-full',
            kpi.trend === 'up' ? 'bg-green-100 text-green-700' : 
            kpi.trend === 'down' ? 'bg-red-100 text-red-700' : 
            'bg-gray-100 text-gray-700'
          ]">
            {{ kpi.change }}
          </span>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-app-surface rounded-lg border border-app-border p-4 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              ref="searchInput"
              v-model="searchQuery"
              type="text" 
              placeholder="Search projects..."
              class="w-full pl-10 pr-4 py-2 bg-app-bg border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-transparent text-sm"
            />
          </div>
        </div>

        <!-- Filters & Views -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Saved Views -->
          <div class="flex bg-app-bg rounded-lg p-1">
            <button 
              v-for="view in savedViews" 
              :key="view.key"
              @click="activeSavedView = view.key"
              :class="[
                'px-3 py-1 text-sm rounded-md transition-colors',
                activeSavedView === view.key 
                  ? 'bg-app-surface text-app-text shadow-sm' 
                  : 'text-app-muted hover:text-app-text'
              ]"
            >
              {{ view.label }}
            </button>
          </div>

          <!-- Filter Button -->
          <button 
            @click="showFilters = !showFilters"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-lg transition-colors border',
              showFilters 
                ? 'bg-app-primary text-white border-app-primary' 
                : 'bg-app-surface text-app-muted border-app-border hover:text-app-text'
            ]"
          >
            <Filter class="w-4 h-4 inline mr-1" />
            Filters
          </button>

          <!-- Sort -->
          <select 
            v-model="sortBy"
            class="px-3 py-2 text-sm bg-app-surface border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary"
          >
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
            <option value="updated">Sort by Updated</option>
            <option value="due">Sort by Due Date</option>
          </select>

          <!-- View Toggle -->
          <div class="flex bg-app-bg rounded-lg p-1">
            <button 
              v-for="view in viewModes" 
              :key="view.key"
              @click="activeView = view.key"
              :class="[
                'p-2 rounded-md transition-colors',
                activeView === view.key 
                  ? 'bg-app-surface text-app-text shadow-sm' 
                  : 'text-app-muted hover:text-app-text'
              ]"
              :title="view.label"
            >
              <component :is="view.icon" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Expanded Filters -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="showFilters" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-app-border">
          <select v-model="filters.owner" class="px-3 py-2 text-sm bg-app-bg border border-app-border rounded-lg">
            <option value="">All Owners</option>
            <option value="1">Sarah Johnson</option>
            <option value="2">Michael Chen</option>
            <option value="3">Emily Davis</option>
          </select>
          
          <select v-model="filters.status" class="px-3 py-2 text-sm bg-app-bg border border-app-border rounded-lg">
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
          
          <select v-model="filters.priority" class="px-3 py-2 text-sm bg-app-bg border border-app-border rounded-lg">
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          
          <input 
            v-model="filters.tag"
            placeholder="Filter by tags..."
            class="px-3 py-2 text-sm bg-app-bg border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary"
          />
        </div>
      </Transition>
    </div>

    <!-- Content Views -->
    <div class="relative">
      <ProjectsTable 
        v-if="activeView === 'table'"
        :projects="filteredProjects"
        :selected-projects="selectedProjects"
        @select-project="toggleProjectSelection"
        @select-all="toggleSelectAll"
        @open-details="openProjectDetails"
      />
      <ProjectsGrid 
        v-else-if="activeView === 'cards'"
        :projects="filteredProjects"
        :selected-projects="selectedProjects"
        @select-project="toggleProjectSelection"
        @open-details="openProjectDetails"
      />
      <ProjectsKanban 
        v-else-if="activeView === 'kanban'"
        :projects="filteredProjects"
        @open-details="openProjectDetails"
      />
      <div v-if="filteredProjects.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-app-bg rounded-full flex items-center justify-center mx-auto mb-4">
          <FolderOpen class="w-8 h-8 text-app-muted" />
        </div>
        <h3 class="text-lg font-medium text-app-text mb-2">No projects found</h3>
        <p class="text-app-muted mb-6">Get started by creating your first project or adjust your filters.</p>
        <button 
          @click="openCreateModal"
          class="px-6 py-2 bg-app-primary text-white text-sm font-medium rounded-lg hover:bg-app-primary-900 transition-colors"
        >
          Create Project
        </button>
      </div>
    </div>

    <!-- Bulk Actions Footer -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-full"
    >
      <div v-if="hasSelectedProjects" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-app-surface border border-app-border rounded-lg shadow-lg p-4 z-40">
        <div class="flex items-center space-x-4">
          <span class="text-sm text-app-muted">{{ selectedProjects.length }} project(s) selected</span>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-sm text-app-muted hover:text-app-text">Archive</button>
            <button class="px-3 py-1 text-sm text-app-muted hover:text-app-text">Change Status</button>
            <button class="px-3 py-1 text-sm text-app-muted hover:text-app-text">Assign Owner</button>
            <button @click="clearSelection" class="px-3 py-1 text-sm text-app-primary hover:text-app-primary-900">Clear</button>
          </div>
        </div>
      </div>
    </Transition>

    <ProjectDetailsDrawer 
      :project="selectedProject"
      :is-open="showDetailsDrawer"
      @close="closeProjectDetails"
      @edit="openEditModal"
    />
    <ProjectModal 
      :project="editingProject"
      :is-open="showProjectModal"
      @close="closeProjectModal"
      @save="saveProject"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Plus, Search, Filter, FolderOpen, List, Grid3x3, Kanban } from 'lucide-vue-next'
import ProjectsTable from '../components/projects/ProjectsTable.vue'
import ProjectsGrid from '../components/projects/ProjectsGrid.vue'
import ProjectsKanban from '../components/projects/ProjectsKanban.vue'
import ProjectDetailsDrawer from '../components/projects/ProjectDetailsDrawer.vue'
import ProjectModal from '../components/projects/ProjectModal.vue'
import { useProjectsStore } from '../stores/projects'

const projectsStore = useProjectsStore()

const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const showFilters = ref(false)
const activeView = ref<'table' | 'cards' | 'kanban'>('table')
const activeSavedView = ref('all')
const sortBy = ref('name')
const selectedProjects = ref<string[]>([])
const showDetailsDrawer = ref(false)
const showProjectModal = ref(false)
const selectedProject = ref<any>(null)
const editingProject = ref<any>(null)

const filters = ref({ owner: '', status: '', priority: '', tag: '' })

const savedViews = [
  { key: 'all', label: 'All' },
  { key: 'running', label: 'Running' },
  { key: 'pending', label: 'Pending' },
  { key: 'ended', label: 'Ended' }
]

const viewModes = [
  { key: 'table', label: 'Table View', icon: List },
  { key: 'cards', label: 'Card View', icon: Grid3x3 },
  { key: 'kanban', label: 'Kanban View', icon: Kanban }
]

const kpiStats = computed(() => {
  const stats = projectsStore.getProjectStats
  return [
    { label: 'Total', value: stats.total, change: '+2', trend: 'up' },
    { label: 'Running', value: stats.running, change: '+1', trend: 'up' },
    { label: 'Pending', value: stats.pending, change: '0', trend: 'neutral' },
    { label: 'Ended', value: stats.ended, change: '+1', trend: 'up' }
  ]
})

const filteredProjects = computed(() => {
  return projectsStore.getFilteredProjects(searchQuery.value, filters.value, activeSavedView.value, sortBy.value)
})

const hasSelectedProjects = computed(() => selectedProjects.value.length > 0)

const toggleProjectSelection = (projectId: string) => {
  const index = selectedProjects.value.indexOf(projectId)
  if (index > -1) {
    selectedProjects.value.splice(index, 1)
  } else {
    selectedProjects.value.push(projectId)
  }
}

const toggleSelectAll = () => {
  if (selectedProjects.value.length === filteredProjects.value.length) {
    selectedProjects.value = []
  } else {
    selectedProjects.value = filteredProjects.value.map(p => p.id)
  }
}

const clearSelection = () => {
  selectedProjects.value = []
}

const openProjectDetails = (project: any) => {
  selectedProject.value = project
  showDetailsDrawer.value = true
}

const closeProjectDetails = () => {
  showDetailsDrawer.value = false
  selectedProject.value = null
}

const openCreateModal = () => {
  editingProject.value = null
  showProjectModal.value = true
}

const openEditModal = (project?: any) => {
  editingProject.value = project || selectedProject.value
  showProjectModal.value = true
}

const closeProjectModal = () => {
  showProjectModal.value = false
  editingProject.value = null
}

const saveProject = (projectData: any) => {
  if (editingProject.value) {
    projectsStore.updateProject(editingProject.value.id, projectData)
  } else {
    projectsStore.createProject(projectData)
  }
  closeProjectModal()
}

const importProjects = () => console.log('Import projects')
const openBulkActions = () => console.log('Bulk actions')

const handleLocalKeydown = (event: KeyboardEvent) => {
  if (event.key === '/' && !event.target?.closest('input, textarea')) {
    event.preventDefault()
    searchInput.value?.focus()
  }
  if (event.key === 'v' && !event.target?.closest('input, textarea')) {
    event.preventDefault()
    const currentIndex = viewModes.findIndex(v => v.key === activeView.value)
    const nextIndex = (currentIndex + 1) % viewModes.length
    activeView.value = viewModes[nextIndex].key
  }
  if (event.key === 'f' && !event.target?.closest('input, textarea')) {
    event.preventDefault()
    showFilters.value = !showFilters.value
  }
}

onMounted(() => {
  if (projectsStore.projects.length === 0) {
    projectsStore.loadProjects()
  }
  window.addEventListener('keydown', handleLocalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleLocalKeydown)
})
</script>
