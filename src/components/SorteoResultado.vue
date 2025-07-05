<template>
    <div v-if="resultado.length">
      <h2>Resultado del Sorteo 🎯</h2>
      <ul>
        <li v-for="(asignacion, index) in resultado" :key="index">
          <strong>{{ asignacion.jugador }}</strong> → <span>{{ asignacion.equipo }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "SorteoResultado",
    props: {
      resultado: Array
    }
  };
  </script>
  
  <style scoped>
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin: 6px 0;
    font-size: 1.2rem;
    background-color:   #ffffffaa;
    padding: 8px 12px;
    border-radius: 6px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    color: #000000;
  }
  </style>
  