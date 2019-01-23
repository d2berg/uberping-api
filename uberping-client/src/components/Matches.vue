<template>
  <div>
    <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
    <table>
      <tr v-for="(match) in matches.slice(0,50)" v-bind:key="match.id">
            <td><span>{{match.timestamp.toLocaleString()}}</span></td>
          <td>
             <v-chip title="Winning score" color="primary">{{match.home}} | <b>{{match.homeScore }}</b></v-chip>
            <span> -- </span>
            <v-chip title="Losing score" color="accent"><b>{{match.awayScore}}</b> | {{match.away}}</v-chip>
            </td>
            <td><v-btn @click="remove(match.id)">Remove</v-btn></td>
      </tr>
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
      loading: true,
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
          .then(response => {
            this.rawmatches = response.data;
            this.loading = false;
          });
      });
  },
  methods: {
    remove(id){
      const index = this.rawmatches.findIndex(m => m._id === id);
      axios.delete(`api/matches/${id}`).then(() => this.rawmatches.splice(index, 1))
    }
  },
  computed: {
    matches(){
      return this.rawmatches
        .map(m => {
          return {
            id: m._id,
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
