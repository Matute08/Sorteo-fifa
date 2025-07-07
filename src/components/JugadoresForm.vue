<template>
    <div>
        <h2>Jugadores 🎮</h2>
        <form @submit.prevent="agregarJugador">
            <input v-model="nuevoJugador" placeholder="Nombre del jugador" />
            <button type="submit">Agregar</button>
        </form>

        <ul class="lista">
            <li v-for="(jugador, index) in jugadores" :key="index">
                {{ jugador }}
                <button @click="eliminarJugador(index)">❌</button>
            </li>
        </ul>
    </div>
</template>

<script>
import { useDatosStore } from '../stores/datos'
import { storeToRefs } from 'pinia'
export default {
  name: "JugadoresForm",
  setup() {
    const datosStore = useDatosStore();
    const { jugadores } = storeToRefs(datosStore);
    return { datosStore, jugadores };
  },
  data() {
    return {
      nuevoJugador: ""
    };
  },
  methods: {
    agregarJugador() {
      const nombre = this.nuevoJugador.trim();
      if (nombre) {
        this.jugadores.push(nombre);
        this.datosStore.setJugadores(this.jugadores);
        this.nuevoJugador = "";
      }
    },
    eliminarJugador(index) {
      this.jugadores.splice(index, 1);
      this.datosStore.setJugadores(this.jugadores);
    }
  }
};
</script>


<style scoped>
.formulario {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #333;
  color: white;
}

button {
  padding: 10px 10px;
  margin: 10px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #1565c0;
}

.lista {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
}

.lista li {
  width: 90%;
  max-width: 260px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f3f3f3;
  padding: 6px 10px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-size: 0.9rem;
  color: #222;
  height: 36px;
  line-height: 1;
}



.eliminar {
  background-color: #e53935;
  padding: 4px 8px;
  font-size: 0.85rem;
  border-radius: 4px;
  border: none;
  color: white;
  margin-left: 8px;
  height: 28px;
}
.eliminar:hover {
  background-color: #c62828;
}

</style>
