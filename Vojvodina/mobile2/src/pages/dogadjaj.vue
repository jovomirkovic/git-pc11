<template>
  <div class="">
    <q-carousel-slide name="dogadjaj" class="q-pa-none mobilniCssAnketa">
      <q-scroll-area class="fit mobilniCssAnketa">
        <div class="column no-wrap flex-center q-carousel--padding;">
          <!-- <q-icon name="accessibility" size="56px" style="top:15px" /> -->
          <div style="width: 100%; text-align: center">
            <p style="
                position: relative;
                top: 75px;
                text-align: center;
                font-size: 20pt;
                font-weight: 200;
                line-height: 50%;
                color: #00000090;
              ">
              Анкета
            </p>
            <q-img src="..\assets\img\sunce.png" style="width: 35%; position: relative; top: 100px" />
          </div>
          <div class="pozadinaDonja" style="
              position: absolute;
              bottom: 0px;
              margin: 0px;
              text-align: center;
              width: 90%;
              padding: 150px 25px 50px 25px;
            ">
            <q-select dense outlined v-model="nivoTrenaznogOpterecenja" label="Ocenite nivo fizičkog zamora"
              option-value="value" option-label="label" :options="borgScale" emit-value map-options
              style="margin-top: 15px">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" style="">
                  <span style="
                      width: 20px;
                      height: 10px;
                      margin: 10px;
                      border-radius: 5px;
                    " :style="{ backgroundColor: [getColor(scope.opt.value)] }"></span>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select dense outlined v-model="ocenaPsiholoskogZamora" label="Ocenite nivo mentalnog zamora"
              option-value="value" option-label="label" :options="nivoidPsiholoskogZamora" emit-value map-options
              style="margin-top: 15px">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" style="">
                  <span style="
                      width: 20px;
                      height: 10px;
                      margin: 10px;
                      border-radius: 5px;
                    " :style="{ backgroundColor: [getColor(scope.opt.value)] }"></span>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <br />
            <br />

            <!-- <p style="text-align: center; font-size: medium; margin: 5px;">
              Имате ли упалу или бол?
            </p>

            <div style="text-align: center; ">
              <q-btn label="Напред" @click="otvoriStanjeAnketa()"
                style="margin:5px; background-color: rgba(255, 255, 255, 0.8)">
                <q-avatar size="40px">
                  <img src="../images/front.png" />
                  <img v-show="false" src="../images/telo-napred.png" />
                </q-avatar>
              </q-btn>
              <q-btn label="Назад" @click="otvoriStanjeAnketaLedja()"
                style="margin:5px; background-color: rgba(255, 255, 255, 0.8)">
                <q-avatar size="40px">
                  <img src="../images/back.png" />
                  <img v-show="false" src="../images/telo-nazad.png" />
                </q-avatar>
              </q-btn>
              <br />
              <br />
            </div> -->

            <div style="text-align: center">
              <q-btn style="
                  z-index: 1;
                  border-radius: 20px;
                  color: white;
                  background-color: #2b3357;
                " icon="mail" @click="posalji" label="POŠALJI" />
            </div>

            <!-- <body-front />
               <body-back /> -->
          </div>
        </div>
      </q-scroll-area>
    </q-carousel-slide>

    <!-- dugme za pomoc -->
    <q-btn-dropdown :content-style="{ backgroundColor: '#000000d0' }" style="
        position: fixed;
        top: 10px;
        left: 10px;
        opacity: 1;
        background-color: #2b3357;
        color: GhostWhite;
      " push label="Meni">
      <q-list>
        <q-item clickable @click="ajdeKuci">
          <q-item-section avatar>
            <q-avatar icon="home" text-color="white" class="bg-secondary" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: ghostwhite; font-weight: bold">Početna</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="otvoriDobroJutro" :disable="dobroJutroPopunjen">
          <q-item-section avatar>
            <q-avatar icon="wb_sunny" color="yellow-8" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: ghostwhite; font-weight: bold">Dobro jutro</q-item-label>
            <q-item-label caption style="color: ghostwhite; font-weight: lighter">Jutarnja anketa</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="otvoriLakuNoc" :disable="lakuNocPopunjen">
          <q-item-section avatar>
            <q-avatar icon="nights_stay" color="blue-10" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: ghostwhite; font-weight: bold">Laku noć</q-item-label>
            <q-item-label caption style="color: ghostwhite; font-weight: lighter">Večernja anketa</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="otvoriSettings">
          <q-item-section avatar>
            <q-avatar icon="settings" color="grey-5" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: ghostwhite; font-weight: bold">Podešavanja</q-item-label>
            <q-item-label caption style="color: ghostwhite; font-weight: lighter">Automatsko logovanje</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="logout">
          <q-item-section avatar>
            <q-avatar icon="logout" color="grey-7" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label style="color: ghostwhite; font-weight: bold">Kraj rada</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn round push style="
        position: fixed;
        top: 10px;
        right: 10px;
        opacity: 1;
        background-color: #2b3357;
        color: GhostWhite;
      " icon="logout" @click="logout" />

    <q-dialog v-model="dialogSettings" transition-show="rotate" transition-hide="rotate" ref="dialogOpenedTest"
      :content-style="{ backgroundColor: '#000000c0' }">
      <q-layout view="Lhh lpR fff" container class="bg-white" style="height: 150px">
        <q-header style="background-color: #2b3357">
          <q-toolbar>
            <q-toolbar-title>Podešavanja</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-header>
        <q-card style="margin: 15px; margin-top: 75px">
          <div>
            <ul id="podesi">
              <label class="switch">
                <input type="checkbox" v-on:change="autoLogin" v-model="selektovan_al" id="cb2" />
                <span class="slider"></span>
              </label>
              <span class="podesi-txt" style="color: #448087; font-size: 18px">Automatska prijava</span>
            </ul>
          </div>
        </q-card>
      </q-layout>
    </q-dialog>

    <div>
      <q-dialog v-model="openedAnketa" ref="dialogOpenedTest">
        <div>
          <bodyfront v-bind:inicijalniNivoBola="nivoBola" />
        </div>
        <!-- <body-back /> -->
      </q-dialog>

      <q-dialog v-model="openedAnketa_back" ref="dialogOpenedTest">
        <bodyback v-bind:inicijalniNivoBola="nivoBola" />
        <!-- <body-back /> -->
      </q-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { date } from "quasar";

