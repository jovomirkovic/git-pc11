<template>
  <q-layout view="hhh lpR fFf">
    <div
      class="inverter-border-radius"
      :style="{ left: [miniState ? [left ? '60px' : '0px'] : '300px'] }"
    ></div>
    <q-header reveal elevated :style="stil">
      <!-- linear-gradient(145deg, rgb(74, 94, 137) 15%, rgb(30, 75, 131) 70%); -->
      <q-toolbar>
        <q-btn
          @click="left = !left"
          flat
          round
          dense
          icon="menu"
          class="q-mr-sm"
        />
        <!-- <q-avatar> -->
        <img src="../assets/pro-coach11 assets/foto/web/coklogo.png" />
        <!-- </q-avatar> -->

        <q-toolbar-title>
          <!-- {{naslov}}  -->
          <div class="row justify-center" style="text-align: center;">
            <div
              v-if="selektovaniTim != undefined"
              v-show="putanja != 'administracija' && putanja != 'trenazneVezbe'"
              style=" color: white;"
            >
              {{ $t("matches.team") }}: {{ selektovaniTim.label }} -
              {{ $t("matches.place") }}: {{ selektovaniTim.mesto }} -
              {{ $t("matches.age") }}: {{ selektovaniTim.uzrast
              }}<span
                v-show="
                  putanja != 'treninzi' &&
                    putanja != 'utakmice' &&
                    putanja != 'trenazneVezbe'
                "
              >
                - {{ this.igrac }}</span
              >
              <q-btn
                style="padding: 0px;margin: 0px 10px;color:red"
                flat
                round
                icon="people"
                @click="izborIgraca()"
              >
                <q-tooltip
                  v-if="putanja != 'treninzi' && putanja != 'utakmice'"
                  >{{ $t("playerInjuries.browsePlayers") }}</q-tooltip
                >
                <q-tooltip v-else>{{
                  $t("playerInjuries.browseTeams")
                }}</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-toolbar-title>

        <q-select
          rounded
          class="jezici"
          v-model="lang"
          :options="langOptions"
          dense
          style="background: #456aaa !important; color: white !important"
        >
        </q-select>

        <q-btn
          round
          dense
          flat
          style="background-color: #456aaa; margin: 0 10px;"
          color="white"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          @click="$q.fullscreen.toggle()"
        >
          <q-tooltip>{{ $t("main.fullScreen") }}</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          style="background-color: #456aaa;"
          icon="fas fa-sign-out-alt"
          to="/"
        >
          <q-tooltip>{{ $t("main.exit") }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer
      class="left-navigation text-white"
      show-if-above
      v-model="left"
      style="background-color: #323b62 !important; "
      side="left"
      :mini="miniState"
      min-width="60"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      overlay
      persistent
      elevated
    >
      <div
        style="height: calc(100% - 117px);padding:5px; margin: auto; position:absolute; top: 0; bottom: 0; left: 0; right: 0;"
      >
        <!-- <q-toolbar style="margin-left: 0px;padding-left: 0px;">
          <q-avatar >
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>

          <q-toolbar-title>{{korisnik}}</q-toolbar-title>
        </q-toolbar>
        <hr/> -->
        <q-scroll-area style="height:100%;">
          <q-list padding>
            <!-- <div v-for="d in menu" :key="d.label">
              <q-item active-class="tab-active" :to="d.to" exact class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="d.iconName"/>
              </q-item-section>

              <q-item-section>
                {{d.label}}
              </q-item-section>
            </q-item>
            </div> -->

            <!-- <q-item active-class="tab-active" to="/dashboard" exact class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="dashboard"/>
              </q-item-section>

              <q-item-section>
                Dashboard
              </q-item-section>
            </q-item> -->

            <!--
            <q-item active-class="tab-active" to="/dashboard1" exact class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="dashboard"/>
              </q-item-section>

              <q-item-section>
                Избор тима и играча
              </q-item-section>
            </q-item> -->

            <q-item
              active-class="tab-active"
              to="/administracija"
              class="q-ma-sm navigation-item"
              @click="putanja = 'administracija'"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <!-- <q-icon name="star"/> -->
                <img
                  src="../assets/pro-coach11 assets/ikonice/web/Sidebar/Administration.svg"
                  style=""
                />
              </q-item-section>

              <q-item-section>
                {{ $t("main.administration") }}
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/trenezneVezbe"
              class="q-ma-sm navigation-item"
              @click="putanja = 'trenazneVezbe'"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <!-- <q-icon name="attach_money"/> -->
                <img
                  src="../assets/pro-coach11 assets/ikonice/web/Sidebar/Training excersizes.svg"
                  style=""
                />
              </q-item-section>

              <q-item-section>
                {{ $t("main.trainingExercises") }}
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/treninzi"
              class="q-ma-sm navigation-item"
              @click="putanja = 'treninzi'"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <!-- <q-icon name="send"/> -->
                <img
                  src="../assets/pro-coach11 assets/ikonice/web/Sidebar/Trainings.svg"
                  style=""
                />
              </q-item-section>

              <q-item-section>
                {{ $t("main.trainings") }}
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/utakmice"
              class="q-ma-sm navigation-item"
              @click="putanja = 'utakmice'"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <!-- <q-icon name="money"/> -->
                <img
                  src="../assets/pro-coach11 assets/ikonice/web/Sidebar/Matches.svg"
                  style=""
                />
              </q-item-section>

              <q-item-section>
                {{ $t("main.matches") }}
              </q-item-section>
            </q-item>

            <q-item
              disable
              active-class="tab-active"
              to="/catapult"
              class="q-ma-sm navigation-item"
              @click="putanja = 'catapult'"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <!-- <q-icon name="list"/> -->
                <img
                  src="../assets/pro-coach11 assets/ikonice/web/Sidebar/Catapult.svg"
                  style=""
                />
              </q-item-section>

              <q-item-section>
                {{ $t("main.catapult") }}
              </q-item-section>
            </q-item>

            <!-- <q-separator color="orange" inset /> -->

            <q-item
              active-class="tab-active"
              to="/tehnickiElementi"
              class="q-ma-sm navigation-item"
              @click="putanja = 'tehnickiElementi'"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <!-- <q-icon name="calendar_today"/> -->
                <img
                  src="../assets/pro-coach11 assets/ikonice/web/Sidebar/Technical elements.svg"
                  style=""
                />
              </q-item-section>

              <q-item-section>
                {{ $t("main.technicalElements") }}
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/taktickiElementi"
              class="q-ma-sm navigation-item"
              @click="putanja = 'taktickiElementi'"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <!-- <q-icon name="business"/> -->
                <img
                  src="../assets/pro-coach11 assets/ikonice/web/Sidebar/Tactical elements.svg"
                  style=""
                />
              </q-item-section>

              <q-item-section>
                {{ $t("main.tacticalElements") }}
              </q-item-section>
            </q-item>

            <!--             <q-item active-class="tab-active" to="/principiIgre" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts"/>
              </q-item-section>

              <q-item-section>
                Principi igre
              </q-item-section>
            </q-item> -->

            <!-- <q-separator color="orange" inset /> -->
            <q-item
              active-class="tab-active"
              to="/igraci"
              class="q-ma-sm navigation-item"
              @click="putanja = 'igraci'"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <!-- <q-icon name="drafts"/> -->
                <img
                  src="../assets/pro-coach11 assets/ikonice/web/Sidebar/Players.svg"
                  style=""
                />
              </q-item-section>

              <q-item-section>
                {{ $t("main.players") }}
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/medicinskiKarton"
              class="q-ma-sm navigation-item"
              @click="putanja = 'medicinskiKarton'"
              clickable
              v-ripple
            >
              <q-item-section avatar :class="{ uvuci: !miniState }">
                <!-- <q-icon name="drafts"/> -->
                <img
                  src="../assets/pro-coach11 assets/ikonice/web/Sidebar/Medical record.svg"
                  style=""
                />
              </q-item-section>

              <q-item-section>
                {{ $t("main.medicalRecord") }}
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/povredeIgraca"
              class="q-ma-sm navigation-item"
              @click="putanja = 'povredeIgraca'"
              clickable
              v-ripple
            >
              <q-item-section avatar :class="{ uvuci: !miniState }">
                <!-- <q-icon name="drafts"/> -->
                <img
                  src="../assets/pro-coach11 assets/ikonice/web/Sidebar/Player injuries.svg"
                  style=""
                />
              </q-item-section>

              <q-item-section>
                {{ $t("main.playerInjuries") }}
              </q-item-section>
            </q-item>

            <!-- <q-separator color="orange" inset /> -->

            <!-- <q-item active-class="tab-active" to="/strucniTim" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts"/>
              </q-item-section>

              <q-item-section>
                Stručni tim
              </q-item-section>
            </q-item> -->
          </q-list>
        </q-scroll-area>
      </div>
    </q-drawer>

    <q-page-container
      class="pozadina"
      :style="[left ? { marginLeft: '60px' } : { marginLeft: '0px' }]"
    >
      <router-view :selektovaniIgrac="selektovaniIgrac" />
    </q-page-container>

    <q-dialog persistent v-model="dialog_za_promenu_igraca">
      <promenaIgraca
        :putanja="putanja"
        :selektovaniTim1="selektovaniTim"
        :selektovaniIgrac1="selektovaniIgrac"
        @update-snimi="prenesiOvde"
        @update-snimi-tim="prenesiOvdeTim"
      ></promenaIgraca>
    </q-dialog>
  </q-layout>
</template>

<script>
import promenaIgraca from "../components/promenaIgracaKomponenta";

export default {
  components: {
    promenaIgraca
  },
  data() {
    return {
      dialog_za_promenu_igraca: false,
      selektovaniTim: "",
      selektovaniIgrac: {},
      listaTimova: [],
      listaIgraca: [],
      left: true,
      miniState: true,
      igrac: "",
      igracID: "",
      korisnik: "",
      naslov: "",
      putanja: "administracija",
      stil: "background: #6000f0",
      menu: [
        {
          label: "Igrači",
          to: "/igraci",
          iconName: "drafts"
        },
        {
          label: "Dashboard",
          to: "/dashboard",
          iconName: "drafts"
        },
        {
          label: "Administracija",
          to: "/administracija",
          iconName: "star"
        }
      ],
      lang: JSON.parse(localStorage.getItem("jezik")),
      langOptions: [
        {
          value: "en-us",
          label: "English",
          flag: "gb"
        },
        {
          value: "rs",
          label: "Srpski",
          flag: "rs"
        }
      ],
      contentStyle: {
        backgroundColor: "rgba(0,0,0,0.02)",
        color: "#555"
      },

      contentActiveStyle: {
        backgroundColor: "#eee",
        color: "black"
      },

      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75
      }
    };
  },
  mounted() {
    debugger;
    //this.igrac = window.$igracName;
    try {
      if (
        this.$apiPutanja ==
        "https://redstar-core-procoach-appsvc.azurewebsites.net"
      ) {
        this.naslov = "ProCoach11 web software, ver - " + this.$ver;
        this.stil = "background: linear-gradient(to right, #323b62, #3b5c98)";
      } else {
        this.naslov = "RED STAR - DATA STAR ver - " + this.$ver;
        this.stil = "background: #6000f0";
      }
      this.korisnik = window.$userName;
    } catch (error) {}
    this.lang = JSON.parse(localStorage.getItem("jezik"));

    ////alert(this.korisnik)
  },
  watch: {
    lang(lang) {
      this.$i18n.locale = lang.value;
      localStorage.setItem("jezik", JSON.stringify(lang));
    },
    miniState: function() {
      if (this.miniState && this.comp_model) {
        this.comp = "div";
      } else {
        this.comp = "q-collapsible";
      }
    }
  },
  methods: {
    promenaTima() {
      //  samo azuriranje stvari vezanih za utakmicu, nista drugo
      // this.$refs.selektZaIgraca.blur();
      // this.getDataZaID()
      // this.getDataEkipa(this.selektovaniTim.value)
    },
    prenesiOvde(jen, dva, tri) {
      console.log(jen);
      console.log(dva);
      this.igrac = jen;
      this.igracID = dva;
      this.selektovaniTim = tri;
      this.selektovaniIgrac = null;
      this.selektovaniIgrac = {
        igrac: this.igrac,
        igracID: this.igracID,
        selektovaniTim: this.selektovaniTim
      };
      console.log(this.selektovaniIgrac);
      debugger;
      // this.igr = jen
      // this.igrID = dva;
      debugger;
      // this.getDataZaID() //idemo da uzmenmo podatke iz baze
    },
    prenesiOvdeTim(tri) {
      this.igrac = undefined;
      this.igracID = undefined;
      this.selektovaniTim = tri;
      this.selektovaniIgrac = null;
      this.selektovaniIgrac = {
        igrac: undefined,
        igracID: undefined,
        selektovaniTim: this.selektovaniTim
      };
      console.log(this.selektovaniIgrac);
      this.dialog_za_promenu_igraca = false;
      debugger;
      // this.igr = jen
      // this.igrID = dva;
      debugger;
      // this.getDataZaID() //idemo da uzmenmo podatke iz baze
    },
    izborIgraca() {
      this.dialog_za_promenu_igraca = true;
    }
  }
};
</script>

