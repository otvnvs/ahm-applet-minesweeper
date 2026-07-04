<template>
  <svg v-if="type === 'flag'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon flag-icon">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
    <line x1="4" y1="22" x2="4" y2="15"></line>
  </svg>

  <svg v-else-if="type === 'mine'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon mine-icon">
    <circle cx="12" cy="12" r="8"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
  
  <svg v-else-if="type === 'clock'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.svg-icon {
  width: 16px;
  height: 16px;
  display: block;
}
.flag-icon {
  color: #ef4444; /* Vibrant structural red */
}
.mine-icon {
  color: #f59e0b; /* Amber warning color */
}
</style>

