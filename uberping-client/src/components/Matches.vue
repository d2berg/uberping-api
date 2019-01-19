<template>
  <div>
    <md-table>
      <thead>
        <md-table-head>Time</md-table-head>
        <md-table-head>Home</md-table-head>
        <md-table-head>Score</md-table-head>
        <md-table-head>Away</md-table-head>
      </thead>
      <tbody>
        <md-table-row v-for="(match) in matches" v-bind:key="match._id">
          <md-table-cell>{{match.timestamp.toLocaleDateString()}}</md-table-cell>
          <md-table-cell :class="match.homeScore > match.awayScore ? 'bold': ''">{{match.home}}</md-table-cell>
          <md-table-cell>{{match.homeScore}} - {{match.awayScore}}</md-table-cell>
          <md-table-cell :class="match.homeScore < match.awayscore ? 'bold': ''">{{match.away}}</md-table-cell>
          <md-table-cell><md-button @click="remove(match._id)" class="md-fab md-mini"><md-icon>delete</md-icon></md-button></md-table-cell>
        </md-table-row>
      </tbody>
    </md-table>  
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Matches',
  data(){
    return {
      users: null,
      rawmatches: [],
      usermap: {},
    }
  },
   mounted () {
    axios
      .get('api/users')
      .then(response => {
        const users = response.data;
        this.users = users
        users.forEach(u => { this.usermap[u._id] = u.name;});
         axios.get('api/matches')
          .then(response => (this.rawmatches = response.data));
      });
  },
  methods: {
    remove(id){
      axios.delete(`api/matches/${id}`);
    }
  },
  computed: {
    matches(){
      return this.rawmatches
        .map(m => {
          return {
            timestamp: new Date(m.timestamp),
            home: this.usermap[m.homeId],
            homeScore: m.homeScore,
            awayScore: m.awayScore,
            away: this.usermap[m.awayId],
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
.bold {
  font-weight: bold;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
