<template>
  <div class="mobilniCss">
    <q-pull-to-refresh @refresh="refresh" color="yellow-9" icon="refresh"
      style="height: 100%; width: 100%; text-align: center">
      <div class="flex items-center column q-pt-xl">
        <q-avatar size="100px" style="box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.8)">
          <img :src="fotografija" style="object-fit: cover" />
        </q-avatar>
        <span class="q-mt-md" style="font-size: 20pt; padding: 5px; font-weight: 800; color: white">
          {{ ime + " " + prezime }}
        </span>
        <!-- <span
          style="font-size: 16pt; padding: 5px; font-weight: 600; color:white; opacity: 0.8; "
        >
          {{ userData.primarnaPozicija.naziv || "" }}
        </span> -->

        <q-img class="q-mb-xl logo" :src="srcLogo" spinner-color="white" />
        <span class="logo2 q-mb-xl">
          <q-img class="" :src="srcPC11Logo" spinner-color="white" />
        </span>
      </div>
      <div class="q-carousel--padding" style="text-align: center; width: 100%; position: absolute; bottom: 0px">
        <div class="column" style="width: 90%; margin: auto">
          <div class="col-1">
            <q-img style="width: 100%; height: 230px">
              <q-carousel v-model="slide" transition-prev="scale" transition-next="scale" swipeable animated
                control-color="white" navigation padding arrows height="100%"
                class="text-white shadow-1 rounded-borders" style="width: 100%">
                <q-carousel-slide v-if="!imaAnketa" name="style111" class="column no-wrap flex-center">
                  <span style="position: relative; top: 17px">
                    Danas nemate ni utakmicu ni trening!
                  </span>
                </q-carousel-slide>

                <q-carousel-slide v-for="el in dnevneAnkete" :key="el.id" :name="el.id"
                  class="column no-wrap flex-center">
                  <router-link :disabled="!checkIsInputEnabled(el)" :style="{
                    pointerEvents: [checkIsInputEnabled(el) ? '' : 'none'],
                  }" :to="{ name: 'dogadjaj', params: { id: el.id } }" style="
                      text-decoration: none;
                      text-align: center;
                      color: white;
                    ">
                    <q-icon name="sports_soccer" size="46px" />
                    <div class="q-mt-md text-center" style="margin-top: 10px">
                      <span style="font-size: 17pt; text-transform: uppercase">{{ el.protivnik }}</span>
                      <br />
                      <span>{{ el.datum + " " + el.vreme }}</span>
                      <br />
                      <span>{{ el.lokacija }}</span>
                      <br />
                      <span style="font-weight: bold" v-if="!checkIsInputEnabled(el)">Anketu možete uneti 30 minuta
                        nakon
                        {{
                          el.tip == "trening" ? "treninga" : "utakmice"
                        }}</span>
                    </div>
                  </router-link>
                </q-carousel-slide>
              </q-carousel>
            </q-img>
          </div>
          <div class="col-1">
            <div class="row" style="margin: 25px 0px">
              <div class="col">
                <q-btn push label="Jutarnja anketa" style="
                    margin-right: 5px;
                    padding: 10px;
                    opacity: 1;
                    background-color: #2b3357;
                    color: GhostWhite;
                    font-weight: bold;
                  " @click="otvoriDobroJutro" />
              </div>
              <div class="col">
                <q-btn push label="Večernja anketa" style="
                    margin-left: 5px;
                    padding: 10px;
                    opacity: 1;
                    float: right;
                    background-color: #2b3357;
                    color: GhostWhite;
                    font-weight: bold;
                  " @click="otvoriLakuNoc" />
              </div>
            </div>
          </div>
        </div>
      </div>
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
          <q-item clickable @click="console.log('vec si tu..')" disable>
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
              <q-item-label style="color: #f8f8ffc0; font-weight: lighter" caption>Jutarnja anketa</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="otvoriLakuNoc" :disable="lakuNocPopunjen">
            <q-item-section avatar>
              <q-avatar icon="nights_stay" color="blue-10" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label style="color: ghostwhite; font-weight: bold">Laku noć</q-item-label>
              <q-item-label style="color: #f8f8ffc0; font-weight: lighter" caption>Večernja anketa</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="otvoriSettings">
            <q-item-section avatar>
              <q-avatar icon="settings" color="grey-5" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label style="color: ghostwhite; font-weight: bold">Podešavanja</q-item-label>
              <q-item-label style="color: #f8f8ffc0; font-weight: lighter" caption>Automatsko logovanje</q-item-label>
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

      <!-- dugme za logout -->
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
              <span class="podesi-txt text-primary" style="font-size: 18px">Automatska prijava</span>
            </ul>
          </div>
        </q-card>
      </q-dialog>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import avatarPlaceholder from "../assets/img/avatar.jpg";
