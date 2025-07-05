<template>
  <div class="layout">
    <Sidebar />
    <div class="contenido">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Sidebar
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
}

.layout {
  display: flex;
  max-height: 100vh;
  margin: 20px;
  background-color: #2e2e2e;
}

.contenido {
  flex: 1;
  background-color: #5e5a3a;
  color: white;
  overflow-y: auto;
}
</style>
