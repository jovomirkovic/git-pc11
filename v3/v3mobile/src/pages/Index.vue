<template>
  <div class="q-pa-md">
    <q-carousel v-model="slide" swipeable animated arrows navigation navigation-icon="radio_button_unchecked"
      control-type="regular" control-color="white" control-text-color="grey-8" class="bg-red text-white rounded-borders"
      height="94vh" ref="karusel" infinite>
      <q-carousel-slide name="home" class="q-pa-none mobilniCss">
        <q-scroll-area class="fit">
          <div class="column no-wrap flex-center q-carousel--padding" style="max-height:100%">
            <q-img src="..\assets\img\pozadina-oblaci.png" style="witdh:100%;" />

            <q-img :src="srcSunce" spinner-color="white"
              style="height: 200px; max-width: 200px; top: -10px; left: 1px; position: absolute;"
              @click="posaljiDobroJutro" />

            <!-- v-fg:touchStart="posaljiDobroJutro" -->
            <!-- v-fg:touchEnd="posaljiDobroJutroKraj" -->

            <q-img :src="srcMesec" spinner-color="white"
              style="height: auto; width:200px; max-width: 200px;bottom:10px;right:10px;position: absolute;"
              @click="posaljiLakuNoc" />
            <q-img style="width:80%; height: 200px;position:absolute">
              <!--               <q-icon
                name="home"
                size="56px"
                style="position:relative;top:15px; left: 41%;"
              /> -->
              <!--               <div
                style="position: absolute; top: 75px;left:39%; text-align: center; font-size: xx-large; font-weight: 200; line-height: 50%"
              >
                Кућа
              </div> -->
              <div class="q-mt-md"
                style="position: absolute; text-align:center; top: 105px; left:29%;font-size: large;">
                Trening u 15:00
              </div>
            </q-img>
          </div>
        </q-scroll-area>
      </q-carousel-slide>

      <q-carousel-slide name="dj" class="q-pa-none mobilniCssDJ">
        <q-scroll-area class="fit">
          <div class="column no-wrap flex-center q-carousel--padding">
            <!-- <q-icon name="alarm" size="56px" style="top:15px" /> -->
            <div class="">
              <p
                style="position: relative; top: 55px; text-align: center; font-size: xx-large; font-weight: 200; line-height: 50%">
                Dobro jutro
              </p>
            </div>
            <div style="position: relative; top: 65px; " class="q-mt-md">
              <p style="text-align: center; font-size: large;">
                Oceni kvalitet sna, od 1 do 5:
              </p>
              <div class="q-pa-md">
                <q-slider v-model="kvalitetSna" :min="0" :max="5" :step="1" snap label label-always color="purple" />
              </div>
              <p style="text-align: center; font-size: large;">
                Kako si raspoložen jutros?
              </p>
              <div class="q-pa-md">
                <q-slider v-model="raspolozenje" :min="0" :max="5" :step="1" snap label label-always color="blue" />
              </div>
              <q-input rounded standout bottom-slots v-model="puls" label="Unesi puls" counter>
                <template v-slot:prepend>
                  <q-icon name="sports_soccer" />
                </template>
                <template v-slot:append>
                  <q-icon name="close" @click="text = ''" class="cursor-pointer" />
                </template>
              </q-input>
              TQR? <br />
              <br />
              <div style="text-align: center;">
                <q-btn round @click="otvoriStanjeDobroJutro()">
                  <q-avatar size="50px">
                    <img src="../images/Silueta lice.png" />
                  </q-avatar>
                </q-btn>
                <q-btn round @click="otvoriStanjeDobroJutroLedja()">
                  <q-avatar size="50px">
                    <img src="../images/Silueta ledja.png" />
                  </q-avatar>
                </q-btn>
                <br />
                <br />
              </div>
              <div style="text-align: center;">
                <q-btn color="deep-orange" icon="mail" label="Pošalji" />
              </div>

              <!-- <body-front />
              <body-back /> -->
            </div>
          </div>
        </q-scroll-area>
      </q-carousel-slide>

      <q-carousel-slide name="dogadjaj" class="q-pa-none mobilniCssAnketa">
        <q-scroll-area class="fit">
          <div class="column no-wrap flex-center q-carousel--padding">
            <!-- <q-icon name="accessibility" size="56px" style="top:15px" /> -->
            <div class="">
              <p
                style="position: relative; top: 25px; text-align: center; font-size: xx-large; font-weight: 200; line-height: 50%">
                Anketa
              </p>
            </div>
            <div style="position: relative; top: 115px; " class="q-mt-md">
              <p style="text-align: center; font-size: large; color: blue;">
                Mentalno opterećenja:
              </p>
              <div class="q-pa-md">
                <q-slider v-model="mentalnoOpterecenje" :min="0" :max="10" :step="0.5" snap label label-always
                  color="purple" />
              </div>
              <p style="text-align: center; font-size: large; color: blue;">
                Fizičko opterećenje:
              </p>
              <div class="q-pa-md">
                <q-slider v-model="fizickoOpterecenje" :min="0" :max="10" :step="0.5" snap label label-always
                  color="blue" />
              </div>
              <p style="text-align: center; font-size: large; color: blue;">
                Kako si raspoložen?
              </p>
              <div class="q-pa-md">
                <q-slider v-model="raspolozenjePosleTreniga" :min="0" :max="5" :step="1" snap label label-always
                  color="blue" />
              </div>

              <div style="text-align: center;">
                <q-btn round @click="otvoriStanjeAnketa()">
                  <q-avatar size="50px">
                    <img src="../images/Silueta lice.png" />
                  </q-avatar>
                </q-btn>
                <q-btn round @click="otvoriStanjeAnketaLedja()">
                  <q-avatar size="50px">
                    <img src="../images/Silueta ledja.png" />
                  </q-avatar>
                </q-btn>
                <br />
                <br />
              </div>

              <div style="text-align: center;">
                <q-btn color="deep-orange" icon="mail" label="Pošalji" />
              </div>

              <!-- <body-front />
               <body-back /> -->
            </div>
          </div>
        </q-scroll-area>
      </q-carousel-slide>

      <q-carousel-slide name="ln" class="q-pa-none mobilniCssLN" style="background-color: darkgray;">
        <q-scroll-area class="fit">
          <div class="column no-wrap flex-center q-carousel--padding">
            <!-- <q-icon name="nights_stay" size="56px" style="top:15px" /> -->
            <div class="">
              <p
                style="position: relative; top: 25px; text-align: center; font-size: xx-large; font-weight: 200; line-height: 50%">
                Laku noć
              </p>
            </div>
            <div style="position: relative; top: 275px; " class="q-mt-md">
              <p style="text-align: center; font-size: large;">
                Obroci po planu?
              </p>
              <div style="text-align: center; ">
                <q-btn-toggle v-model="obroci" class="my-custom-toggle" no-caps rounded unelevated
                  toggle-color="primary" color="white" text-color="primary" :options="[
                    { label: 'Da', value: 'da' },
                    { label: 'Ne', value: 'ne' }
                  ]" />
              </div>
              <p style="text-align: center; font-size: large;">
                Kako si raspoložen?
              </p>
              <div class="q-pa-md">
                <q-slider v-model="raspolozenjePredSpavanje" :min="0" :max="5" :step="1" snap label label-always
                  color="blue" />
              </div>

              <div style="text-align: center;">
                <q-btn color="deep-orange" icon="mail" label="ПОШАЉИ" />
              </div>
            </div>
          </div>
        </q-scroll-area>
      </q-carousel-slide>

      <q-carousel-slide name="settings" class="q-pa-none">
        <q-scroll-area class="fit">
          <div class="column no-wrap flex-center q-carousel--padding">
            <q-icon name="settings" size="56px" style="top:20px" />
            <div class="">
              <p
                style="position: relative; top: 55px; text-align: center; font-size: xx-large; font-weight: 200; line-height: 50%">
                Podešavanja
              </p>
            </div>
            <div style="position: relative; top: 55px; " class="q-mt-md">
              ToDo... <br />
              <br />

              <br />
            </div>
          </div>
        </q-scroll-area>
      </q-carousel-slide>
    </q-carousel>

    <div>
      <q-dialog v-model="opened" ref="dialogOpenedTest">
        <bodyfront v-bind:inicijalniNivoBola="nivoBola" />
        <!-- <body-back /> -->
      </q-dialog>

      <q-dialog v-model="opened_back" ref="dialogOpenedTest">
        <bodyback v-bind:inicijalniNivoBola="nivoBola" />
        <!-- <body-back /> -->
      </q-dialog>

      <q-dialog v-model="openedAnketa" ref="dialogOpenedTest">
        <bodyfront v-bind:inicijalniNivoBola="nivoBolaAnketa" />
        <!-- <body-back /> -->
      </q-dialog>

      <q-dialog v-model="openedAnketa_back" ref="dialogOpenedTest">
        <bodyback v-bind:inicijalniNivoBola="nivoBolaAnketa" />
        <!-- <body-back /> -->
      </q-dialog>
    </div>
  </div>
