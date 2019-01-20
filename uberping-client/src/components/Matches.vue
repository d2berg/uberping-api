<template>
  <div>
    <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
    <md-list>
      <md-list-item v-for="(match) in matches.slice(0,50)" v-bind:key="match.id">
        <md-card>
          <md-card-header>
            <span>{{match.timestamp.toLocaleString()}}</span>
          </md-card-header>
          <md-card-content>
            <md-chip title="Winning score" class="md-primary">{{match.home}} | <b>{{match.homeScore }}</b></md-chip>
            <span> -- </span>
            <md-chip title="Losing score" class="md-accent"><b>{{match.awayScore}}</b> | {{match.away}}</md-chip>
            <!-- <md-button @click="remove(match.id, index)" class="md-mini"><md-icon>delete</md-icon></md-button> -->
          </md-card-content>
        </md-card>
      </md-list-item>
    <md-list-item>...</md-list-item>
    </md-list>
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
