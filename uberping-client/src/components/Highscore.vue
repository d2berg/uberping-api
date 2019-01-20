<template>
  <div>
    <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
    <div class="grid">
      <div class="grid-item" v-for="(user, index) in users" v-bind:key="user.id">
        <md-card>
          <md-card-header>
            <span>{{index+1}}. </span>
            <span>{{user.name}}</span>
          </md-card-header>
          <md-card-content>
            <md-chip title="Rating" class="md-primary md-mini"><md-icon>grade</md-icon> {{user.rating.toFixed(1)}}</md-chip>
            <svg style="vertical-align: middle; margin: 4px;" :width="sparkline.w" :height="sparkline.h">
              <path style="stroke:#555; fill: transparent;" :d="createSparkline(user)" />
            </svg>
            <md-chip title="Streak" class="md-secondary"><md-icon>schedule</md-icon> {{user.streak}}</md-chip>
            <md-chip title="Wins" class="md-primary"><md-icon>thumb_up</md-icon> {{user.wins }}</md-chip>
            <md-chip title="Losses" class="md-accent"><md-icon>thumb_down</md-icon> {{user.losses}}</md-chip>
          </md-card-content>
        </md-card>
      </div>
          <md-button @click="rank">Rank</md-button>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import { extent, line, scaleTime, scaleLinear} from 'd3';

export default {
  name: 'Highscopre',
  data(){
    return {
      users: null,
      loading: false,
      sparkline: {
        w: 80,
        h: 20
      }
    }
  },
   mounted () {
     this.getUsers();
  },
  methods: {
    createSparkline(user){
      const width = this.sparkline.w;
      const height = this.sparkline.h;
      let history = user.ratingHistory.map((h) => { return {...h, timestamp: new Date(h.timestamp).valueOf()}});
      const x = scaleTime().range([0, width]);
      const y = scaleLinear().range([height, 0]);
      x.domain(extent(history, (d) => d.timestamp));
      y.domain(extent(history, (d) => d.rating));
      const sparkline = line()
        .x((p) => x(p.timestamp))
        .y((p) => y(p.rating));
      return sparkline(history);
    },
    getUsers(){
      this.loading = true;
       axios
      .get('api/users')
      .then(response => {
        const users = response.data;
        this.users = users;
        this.loading = false;
      });
    },
    rank(){
     axios.get('api/updateRating').then(() => {
       this.getUsers();
     });
    }
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

