<template>
  <q-page class="q-pa-sm container">
    <q-tabs
      v-model="tab"
      align="justify"
      active-color="white"
      active-bg-color="linear-gradient(135deg, #3b5d99 60%, #3d5791 0%, #3d5791 80%, #3d548c 10%)"
      style="margin-left: 20px;"
      indicator-color="transparent"
    >
      <!-- Tabs -->
      <q-tab
        v-if="isUserAdmin"
        no-caps
        label=""
        @click="iskljuciSveOsim(1)"
        name="tab-korisnici"
        :class="tab == 'tab-korisnici' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.korisniciT"
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Users active.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Users.svg"
          style=""
        />
        <label>{{ $t("administration.menu.users") }}</label>
      </q-tab>
      <q-tab
        v-if="isUserAdmin"
        no-caps
        label=""
        @click="iskljuciSveOsim(2)"
        name="tab-uloge"
        :class="tab == 'tab-uloge' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.ulogeT"
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Roles active.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Roles.svg"
          style=""
        />
        <label>{{ $t("administration.menu.roles") }}</label>
      </q-tab>
      <q-tab
        no-caps
        label=""
        @click="iskljuciSveOsim(3)"
        name="tab-timovi"
        :class="tab == 'tab-timovi' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.timT"
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Teams active.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Teams.svg"
          style=""
        />
        <label>{{ $t("administration.menu.teams") }}</label>
      </q-tab>
      <q-tab
        no-caps
        label=""
        @click="iskljuciSveOsim(4)"
        name="tab-strucniTim"
        :class="tab == 'tab-strucniTim' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.profT"
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Professional staff active.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Professional staff.svg"
          style=""
        />
        <label>{{ $t("administration.menu.professionalStaff") }}</label>
      </q-tab>
      <q-tab
        no-caps
        label=""
        @click="iskljuciSveOsim(5)"
        name="tab-igraci"
        :class="tab == 'tab-igraci' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.igraciT"
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Players active.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Players.svg"
          style=""
        />
        <label>{{ $t("administration.menu.players") }}</label>
      </q-tab>
      <q-tab
        no-caps
        label=""
        @click="iskljuciSveOsim(6)"
        name="tab-veze"
        :class="tab == 'tab-veze' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.konekcijeT"
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Connections active.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Connections.svg"
          style=""
        />
        <label>{{ $t("administration.menu.connections") }}</label>
      </q-tab>
      <q-tab
        no-caps
        label=""
        @click="iskljuciSveOsim(7)"
        name="tab-elementi"
        :class="tab == 'tab-elementi' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.elemT"
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Game elements active.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Game elements.svg"
          style=""
        />
        <label>{{ $t("administration.menu.elementsOfTheGame") }}</label>
      </q-tab>
      <q-tab
        no-caps
        label=""
        @click="iskljuciSveOsim(8)"
        name="tab-tehnika"
        :class="tab == 'tab-tehnika' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.tehnikaT"
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Technique active.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Technique.svg"
          style=""
        />
        <label>{{ $t("administration.menu.technique") }}</label>
      </q-tab>
      <q-tab
        no-caps
        label=""
        @click="iskljuciSveOsim(9)"
        name="tab-taktika"
        :class="tab == 'tab-taktika' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.taktikaT"
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Tactics active.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Tactics.svg"
          style=""
        />
        <label>{{ $t("administration.menu.tactics") }}</label>
      </q-tab>
      <q-tab
        no-caps
        label=""
        @click="iskljuciSveOsim(10)"
        name="tab-principiIgre"
        :class="tab == 'tab-principiIgre' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.principiT"
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Principles of the game active.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Principles of the game.svg"
          style=""
        />
        <label>{{ $t("administration.menu.principlesOfTheGame") }}</label>
      </q-tab>
      <q-tab
        no-caps
        label=""
        @click="iskljuciSveOsim(11)"
        name="tab-podaciOTestovima"
        :class="
          tab == 'tab-podaciOTestovima' ? 'plaviGradijent' : 'beliGradijent'
        "
        class="karticaGradijent "
      >
        <img
          v-if="this.testT"
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Test data active.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Nav/Test data.svg"
          style=""
        />
        <label>{{ $t("administration.menu.testData") }}</label>
      </q-tab>
      <!-- <q-tab no-caps label="Formacije" name="tab-formacije"> <i class="fas fa-users-cog fa-2x"></i> </q-tab> -->
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      animated
      style=" background: #ffffff00; padding-top: 0px !important; margin-top: 0px; padding-top: 0px;"
    >
      <!-- style="overflow: auto; height: 80vh;" -->
      <q-tab-panel
        name="tab-korisnici"
        style="margin-top: 0px; padding-top: 0px; height: calc(100% - 117px); overflow: hidden;"
      >
        <korisnici></korisnici>
      </q-tab-panel>
      <q-tab-panel name="tab-uloge" style="margin-top: 0px; padding-top: 0px;">
        <uloge></uloge>
      </q-tab-panel>
      <q-tab-panel name="tab-timovi" style="margin-top: 0px; padding-top: 0px;">
        <timovi></timovi>
      </q-tab-panel>
      <q-tab-panel
        name="tab-strucniTim"
        style="margin-top: 0px; padding-top: 0px;"
      >
        <strucniTimKomponenta></strucniTimKomponenta>
      </q-tab-panel>
      <q-tab-panel name="tab-igraci" style="margin-top: 0px; padding-top: 0px;">
        <igraciOsnoviPodaci></igraciOsnoviPodaci>
      </q-tab-panel>
      <q-tab-panel name="tab-veze" style="margin-top: 0px; padding-top: 0px;">
        <povezivanje></povezivanje>
      </q-tab-panel>
      <q-tab-panel
        name="tab-elementi"
        style="margin-top: 0px; padding-top: 0px;"
      >
        <elmenti></elmenti>
      </q-tab-panel>

      <q-tab-panel
        name="tab-tehnika"
        style="margin-top: 15px; padding-top: 0px;"
      >
        <q-tabs
          indicator-color="transparent"
          v-model="tabTehnika"
          active-bg-color="deep-orange-6"
          style="background-color: unset"
        >
          <q-tab
            no-caps
            :label="$t('administration.menu.groups')"
            @click="iskljuciSveOsimTehnika(1)"
            :class="this.tehnika1 ? 'narandzastaPozadina' : 'nemaPozadine'"
            style="border-radius: 10px 0 0 10px;"
            name="tab-tehnika-grupe"
          ></q-tab>
          <q-tab
            no-caps
            :label="$t('administration.menu.items')"
            @click="iskljuciSveOsimTehnika(2)"
            style=""
            :class="this.tehnika2 ? 'narandzastaPozadina' : 'nemaPozadine'"
            name="tab-tehnika-stavke"
          ></q-tab>
          <q-tab
            no-caps
            :label="$t('administration.menu.setpointMatrix')"
            @click="iskljuciSveOsimTehnika(3)"
            :class="this.tehnika3 ? 'narandzastaPozadina' : 'nemaPozadine'"
            style="border-radius: 0px 10px 10px 0px;"
            name="tab-tehnika-matrica"
          ></q-tab>
        </q-tabs>
        <q-tab-panels
          v-model="tabTehnika"
          animated
          style="overflow: auto;  background-color: unset;"
        >
          <q-tab-panel name="tab-tehnika-grupe">
            <tehnikaGrupe></tehnikaGrupe>
          </q-tab-panel>
          <q-tab-panel name="tab-tehnika-stavke">
            <tehnikaStavke></tehnikaStavke>
          </q-tab-panel>
          <q-tab-panel name="tab-tehnika-matrica">
            <zadatiNivoTehnike></zadatiNivoTehnike>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>

      <q-tab-panel
        name="tab-taktika"
        style="margin-top: 15px; padding-top: 0px;"
      >
        <q-tabs
          indicator-color="transparent"
          v-model="tabTaktika"
          active-bg-color="deep-orange-6"
          style="background-color: unset;"
        >
          <q-tab
            no-caps
            :label="$t('administration.menu.groups')"
            @click="iskljuciSveOsimTaktika(1)"
            :class="this.taktika1 ? 'narandzastaPozadina' : 'nemaPozadine'"
            style="border-radius: 10px 0 0 10px;"
            name="tab-taktika-grupe"
          ></q-tab>
          <q-tab
            no-caps
            :label="$t('administration.menu.items')"
            @click="iskljuciSveOsimTaktika(2)"
            :class="this.taktika2 ? 'narandzastaPozadina' : 'nemaPozadine'"
            name="tab-taktika-stavke"
          ></q-tab>
          <q-tab
            no-caps
            :label="$t('administration.menu.setpointMatrix')"
            @click="iskljuciSveOsimTaktika(3)"
            :class="this.taktika3 ? 'narandzastaPozadina' : 'nemaPozadine'"
            style="border-radius: 0px 10px 10px 0px;"
            name="tab-taktika-matrica"
          ></q-tab>
        </q-tabs>
        <q-tab-panels
          v-model="tabTaktika"
          animated
          style="overflow: auto; margin-top: 0px; padding-top: 0px; background-color: unset;"
        >
          <q-tab-panel name="tab-taktika-grupe">
            <taktikaGrupe></taktikaGrupe>
          </q-tab-panel>
          <q-tab-panel
            name="tab-taktika-stavke"
            style="margin-top: 0px; padding-top: 0px; background-color: unset;"
          >
            <taktikaStavke></taktikaStavke>
          </q-tab-panel>
          <q-tab-panel
            name="tab-taktika-matrica"
            style="margin-top: 0px; padding-top: 0px; background-color: unset;"
          >
            <zadatiNivoTaktike></zadatiNivoTaktike>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>
      <q-tab-panel
        name="tab-principiIgre"
        style="margin-top: 0px; padding-top: 0px;"
      >
        <principiIgre></principiIgre>
      </q-tab-panel>
      <q-tab-panel
        name="tab-podaciOTestovima"
        style="margin-top: 0px; padding-top: 0px;"
      >
        <podaciOTestovima></podaciOTestovima>
      </q-tab-panel>
      <q-tab-panel
        name="tab-formacije"
        style="margin-top: 0px; padding-top: 0px;"
      >
        <formacije></formacije>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { exportFile } from "quasar";

