<template>
    <aside class="sidebar">
      <router-link to="/" class="nav-link" exact-active-class="active">
        <span class="material-icons">home</span>
        Home
      </router-link>
      <router-link to="/fixture" class="nav-link" exact-active-class="active">
        <span class="material-icons">event</span>
        Fixture
      </router-link>
      <router-link to="/tabla" class="nav-link" exact-active-class="active">
        <span class="material-icons">leaderboard</span>
        Tabla
      </router-link>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'Sidebar'
  }
  </script>
  
  <style scoped>
.sidebar {
  width: 200px;
  background: #121212; /* <- aseguramos fondo sólido oscuro */
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
  z-index: 100;
  position: relative;
}


.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.8rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
  font-size: 1rem;
}

.nav-link:hover {
  background: #444;
}

.active {
  background: #1565c0;
}

  </style>
  