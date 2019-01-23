import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
// import 'vue-material/dist/vue-material.min.css';
// import 'vue-material/dist/theme/default.css';
import 'vuetify/dist/vuetify.min.css';


// Vue.use(VueMaterial);
Vue.use(Vuetify);
// Vue.use(MdOption);
// Vue.use(MdSelect);
Vue.use(VueRouter);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
