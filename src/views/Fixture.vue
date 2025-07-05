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
                                />
                                <span class="guion">-</span>
                                <input
                                    v-model.number="partido.golesVisitante"
                                    type="number"
                                    min="0"
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

                    <button @click="guardarFixture">Guardar Fixture</button>
                </div>
            </div>
        </div>
    
</template>

<script>
import Swal from "sweetalert2";

export default {
    name: "Fixture",
    data() {
        return {
            resultado: JSON.parse(localStorage.getItem("resultado")) || [],
            fechas: JSON.parse(localStorage.getItem("fixture")) || [],
        };
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

            this.fechas = fechasGeneradas;
            this.guardarFixture(true);
        },
        guardarFixture(notify = false) {
            localStorage.setItem("fixture", JSON.stringify(this.fechas));
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
                text: "Esto eliminará el fixture actual.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("fixture");
                    this.fechas = [];
                    this.generarFixture();
                }
            });
        },
    },
};
</script>

<style scoped>
.contenedor-fixture {
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
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
</style>
