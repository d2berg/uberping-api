<template>
  <div id="app">
    <div class="main">
      <router-view />
    </div>
    
    <div class="bar">
      <router-link to="/game">Game</router-link>
      <router-link to="/highscore">Highscore</router-link>
      <router-link to="/matches">Matches</router-link>
    </div>
  </div>
</template>

<script>
import VueRouter from 'vue-router';
import Game from './components/Game.vue';
import Highscore from './components/Highscore.vue';
import Matches from './components/Matches.vue';

const router = new VueRouter({
  routes: [
    { path: '/game', component: Game },
    { path: '/highscore', component: Highscore },
    { path: '/matches', component: Matches }
  ]
})

export default {
  name: 'app',
  router,
}
</script>

<style lang="scss">
html, body {
    width: 100%;
    height: 100%;
    margin: 0px;
    font-size: 18px;
}

table {
  width: 100%;
  text-align: center;
}


#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
    display: flex;
    flex-direction: column;
  .bar {
    background: red;
    flex-shrink: 0;
  }
  .main {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
