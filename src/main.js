import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "font-awesome/css/font-awesome.min.css";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Print from "vue-print-nb";
import VueApexCharts from "vue-apexcharts";
import Loader from "./components/Loader.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueSweetalert2);
Vue.use(require("vue-moment"));
Vue.use(Print);
Vue.use(VueApexCharts);
Vue.use(Loading);

Vue.component("apexchart", VueApexCharts);
Vue.component("loader", Loader);

Vue.filter("toCurrency", (value) => {
  if (isNaN(Number(value))) {
    return value;
  }
  var formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
  });
  return "₦ " + formatter.format(Number(value));
});

Vue.prototype.$appUrl = process.env.VUE_APP_API_URL;

/* -------------------------- MONTHS PROTOTYPES -------------------------- */
const months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

Vue.prototype.$months = months;

const monthsArr = [{ label: "All months", value: 0 }];
for (const value in months) {
  if (Object.hasOwnProperty.call(months, value)) {
    const label = months[value];
    monthsArr.push({ label, value: Number(value) });
  }
}
Vue.prototype.$monthOptions = monthsArr;

/* -------------------------- YEARS PROTOTYPES -------------------------- */
const yearArr = [];
for (let i = new Date().getFullYear(); i >= 2020; i--) {
  yearArr.push(i);
}
Vue.prototype.$yearOptions = yearArr;

/* -------------------------- DRIECTIVES -------------------------- */
Vue.directive("company", {
  bind: (el) => {
    if (store.getters.userType != 100) el.style.display = "none";
  },
});
Vue.directive("staff", {
  bind: (el) => {
    if (store.getters.userType != 200 && store.getters.userType != 300)
      el.style.display = "none";
  },
});
Vue.directive("companystaff", {
  bind: (el) => {
    if (store.getters.userType > 300) el.style.display = "none";
  },
});
Vue.directive("pfc", {
  bind: (el) => {
    if (store.getters.userType != 400) el.style.display = "none";
  },
});
Vue.directive("pfa", {
  bind: (el) => {
    if (store.getters.userType != 500) el.style.display = "none";
  },
});
// for pfc and pfa
Vue.directive("pfca", {
  bind: (el) => {
    if (store.getters.userType < 400) el.style.display = "none";
  },
});
// for staff, adminstaff, pfc, pfa
Vue.directive("spfca", {
  bind: (el) => {
    if (store.getters.userType < 200) el.style.display = "none";
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