import korisnici from "../components/administracija/korisnici";
import uloge from "../components/administracija/uloge";
import timovi from "../components/administracija/timovi";
import strucniTimKomponenta from "../components/administracija/strucniTimKomponenta";
import igraciOsnoviPodaci from "../components/administracija/igraciOsnoviPodaci";
import povezivanje from "../components/administracija/povezivanje";
import elmenti from "../components/administracija/elmentiKomponenta";
import tehnikaGrupe from "../components/administracija/grupa/tehnikaGrupeKomponenta";
import tehnikaStavke from "../components/administracija/stavka/tehnikaStavkeKomponenta";
import zadatiNivoTehnike from "../components/administracija/matrica/zadatiNivoTehnikeKomponenta";
import taktikaGrupe from "../components/administracija/grupa/taktikaGrupeKomponenta";
import taktikaStavke from "../components/administracija/stavka/taktikaStavkeKomponenta";
import zadatiNivoTaktike from "../components/administracija/matrica/zadatiNivoTaktikeKomponenta";
import principiIgre from "../components/administracija/principiIgreKomponenta";
import podaciOTestovima from "../components/administracija/podaciOTestovimaKomponenta";

import formacije from "../components/formacijeKomponenta";

export default {
  components: {
    korisnici,
    timovi,
    igraciOsnoviPodaci,
    povezivanje,
    uloge,
    strucniTimKomponenta,
    elmenti,
    tehnikaGrupe,
    taktikaGrupe,
    tehnikaStavke,
    taktikaStavke,
    zadatiNivoTehnike,
    zadatiNivoTaktike,
    principiIgre,
    formacije,
    podaciOTestovima
  },
  props: ["selektovaniIgrac"],
  data() {
    return {
      tab: "tab-timovi",
      tabTehnika: "tab-tehnika-grupe",
      tabTaktika: "tab-taktika-grupe",
      korisniciT: false,
      ulogeT: false,
      timT: true,
      profT: false,
      igraciT: false,
      konekcijeT: false,
      elemT: false,
      tehnikaT: false,
      taktikaT: false,
      principiT: false,
      testT: false,
      tehnika1: true,
      tehnika2: false,
      tehnika3: false,
      taktika1: true,
      taktika2: false,
      taktika3: false,
      isUserAdmin: false
    };
  },
  mounted() {
    this.isUserAdmin = window.$userIsAdmin;
    if (window.$userID == 1) {
      window.$userIsAdmin = true;
      this.isUserAdmin = window.$userIsAdmin;
      this.iskljuciSveOsim(1);
      this.tab = "tab-korisnici";
    } else {
      this.getData();
    }
  },

  watch: {
    selektovaniIgrac: function(val) {
      console.log(val);
    }
  },
  methods: {
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o korisnicima
    //........................................
    getData() {
      let linkStr = this.$apiPutanja + "/korisnici/" + window.$userID;
      let self = this;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          if (response.status == 401) {
            this.$router.push({ name: "login" });
          }
          console.log(response.data);
          if (
            response.data[0].roles.filter(
              e => e == "ROLE_ADMIN" || e == "Administrator"
            ).length > 0
          ) {
            window.$userIsAdmin = true;
            self.isUserAdmin = window.$userIsAdmin;
            self.iskljuciSveOsim(1);
            self.tab = "tab-korisnici";
          }
        })
        .catch(e => {
          //this.errors.push(e);
          this.loadingUtakmice = false;
          this.$router.push({ name: "login" });
          console.log("Greska: " + e);
        });
    },
    iskljuciSveOsim(poslato) {
      this.korisniciT = poslato == 1 ? true : false;
      this.ulogeT = poslato == 2 ? true : false;
      this.timT = poslato == 3 ? true : false;
      this.profT = poslato == 4 ? true : false;
      this.igraciT = poslato == 5 ? true : false;
      this.konekcijeT = poslato == 6 ? true : false;
      this.elemT = poslato == 7 ? true : false;
      this.tehnikaT = poslato == 8 ? true : false;
      this.taktikaT = poslato == 9 ? true : false;
      this.principiT = poslato == 10 ? true : false;
      this.testT = poslato == 11 ? true : false;
    },
    iskljuciSveOsimTehnika(poslato) {
      this.tehnika1 = poslato == 1 ? true : false;
      this.tehnika2 = poslato == 2 ? true : false;
      this.tehnika3 = poslato == 3 ? true : false;
    },
    iskljuciSveOsimTaktika(poslato) {
      this.taktika1 = poslato == 1 ? true : false;
      this.taktika2 = poslato == 2 ? true : false;
      this.taktika3 = poslato == 3 ? true : false;
    }
  }
};
</script>
<style lang="sass">
i.q-tabs__arrow:nth-child(3)
  background-color: #ffffff;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  margin-top: 17.5px;
  color: #323b62

i.q-tabs__arrow:nth-child(2)
  background-color: #ffffff;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  margin-top: 17.5px;
  color: #323b62
</style>
