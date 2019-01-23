<template>
  <v-app id="app">
    <v-toolbar app dark><v-toolbar-title>uberping</v-toolbar-title></v-toolbar>
    <v-content>
     <v-container fluid>
      <router-view></router-view>
    </v-container>
    </v-content>
    <v-bottom-nav fixed dark value="true">
      <v-btn href="#/game" >Play <v-icon>input</v-icon></v-btn>
      <v-btn href="#/highscore">Highscore  <v-icon>assessment</v-icon></v-btn>
      <v-btn href="#/matches" md-icon="list">Matches <v-icon>list</v-icon></v-btn>
    </v-bottom-nav>
  </v-app>
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

.score {
  text-align: center;
  font-size: 48px;
}

// html, body {
//     width: 100%;
//     height: 100%;
//     margin: 0px;
//     font-size: 18px;
// }

table {
  width: 100%;
  text-align: center;
}


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
