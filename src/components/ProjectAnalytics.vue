<template>
  <div class="bg-app-surface rounded-card p-6 shadow-sm border border-app-border">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-app-text">Project Analytics</h2>
      <select class="text-sm border border-app-border rounded-lg px-3 py-1 bg-app-surface text-app-text">
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 3 months</option>
      </select>
    </div>

    <!-- Mini Bar Chart -->
    <div class="space-y-4">
      <div v-for="day in weeklyData" :key="day.day" class="flex items-center justify-between">
        <span class="text-sm text-app-muted w-8">{{ day.day }}</span>
        <div class="flex-1 mx-4">
          <div class="h-8 bg-app-bg rounded-full overflow-hidden">
            <div 
              class="h-full bg-primary-gradient rounded-full transition-all duration-300"
              :style="{ width: `${(day.value / maxValue) * 100}%` }"
            ></div>
          </div>
        </div>
        <span class="text-sm font-medium text-app-text w-8 text-right">{{ day.value }}</span>
      </div>
    </div>

    <!-- Summary -->
    <div class="mt-6 pt-4 border-t border-app-border">
      <div class="flex justify-between text-sm">
        <span class="text-app-muted">Total tasks completed this week</span>
        <span class="font-medium text-app-text">{{ totalTasks }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const weeklyData = ref([
  { day: 'S', value: 12 },
  { day: 'M', value: 18 },
  { day: 'T', value: 15 },
  { day: 'W', value: 22 },
  { day: 'T', value: 19 },
  { day: 'F', value: 25 },
  { day: 'S', value: 16 },
])

const maxValue = computed(() => Math.max(...weeklyData.value.map(d => d.value)))
const totalTasks = computed(() => weeklyData.value.reduce((sum, d) => sum + d.value, 0))
</script>