import slLogo from "../assets/img/logo.png";
import slPC11Logo from "../assets/pc11logo.png";
//import ikona from '../assets/img/ikona.png';
import { LocalNotifications } from "@capacitor/local-notifications";
import { date } from "quasar";

async function createNotificationChannel() {
  try {
    const result = await LocalNotifications.createChannel({
      id: "default",
      name: "Default Channel",
      description: "The default channel for notifications",
      priority: 2, // Visoki prioritet
      importance: 5, // Visoka važnost
      lightColor: "#FF0000", // Crvena svetlost
      lockscreenVisibility: 1, // Vidljivost na zaključanom ekranu
    });
    //alert('Channel created:', result);
    scheduleNotification();
  } catch (error) {
    console.log("Error creating channel:", error);
  }
}

async function scheduleNotification() {
  //alert(4)
  const now = new Date();
  const notification1 = new Date();
  notification1.setHours(8, 10, 0, 0); // 8:10 AM

  // Postavljanje vremena za 9:30 PM
  const notification2 = new Date();
  notification2.setHours(21, 30, 0, 0); // 9:30 PM

  await LocalNotifications.schedule({
    notifications: [
      {
        title: "PODSETNIK",
        body: "Proverite da li ste uneli jutarnju anketu.",
        id: 1,
        schedule: {
          every: "day", // Svakog dana
          at: notification1,
        },
        //schedule: { at: new Date(Date.now() + 10000) }, // 10 sekundi kasnije
        // attachments: [
        //     { id: 'image', url: slLogo } // Koristite URL lokalne slike za telo notifikacije
        // ],
        // smallIcon: slLogo,  // Koristite prilagođenu malu ikonu
        // largeIcon: slLogo,  // Ako imate veliku ikonu, koristite je ovde
        //sound: null,
        priority: 2, // Visoki prioritet
        importance: 5, // Visoka važnost
        channelId: "default", // Možete definisati i sopstveni kanal
        autoCancel: true,
      },
      {
        title: "PODSETNIK",
        body: "Proverite da li ste uneli večernju anketu.",
        id: 2,
        schedule: {
          every: "day", // Svakog dana
          at: notification2,
        },
        //schedule: { at: new Date(Date.now() + 10000) }, // 10 sekundi kasnije
        // attachments: [
        //     { id: 'image', url: slLogo } // Koristite URL lokalne slike za telo notifikacije
        // ],
        // smallIcon: slLogo,  // Koristite prilagođenu malu ikonu
        // largeIcon: slLogo,  // Ako imate veliku ikonu, koristite je ovde
        //sound: null,
        priority: 2, // Visoki prioritet
        importance: 5, // Visoka važnost
        channelId: "default", // Možete definisati i sopstveni kanal
        autoCancel: true,
      },
      // {
      //         title: "PODSETNIK",
      //         body: "Proverite da li ste uneli večernju anketu.",
      //         id: 3,
      //         // schedule: {
      //         //   every: 'day', // Svakog dana
      //         //   at: notification2
      //         // },
      //         schedule: { at: new Date(Date.now() + 10000) }, // 10 sekundi kasnije
      //         // attachments: [
      //         //     { id: 'image', url: slLogo } // Koristite URL lokalne slike za telo notifikacije
      //         // ],
      //         // smallIcon: slLogo,  // Koristite prilagođenu malu ikonu
      //         // largeIcon: slLogo,  // Ako imate veliku ikonu, koristite je ovde
      //         //sound: null,
      //         priority: 2, // Visoki prioritet
      //         importance: 5, // Visoka važnost
      //         channelId: "default", // Možete definisati i sopstveni kanal
      //         autoCancel: true
      // }
    ],
  });
}

// async function requestPermissions() {
//   alert(2)
//   const permissions = await LocalNotifications.requestPermissions();
//   alert(3)
//   if (permissions.receive === 'granted') {
//     alert('Notification permissions granted. ' + permissions.receive);
//     scheduleNotification();
//   } else {
//     alert('Notification permissions denied.');
//   }
// }

