<template>
  <div class="main-container">
    <h1>Tabla de Posiciones 📊</h1>

    <table class="tabla">
      <thead>
        <tr>
          <th>Equipo</th>
          <th>Jugador</th>
          <th>PJ</th>
          <th>G</th>
          <th>E</th>
          <th>P</th>
          <th>GF</th>
          <th>GC</th>
          <th>DIF</th>
          <th>PTS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="equipo in posiciones" :key="equipo.nombre">
          <td>{{ equipo.nombre }}</td>
          <td>{{ equipo.jugador }}</td>
          <td>{{ equipo.pj }}</td>
          <td>{{ equipo.g }}</td>
          <td>{{ equipo.e }}</td>
          <td>{{ equipo.p }}</td>
          <td>{{ equipo.gf }}</td>
          <td>{{ equipo.gc }}</td>
          <td>{{ equipo.dif }}</td>
          <td><strong>{{ equipo.pts }}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useFixtureStore } from '../stores/fixture'
import { storeToRefs } from 'pinia'
export default {
  name: 'Tabla',
  setup() {
    const fixtureStore = useFixtureStore();
    const { fechas, resultado } = storeToRefs(fixtureStore);
    return { fixtureStore, fechas, resultado };
  },
  data() {
    return {
      posiciones: [],
    };
  },
  watch: {
    fechas: {
      handler(nuevasFechas) {
        if (nuevasFechas && this.resultado) {
          this.calcularTabla(nuevasFechas, this.resultado);
        }
      },
      immediate: true,
      deep: true,
    },
    resultado: {
      handler(nuevoResultado) {
        if (this.fechas && nuevoResultado) {
          this.calcularTabla(this.fechas, nuevoResultado);
        }
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this._interval = setInterval(() => {
      const fixture = JSON.parse(localStorage.getItem('fixture'));
      const resultado = JSON.parse(localStorage.getItem('resultado'));
      if (fixture && resultado) {
        this.calcularTabla(fixture, resultado);
      }
    }, 1000); // cada 1 segundo
  },
  beforeDestroy() {
    clearInterval(this._interval);
  },
  methods: {
    calcularTabla(fixture, resultado) {
      const tabla = {};

      // Inicializar equipos
      resultado.forEach(r => {
        tabla[r.equipo] = {
          nombre: r.equipo,
          jugador: r.jugador,
          pj: 0, g: 0, e: 0, p: 0,
          gf: 0, gc: 0,
          dif: 0, pts: 0,
        };
      });

      fixture.forEach(fecha => {
        fecha.forEach(partido => {
          if (partido.libre) return;

          // Solo contar si ambos goles están cargados y son válidos
          if (
            partido.golesLocal === null || partido.golesLocal === "" ||
            partido.golesVisitante === null || partido.golesVisitante === "" ||
            isNaN(Number(partido.golesLocal)) || isNaN(Number(partido.golesVisitante))
          ) {
            return;
          }
          const local = tabla[partido.local];
          const visitante = tabla[partido.visitante];
          const gl = Number(partido.golesLocal);
          const gv = Number(partido.golesVisitante);

          // Jugados
          local.pj++; visitante.pj++;

          // Goles
          local.gf += gl; local.gc += gv;
          visitante.gf += gv; visitante.gc += gl;

          // Resultado
          if (gl > gv) {
            local.g++; visitante.p++;
            local.pts += 3;
          } else if (gl < gv) {
            visitante.g++; local.p++;
            visitante.pts += 3;
          } else {
            local.e++; visitante.e++;
            local.pts += 1;
            visitante.pts += 1;
          }
        });
      });

      // Calcular diferencia
      Object.values(tabla).forEach(e => e.dif = e.gf - e.gc);

      // Convertir a array y ordenar
      this.posiciones = Object.values(tabla).sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        return b.dif - a.dif;
      });
    }
  }
};
</script>

<style scoped>
.main-container {
  padding: 2rem;
  max-width: 1000px;
  margin: auto;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  background-color: #222;
  color: white;
}

.tabla th, .tabla td {
  padding: 0.5rem;
  border-bottom: 1px solid #444;
}

.tabla thead {
  background-color: #333;
}

.tabla tr:hover {
  background-color: #444;
}
</style>
