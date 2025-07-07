<template>
  <div class="">
    <q-carousel-slide name="ln" class="q-pa-none mobilniCssLN" style="background-color: darkgray">
      <q-scroll-area class="fit">
        <div class="column no-wrap flex-center q-carousel--padding">
          <!-- <q-icon name="nights_stay" size="56px" style="top:15px" /> -->
          <q-img :src="moonImg" spinner-color="white" style="position: absolute; width: 50%; top: 25%" />
          <div class="">
            <p style="
                position: relative;
                top: 75px;
                text-align: center;
                font-size: 20pt;
                font-weight: 200;
                line-height: 50%;
                color: GhostWhite;
              ">
              Večernja anketa
            </p>
          </div>
          <div style="
              position: absolute;
              bottom: 0px;
              text-align: center;
              margin: 25px;
              padding: 25px 0px;
              width: 90%;
              background-color: #0000006f;
              border-radius: 5px;
            " class="q-mt-md">
            <p style="text-align: center; font-size: large; color: GhostWhite">
              Obroci po planu?
            </p>
            <div style="text-align: center">
              <q-btn-toggle v-model="obroci" class="my-custom-toggle text-secondary" no-caps rounded unelevated
                toggle-color="secondary" color="transparent" emit-value :options="[
                  { label: 'Da', value: 1 },
                  { label: 'Ne', value: 0 },
                ]" />
            </div>
            <br />
            <p style="text-align: center; font-size: large; color: GhostWhite">
              Kako si raspoložen?
            </p>
            <q-rating v-model="nivoZamoraIStresa" size="40px" :max="5" color="blue-11" color-selected="secondary"
              style="padding-bottom: 25px" />
            <br />
            <p style="text-align: center; font-size: medium; color: GhostWhite">
              Stanje tela
            </p>

            <div style="text-align: center">
              <q-btn label="Napred" @click="otvoriStanjeDobroJutro()"
                style="margin: 5px; background-color: rgba(255, 255, 255, 0.8)">
                <q-avatar size="40px">
                  <img src="../images/front.png" />
                  <img v-show="false" src="../images/telo-napred.png" />
                </q-avatar>
              </q-btn>
              <q-btn label="Nazad" @click="otvoriStanjeDobroJutroLedja()"
                style="margin: 5px; background-color: rgba(255, 255, 255, 0.8)">
                <q-avatar size="40px">
                  <img src="../images/back.png" />
                  <img v-show="false" src="../images/telo-nazad.png" />
                </q-avatar>
              </q-btn>
              <br />
              <br />
            </div>
            <q-btn class="bg-white" style="text-align: center; border-radius: 20px; color: #2b3357" icon="mail"
              @click="posalji" label="Pošalji" />
          </div>
        </div>
      </q-scroll-area>
    </q-carousel-slide>

    <q-dialog v-model="opened" ref="dialogOpenedTest">
      <bodyfront v-if="opened" v-bind:inicijalniNivoBola="nivoBola" />
      <!-- <body-back /> -->
    </q-dialog>

    <q-dialog v-model="opened_back" ref="dialogOpenedTest">
      <bodyback v-if="opened_back" v-bind:inicijalniNivoBola="nivoBola" />
      <!-- <body-back /> -->
    </q-dialog>

    <!-- dugme za pomoc -->
    <q-btn-dropdown :content-style="{ backgroundColor: '#000000b0' }" style="
        position: fixed;
        top: 10px;
        left: 10px;
        opacity: 1;
        background-color: #00000090;
        color: GhostWhite;
      " push label="Meni">
      <q-list style="color: GhostWhite">
        <q-item clickable @click="ajdeKuci">
          <q-item-section avatar>
            <q-avatar icon="home" class="bg-secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Početna</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="otvoriDobroJutro" :disable="dobroJutroPopunjen">
          <q-item-section avatar>
            <q-avatar icon="wb_sunny" color="yellow-8" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dobro jutro</q-item-label>
            <q-item-label caption style="color: lightgray">Јутарња анкета</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="otvoriLakuNoc" disabled>
          <q-item-section avatar>
            <q-avatar icon="nights_stay" color="blue-10" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Laku noć</q-item-label>
            <q-item-label caption style="color: lightgray">Вечерња анкета</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="otvoriSettings">
          <q-item-section avatar>
            <q-avatar icon="settings" color="grey-5" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Podešavanja</q-item-label>
            <q-item-label caption style="color: lightgray">Automatsko logovanje</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="logout">
          <q-item-section avatar>
            <q-avatar icon="logout" color="grey-7" text-color="GhostWhite" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Kraj rada</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn round push style="
        position: fixed;
        top: 10px;
        right: 10px;
        opacity: 1;
        background-color: #00000090;
        color: GhostWhite;
      " icon="logout" @click="logout" />

    <q-dialog v-model="dialogSettings" transition-show="rotate" transition-hide="rotate" ref="dialogOpenedTest"
      :content-style="{ backgroundColor: '#000000c0' }">
      <q-card style="width: 90%; height: 150px">
        <q-toolbar style="background-color: #2b3357; color: white">
          <q-toolbar-title>Podešavanja</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
        <div style="margin-top: 25px">
          <ul id="podesi">
            <label class="switch">
              <input type="checkbox" v-on:change="autoLogin" v-model="selektovan_al" id="cb2" />
              <span class="slider"></span>
            </label>
            <span class="podesi-txt" style="color: #448087; font-size: 18px">Automatska prijava</span>
          </ul>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { date } from "quasar";