async function requestPermissions() {
  try {
    //alert(2);
    const permissions = await LocalNotifications.requestPermissions();
    //alert(3);
    //alert(permissions.display);
    if (permissions.display === "granted") {
      //alert('Notification permissions granted. ' + permissions.display);
      createNotificationChannel();
    } else {
      alert("Notification permissions denied." + JSON.stringify(permissions));
    }
  } catch (error) {
    alert("Error requesting permissions: " + error.message);
    console.error(error);
  }
}

// Like any Cordova plugin, you must wait for deviceready before referencing the plugin.
function onDeviceReady() {
  document.addEventListener(
    "backbutton",
    function (e) {
      e.preventDefault();
    },
    false
  );
  //alert(1)
  requestPermissions();
  //createNotificationChannel();

  // alert(1)

  //     try {
  //       alert(2)
  //       // Request notification permissions
  //       const permission1 =  LocalNotifications.checkPermissions();
  //       alert(permission1)
  //       const permission =  LocalNotifications.requestPermissions();
  //       alert(permission)
  //       if (permission.display !== 'granted') {
  //         alert('Notification permission not granted.');
  //         return;
  //       }

  //       // Schedule the reminder notification
  //       alert(3)
  //       alert(5)

  //      LocalNotifications.schedule({
  //       notifications: [
  //       {
  //         title: 'Title',
  //         body: 'Body',
  //         id: 1,
  //         schedule: { at: new Date(Date.now() + 1000 * 5) },
  //         sound: null,
  //         attachments: null,
  //         actionTypeId: '',
  //         extra: null,
  //       },
  //     ],
  //     });
  //       alert(4)
  //     } catch (error) {
  //       alert('Notification setup error: ', error);
  //     }

  // const notifs =  LocalNotifications.schedule({
  //   notifications: [
  //     {
  //       title: 'Title',
  //       body: 'Body',
  //       id: 1,
  //       schedule: { at: new Date(Date.now() + 1000 * 5) },
  //       sound: null,
  //       attachments: null,
  //       actionTypeId: '',
  //       extra: null,
  //     },
  //   ],
  // });
  // console.log('scheduled notifications', notifs);

  // let notifikacija = window.cordova;

  // notifikacija.plugins.notification.local.isPresent(1, function (present) {
  //   if (!present) {
  //     notifikacija.plugins.notification.local.schedule({
  //       id: 1,
  //       title: "PODSETNIK",
  //       text: "Proverite da li ste popunili jutarnju anketu.",
  //       foreground: true,
  //       trigger: { every: { hour: 8, minute: 0, second: 10 }, count: 1 }
  //     });
  //   }
  //   if (
  //     a.getFullYear() == d.getFullYear() &&
  //     a.getMonth() == d.getMonth() &&
  //     a.getDay() == d.getDay()
  //   ) {
  //     console.log("Usao u proveru 1");
  //     notifikacija.plugins.notification.local.cancel(1, function () {
  //       console.log("done");
  //     });

  //     const today = new Date();
  //     const tomorrow = new Date(today);
  //     console.log("pre " + tomorrow);
  //     tomorrow.setDate(tomorrow.getDate() + 1);
  //     console.log("posle " + tomorrow);

  //     notifikacija.plugins.notification.local.schedule({
  //       id: 1,
  //       title: "PODSETNIK",
  //       text: "Proverite da li ste popunili jutarnju anketu.",
  //       foreground: true,
  //       trigger: {
  //         every: { hour: 8, minute: 0, second: 10 },
  //         count: 1,
  //         firstAt: tomorrow
  //       }
  //     });
  //   }
  // });

  // notifikacija.plugins.notification.local.isPresent(2, function (present) {
  // if (!present) {
  //   notifikacija.plugins.notification.local.schedule({
  //     id: 2,
  //     title: "PODSETNIK",
  //     text: "Proverite da li ste popunili večernju anketu.",
  //     foreground: true,
  //     trigger: { every: { hour: 21, minute: 30, second: 10 }, count: 1 }
  //   });
  // }
  // if (
  //   b.getFullYear() == d.getFullYear() &&
  //   b.getMonth() == d.getMonth() &&
  //   b.getDay() == d.getDay()
  // ) {
  //   console.log("Usao u proveru 2");
  //   notifikacija.plugins.notification.local.cancel(2, function () {
  //     console.log("Ugasio notifikaciju id 2, laku noc");
  //   });

  //   const today = new Date();
  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(tomorrow.getDate() + 1);

  //   notifikacija.plugins.notification.local.schedule({
  //     id: 2,
  //     title: "PODSETNIK",
  //     text: "Proverite da li ste popunili večernju anketu.",
  //     foreground: true,
  //     trigger: {
  //       every: { hour: 21, minute: 30, second: 10 },
  //       count: 1,
  //       firstAt: tomorrow
  //     }
  //   });
  // }
  // });
}

