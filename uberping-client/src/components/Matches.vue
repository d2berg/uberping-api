<template>
  <div>
    <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
    <table>
      <tr v-for="(match) in matches.slice(0,50)" v-bind:key="match.id">
          <td><span>{{match.timestamp.toLocaleString()}}</span></td>
          <td>{{match.home}}</td>
          <td><b>{{match.homeScore }}</b></td>
          <td>{{match.away}}</td>
          <td><b>{{match.awayScore }}</b></td>
          <td>
            <v-btn @click="remove(match.id)"><v-icon>delete</v-icon></v-btn>
          </td>
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
      const doit = confirm("sure?");
      if(doit){
        axios.delete(`api/matches/${id}`).then(() => this.rawmatches.splice(index, 1));
      }
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
table {
  font-size: 90%;
}
.bold {
  font-weight: bold;
}
td {
  padding: 5px 0px;
  border-bottom: 1px solid #999;
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