import smileySlider from "../components/SmileySlider.vue";
import bodyfront from "../components/BodyFront.vue";
import bodyback from "../components/BodyBack.vue";

import ImageMap from "image-map";

export default {
  components: {
    bodyfront,
    bodyback,
    smileySlider,
  },
  props: ["userData", "globalTest"],
  data() {
    return {
      nivoBola: [
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
      ],
      slide: "style",
      lorem: "Dobar dan, i tako to...",
      kvalitetSna: 0,
      raspolozenje: 0,
      puls: "",
      ocenaMentalnogOpterecenja: "",
      ocenaFizickogOpterecenja: "",
      ocenaPsiholoskogZamora: "",
      nivoTrenaznogOpterecenja: "",
      raspolozenjePosleTreniga: "",
      obroci: "",
      //raspolozenjePredSpavanje: 5,
      opened: false,
      // opened_back: false,
      openedAnketa: false,
      openedAnketa_back: false,
      tolkin: "",
      userId: 0,

      // 0 - Nothing at all / Bez opterećnja
      // 1 - Very weak / Veoma slabo
      // 2 - Weak / Slabo
      // 3 - Moderate / Umereno
      // 6 – Strong / Jako
      // 7  - Very strong / Veoma Jako
      // 10 – Extremely hard / Ekstremno teško
      // 12 – Absolute maximum / Apsolutni maksimum

      nivoidPsiholoskogZamora: [
        {
          value: 0,
          label: "Bez opterećnja",
        },
        {
          value: 1,
          label: "Veoma slabo",
        },
        {
          value: 2,
          label: "Slabo",
        },
        {
          value: 3,
          label: "Umereno",
        },
        {
          value: 6,
          label: "Jako",
        },
        {
          value: 7,
          label: "Veoma Jako",
        },
        {
          value: 10,
          label: "Ekstremno teško",
        },
        {
          value: 12,
          label: "Apsolutni maksimum",
        },
      ],
      borgScale: [
        {
          value: 0,
          label: "Bez opterećnja",
        },
        {
          value: 1,
          label: "Veoma slabo",
        },
        {
          value: 2,
          label: "Slabo",
        },
        {
          value: 3,
          label: "Umereno",
        },
        {
          value: 6,
          label: "Jako",
        },
        {
          value: 7,
          label: "Veoma Jako",
        },
        {
          value: 10,
          label: "Ekstremno teško",
        },
        {
          value: 12,
          label: "Apsolutni maksimum",
        },
      ],
      dobroJutroPopunjen: false,
      lakuNocPopunjen: false,
      selektovan_al: false,
      dialogSettings: false,
      globalDialog: window.$dialogActive,
    };
  },
  beforeMount() {
    this.tolkin = this.$route.params.tolkin;
    this.userId = this.$route.params.userId;

    if (localStorage.getItem("autologin") === "1") this.selektovan_al = true;
    else this.selektovan_al = false;

    var d = date.formatDate(new Date(), "DD.MM.YYYY.");
    let a = localStorage.getItem("dobroJutroAnketaPostavljenaDana");

    if (a == d) {
      this.dobroJutroPopunjen = true;
    } else this.dobroJutroPopunjen = false;

    let b = localStorage.getItem("lakuNocAnketaPostavljenaDana");

    if (b == d) {
      this.lakuNocPopunjen = true;
    } else this.lakuNocPopunjen = false;
  },
  mounted() {
    //this.userName = localStorage.getItem("mAppsUsername");
    //this.$refs.karusel.goTo("home");
    //this.$refs.karusel.goToSlide(this.slideNumber); //idemo na stranu na kojoj smo bili kad smo pozvali neku mApp
  },

  methods: {
    autoLogin: function () {
      var checkBox = document.getElementById("cb2");
      if (checkBox.checked == true) {
        localStorage.setItem("autologin", "1");

        this.$q.notify({
          message: "Program će se startovati bez prijave!",
          color: "red",
        });
      } else {
        localStorage.setItem("autologin", "0");

        this.$q.notify({
          message: "Automatska prijava je isključena!",
          color: "green",
        });
      }
    },
    otvoriSettings() {
      this.dialogSettings = true;
    },
    otvoriDobroJutro() {
      var d = date.formatDate(new Date(), "DD.MM.YYYY.");
      let a = localStorage.getItem("dobroJutroAnketaPostavljenaDana");

      if (a == d) {
        this.$q.notify({
          message: "Ovu anketu ste već popunili. Hvala.",
          color: "red",
        });
        return;
      }

      this.$router.push({
        name: "dobrojutro",
        params: { tolkin: this.tolkin, userId: this.userId },
      });
    },
    otvoriLakuNoc() {
      var d = date.formatDate(new Date(), "DD.MM.YYYY.");
      let a = localStorage.getItem("lakuNocAnketaPostavljenaDana");

      if (a == d) {
        this.$q.notify({
          message: "Ovu anketu ste već popunili. Hvala.",
          color: "red",
        });
        return;
      }

      this.$router.push({
        name: "lakunoc",
        params: { tolkin: this.tolkin, userId: this.userId },
      });
    },
    logout(navigator) {
      window.navigator.app.exitApp();
    },
    updateRPT: function (ocena) {
      this.raspolozenjePosleTreniga = ocena;
    },
    otvoriStanjeAnketa() {
      this.openedAnketa = true;
      ImageMap("img[usemap]", 350);
    },
    otvoriStanjeAnketaLedja() {
      this.openedAnketa_back = true;
      ImageMap("img[usemap]", 350);
    },
    getDateTime() {
      const today = new Date();

      return today.toISOString();
    },
    getColor(val) {
      switch (val) {
        case 0:
          return "#548235";
        case 1:
          return "#00b050";
        case 2:
          return "#92d050";
        case 3:
          return "#bf9000";
        case 6:
          return "#ffc000";
        case 7:
          return "#ff0000";
        case 10:
          return "#c00000";
        case 12:
          return "#7030a0";

        default:
          break;
      }
    },
    posalji() {
      var self = this;
      let datetime = this.getDateTime();
      let objstanjeTelaModelList = [];

      objstanjeTelaModelList.push(this.nivoBola[0]);
      objstanjeTelaModelList.push(this.nivoBola[1]);
      objstanjeTelaModelList.push(this.nivoBola[2]);
      objstanjeTelaModelList.push(this.nivoBola[3]);
      objstanjeTelaModelList.push(this.nivoBola[4]);
      objstanjeTelaModelList.push(this.nivoBola[5]);
      objstanjeTelaModelList.push(this.nivoBola[6]);
      objstanjeTelaModelList.push(this.nivoBola[7]);
      objstanjeTelaModelList.push(this.nivoBola[8]);
      objstanjeTelaModelList.push(this.nivoBola[9]);
      objstanjeTelaModelList.push(this.nivoBola[10]);
      objstanjeTelaModelList.push(this.nivoBola[11]);
      objstanjeTelaModelList.push(this.nivoBola[12]);
      objstanjeTelaModelList.push(this.nivoBola[13]);
      objstanjeTelaModelList.push(this.nivoBola[14]);
      objstanjeTelaModelList.push(this.nivoBola[15]);
      objstanjeTelaModelList.push(this.nivoBola[16]);
      //1787
      // var dataString1 = {
      //   datumVreme: datetime,
      //   dobaDanaTip: "DOG",
      //   ident: null,
      //   kvalitetSna: this.kvalitetSna,
      //   obrociPoPlanu: 0,
      //   puls: this.puls,
      //   raspolozenje: this.raspolozenje,
      //   userIdent: this.userData.id,
      //   stanjaTela: null,
      //   stanjeTelaValuesList: objstanjeTelaModelList
      // };

      var dataString = {
        datumVreme: datetime,
        dobaDanaTip: "POSLE_UTAKMICE",
        idDogadjaja: this.$route.params.id,
        identUser: this.userData.id,
        kvalitetSna: null,
        obrociPoPlanu: null,
        ocenaFizickogOpterecenja: this.nivoTrenaznogOpterecenja,
        ocenaMentalnogOpterecenja: this.ocenaPsiholoskogZamora,
        puls: this.puls,
        raspolozenje: null,
        stanjeTelaValuesList: objstanjeTelaModelList,
        tqr: "0",
        duzinaSpavanja: null,
        nivoSpremnosti: null,
        nivoZamoraIStresa: null,
      };

      let data1 = JSON.stringify(dataString);

      console.log(data1);
      debugger;
      let linkStr = this.$api.defaults.baseURL + "/doba-dana/posle-utakmice";
      let token = localStorage.getItem("token");
      axios
        .post(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + token,
          },
        })
        .then(function (response) {
          console.log(response);
          self.$q.notify({
            message: "Podaci su uspešno poslati! Hvala.",
            color: "green",
          });
          self.$router.push({
            name: "start",
          });

          // if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(self.posaljiLokaciju);}
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });
    },
    posaljiLokaciju(pos) {
      debugger;
      var dataString = {
        adresa: "",
        drzava: "",
        geoLat: pos.coords.latitude,
        geoLong: pos.coords.longitude,
        grad: "",
        naziv: "",
        userIdent: this.userData.id,
      };

      let linkStr = this.$api.defaults.baseURL + "/lokacija-spijun";
      let data1 = JSON.stringify(dataString);
      let token = localStorage.getItem("token");

      debugger;
      this.$axios
        .post(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + token,
          },
        })
        .then(function (response) {
          debugger;
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });
      this.ajdeKuci();
    },
    ajdeKuci() {
      this.$router.push({
        path: "/start",
      });
    },
  },

  watch: {
    globalTest(newValue) {
      if (newValue == false) {
        this.opened = false;
        this.opened_back = false;
        this.dialogSettings = false;
      }
    },

    opened(newVal) {
      if (this.globalTest != newVal) {
        this.$emit("menjaj-test", newVal);
      }
      console.log(newVal);
    },
    opened_back(newVal) {
      if (this.globalTest != newVal) {
        this.$emit("menjaj-test", newVal);
      }
      console.log(newVal);
    },
    dialogSettings(newVal) {
      if (this.globalTest != newVal) {
        this.$emit("menjaj-test", newVal);
      }
      console.log(newVal);
    },
  },
};
</script>

<style scoped>
.my-custom-toggle {
  border: 1px solid #027be3;
}

.mobilniCssAnketa {
  width: 100%;
  height: 100vh;
  background-image: url("../assets/img/login.png");
  background-repeat: no-repeat;
  background-size: 100% 100%, contain;
  vertical-align: -webkit-baseline-middle;
}

.pozadinaDonja {
  background-image: url("../assets/img/clipboard.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.switch input {
  display: none;
}

.switch {
  display: inline-block;
  width: 50px;
  height: 30px;
  margin: 8px 8px;
  /*             transform: translateY(50%);
 */
  position: relative;
  vertical-align: middle;
  background: #fff;
  border-radius: 30px;
}

.slider {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 30px;
  box-shadow: 0 0 0 2px #eee, 0 0 4px #eee;
  cursor: pointer;
  border: 2px solid transparent;
  /*             overflow: hidden;
 */
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  display: block;
  width: 25px;
  height: 25px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  border-radius: 30px;
  /*             transform: translateX(-20px);
 */
  transition: 0.4s;
}

input:checked+.slider:before {
  transform: translateX(20px);
  background: #2b3357;
}

input:checked+.slider {
  box-shadow: 0 0 0 2px #2b3357, 0 0 2px #2b3357;
}
</style>