</template>

<script>

import bodyfront from "../components/BodyFront.vue";
import bodyback from "../components/BodyBack.vue";
import slSunce from "../assets/img/pozadina-sunce.png";
import slSunceSivo from "../assets/img/pozadina-sunce-sivo.png";
import slMesec from "../assets/img/pozadina-mesec.png";
import slMesecSivo from "../assets/img/pozadina-mesec-sivo.png";

// Vue.component('body-front', bodyfront)
// Vue.component('body-back', bodyback)

export default {
  components: {
    bodyfront,
    bodyback
  },
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
        "0"
      ],
      nivoBolaAnketa: [
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
        "0"
      ],
      slide: "style",
      lorem: "Dobar dan, i tako to...",
      kvalitetSna: 4,
      raspolozenje: 5,
      puls: "",
      mentalnoOpterecenje: 5,
      fizickoOpterecenje: 5,
      raspolozenjePosleTreniga: 5,
      obroci: "",
      raspolozenjePredSpavanje: 5,
      opened: false,
      opened_back: false,
      openedAnketa: false,
      openedAnketa_back: false,
      srcSunce: slSunce,
      srcMesec: slMesec,
      srcSunceSivo: slSunceSivo,
      srcMesecSivo: slMesecSivo
    };
  },
  beforeMount() {
    if (localStorage.getItem("mAppsCurrentSlide") == null) {
      localStorage.setItem("mAppsCurrentSlide", 0);
    }
    this.slideNumber = Number(localStorage.getItem("mAppsCurrentSlide")); //slienunber ocekuje broj, zato moramo da ga konvertujemo!
  },
  mounted() {
    this.userName = localStorage.getItem("mAppsUsername");
    this.$refs.karusel.goTo("home");
    //this.$refs.karusel.goToSlide(this.slideNumber); //idemo na stranu na kojoj smo bili kad smo pozvali neku mApp
  },

  methods: {
    onEnd({ lastSentence, transcription }) {
      // `lastSentence` is the last sentence before the pause
      // `transcription` is the full array of sentences
      alert(lastSentence);
    },
    otvoriStanjeDobroJutro() {
      this.opened = true;
    },
    otvoriStanjeDobroJutroLedja() {
      this.opened_back = true;
    },
    otvoriStanjeAnketa() {
      this.openedAnketa = true;
    },
    otvoriStanjeAnketaLedja() {
      this.openedAnketa_back = true;
    },
    posaljiDobroJutro() {
      this.srcSunce = slSunceSivo;
      this.$refs.karusel.goTo("dj");
      this.srcSunce = slSunce;
      //alert("Jutro");
    },
    posaljiDogadjaj() {
      this.$refs.karusel.goTo("dogadjaj");
    },
    posaljiLakuNoc() {
      this.$refs.karusel.goTo("ln");
    },
    posaljiDobroJutroKraj() {
      this.srcSunce = slSunce;
      //alert("Jutro kraj");
    }
  },

  watch: {
    vertical(val) {
      this.navPos = val === true ? "right" : "bottom";
    }
  }
};
</script>

<style scoped>
.my-custom-toggle {
  border: 1px solid #027be3;
}

.mobilniCss {
  width: 100%;
  background-image: url("../assets/img/pozadina-pozadina.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  vertical-align: -webkit-baseline-middle;
}

.mobilniCssDJ {
  width: 100%;
  background-image: url("../assets/img/pozadina-dobrojutro.png");
  background-repeat: no-repeat;
  background-size: 100% 100%, contain;
  vertical-align: -webkit-baseline-middle;
}

.mobilniCssLN {
  width: 100%;
  background-image: url("../assets/img/pozadina-lakunoc.png");
  background-repeat: no-repeat;
  background-size: 100% 100%, contain;
  vertical-align: -webkit-baseline-middle;
}

.mobilniCssAnketa {
  width: 100%;
  background-image: url("../assets/img/pozadina-anketa.png");
  background-repeat: no-repeat;
  background-size: 100% 100%, contain;
  vertical-align: -webkit-baseline-middle;
}
</style>
