<template>
    <div class="contenedor-fixture scrollable-fixture">
        <div class="fixture">
            <h1>Fixture del Torneo 📅</h1>

           
                <div v-if="fechas.length === 0">
                    <button @click="generarFixture">Generar Fixture</button>
                </div>

                <div v-else >
                    <button @click="regenerarFixture" class="btn-reset">
                        🗑️ Reiniciar Fixture
                    </button>
                    <button @click="limpiarFixture" class="btn-limpiar-fixture">Limpiar Goles 🧹</button>

                    <div v-for="(fecha, i) in fechas" :key="i" class="fecha">
                        <h2>Fecha {{ i + 1 }}</h2>

                        <div
                            v-for="(partido, j) in getPartidosLibres(fecha)"
                            :key="'libre' + j"
                            class="libre"
                        >
                            🟣 <i>{{ partido.libre }} tiene fecha libre</i>
                        </div>

                        <div
                            v-for="(partido, j) in getPartidosJuego(fecha)"
                            :key="'juego' + j"
                            class="partido"
                        >
                            <div class="fila">
                                <div class="equipo">
                                    <span>{{ partido.local }}</span>
                                    <small>{{
                                        getJugador(partido.local)
                                    }}</small>
                                </div>

                                <input
                                    v-model.number="partido.golesLocal"
                                    type="number"
                                    min="0"
                                    @input="onGolesChange"
                                />
                                <span class="guion">-</span>
                                <input
                                    v-model.number="partido.golesVisitante"
                                    type="number"
                                    min="0"
                                    @input="onGolesChange"
                                />

                                <div class="equipo">
                                    <span>{{ partido.visitante }}</span>
                                    <small>{{
                                        getJugador(partido.visitante)
                                    }}</small>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    
</template>

<script>
import Swal from "sweetalert2";
import { useFixtureStore } from '../stores/fixture'
import { storeToRefs } from 'pinia'

export default {
    name: "Fixture",
    setup() {
        const fixtureStore = useFixtureStore();
        const { fechas, resultado } = storeToRefs(fixtureStore);
        return { fixtureStore, fechas, resultado };
    },
    methods: {
        getPartidosLibres(fecha) {
            return fecha.filter((partido) => partido.libre);
        },
        getPartidosJuego(fecha) {
            return fecha.filter((partido) => !partido.libre);
        },
        getJugador(equipo) {
            const encontrado = this.resultado.find((r) => r.equipo === equipo);
            return encontrado?.jugador || "";
        },
        // --- NUEVO: Guardar automáticamente al cambiar goles ---
        onGolesChange() {
            this.fixtureStore.setFechas(this.fechas);
            this.actualizarTabla && this.actualizarTabla();
        },
        generarFixture() {
            if (this.resultado.length < 2) {
                Swal.fire(
                    "⚠️ Error",
                    "Debés sortear al menos 2 jugadores para generar el fixture",
                    "warning"
                );
                return;
            }

            const equipos = this.resultado.map((r) => r.equipo);
            const partidos = [];
            let listaEquipos = [...equipos];

            // Mezclar el array de equipos para que el fixture sea aleatorio
            for (let i = listaEquipos.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [listaEquipos[i], listaEquipos[j]] = [listaEquipos[j], listaEquipos[i]];
            }

            if (listaEquipos.length % 2 !== 0) {
                listaEquipos.push("Libre");
            }

            const totalFechas = listaEquipos.length - 1;
            const mitad = listaEquipos.length / 2;
            let fechasGeneradas = [];

            for (let f = 0; f < totalFechas; f++) {
                const partidosFecha = [];
                for (let i = 0; i < mitad; i++) {
                    const local = listaEquipos[i];
                    const visitante = listaEquipos[listaEquipos.length - 1 - i];

                    if (local === "Libre") {
                        partidosFecha.push({ libre: visitante });
                    } else if (visitante === "Libre") {
                        partidosFecha.push({ libre: local });
                    } else {
                        partidosFecha.push({
                            local,
                            visitante,
                            golesLocal: null,
                            golesVisitante: null,
                        });
                    }
                }

                fechasGeneradas.push(partidosFecha);
                listaEquipos.splice(1, 0, listaEquipos.pop());
            }

            this.fixtureStore.setFechas(fechasGeneradas);
            // Actualiza la referencia reactiva
            this.fechas.splice(0, this.fechas.length, ...fechasGeneradas);
            this.guardarFixture(true);
        },
        guardarFixture(notify = false) {
            this.fixtureStore.setFechas(this.fechas);
            if (notify) {
                Swal.fire(
                    "✔️ Fixture generado",
                    "El fixture fue creado y guardado con éxito.",
                    "success"
                );
            } else {
                Swal.fire(
                    "💾 Guardado",
                    "Fixture actualizado correctamente.",
                    "success"
                );
            }
        },
        regenerarFixture() {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "Esto eliminará el fixture actual y lo sorteará de nuevo.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, volver a sortear",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    this.fixtureStore.limpiarFixture();
                    this.fechas.splice(0, this.fechas.length);
                    // Esperar un tick para limpiar la reactividad y luego volver a sortear
                    this.$nextTick(() => {
                        this.generarFixture();
                    });
                }
            });
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
        },
    },
    // Ya no es necesario el watcher, Pinia y el método onGolesChange se encargan
};
</script>

<style scoped>
.contenedor-fixture {
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
  height: 90vh;
}
.fixture {
    padding: 2rem;
    max-width: 1000px;
    margin: 0 auto;
    color: white;
    max-width: 1200px;
    padding: 1.5rem;
}



.fecha {
    background: #333;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 8px;
    text-align: center;
}

.partido {
    margin: 0.7rem 0;
}

.fila {
    display: grid;
    grid-template-columns: 1fr 60px 20px 60px 1fr;
    align-items: center;
    gap: 0.3rem;
    justify-items: center;
}

input {
    width: 60px;
    text-align: center;
    padding: 0.3rem;
    border-radius: 5px;
    border: none;
    font-weight: bold;
    font-size: 1rem;
}

.guion {
    font-weight: bold;
    font-size: 1.2rem;
}

.equipo {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: bold;
    font-size: 1.1rem;
}

.equipo small {
    font-size: 0.75rem;
    color: #bbb;
    font-weight: normal;
    margin-top: 2px;
}

.libre {
    margin-bottom: 0.7rem;
    font-style: italic;
    color: #ccc;
    font-size: 0.95rem;
}

.btn-reset {
    margin-bottom: 1rem;
    background: crimson;
    color: white;
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}
.btn-limpiar-fixture {
    margin-bottom: 1.5rem;
    margin-left: 18px;
    background: #fbc02d;
    color: #222;
    border: none;
    border-radius: 6px;
    padding: 0.4rem 0.8rem;
    font-weight: bold;
    cursor: pointer;
}
.btn-limpiar-fixture:hover {
    background: #ffd600;
}
</style>
