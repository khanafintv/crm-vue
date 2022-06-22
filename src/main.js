import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dateFilter from "@/filters/date.filter.js";
import currencyFilter from "@/filters/currency.filter.js";
import tooltipDerective from "./derectives/tooltip.derective";
import messagePlugin from "./myplugins/message.plugin";
import Vuelidate from "vuelidate";
import Paginate from "vuejs-paginate";
import "materialize-css/dist/js/materialize.min.js";
import "./registerServiceWorker";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import Loader from "@/components/Loader";

//import { initializeApp } from "firebase/app";

Vue.config.productionTip = false;

Vue.filter("date", dateFilter);
Vue.filter("currency", currencyFilter);
Vue.directive("tooltip", tooltipDerective);
Vue.use(Vuelidate);
Vue.use(messagePlugin);
Vue.component("Loader", Loader);
Vue.component("Paginate", Paginate);

firebase.initializeApp({
  apiKey: "AIzaSyAelPL1vpPMii-Ok-So0CQXwykevpo1glY",
  authDomain: "vuecrm-6ada7.firebaseapp.com",
  projectId: "vuecrm-6ada7",
  storageBucket: "vuecrm-6ada7.appspot.com",
  messagingSenderId: "1023890057296",
  appId: "1:1023890057296:web:d6d392ca93757daf388955",
  measurementId: "G-5TG0V3KLH5",
});

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
});

// new Vue({
//   router,
//   store,
//   render: (h) => h(App),
// }).$mount("#app");
