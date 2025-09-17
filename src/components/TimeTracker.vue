<template>
  <div class="bg-app-surface rounded-card p-6 shadow-sm border border-app-border">
    <h2 class="text-lg font-semibold text-app-text mb-6">Time Tracker</h2>

    <!-- Timer Display -->
    <div class="text-center mb-6">
      <div class="text-3xl font-mono font-bold text-app-text mb-2">
        {{ formattedTime }}
      </div>
      <p class="text-sm text-app-muted">{{ currentTask || 'No active task' }}</p>
    </div>

    <!-- Control Buttons -->
    <div class="flex justify-center space-x-3 mb-6">
      <button 
        @click="toggleTimer"
        :class="[
          'flex items-center justify-center w-12 h-12 rounded-full transition-colors',
          isRunning 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-app-primary hover:bg-app-primary-900 text-white'
        ]"
        :aria-label="isRunning ? 'Pause timer' : 'Start timer'"
      >
        <Pause v-if="isRunning" class="w-5 h-5" />
        <Play v-else class="w-5 h-5" />
      </button>
      
      <button 
        @click="stopTimer"
        class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors"
        aria-label="Stop timer"
      >
        <Square class="w-5 h-5" />
      </button>
    </div>

    <!-- Current Project -->
    <div class="bg-app-bg rounded-lg p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-app-text">Current Project</span>
        <button class="text-app-primary text-sm hover:underline">Change</button>
      </div>
      <p class="text-app-muted text-sm">Website Redesign</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Play, Pause, Square } from 'lucide-vue-next'

const seconds = ref(0)
const isRunning = ref(false)
const currentTask = ref('Website Redesign')
let intervalId: number | null = null

const formattedTime = computed(() => {
  const hours = Math.floor(seconds.value / 3600)
  const minutes = Math.floor((seconds.value % 3600) / 60)
  const secs = seconds.value % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

const startTimer = () => {
  isRunning.value = true
  intervalId = window.setInterval(() => {
    seconds.value++
  }, 1000)
}

const pauseTimer = () => {
  isRunning.value = false
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const stopTimer = () => {
  isRunning.value = false
  seconds.value = 0
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
