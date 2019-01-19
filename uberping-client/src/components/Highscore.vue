<template>
  <div>
    <div class="grid">
      <div class="grid-item" v-for="(user, index) in users" v-bind:key="user.id">
        <md-card>
          <md-card-header>
            <span>{{index+1}}. </span>
            <span>{{user.name}}</span>
          </md-card-header>
          <md-card-content>
            <md-chip title="Rating" class="md-primary md-mini"><md-icon>grade</md-icon> {{user.rating.toFixed(1)}}</md-chip>
            <p>
            <md-chip title="Streak" class="md-secondary"><md-icon>schedule</md-icon> {{user.streak}}</md-chip>
            <md-chip title="Wins" class="md-primary"><md-icon>thumb_up</md-icon> {{user.wins }}</md-chip>
            <md-chip title="Losses" class="md-accent"><md-icon>thumb_down</md-icon> {{user.losses}}</md-chip>
            </p>
          </md-card-content>
        </md-card>
      </div>
    </div>
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

