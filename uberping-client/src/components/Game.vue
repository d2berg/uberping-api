<template>
  <table>
    <tr>
      <th><label>Home</label></th>
      <th><label>Away</label></th>
      </tr>
    <tr>
      <td>
        <select v-model="homeId">
          <option v-bind:key="user._id" v-for="user in users" v-bind:value="user._id">
          {{ user.name }}
          </option>
        </select>
      </td>
      <td>
        <select v-model="awayId">
          <option v-bind:key="user._id" v-for="user in users" v-bind:value="user._id">
          {{ user.name }}
          </option>
        </select>
      </td>
    </tr>
    <tr>
      <td><input type="number" v-model="homeScore" /></td>
      <td><input type="number" v-model="awayScore" /></td>
    </tr>
  </table>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Highscopre',
  data(){
    return {
      homeId: '',
      homeScore: 11,
      awayScore: 11,
      awayId: '',
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
  }
}
</script>

