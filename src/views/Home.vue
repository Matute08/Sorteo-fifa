<template>
    <div class="contenedor-home">
        <SorteoAnimado
            v-if="mostrandoSorteo"
            :jugadores="jugadores"
            :equipos="equipos"
            @finalizado="guardarResultado"
        />

        <div class="scrollable-home">
            <div :class="['contenido-blurable', { blur: mostrandoSorteo }]">
                <h1 class="titulo-home">Torneo de FIFA 🎮</h1>

                <div class="grilla">
                    <JugadoresForm @updateJugadores="jugadores = $event" />
                    <EquiposForm @updateEquipos="equipos = $event" />
                </div>

                <div class="columna-resultado">
                    <button
                        @click="sortearEquipos"
                        :disabled="!puedeSortear"
                        class="boton-sorteo"
                    >
                        Sortear Equipos 🎲
                    </button>

                    <SorteoResultado :resultado="resultado" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import JugadoresForm from "../components/JugadoresForm.vue";
import EquiposForm from "../components/EquiposForm.vue";
import SorteoResultado from "../components/SorteoResultado.vue";
import SorteoAnimado from "../components/SorteoAnimado.vue";

export default {
    name: "Home",
    components: {
        JugadoresForm,
        EquiposForm,
        SorteoResultado,
        SorteoAnimado,
    },
    data() {
        return {
            jugadores: JSON.parse(localStorage.getItem("jugadores")) || [],
            equipos: JSON.parse(localStorage.getItem("equipos")) || [],
            resultado: JSON.parse(localStorage.getItem("resultado")) || [],
            mostrandoSorteo: false,
        };
    },

    computed: {
        puedeSortear() {
            return (
                this.jugadores.length > 0 &&
                this.equipos.length >= this.jugadores.length
            );
        },
    },
    methods: {
        sortearEquipos() {
            this.mostrandoSorteo = true;
        },
        guardarResultado(resultado) {
            this.resultado = resultado;
            localStorage.setItem("resultado", JSON.stringify(resultado));
            this.mostrandoSorteo = false;
        },
    },
};
</script>

<style scoped>
.contenedor-home {
    position: relative;
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    box-sizing: border-box;
}

.titulo-home {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
}

.grilla {
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    flex-wrap: wrap;
}

.grilla > * {
    flex: 1 1 48%;
    min-width: 300px;
}

.columna-resultado {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.boton-sorteo {
    background-color: #1e88e5;
    color: white;
    padding: 12px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.boton-sorteo:hover {
    background-color: #1565c0;
}

.contenido-blurable.blur {
    filter: blur(6px);
    pointer-events: none;
    user-select: none;
    opacity: 0.6;
    transition: all 0.3s ease;
}
.scrollable-home {
  max-height: calc(100vh - 130px);
  overflow-y: auto;
  padding: 1rem;
}

.grilla {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
}

.contenido-blurable {
    transition: all 0.3s ease;
}
</style>
