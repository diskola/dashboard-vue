<template>
  <main class="max-w-screen-2xl mx-auto px-6 lg:px-10 py-4 lg:py-6">
    <!-- Page Header -->
    <div class="mb-6 lg:mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl lg:text-2xl xl:text-3xl font-bold text-app-text mb-2">Dashboard</h1>
          <p class="text-sm lg:text-base text-app-muted">Welcome back! Here's what's happening with your projects today.</p>
        </div>
        
        <!-- Keyboard shortcut hint -->
        <div class="hidden lg:block">
          <div class="flex items-center space-x-2 text-xs text-app-muted bg-app-surface px-3 py-2 rounded-lg border border-app-border shadow-sm">
            <kbd class="px-2 py-1 bg-app-bg border border-app-border rounded text-xs font-mono">Ctrl</kbd>
            <span>+</span>
            <kbd class="px-2 py-1 bg-app-bg border border-app-border rounded text-xs font-mono">B</kbd>
            <span>Toggle sidebar</span>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <KPICard 
        v-for="kpi in kpiData" 
        :key="kpi.title"
        :title="kpi.title"
        :value="kpi.value"
        :change="kpi.change"
        :icon="kpi.icon"
        :trend="kpi.trend"
      />
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-4 lg:gap-6">
      <!-- Project Analytics -->
      <div class="lg:col-span-2 xl:col-span-8">
        <ProjectAnalytics />
      </div>
      
      <!-- Time Tracker -->
      <div class="xl:col-span-4">
        <TimeTracker />
      </div>

      <!-- Reminders -->
      <div class="xl:col-span-4">
        <Reminders />
      </div>

      <!-- Team List -->
      <div class="xl:col-span-4">
        <TeamList />
      </div>

      <!-- Project Progress -->
      <div class="xl:col-span-4">
        <ProjectProgress />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KPICard from '../components/KPICard.vue'
import ProjectAnalytics from '../components/ProjectAnalytics.vue'
import TimeTracker from '../components/TimeTracker.vue'
import Reminders from '../components/Reminders.vue'
import TeamList from '../components/TeamList.vue'
import ProjectProgress from '../components/ProjectProgress.vue'

const kpiData = ref([
  {
    title: 'Total Projects',
    value: '24',
    change: '+12%',
    trend: 'up' as const,
    icon: 'FolderOpen'
  },
  {
    title: 'Completed Tasks',
    value: '156',
    change: '+8%',
    trend: 'up' as const,
    icon: 'CheckCircle2'
  },
  {
    title: 'Team Members',
    value: '8',
    change: '+2',
    trend: 'up' as const,
    icon: 'Users'
  },
  {
    title: 'Pending Reviews',
    value: '12',
    change: '-4%',
    trend: 'down' as const,
    icon: 'Clock'
  }
])
</script>
