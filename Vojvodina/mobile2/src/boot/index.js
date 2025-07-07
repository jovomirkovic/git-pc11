import Vue from "vue";

import axios from "axios";

Vue.prototype.$axios = axios;

//Vue.prototype.$apiPutanja = "https://procoach-dev.api.glu.one"; //demo za Vojvodinu 14.03.24.
Vue.prototype.$apiPutanja = "https://procoach-prod.api.glu.one"; //produkcija za Vojvodinu 14.03.24.


//Vue.prototype.$apiPutanja = "https://redstar-core-prvitim-appsvc.azurewebsites.net"; //prvi tim
//https://redstar-core-prvitim-appsvc.azurewebsites.net/swagger-ui/#/

//Vue.prototype.$apiPutanja = "https://redstar-core-dev-appsvc.azurewebsites.net"; //t4estna omladina
//Vue.prototype.$apiPutanja = "https://redstar-core-appsvc.azurewebsites.net"; //produkciona    !!!promeniti putanju i u start.vue
//Vue.prototype.$apiPutanja = "http://192.168.1.13"; //lokal
Vue.prototype.$ver = "0.2.02";

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
  Vue.prototype.$igracID = 0;
  Vue.prototype.$timID = 0;
  Vue.prototype.$igracName = "";
};
