<template>
  <div class="bg-app-surface rounded-card p-6 shadow-sm border border-app-border">
    <div class="flex items-center justify-between mb-4">
      <div class="w-12 h-12 bg-app-primary/10 rounded-lg flex items-center justify-center">
        <component :is="iconComponent" class="w-6 h-6 text-app-primary" />
      </div>
      <span :class="[
        'text-sm font-medium px-2 py-1 rounded-full',
        trend === 'up' 
          ? 'text-green-700 bg-green-100' 
          : 'text-red-700 bg-red-100'
      ]">
        {{ change }}
      </span>
    </div>
    
    <div>
      <h3 class="text-2xl font-bold text-app-text mb-1">{{ value }}</h3>
      <p class="text-app-muted text-sm">{{ title }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FolderOpen, CheckCircle2, Users, Clock } from 'lucide-vue-next'

interface Props {
  title: string
  value: string
  change: string
  icon: string
  trend: 'up' | 'down'
}

const props = defineProps<Props>()

const iconMap = {
  FolderOpen,
  CheckCircle2,
  Users,
  Clock
}

const iconComponent = computed(() => iconMap[props.icon as keyof typeof iconMap])
</script>
