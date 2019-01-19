<template>
  <div>
    <table>
      <thead>
        <th>Time</th>
        <th>Home</th>
        <th>Score</th>
        <th>Away</th>
      </thead>
      <tbody>
        <tr v-for="(match) in matches" v-bind:key="match.id">
          <td>{{new Date(match.timestamp).toLocaleDateString()}}</td>
          <td :class="match.homeScore > match.awayScore ? 'bold': ''">{{match.home}}</td>
          <td>{{match.homeScore}} - {{match.awayScore}}</td>
          <td :class="match.homeScore < match.awayscore ? 'bold': ''">{{match.away}}</td>
        </tr>
      </tbody>
    </table>  
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
  computed: {
    matches(){
      return this.rawmatches.map(m => {
        return {
          timestamp: m.timestamp,
          home: this.usermap[m.homeId],
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          away: this.usermap[m.awayId],
        };
        });
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
