<template>
  <div>
    <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
    <div class="grid">
      <div class="grid-item" v-for="(user, index) in users" v-bind:key="user.id">
        <v-card>
          <v-card-title>
            <h3 class="headline mb-0">{{index+1}}. </h3>
            <h3 class="headline mb-0">{{user.name}}</h3>
          </v-card-title>
          <v-card-content>
            <v-chip text-color="white" title="Rating" color="primary">{{user.rating.toFixed(1)}} <v-icon rigtht>grade</v-icon></v-chip>
            <svg style="vertical-align: middle; margin: 4px;" :width="sparkline.w" :height="sparkline.h">
              <path style="stroke:#555; fill: transparent;" :d="createSparkline(user)" />
            </svg>
            <v-chip text-color="white" title="Streak" color="green"><v-icon rigtht>schedule</v-icon> {{user.streak}}</v-chip>
            <v-chip text-color="white" title="Wins" color="primary"><v-icon rigtht>thumb_up</v-icon> {{user.wins }}</v-chip>
            <v-chip text-color="white" title="Losses" color="red"><v-icon rigtht>thumb_down</v-icon> {{user.losses}}</v-chip>
          </v-card-content>
        </v-card>
      </div>
          <v-btn @click="rank">Rank</v-btn>
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

