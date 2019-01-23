<template>
<div>
  <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
          <v-select label="Home player" v-model="homeUser" :items="users" item-text="name" item-value="_id">
          </v-select>
          <vue-slider v-model="homeScore" min="0" max="30" dot-size="25" tooltip="false"  />
          <v-card>
            <div class="score">
              <table><tr>
                <td>
                  <span class="user">
                  {{homeUser ? users.find(u => u._id === homeUser).name : 'home'}}
                </span>
                </td>
                <td>
                  <span style="text-align:center;">{{homeScore}} - {{awayScore}}</span>
                </td>
                <td>
                  <span class="user">{{awayUser ? users.find(u => u._id === awayUser).name : 'away'}}</span>
                </td>
              </tr></table>
            </div>
          </v-card>
          
          <v-select label="Away player" v-model="awayUser" :items="users" item-text="name" item-value="_id">
          </v-select>
          <vue-slider v-model="awayScore" min="0" max="30" dot-size="25" tooltip="false" />
      <br />
    <br />
    <div class="text-xs-center">
    <v-btn round color="primary" large @click="register" dark>
      {{infoText}}
       <v-icon right dark>cloud_upload</v-icon>
    </v-btn>
  </div>
  </div>
</template>

<script>

import axios from 'axios';
import vueSlider from 'vue-slider-component'

export default {
  name: 'Highscopre',
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
.user {
  font-size: 50%;
}
table {
  table-layout: fixed;
}
td {
  text-align: center;
}
</style>


