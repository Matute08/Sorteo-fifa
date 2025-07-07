<template>
    <div>
        <button class="sidebar-toggle" @click="toggleSidebar" v-if="isMobile">
            <span class="material-icons">menu</span>
        </button>
        <aside class="sidebar" :class="{ 'sidebar-cerrado': isMobile && !sidebarAbierto }">
            <button class="sidebar-close" v-if="isMobile" @click="toggleSidebar">
                <span class="material-icons">close</span>
            </button>
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
    </div>
</template>

<script>
export default {
    name: 'Sidebar',
    data() {
        return {
            sidebarAbierto: false,
            isMobile: false,
        };
    },
    mounted() {
        this.checkScreen();
        window.addEventListener('resize', this.checkScreen);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkScreen);
    },
    methods: {
        toggleSidebar() {
            this.sidebarAbierto = !this.sidebarAbierto;
        },
        checkScreen() {
            this.isMobile = window.innerWidth < 1024; // 1024px ~ laptop
            if (!this.isMobile) {
                this.sidebarAbierto = true;
            } else {
                this.sidebarAbierto = false;
            }
        },
    },
};
</script>

<style scoped>
.sidebar {
    width: 200px;
    background: #121212;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: 100vh;
    box-sizing: border-box;
    z-index: 100;
    position: relative;
    transition: left 0.3s, transform 0.3s;
}

.sidebar-cerrado {
    position: fixed;
    left: -220px;
    top: 0;
    height: 100vh;
    z-index: 200;
    background: #121212;
    transition: left 0.3s, transform 0.3s;
}

.sidebar-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 300;
    background: #1565c0;
    color: white;
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    cursor: pointer;
}

.sidebar-close {
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    align-self: flex-end;
    margin-bottom: 1rem;
    cursor: pointer;
}

@media (max-width: 1023px) {
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        z-index: 200;
        background: #121212;
        transform: translateX(0);
        transition: left 0.3s, transform 0.3s;
    }
    .sidebar-cerrado {
        transform: translateX(-220px);
    }
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
  