import smileySlider from "../components/SmileySlider.vue";
import moonImg1 from "../assets/img/pozadina-mesec.png";
import bodyfront from "../components/BodyFront.vue";
import bodyback from "../components/BodyBack.vue";

export default {
  components: {
    bodyfront,
    bodyback,
    smileySlider,
  },
  props: ["userData", "globalTest"],
  data() {
    return {
      nivoBola: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      obroci: "",
      nivoZamoraIStresa: 0,
      tolkin: "",
      userId: 0,
      raspolozenjePredSpavanje: 0,
      moonImg: moonImg1,
      opened: false,
      opened_back: false,
      dialogSettings: false,
      selektovan_al: false,
      dobroJutroPopunjen: false,
    };
  },
  watch: {
    globalTest(newValue) {
      if (newValue == false) {
        console.log("a0");
        this.opened = false;
        this.opened_back = false;
        this.dialogSettings = false;
        console.log("a00");
      }
    },

    opened(newVal) {
      if (this.globalTest != newVal) {
        console.log("a1");
        this.$emit("menjaj-test", newVal);
      }
    },
    opened_back(newVal) {
      if (this.globalTest != newVal) {
        console.log("a2");
        this.$emit("menjaj-test", newVal);
      }
    },
    dialogSettings(newVal) {
      if (this.globalTest != newVal) {
        console.log("a3");
        this.$emit("menjaj-test", newVal);
      }
    },
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
  },
  mounted() {
    this.userName = localStorage.getItem("mAppsUsername");
    //this.$refs.karusel.goTo("home");
    //this.$refs.karusel.goToSlide(this.slideNumber); //idemo na stranu na kojoj smo bili kad smo pozvali neku mApp
  },

  methods: {
    otvoriStanjeDobroJutro() {
      this.opened = true;
    },
    otvoriStanjeDobroJutroLedja() {
      console.log("kme");
      this.opened_back = true;
      console.log("kme2");
    },
    getDateTime() {
      const today = new Date();

      return today.toISOString();
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

      var dataString = {
        //datumVreme: datetime,
        dobaDanaTip: "LN",
        idDogadjaja: null,
        kvalitetSna: 0,
        //obrociPoPlanu: 1,
        obrociPoPlanu: this.obroci,
        ocenaFizickogOpterecenja: null,
        ocenaMentalnogOpterecenja: null,
        puls: null,
        raspolozenje: this.nivoZamoraIStresa,
        identUser: this.userData.id,
        stanjeTelaList: null,
        stanjeTelaValuesList: objstanjeTelaModelList,
        tqr: "",
        duzinaSpavanja: null,
        nivoSpremnosti: null,
        nivoZamoraIStresa: null,
      };

      let data1 = JSON.stringify(dataString);

      console.log(data1);

      debugger;
      let linkStr = this.$api.defaults.baseURL + "/doba-dana/ln";
      let notifikacija = window.cordova;
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
          var d = date.formatDate(new Date(), "DD.MM.YYYY.");
          localStorage.setItem("lakuNocAnketaPostavljenaDana", d);
          // notifikacija.plugins.notification.local.cancel(2, function () {
          //   console.log("done 2");
          // });

          // const today = new Date();
          // const tomorrow = new Date(today);
          // tomorrow.setDate(tomorrow.getDate() + 1);

          // notifikacija.plugins.notification.local.schedule({
          //   id: 2,
          //   title: "PODSETNIK",
          //   text: "Proverite da li ste popunili večernju anketu",
          //   foreground: true,
          //   trigger: {
          //     every: { hour: 21, minute: 30, second: 10 },
          //     count: 1,
          //     firstAt: tomorrow
          //   }
          // });
          //if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(self.posaljiLokaciju);}
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });
      this.ajdeKuci();
    },
    ajdeKuci() {
      this.$router.push({ path: "/start" });
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
    },

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
          message: "Ovu anketu ste već poslali. Hvala.",
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
      return;
    },
    logout(navigator) {
      window.navigator.app.exitApp();
    },
  },
};
</script>

<style scoped>
.my-custom-toggle {
  border: 2px solid #ffffff;
}

.mobilniCssLN {
  width: 100%;
  height: 100vh;
  background-image: url("../assets/img/pozadina-lakunoc.png");
  background-repeat: no-repeat;
  background-size: 100% 100%, contain;
  vertical-align: -webkit-baseline-middle;
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
