import { defineStore } from 'pinia'

export const useDatosStore = defineStore('datos', {
  state: () => ({
    equipos: JSON.parse(localStorage.getItem('equipos')) || [],
    jugadores: JSON.parse(localStorage.getItem('jugadores')) || [],
  }),
  actions: {
    setEquipos(nuevosEquipos) {
      this.equipos = nuevosEquipos
      localStorage.setItem('equipos', JSON.stringify(nuevosEquipos))
    },
    setJugadores(nuevosJugadores) {
      this.jugadores = nuevosJugadores
      localStorage.setItem('jugadores', JSON.stringify(nuevosJugadores))
    },
    limpiarEquipos() {
      this.equipos = []
      localStorage.removeItem('equipos')
    },
    limpiarJugadores() {
      this.jugadores = []
      localStorage.removeItem('jugadores')
    }
  }
}) 