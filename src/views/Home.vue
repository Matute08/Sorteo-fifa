<template>
    <div class="contenedor-home">
        <SorteoAnimado
            v-if="mostrandoSorteo"
            :jugadores="jugadores"
            :equipos="equipos"
            @finalizado="guardarResultado"
        />

        <div >
            <div :class="['contenido-blurable', { blur: mostrandoSorteo }]">
                <h1 class="titulo-home">Torneo de FIFA 🎮</h1>

                <div class="grilla">
                    <JugadoresForm />
                    <EquiposForm />
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

                <!-- Botones de limpieza -->
                <div class="botones-limpieza">
                    <button @click="limpiarTorneo" class="btn-limpiar-torneo">Limpiar Torneo 🗑️</button>
                    <button @click="limpiarSorteo" class="btn-limpiar-sorteo">Limpiar Sorteo 🔄</button>
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
import { useDatosStore } from '../stores/datos'
import { useFixtureStore } from '../stores/fixture'
import { storeToRefs } from 'pinia'

export default {
    name: "Home",
    components: {
        JugadoresForm,
        EquiposForm,
        SorteoResultado,
        SorteoAnimado,
    },
    setup() {
        const datosStore = useDatosStore();
        const fixtureStore = useFixtureStore();
        const { jugadores, equipos } = storeToRefs(datosStore);
        const { fechas } = storeToRefs(fixtureStore);
        return { datosStore, fixtureStore, jugadores, equipos, fechas };
    },
    data() {
        return {
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
            this.fixtureStore.setResultado(resultado);
            localStorage.setItem("resultado", JSON.stringify(resultado));
            this.mostrandoSorteo = false;
        },
        limpiarTorneo() {
            this.datosStore.limpiarEquipos();
            this.datosStore.limpiarJugadores();
            this.fixtureStore.limpiarFixture();
            this.fixtureStore.setResultado([]);
            this.resultado = [];
            localStorage.removeItem("resultado");
        },
        limpiarSorteo() {
            this.resultado = [];
            localStorage.removeItem("resultado");
        },
        limpiarFixture() {
            // Limpia solo los goles de cada partido, pero mantiene el fixture
            const nuevasFechas = this.fechas.map(fecha =>
                fecha.map(partido => {
                    if (partido.libre) return { ...partido };
                    return {
                        ...partido,
                        golesLocal: null,
                        golesVisitante: null
                    };
                })
            );
            this.fixtureStore.setFechas(nuevasFechas);
        }
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
    height: 90vh;
}

/* .titulo-home {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
} */

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


.grilla {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
}

.contenido-blurable {
    transition: all 0.3s ease;
}

.botones-limpieza {
    margin: 20px 0px;
    padding: 20px;
    display: flex;
    gap: 2.5rem;
    justify-content: center;
}
.btn-limpiar-torneo, .btn-limpiar-sorteo {
    margin: 0 12px;
}
.btn-limpiar-torneo {
    background: #b71c1c;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.7rem 1.2rem;
    font-weight: bold;
    cursor: pointer;
}
.btn-limpiar-torneo:hover {
    background: #d32f2f;
}
.btn-limpiar-sorteo {
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.7rem 1.2rem;
    font-weight: bold;
    cursor: pointer;
}
.btn-limpiar-sorteo:hover {
    background: #1565c0;
}
.btn-limpiar-fixture {
    background: #fbc02d;
    color: #222;
    border: none;
    border-radius: 6px;
    padding: 0.7rem 1.2rem;
    font-weight: bold;
    cursor: pointer;
}
.btn-limpiar-fixture:hover {
    background: #ffd600;
}
</style>
