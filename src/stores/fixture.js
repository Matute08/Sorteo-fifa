import { defineStore } from 'pinia'

export const useFixtureStore = defineStore('fixture', {
  state: () => ({
    fechas: JSON.parse(localStorage.getItem('fixture')) || [],
    resultado: JSON.parse(localStorage.getItem('resultado')) || [],
  }),
  actions: {
    setFechas(nuevasFechas) {
      this.fechas = nuevasFechas
      localStorage.setItem('fixture', JSON.stringify(nuevasFechas))
    },
    setResultado(nuevoResultado) {
      this.resultado = nuevoResultado
      localStorage.setItem('resultado', JSON.stringify(nuevoResultado))
    },
    // Si quieres limpiar el fixture
    limpiarFixture() {
      this.fechas = []
      localStorage.removeItem('fixture')
    }
  }
}) 