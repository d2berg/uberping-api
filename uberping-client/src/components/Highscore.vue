<template>
  <div>
    <md-table>
      <thead>
        <md-table-head>Rank</md-table-head>
        <md-table-head>Name</md-table-head>
        <md-table-head>Rating</md-table-head>
        <md-table-head>Streak</md-table-head>
        <md-table-head>Wins</md-table-head>
        <md-table-head>Losses</md-table-head>
      </thead>
      <tbody>
        <md-table-row v-for="(user, index) in users" v-bind:key="user.id">
          <md-table-cell>{{index+1}}</md-table-cell>
          <md-table-cell>{{user.name}}</md-table-cell>
          <md-table-cell>{{user.rating.toFixed(1)}}</md-table-cell>
          <md-table-cell>{{user.streak}}</md-table-cell>
          <md-table-cell>{{user.wins}}</md-table-cell>
          <md-table-cell>{{user.losses}}</md-table-cell>
        </md-table-row>
      </tbody>
    </md-table>
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

