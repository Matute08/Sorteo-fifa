<template>
    <div v-if="jugadores.length && equipos.length" class="overlay">
      <div class="sorteo-box">
        <h3>{{ jugadorActual }}</h3>
        <div class="ruleta">
          <transition-group name="deslizar" tag="div">
            <p v-for="(equipo, index) in ruletaEquipos" :key="equipo + index" class="equipo-ruleta">
              {{ equipo }}
            </p>
          </transition-group>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SorteoAnimado',
    props: {
      jugadores: Array,
      equipos: Array
    },
    emits: ['finalizado'],
    data() {
      return {
        jugadorActual: '',
        ruletaEquipos: [],
        resultadoFinal: [],
        audioClick: new Audio('/click.wav') // agregá el sonido acá
      };
    },
    mounted() {
      this.iniciarSorteo();
    },
    methods: {
      async iniciarSorteo() {
        const jugadoresShuffled = [...this.jugadores].sort(() => Math.random() - 0.5);
        const equiposShuffled = [...this.equipos].sort(() => Math.random() - 0.5);
  
        for (let i = 0; i < jugadoresShuffled.length; i++) {
          this.jugadorActual = jugadoresShuffled[i];
  
          const equipoFinal = equiposShuffled[i];
          await this.animarRuleta(equipoFinal);
  
          this.resultadoFinal.push({
            jugador: jugadoresShuffled[i],
            equipo: equipoFinal
          });
  
          await this.delay(2500); // espera entre jugadores
        }
  
        // Fin del sorteo: avisamos al padre
        this.$emit('finalizado', this.resultadoFinal);
      },
  
      async animarRuleta(equipoGanador) {
        const vueltas = 20;
        for (let i = 0; i < vueltas; i++) {
          const muestra = this.shuffleEquipos();
          this.ruletaEquipos = muestra;
          await this.delay(80);
        }
  
        this.ruletaEquipos = [equipoGanador];
        this.audioClick.play();
      },
  
      shuffleEquipos() {
        return [...this.equipos].sort(() => Math.random() - 0.5).slice(0, 3);
      },
  
      delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    }
  };
  </script>
  
  <style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
}


@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}

.sorteo-box {
  background: #222;
  padding: 2rem 3rem;
  border-radius: 10px;
  box-shadow: 0 0 30px #00f0ff66;
  font-size: 1.5rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
}


@keyframes boxZoom {
  from { transform: scale(0.7); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.ruleta {
  margin-top: 2rem;
  height: 2.5rem;
  overflow: hidden;
}

.equipo-ruleta {
  margin: 0px;
  padding: 0;
  font-size: 1.8rem;
  font-weight: bold;
  animation: equipoPop 0.3s ease;
}

@keyframes equipoPop {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

.deslizar-enter-active,
.deslizar-leave-active {
  transition: all 0.3s ease;
}

.deslizar-enter-from,
.deslizar-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

  </style>
  