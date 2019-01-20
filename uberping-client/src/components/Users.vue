<template>
  <div>
    <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
    <table>
      <tr class="grid-item" v-for="(user) in users" v-bind:key="user.id">
        <td><span>{{user.name}}</span></td>
        <td><md-button @click="deleteUser(user._id)">Delete</md-button></td>
      </tr>
      <tr>
        <td>
        <md-field>
          <label>New user</label>
          <md-input type="text" v-model="name" />
        </md-field>
        </td>
        <td>
          <md-field><md-button class="md-primary md-raised" @click="addUser">Add</md-button></md-field>
        </td>
      </tr>
  </table>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Users',
  data(){
    return {
      users: null,
      name,
      loading: false,
    }
  },
   mounted () {
     this.getUsers();
  },
  methods: {
    deleteUser(id){
      axios.delete(`api/users/${id}`).then(() => this.getUsers());
    },
    addUser(){
      axios.post(`api/users/${this.name}`).then(() => this.getUsers());
    },
    getUsers(){
      this.loading = true;
       axios
      .get('api/users')
      .then(response => {
        const users = response.data;
        this.users = users.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          if(aName < bName) { return -1; }
          if(aName > bName) { return 1; }
          return 0;
          });
        this.loading = false;
      });
    },
  },
}
</script>

