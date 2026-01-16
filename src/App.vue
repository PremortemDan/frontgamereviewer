<template>
  <Layout>
    <RouterView />
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import Layout from './components/Layout.vue'
import { useTheme } from './composables/useTheme'

// Auto detect dark mode preference
const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
</style>
