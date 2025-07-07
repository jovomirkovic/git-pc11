// import something here
import Vue from "vue";

import axios from "axios";
Vue.prototype.$axios = axios;

//  Vue.prototype.$apiPutanja = "https://redstar-core-dev-appsvc.azurewebsites.net"; //testna ver gadja redstardev2 bazu
// Vue.prototype.$apiPutanja = "https://redstar-core-procoach-appsvc.azurewebsites.net"; //dev za prococah11demo stara prelaz 09.07.2023.

Vue.prototype.$apiPutanja = "https://procoach-prod.api.glu.one"; //produkcija za Vojvodinu 14.03.24.

//ovo je DEMO verzija, i ne sme ni da ide na PRODUKCIONU bazu!!!
//Vue.prototype.$apiPutanja = "https://redstar-core-appsvc.azurewebsites.net"; //produkciona

//Vue.prototype.$apiPutanja = "http://192.168.1.13"; //lokal
Vue.prototype.$ver = "1.0.00";

import Simplert from "vue2-simplert-plugin";
require("../../node_modules/vue2-simplert-plugin/dist/vue2-simplert-plugin.css");
Vue.use(Simplert);

// "async" is optional
export default async (
  {
    /* app, router, Vue, ... */
  }
) => {
  // something to do
  Vue.prototype.$token = "tokenBre"; //globalna varijabla, pristupa joj se sa window.$token
  Vue.prototype.$userID = 0;
  Vue.prototype.$userName = "";
  Vue.prototype.$userIsAdmin = false;
  Vue.prototype.$igracID = 0;
  Vue.prototype.$timID = 0;
  Vue.prototype.$igracName = "";
};
