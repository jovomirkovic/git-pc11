<template>
  <div class="">
    <q-carousel-slide name="dj" class="q-pa-none mobilniCssDJ">
      <q-scroll-area class="fit">
        <div class="column no-wrap flex-center q-carousel--padding">
          <!-- <q-icon name="alarm" size="56px" style="top:15px" /> -->
          <div class="">
            <p style="
                position: relative;
                top: 75px;
                text-align: center;
                font-size: 20pt;
                font-weight: 200;
                line-height: 50%;
                color: #00000090;
                z-index: 2;
              ">
              Jutarnja anketa
            </p>
          </div>
          <div style="
              position: absolute;
              bottom: 0px;
              margin: 25px;
              text-align: center;
              width: 90%;
              padding: 25px;
              background: #00000020;
              border-radius: 5px;
            " class="q-mt-md">
            <q-img src="..\assets\img\polusunce.png" style="width: 50%" />
            <!-- <q-select
              outlined
              v-model="vremeSpavanja"
              :options="satiUDanu"
              label="Колико дуго си спавао:"
            /> -->
            <p style="text-align: center; font-size: medium; margin: 15px 0 0 0">
              Oceni kvalitet sna, od 1 do 5:
            </p>
            <q-rating v-model="kvalitetSna" size="40px" :max="5" color="primary" color-selected="secondary" />
            <p style="text-align: center; font-size: medium; margin: 15px 0 0 0">
              Kako si raspoložen?
            </p>
            <q-rating v-model="raspolozenje" size="40px" :max="5" color="primary" color-selected="secondary" />

            <q-input type="number" color="orange" outlined v-model="puls" label="Unesi puls" clearable>
              <template v-slot:append>
                <q-icon name="favorite" />
              </template>

              <template v-slot:hint> Izmerite puls </template>
            </q-input>
            <!-- <q-select
              outlined
              v-model="izabranNivoSpremnostoi"
              :options="nivoiSpremnosti"
              label="Оцените ниво спремности:"
            /> -->

            <q-select v-if="imaLiTqr == true" dense outlined v-model="tqr" label="TQR" option-value="value"
              option-label="label" :options="listaBorg" emit-value map-options style="margin-top: 10px" />

            <br />
            <p style="text-align: center; font-size: medium">Stanje tela</p>

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
            <div style="text-align: center">
              <q-btn style="
                  z-index: 1;
                  border-radius: 20px;
                  color: white;
                  background-color: #2b3357;
                " icon="mail" @click="dobroJutroPost()" label="POŠALJI" />
            </div>

            <!-- <body-front />
            <body-back /> -->
          </div>
        </div>
      </q-scroll-area>
    </q-carousel-slide>

    <div>
      <q-dialog v-model="opened" ref="dialogOpenedTest">
        <bodyfront v-if="opened" v-bind:inicijalniNivoBola="nivoBola" />
        <!-- <body-back /> -->
      </q-dialog>

      <q-dialog v-model="opened_back" ref="dialogOpenedTest">
        <bodyback v-if="opened_back" v-bind:inicijalniNivoBola="nivoBola" />
        <!-- <body-back /> -->
      </q-dialog>

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

          <q-item clickable disabled>
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
  </div>
</template>

<script>
import axios from "axios";
import { date } from "quasar";

