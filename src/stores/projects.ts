import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { faker } from '@faker-js/faker'

interface TeamMember {
  id: string
  name: string
  initials: string
  role?: string
}

interface Project {
  id: string
  name: string
  description?: string
  client?: string
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on_hold'
  priority: 'low' | 'medium' | 'high'
  progress: number
  color?: string
  startDate: string
  dueDate: string
  completedTasks: number
  totalTasks: number
  owner: TeamMember
  team: TeamMember[]
  tags?: string[]
  updatedAt: string
  createdAt: string
}

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const isLoading = ref(false)

  // Generate mock data
  const generateMockProjects = (): Project[] => {
    const statuses: Project['status'][] = ['planning', 'in-progress', 'review', 'completed', 'on_hold']
    const priorities: Project['priority'][] = ['low', 'medium', 'high']
    const colors = ['app-primary', 'red-500', 'blue-500', 'green-500', 'purple-500', 'yellow-500']
    
    const teamMembers: TeamMember[] = [
      { id: '1', name: 'Sarah Johnson', initials: 'SJ', role: 'Product Manager' },
      { id: '2', name: 'Michael Chen', initials: 'MC', role: 'UI/UX Designer' },
      { id: '3', name: 'Emily Davis', initials: 'ED', role: 'Frontend Developer' },
      { id: '4', name: 'David Wilson', initials: 'DW', role: 'Backend Developer' },
      { id: '5', name: 'Lisa Anderson', initials: 'LA', role: 'QA Engineer' },
      { id: '6', name: 'James Brown', initials: 'JB', role: 'DevOps Engineer' }
    ]

    return Array.from({ length: 24 }, (_, index) => {
      const totalTasks = faker.number.int({ min: 5, max: 50 })
      const completedTasks = faker.number.int({ min: 0, max: totalTasks })
      const progress = Math.round((completedTasks / totalTasks) * 100)
      
      const projectTeam = faker.helpers.arrayElements(teamMembers, { min: 2, max: 5 })
      const owner = faker.helpers.arrayElement(projectTeam)

      return {
        id: `project-${index + 1}`,
        name: faker.company.catchPhrase(),
        description: faker.lorem.sentences(2),
        client: faker.datatype.boolean() ? faker.company.name() : undefined,
        status: faker.helpers.arrayElement(statuses),
        priority: faker.helpers.arrayElement(priorities),
        progress,
        color: faker.helpers.arrayElement(colors),
        startDate: faker.date.recent({ days: 30 }).toISOString(),
        dueDate: faker.date.future({ days: 60 }).toISOString(),
        completedTasks,
        totalTasks,
        owner,
        team: projectTeam,
        tags: faker.helpers.arrayElements(['Web', 'Mobile', 'Design', 'Marketing', 'Research', 'Development'], { min: 1, max: 3 }),
        updatedAt: faker.date.recent({ days: 7 }).toISOString(),
        createdAt: faker.date.past({ years: 1 }).toISOString()
      }
    })
  }

  // Actions
  const loadProjects = async () => {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      projects.value = generateMockProjects()
    } finally {
      isLoading.value = false
    }
  }

  const createProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: projectData.name || '',
      description: projectData.description,
      client: projectData.client,
      status: projectData.status || 'planning',
      priority: projectData.priority || 'medium',
      progress: 0,
      color: projectData.color || 'app-primary',
      startDate: projectData.startDate || new Date().toISOString(),
      dueDate: projectData.dueDate || faker.date.future({ days: 30 }).toISOString(),
      completedTasks: 0,
      totalTasks: 0,
      owner: {
        id: '1',
        name: 'Sarah Johnson',
        initials: 'SJ',
        role: 'Product Manager'
      },
      team: [
        {
          id: '1',
          name: 'Sarah Johnson',
          initials: 'SJ',
          role: 'Product Manager'
        }
      ],
      tags: projectData.tags || [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    projects.value.unshift(newProject)
  }

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const index = projects.value.findIndex(p => p.id === projectId)
    if (index > -1) {
      projects.value[index] = {
        ...projects.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  const deleteProject = (projectId: string) => {
    const index = projects.value.findIndex(p => p.id === projectId)
    if (index > -1) {
      projects.value.splice(index, 1)
    }
  }

  // Getters
  const getFilteredProjects = (
    searchQuery: string,
    filters: any,
    savedView: string,
    sortBy: string
  ) => {
    let filtered = [...projects.value]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.client?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply filters
    if (filters.owner) {
      filtered = filtered.filter(project =>
        project.owner.id === filters.owner
      )
    }

    if (filters.status) {
      filtered = filtered.filter(project =>
        project.status === filters.status
      )
    }

    if (filters.priority) {
      filtered = filtered.filter(project =>
        project.priority === filters.priority
      )
    }

    if (filters.tag) {
      const tag = filters.tag.toLowerCase()
      filtered = filtered.filter(project =>
        project.tags?.some(t => t.toLowerCase().includes(tag))
      )
    }

    // Apply saved view filter
    if (savedView !== 'all') {
      switch (savedView) {
        case 'running':
          filtered = filtered.filter(p => p.status === 'in-progress')
          break
        case 'pending':
          filtered = filtered.filter(p => p.status === 'planning')
          break
        case 'ended':
          filtered = filtered.filter(p => p.status === 'completed')
          break
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'progress':
        filtered.sort((a, b) => b.progress - a.progress)
        break
      case 'updated':
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case 'due':
        filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        break
    }

    return filtered
  }

  const getProjectById = (projectId: string) => {
    return projects.value.find(p => p.id === projectId)
  }

  const getProjectStats = computed(() => {
    const total = projects.value.length
    const running = projects.value.filter(p => p.status === 'in-progress').length
    const pending = projects.value.filter(p => p.status === 'planning').length
    const ended = projects.value.filter(p => p.status === 'completed').length

    return { total, running, pending, ended }
  })

  return {
    // State
    projects,
    isLoading,

    // Actions
    loadProjects,
    createProject,
    updateProject,
    deleteProject,

    // Getters
    getFilteredProjects,
    getProjectById,
    getProjectStats
  }
})
