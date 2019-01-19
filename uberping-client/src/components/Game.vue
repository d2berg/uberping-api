<template>
    <md-content>
    <md-field>
      <label>Home player</label>
      <md-select v-model="homeUser">
        <md-option v-bind:key="user._id" v-for="user in users" v-bind:value="user._id">
        {{ user.name }}
        </md-option>
      </md-select>
    </md-field>
    <md-field>
      <label>Away player</label>
      <md-select v-model="awayUser">
        <md-option v-bind:key="user._id" v-for="user in users" v-bind:value="user._id">
        {{ user.name }}
        </md-option>
      </md-select>
    </md-field>
    <md-field><label>{{homeUser ? users.find(u => u._id === homeUser).name : 'Home'}} score</label><md-input type="number" v-model="homeScore" /></md-field>
    <md-field><label>{{awayUser ? users.find(u => u._id === awayUser).name : 'Away'}} score</label><md-input type="number" v-model="awayScore" /></md-field>
    <md-button class="md-primary md-raised" @click="register">Register</md-button>
    <md-field><label>{{status}}</label></md-field>
    </md-content>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Highscopre',
  data(){
    return {
      homeUser: '',
      homeScore: 11,
      awayScore: 11,
      awayUser: '',
      users: null,
      status: '',
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
        this.status = 'Saving...';
        const match = {
          homeId: this.homeUser,
          homeScore: this.homeScore,
          awayId: this.awayUser,
          awayScore: this.awayScore
        };
        axios.post('api/matches', match).then(() => {
          this.status = "Saved";
        });
      }
    }
  }
}
</script>

