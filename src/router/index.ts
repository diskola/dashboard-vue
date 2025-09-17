import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import Projects from '../views/Projects.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: { activeKey: 'dashboard' }
      },
      {
        path: 'projects',
        name: 'Projects',
        component: Projects,
        meta: { activeKey: 'projects' }
      },
      { path: 'tasks', name: 'Tasks', component: { template: '<div class="p-6">Tasks Page</div>' }, meta: { activeKey: 'tasks' } },
      { path: 'team', name: 'Team', component: { template: '<div class="p-6">Team Page</div>' }, meta: { activeKey: 'team' } },
      { path: 'calendar', name: 'Calendar', component: { template: '<div class="p-6">Calendar Page</div>' }, meta: { activeKey: 'calendar' } },
      { path: 'analytics', name: 'Analytics', component: { template: '<div class="p-6">Analytics Page</div>' }, meta: { activeKey: 'analytics' } },
      { path: 'settings', name: 'Settings', component: { template: '<div class="p-6">Settings Page</div>' }, meta: { activeKey: 'settings' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
