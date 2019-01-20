<template>
<div>
  <md-app id="app" md-waterfall md-mode="fixed" md-scrollbar>
    <md-app-toolbar class="md-primary">
        <span class="md-title">uberping</span>
    </md-app-toolbar>
    <md-app-content>
      <router-view />
    </md-app-content>
  </md-app>
  <md-bottom-bar md-sync-route md-type="fixed">
    <md-bottom-bar-item href="#/game" md-label="Play" md-icon="input"></md-bottom-bar-item>
    <md-bottom-bar-item href="#/highscore" md-label="Highscore" md-icon="assessment"></md-bottom-bar-item>
    <md-bottom-bar-item href="#/matches" md-label="Matches" md-icon="list"></md-bottom-bar-item>
  </md-bottom-bar>
        </div>
</template>

<script>
import VueRouter from 'vue-router';
import Game from './components/Game.vue';
import Highscore from './components/Highscore.vue';
import Matches from './components/Matches.vue';
import Users from './components/Users.vue';

const router = new VueRouter({
  routes: [
    { path: '/game', component: Game },
    { path: '/highscore', component: Highscore },
    { path: '/matches', component: Matches },
    { path: '/users', component: Users }
  ]
})

export default {
  name: 'app',
  router,
}
</script>

<style lang="scss">
.md-bottom-bar {
  position: fixed;
  bottom: 0px;
}
.md-app {
  margin-bottom: 50px;
}
.grid {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .grid-item {
    display: flex;
    flex: 1;
    padding: 0.5em;
  }
}
// html, body {
//     width: 100%;
//     height: 100%;
//     margin: 0px;
//     font-size: 18px;
// }

// table {
//   width: 100%;
//   text-align: center;
// }


// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   min-height: 100vh;
//   max-height: 100vh;
//   overflow-y: auto;
//     display: flex;
//     flex-direction: column;
//   .bar {
//     background: red;
//     flex-shrink: 0;
//   }
//   .main {
//     flex: 1;
//     overflow-y: auto;
//   }
// }
</style>
