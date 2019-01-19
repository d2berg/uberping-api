<template>
<md-content>
      <md-card>
      <md-card-content>
        <md-field>
          <label>Home player</label>
          <md-select v-model="homeUser">
            <md-option v-bind:key="user._id" v-for="user in users" v-bind:value="user._id">
            {{ user.name }}
            </md-option>
          </md-select>
        </md-field>
        <md-field v-if="homeUser">
          <label>{{homeUser ? users.find(u => u._id === homeUser).name : 'Home'}} score</label>
          <md-select v-model="homeScore">
            <md-option v-bind:key="n" v-for="n in numbers" v-bind:value="n">{{n}}</md-option>
          </md-select>
        </md-field>
      </md-card-content>
      </md-card>
      <br />
    <md-card>
      <md-card-content>
      <md-field>
        <label>Away player</label>
        <md-select v-model="awayUser">
          <md-option v-bind:key="user._id" v-for="user in users" v-bind:value="user._id">
          {{ user.name }}
          </md-option>
        </md-select>
      </md-field>
      <md-field v-if="awayUser">
        <label>{{awayUser ? users.find(u => u._id === awayUser).name : 'Away'}} score</label>
        <md-select v-model="awayScore">
          <md-option v-bind:key="n" v-for="n in numbers" v-bind:value="n">{{n}}</md-option>
        </md-select>
      </md-field>
      </md-card-content>
    </md-card>
    <br />
    <md-card>
      <md-card-content>
      <md-button class="md-primary md-raised" @click="register">Register</md-button>
      </md-card-content>
    </md-card>
    <md-snackbar :md-duration="4000" :md-active.sync="showInfo">
      <span>{{infoText}}</span>
      <md-button class="md-primary" @click="showInfo = false">Close</md-button>
    </md-snackbar>
    </md-content>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Highscopre',
  data(){
    return {
      numbers: Array.apply(null, {length: 30}).map(Number.call, Number),
      homeUser: '',
      homeScore: 11,
      awayScore: 11,
      awayUser: '',
      users: null,
      infoText: '',
      showInfo: false,
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
  methods: {
    register(){
      if(this.homeUser && this.awayUser && this.homeScore > -1 && this.awayScore > -1){
        this.infoText = 'Saving...';
        this.showInfo = true;
        const match = {
          homeId: this.homeUser,
          homeScore: this.homeScore,
          awayId: this.awayUser,
          awayScore: this.awayScore
        };
        axios.post('api/matches', match).then(() => {
          this.infoText = 'Saved.';
        });
      }
    }
  }
}
</script>

