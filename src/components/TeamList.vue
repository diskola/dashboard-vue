<template>
  <div class="bg-app-surface rounded-card p-6 shadow-sm border border-app-border">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-app-text">Team Members</h2>
      <button class="text-app-primary text-sm hover:underline">Manage</button>
    </div>

    <div class="space-y-4">
      <div v-for="member in teamMembers" :key="member.id" class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-white font-medium',
              member.avatar ? '' : 'bg-app-primary'
            ]">
              <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="w-10 h-10 rounded-full object-cover">
              <span v-else>{{ member.initials }}</span>
            </div>
            <div :class="[
              'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-app-surface',
              member.status === 'online' ? 'bg-green-500' :
              member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
            ]"></div>
          </div>
          
          <div>
            <p class="text-sm font-medium text-app-text">{{ member.name }}</p>
            <p class="text-xs text-app-muted">{{ member.role }}</p>
          </div>
        </div>
        
        <button class="text-app-muted hover:text-app-text">
          <MessageCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Add Member -->
    <button class="w-full mt-4 py-2 border-2 border-dashed border-app-border rounded-lg text-app-muted hover:border-app-primary hover:text-app-primary transition-colors">
      <UserPlus class="w-4 h-4 inline mr-2" />
      Invite member
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessageCircle, UserPlus } from 'lucide-vue-next'

interface TeamMember {
  id: number
  name: string
  role: string
  status: 'online' | 'away' | 'offline'
  avatar?: string
  initials: string
}

const teamMembers = ref<TeamMember[]>([
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Product Manager',
    status: 'online',
    initials: 'SJ'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'UI/UX Designer',
    status: 'online',
    initials: 'MC'
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Frontend Developer',
    status: 'away',
    initials: 'ED'
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'Backend Developer',
    status: 'offline',
    initials: 'DW'
  }
])
</script>