import smileySlider from "../components/SmileySlider.vue";
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
      izabranNivoSpremnostoi: 1,
      nivoiSpremnosti: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      vremeSpavanja: "",
      satiUDanu: [
        "00h",
        "01h",
        "02h",
        "03h",
        "04h",
        "05h",
        "06h",
        "07h",
        "08h",
        "09h",
        "10h",
        "11h",
        "12h",
        "13h",
        "14h",
        "15h",
        "16h",
        "17h",
        "18h",
        "19h",
        "20h",
        "21h",
        "22h",
        "23h",
        "24h",
      ],
      nivoBola: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      kvalitetSna: 0,
      raspolozenje: 0,
      puls: "",
      opened: false,
      opened_back: false,
      tolkin: "",
      userId: 0,
      imaLiTqr: false,
      tqr: "",
      listaBorg: [
        { label: "6", value: "6" },
        { label: "7", value: "7" },
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "10", value: "10" },
        { label: "11", value: "11" },
        { label: "12", value: "12" },
        { label: "13", value: "13" },
        { label: "14", value: "14" },
        { label: "15", value: "15" },
        { label: "16", value: "16" },
        { label: "17", value: "17" },
        { label: "18", value: "18" },
        { label: "19", value: "19" },
        { label: "20", value: "20" },
      ],
      lakuNocPopunjen: false,
      selektovan_al: false,
      dialogSettings: false,
    };
  },
  beforeMount() {
    this.tolkin = this.$route.params.tolkin;
    this.userId = this.$route.params.userId;

    if (localStorage.getItem("autologin") === "1") this.selektovan_al = true;
    else this.selektovan_al = false;

    var d = date.formatDate(new Date(), "DD.MM.YYYY.");
    let a = localStorage.getItem("lakuNocAnketaPostavljenaDana");

    if (a == d) {
      this.lakuNocPopunjen = true;
    } else this.lakuNocPopunjen = false;
  },
  mounted() {
    //this.userName = localStorage.getItem("mAppsUsername");
    this.tqrProvera();
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
    tqrProvera: function () {
      let linkStr =
        this.$api.defaults.baseURL + "/doba-dana/get-tqr/" + this.userData.id;
      let token = localStorage.getItem("token");
      debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + token,
          },
        })
        .then((response) => {
          debugger;
          this.imaLiTqr = false; //response.data;
        })
        .catch((e) => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    updateR: function (ocena) {
      this.raspolozenje = ocena;
    },
    updateKS: function (ocena) {
      this.kvalitetSna = ocena;
    },
    otvoriStanjeDobroJutro() {
      this.opened = true;
    },
    otvoriStanjeDobroJutroLedja() {
      this.opened_back = true;
    },
    posalji() {
      this.$q.notify({
        message: "Podaci su uspešno poslati! Hvala.",
        color: "green",
      });
    },
    ajdeKuci() {
      this.$router.push({ path: "/start" });
    },
    getDateTime() {
      const today = new Date();

      return today.toISOString();
    },
    dobroJutroPost() {

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
        dobaDanaTip: "DJ",
        idDogadjaja: null,
        ident: null,
        kvalitetSna: this.kvalitetSna,
        obrociPoPlanu: null,
        ocenaFizickogOpterecenja: null,
        ocenaMentalnogOpterecenja: null,
        puls: this.puls,
        raspolozenje: this.raspolozenje,
        identUser: this.userData.id,
        stanjeTelaList: null,
        stanjeTelaValuesList: objstanjeTelaModelList,
        tqr: this.tqr,
        duzinaSpavanja: this.vremeSpavanja,
        nivoSpremnosti: this.izabranNivoSpremnostoi,
        nivoZamoraIStresa: null,
      };

      let data1 = JSON.stringify(dataString);

      console.log(data1);
      let token = localStorage.getItem("token");
      let notifikacija = window.cordova;
      let linkStr = this.$api.defaults.baseURL + "/doba-dana/dj";
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

          localStorage.setItem("dobroJutroAnketaPostavljenaDana", d);
          notifikacija.plugins.notification.local.cancel(1, function () {
            console.log("done");
          });

          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          notifikacija.plugins.notification.local.schedule({
            id: 1,
            title: "PODSETNIK",
            text: "Proverite da li ste poslali jutarnju anketu",
            foreground: true,
            trigger: {
              every: { hour: 8, minute: 0, second: 10 },
              count: 1,
              firstAt: tomorrow,
            },
          });
          // if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(self.posaljiLokaciju);}
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });
      this.ajdeKuci();
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
    otvoriLakuNoc() {
      var d = date.formatDate(new Date(), "DD.MM.YYYY.");
      let a = localStorage.getItem("lakuNocAnketaPostavljenaDana");

      if (a == d) {
        this.$q.notify({
          message: "Ovu anketu ste već poslali. Hvala.",
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

.mobilniCssDJ {
  width: 100%;
  height: 100vh;
  background-color: white;
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
