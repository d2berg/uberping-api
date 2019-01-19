<template>
  <div>
    <table>
      <thead>
        <th>Rank</th>
        <th>Name</th>
        <th>Rating</th>
        <th>Streak</th>
        <th>Wins</th>
        <th>Losses</th>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" v-bind:key="user.id">
          <td>{{index+1}}</td>
          <td>{{user.name}}</td>
          <td>{{user.rating.toFixed(1)}}</td>
          <td>{{user.streak}}</td>
          <td>{{user.wins}}</td>
          <td>{{user.losses}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Highscopre',
  data(){
    return {
      users: null,
    }
  },
   mounted () {
    axios
      .get('api/users')
      .then(response => {
        const users = response.data;
        this.users = users;
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

