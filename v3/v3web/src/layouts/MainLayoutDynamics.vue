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
        <img
          height="40px"
          src="../assets/pro-coach11 assets/foto/web/coklogo.png"
        />
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
        <q-scroll-area style="height: 100%;">
          <q-list padding>
            <menuItemComponent
              v-for="item in filteredMenu.filter(e => e.type != 'component')"
              :key="item.to"
              :item="item"
              @update-putanja="updatePutanja"
            ></menuItemComponent>
          </q-list>
        </q-scroll-area>
      </div>
    </q-drawer>

    <q-page-container
      class="pozadina"
      :style="[left ? { marginLeft: '60px' } : { marginLeft: '0px' }]"
    >
      <router-view
        :selektovaniIgrac="selektovaniIgrac"
        :menuItems="menuItems"
        :userRoles="userRoles"
        @update-meni="updateMeni"
      />
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
import menuItemComponent from "../components/menuItemComponent";

export default {
  components: {
    promenaIgraca,
    menuItemComponent
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
      userRoles: ["admin"],
      /**
       * @file MainLayoutDynamics.vue
       * @description Ovaj fajl je deo MainLayoutDynamics komponente u v3web aplikaciji.
       *
       * @comment
       * Niz `userRoles` je zakomentarisan i sadrži primer uloga za korisnika.
       * Primer uloga uključuje 'coach' i 'medic', što ukazuje da korisnik može imati više uloga.
       * Ovaj niz može biti dinamički popunjen iz API-ja.
       */
      //userRoles: ['coach', 'medic'], // Primer: korisnik je trener i lekar, // Primer uloge (može dolaziti API-ja)
      //ako iygubimo meni, ovde ga dodajemo iz fajla ili lovalstorage-a
      //i odkomentarisemo meniIzBekapa u getMeni()
      //kad da ponovo snimimo, onda vratimo komentar na meniIzBekapa
      meniIzBekapa: [
        {
          key: "administracija",
          label: "main.administration",
          to: "/administracija",
          icon: "Administration.svg",
          roles: ["admin", "sys_admin", "role_trener"]
        },
        {
          key: "trenazneVezbe",
          label: "main.trainingExercises",
          to: "/trenezneVezbe",
          icon: "Training excersizes.svg",
          roles: ["admin", "sys_admin", "role_trener", "role_kondicioni_trener"]
        },
        {
          key: "treninzi",
          label: "main.trainings",
          to: "/treninzi",
          icon: "Trainings.svg",
          roles: ["coach", "admin", "sys_admin"]
        },
        {
          key: "utakmice",
          label: "main.matches",
          to: "/utakmice",
          icon: "Matches.svg",
          roles: ["coach", "role_trener_golmana"]
        },
        {
          key: "catapult",
          label: "main.catapult",
          to: "/catapult",
          icon: "Catapult.svg",
          roles: ["admin", "sys_admin"],
          disabled: true
        },
        {
          key: "tehnickiElementi",
          label: "main.technicalElements",
          to: "/tehnickiElementi",
          icon: "Technical elements.svg",
          roles: ["coach", "sys_admin"]
        },
        {
          key: "taktickiElementi",
          label: "main.tacticalElements",
          to: "/taktickiElementi",
          icon: "Tactical elements.svg",
          roles: ["coach", "sys_admin"]
        },
        {
          key: "igraci",
          label: "main.players",
          to: "/igraci",
          icon: "Players.svg",
          roles: ["admin", "coach", "sys_admin"]
        },
        {
          key: "medicinskiKarton",
          label: "main.medicalRecord",
          to: "/medicinskiKarton",
          icon: "Medical record.svg",
          roles: ["medic", "sys_admin", "role_lekar"]
        },
        {
          key: "povredeIgraca",
          label: "main.playerInjuries",
          to: "/povredeIgraca",
          icon: "Player injuries.svg",
          roles: ["medic", "coach", "sys_admin", "role_lekar"]
        },
        {
          key: "strucniTim",
          label: "main.coachingStaff",
          to: "/strucniTim",
          icon: "Administration.svg",
          roles: ["coach", "sys_admin", "role_kondicioni_trener"]
        },
        {
          key: "test",
          label: "main.test",
          to: "/test",
          icon: "Administration.svg",
          roles: ["admin", "sys_admin"]
        },
        {
          key: "access",
          label: "main.access",
          to: "/access",
          icon: "Administration.svg",
          roles: ["sys_Admin", "sys_admin"]
        },
        {
          key: "Tenanti",
          label: "tenanti",
          to: "/tenanti",
          icon: "Administration.svg",
          roles: ["sys_admin", "pomocni_trener"]
        }
      ],
      menuItems: [],
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
    //this.getRoles()
    this.userRoles = window.$roles; // ['admin'] //window.$roles;
    debugger;

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

    try {
      this.lang = JSON.parse(localStorage.getItem("jezik"));
    } catch (error) {
      console.log(error);
    }
    debugger;
    this.getMeni();

    ////alert(this.korisnik)
  },
  computed: {
    filteredMenu() {
      // Step 1: Filter menuItems based on user roles
      const visibleItems = this.menuItems.filter(
        item =>
          item.roles.length !== 0 &&
          item.roles.some(role => this.userRoles.includes(role))
      );

      // Step 2: Build a map of items by id for quick access
      const itemMap = new Map();
      visibleItems.forEach(item => {
        item.children = [];
        itemMap.set(item.id, item);
      });

      // Step 3: Group items with parentId under their parent
      const topLevelItems = [];
      visibleItems.forEach(item => {
        if (item.parentId && itemMap.has(item.parentId)) {
          itemMap.get(item.parentId).children.push(item);
        } else if (!item.parentId) {
          topLevelItems.push(item);
        }
      });

      console.log("topLevelItems", topLevelItems);
      return topLevelItems;
    }
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
    updatePutanja(to) {
      console.log("putanja", to);
      this.putanja = to;
    },
    updateMeni(meni) {
      this.menuItems = meni;
    },
    getMeni() {
      fetch(
        "https://redstar-dev.atomdataservices.com/ui-access-user-kc/for-user",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        }
      )
        .then(response => response.json())
        .then(data => {
          console.log("Успешно getMeni:", data.keyValue);
          debugger;
          if (Object.keys(data.keyValue).length === 0) this.menuItems = [];
          //JSON.stringify(data.keyValue);
          else this.menuItems = data.keyValue; //JSON.stringify(data.keyValue);
          //this.menuItems = this.meniIzBekapa;

          //ako je meni prazan, provaravamo da li ulogovani korisnika ima rolu sys_admin, pa mu dodeljujemo stranicu acces,
          //ovo se desava kad se kreira tenant i sve je prazno

          if (
            this.menuItems.length === 0 &&
            this.userRoles.includes("sys_admin")
          ) {
            debugger;
            this.menuItems = [
              {
                key: "access",
                label: "main.access",
                to: "/access",
                icon: "Administration.svg",
                roles: ["sys_Admin", "sys_admin"]
              }
            ];
            console.log("MenuLayoutDynamics getmeni: ", this.menuItems);
            //alert(JSON.stringify(this.menuItems));
          } else {
            //alert(this.menuItems.length);
            //alert(this.userRoles.includes("sys_admin"));
          }
        })
        .catch(error => {
          console.error("Грешка meni:", error);
        });
    },

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
