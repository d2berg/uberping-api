<template>
<v-layout align-space-between justify-space-around column fill-height>
  <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
          <v-select label="Home player" v-model="homeUser" :items="users" item-text="name" item-value="_id">
          </v-select>
          <vue-slider style="margin: 2em 1em;" v-model="homeScore" min="0" max="30" dot-size="25" tooltip="false"  />
          <v-card style="margin-bottom: 1em;">
            <div class="score" v-if="!homeUser || !awayUser">
              <span>Select players.</span>
            </div>
            <div class="score" v-if="homeUser && awayUser">
              <table><tr>
                <td>
                  <span class="user">
                  {{homeUser ? users.find(u => u._id === homeUser).name : 'home'}}
                </span>
               
                </td>
                <td>
                  <span class="user">{{awayUser ? users.find(u => u._id === awayUser).name : 'away'}}</span>
                </td>
              </tr>
              <tr>
                <td><span style="text-align:center;">{{homeScore}}</span></td>
                <td><span>{{awayScore}}</span></td>
                </tr>
              </table>
            </div>
          </v-card>
          
          <v-select label="Away player" v-model="awayUser" :items="users" item-text="name" item-value="_id">
          </v-select>
          <vue-slider style="margin: 2em 1em;" v-model="awayScore" min="0" max="30" dot-size="25" tooltip="false" />
      <br />
    <br />
    <div class="text-xs-center">
    <v-btn round color="primary" large @click="register" dark>
      {{infoText}}
       <v-icon right dark>cloud_upload</v-icon>
    </v-btn>
  </div>
</v-layout>
</template>

<script>

import axios from 'axios';
import vueSlider from 'vue-slider-component'

export default {
  name: 'Highscore',
  components: {
    vueSlider
  },
  data(){
    return {
      numbers: Array.apply(null, {length: 30}).map(Number.call, Number),
      homeUser: '',
      homeScore: 11,
      awayScore: 11,
      awayUser: '',
      users: null,
      infoText: 'Register',
      showInfo: false,
      loading: false
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
        const match = {
          homeId: this.homeUser,
          homeScore: this.homeScore,
          awayId: this.awayUser,
          awayScore: this.awayScore
        };
        axios.post('api/matches', match).then(() => {
          this.infoText = 'Saved';
          setTimeout(() => this.infoText = 'Register', 1000);
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.score {
  text-align: center;
  font-size: 3em;
}
.user {
  font-size: 50%;
}
table {
  table-layout: fixed;
}
td {
  text-align: center;
  overflow: auto;
}
</style>