<style>
.q-drawer {
  background-color: #323b62 !important;
}

.q-drawer__content {
  background-color: #323b62(1, 1, 1, 0.75);
}

.navigation-item {
  border-radius: 10px;
}

.tab-active {
  background-color: #ff4b00;
  margin-left: 0px;
  margin-right: 0px;
  height: 50px;
}

.uvuci {
  padding-left: 30px !important;
}

.jezici {
  color: white !important;
  z-index: 100000;
  border-radius: 25px;
  font-weight: bold;
  background-color: #456aaa;
  min-width: 110px;
  padding: 0 10px 0 15px;
}
.pozadina {
  background-image: linear-gradient(to bottom, #b4d0e9, #f5f8fb);
}

#q-app
  > div.q-layout.q-layout--standard
  > header
  > div.q-toolbar.row.no-wrap.items-center
  > label
  > div
  > div
  > div.q-field__control-container.col.relative-position.row.no-wrap.q-anchor--skip
  > div {
  color: white !important;
}
#q-app
  > div.q-layout.q-layout--standard
  > div.q-page-container.pozadina
  > main
  > div.q-tab-panels.q-panel-parent
  > div
  > div
  > main
  > div
  > div.q-table__bottom.row.items-center.justify-end
  > div:nth-child(3)
  > label
  > div
  > div
  > div.q-field__control-container.col.relative-position.row.no-wrap.q-anchor--skip
  > div {
  color: #323b62 !important;
}

/* onaj obrnuti border radius u gornjem levom cosku */
.inverter-border-radius {
  background-color: #ffffff00;
  width: 50px;
  height: 50px;
  border-radius: 25%;
  position: absolute;
  top: 50px;
  content: "";
  z-index: 100000;
  box-shadow: -25px -25px 0 0 #323b62;
  clip-path: inset(0 0 0 0);
}

@font-face {
  font-family: PoppinsThin;
  src: url("../assets/pro-coach11 assets/font/Poppins/Poppins-Thin.ttf");
}

header {
  font-family: PoppinsThin;
}
</style>

<style lang="sass">
.jezici
  .q-field__marginal
    color: white !important
.q-drawer-container:not(.q-drawer--mini-animate) .q-drawer--mini
  width: 60px !important
</style>
