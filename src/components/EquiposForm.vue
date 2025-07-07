<template>
    <div>
        <h2>Equipos 🏆</h2>
        <form @submit.prevent="agregarEquipo">
            <input v-model="nuevoEquipo" placeholder="Nombre del equipo" />
            <button type="submit">Agregar</button>
        </form>

        <ul class="lista">
            <li v-for="(equipo, index) in equipos" :key="index">
                {{ equipo }}
                <button @click="eliminarEquipo(index)">❌</button>
            </li>
        </ul>
    </div>
</template>

<script>
import { useDatosStore } from '../stores/datos'
import { storeToRefs } from 'pinia'
export default {
    name: "EquiposForm",
    setup() {
        const datosStore = useDatosStore();
        const { equipos } = storeToRefs(datosStore);
        return { datosStore, equipos };
    },
    data() {
        return {
            nuevoEquipo: ""
        };
    },
    methods: {
        agregarEquipo() {
            const nombre = this.nuevoEquipo.trim();
            if (nombre) {
                this.equipos.push(nombre);
                this.datosStore.setEquipos(this.equipos);
                this.nuevoEquipo = "";
            }
        },
        eliminarEquipo(index) {
            this.equipos.splice(index, 1);
            this.datosStore.setEquipos(this.equipos);
        },
    },
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