//document.addEventListener("deviceready", onDeviceReady, false);
if (Capacitor.isNativePlatform()) {
  document.addEventListener("deviceready", onDeviceReady, false);
} else {
  onDeviceReady(); // For web testing
}

export default {
  components: {},
  props: ["userData", "globalTest"],
  data() {
    return {
      selektovan_al: false,
      dialogSettings: false,
      slide: "",
      srcGlavniTekst: "display:inline",
      srcDugmeHelp: "display:none",
      tekstNaTerenu: "",
      tolkin: "",
      userId: 0,
      data: [],
      dnevneAnkete: [{}],
      srcLogo: slLogo,
      srcPC11Logo: slPC11Logo,
      imaAnketa: true,
      ime: "",
      prezime: "",
      fotografija: "",
      windowWidth: window.innerWidth,
      dobroJutroPopunjen: false,
      lakuNocPopunjen: false,
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
    this.getData();

    // this.ime = this.userData.ime;
    // this.prezime = this.userData.prezime;

    // this.fotografija = this.userData.fotografija || avatarPlaceholder;

    this.ime = localStorage.getItem("ime");
    this.prezime = localStorage.getItem("prezime");
    this.fotografija = localStorage.getItem("fotografija");

    let self = this;
    if (this.ime == null || this.prezime == null || this.fotografija == null) {
      setTimeout(function () {
        self.ime = localStorage.getItem("ime");
        self.prezime = localStorage.getItem("prezime");
        self.fotografija = localStorage.getItem("fotografija");
        if (
          this.ime == null ||
          this.prezime == null ||
          this.fotografija == null
        ) {
          setTimeout(function () {
            self.ime = localStorage.getItem("ime");
            self.prezime = localStorage.getItem("prezime");
            self.fotografija = localStorage.getItem("fotografija");
          }, 500);
        }
      }, 500);
    }
    this.fotografija =
      this.fotografija != "" ? this.fotografija : avatarPlaceholder;
    console.log("self.fotografija");
    console.log(self.fotografija);
    console.log(self.fotografija == "");
  },
  methods: {
    refresh(done) {
      setTimeout(() => {
        this.getData();
        done();
      }, 1000);
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
    otvoriDogadjaj() {
      this.$router.push({
        name: "dogadjaj",
        params: { tolkin: this.tolkin, userId: this.userId },
      });
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
    help() {
      alert("nema ti pomoci");
    },

    //''''''''''''''''''''''''''''''''''''''''
    // citanje dogadjaja
    //........................................
    getData() {
      let linkStr =
        this.$api.defaults.baseURL +
        "/igraci/" +
        this.userData.id +
        "/svi-dogadjaji";
      //this.$api.defaults.baseURL + "/igraci/" + this.userData.id + "/dogadjaji-za-danas";
      ///igraci/{id}/dogadjaji
      debugger;
      let token = localStorage.getItem("token");
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + token,
          },
        })
        .then((response) => {
          debugger;
          this.data = response.data;
          this.spremiUtakmiceZaCitanje();
          debugger;
        })
        .catch((e) => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    checkIsInputEnabled(el) {
      console.log("checkIsInputEnabled(a)");
      console.log(el);

      let tmpDate = new Date();
      let tmpOffset = tmpDate.getTimezoneOffset();

      let dateNow = Date.now();
      let date1 =
        new Date(el.date).getTime() + (el.trajanje + 30 - tmpOffset) * 60000;
      console.log(date1 < dateNow);

      return date1 < dateNow;
    },
    spremiUtakmiceZaCitanje() {
      let self = this;
      self.dnevneAnkete.length = 0;
      //var myDate = new Date("2013-04-08T10:28:43Z");
      debugger;

      if (this.data.treningList.length != 0)
        this.data.treningList.forEach((element) => {
          var tmp = {
            id: -1,
            tip: "",
            vreme: "",
            trajanje: 0,
            protivnik: "",
          };
          tmp.id = element.ident;
          tmp.tip = "trening";
          var myDate = new Date(element.vremePocetka);
          var dan;
          switch (myDate.getDay()) {
            case 0:
              dan = "Nedelja";
              break;
            case 1:
              dan = "Ponedeljak";
              break;
            case 2:
              dan = "Utorak";
              break;
            case 3:
              dan = "Sreda";
              break;
            case 4:
              dan = "Cetvrtak";
              break;
            case 5:
              dan = "Petak";
              break;
            case 6:
              dan = "Subota";
              break;
            default:
            // code block
          }
          let tmpDate = new Date();
          let tmpOffset = tmpDate.getTimezoneOffset() / 60;

          tmp.lokacija = element.lokacija;
          tmp.datum = date.formatDate(
            date.extractDate(element.vremePocetka.split("T")[0], "YYYY-MM-DD"),
            "DD.MM.YYYY."
          );
          tmp.date = element.vremePocetka;
          tmp.trajanje = element.vremeTrajanjaTreninga;
          tmp.datumZaSortiranje = date.extractDate(
            element.vremePocetka.replace("T", "-").split(".")[0],
            "YYYY-MM-DD-HH:mm:ss"
          );
          tmp.vreme =
            dan +
            ", " +
            (myDate.getHours() < 10 ? "0" : "") +
            (myDate.getHours() - tmpOffset) +
            ":" +
            (myDate.getMinutes() < 10 ? "0" : "") +
            myDate.getMinutes();
          tmp.protivnik = element.protivnik;
          self.dnevneAnkete.push(tmp);
        });
      if (this.data.utakmicaList.length != 0)
        this.data.utakmicaList.forEach((element) => {
          var tmp = {
            id: -1,
            tip: "",
            vreme: "",
            trajanje: 90,
            protivnik: "",
          };
          tmp.id = element.ident;
          tmp.tip = "utakmica";
          var myDate = new Date(element.datum);
          var dan;
          switch (myDate.getDay()) {
            case 0:
              dan = "Nedelja";
              break;
            case 1:
              dan = "Ponedeljak";
              break;
            case 2:
              dan = "Utorak";
              break;
            case 3:
              dan = "Sreda";
              break;
            case 4:
              dan = "Cetvrtak";
              break;
            case 5:
              dan = "Petak";
              break;
            case 6:
              dan = "Subota";
              break;
            default:
            // code block
          }
          let tmpDate = new Date();
          let tmpOffset = tmpDate.getTimezoneOffset() / 60;

          tmp.lokacija = element.lokacija;
          tmp.datum = date.formatDate(
            date.extractDate(element.datum.split("T")[0], "YYYY-MM-DD"),
            "DD.MM.YYYY."
          );

          tmp.date = element.datum;
          tmp.trajanje = 90;
          tmp.datumZaSortiranje = date.extractDate(
            element.datum.replace("T", "-").split(".")[0],
            "YYYY-MM-DD-HH:mm:ss"
          );
          tmp.vreme =
            dan +
            ", " +
            (myDate.getHours() < 10 ? "0" : "") +
            (myDate.getHours() - tmpOffset) +
            ":" +
            (myDate.getMinutes() < 10 ? "0" : "") +
            myDate.getMinutes();
          tmp.protivnik = element.protivnik;
          self.dnevneAnkete.push(tmp);
        });

      debugger;
      if (self.dnevneAnkete.length == 0) {
        self.imaAnketa = false;
        self.slide = "style111";
      } else self.slide = self.dnevneAnkete[0].id;

      self.dnevneAnkete.sort(
        (a, b) => a.datumZaSortiranje - b.datumZaSortiranje
      );

      //todo: ako za danas nema dnevnih anketa, treba da stoji: Danas nemate ni utakmica ni treninga.
      //todo: klik ne teren ne sme da otvara dogadjaj ako ne postoji
    },
  },

  watch: {
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

.mobilniCss {
  width: 100%;
  height: 100vh;
  background-color: white;
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

.logo {
  width: 20%;
}

.logo2 {
  width: 30%;
}
</style>
