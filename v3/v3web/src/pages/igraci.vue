<template>
  <q-page class="q-pa-sm">
    <router-view :selektovaniIgrac="selektovaniIgrac" />
    <!-- <q-splitter
      v-model="splitterModel"
      style="height: 100%"
    > -->

    <!--
      ovo vatiti dole, ako ustreba!
      <q-tab label="Izbor igrača" name="tab-0"> <i class="fas fa-user fa-2x"></i> </q-tab>
     -->

    <!-- <template v-slot:before> -->
    <!-- vertical  -->
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
        v-if="
          menuItems.find(e => e.label == 'sportTrails') != undefined &&
            menuItems
              .find(e => e.label == 'sportTrails')
              .roles.some(item => userRoles.includes(item))
        "
        no-caps
        label=""
        @click="iskljuciSveOsim(1)"
        name="tab-1"
        :class="tab == 'tab-1' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.korisniciT"
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Sports trail hover.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Sports trail.svg"
          style=""
        />
        <label>{{ $t("players.sportsTrail.sportsTrail") }}</label>
      </q-tab>
      <q-tab
        v-if="
          menuItems.find(e => e.label == 'playerRating') != undefined &&
            menuItems
              .find(e => e.label == 'playerRating')
              .roles.some(item => userRoles.includes(item))
        "
        no-caps
        label=""
        @click="iskljuciSveOsim(2)"
        name="tab-1a"
        :class="tab == 'tab-1a' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.ulogeT"
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Player rating hover.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Player rating.svg"
          style=""
        />
        <label>{{ $t("players.playerRating.playerRating") }}</label>
      </q-tab>
      <q-tab
        v-if="
          menuItems.find(e => e.label == 'morphologicalCharacteristic') !=
            undefined &&
            menuItems
              .find(e => e.label == 'morphologicalCharacteristic')
              .roles.some(item => userRoles.includes(item))
        "
        no-caps
        label=""
        @click="iskljuciSveOsim(3)"
        name="tab-2"
        :class="tab == 'tab-2' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.timT"
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Morphological characteristics hover.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Morphological characteristics.svg"
          style=""
        />
        <label>{{
          $t(
            "players.morphologicalCharacteristics.morphologicalCharacteristics"
          )
        }}</label>
      </q-tab>
      <q-tab
        v-if="
          menuItems.find(e => e.label == 'motorSkills') != undefined &&
            menuItems
              .find(e => e.label == 'motorSkills')
              .roles.some(item => userRoles.includes(item))
        "
        no-caps
        label=""
        @click="iskljuciSveOsim(4)"
        name="tab-3"
        :class="tab == 'tab-3' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.profT"
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Motor skills hover.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Motor skills.svg"
          style=""
        />
        <label>{{ $t("players.motorSkills.motorSkills") }}</label>
      </q-tab>
      <q-tab
        v-if="
          menuItems.find(e => e.label == 'functionalData') != undefined &&
            menuItems
              .find(e => e.label == 'functionalData')
              .roles.some(item => userRoles.includes(item))
        "
        no-caps
        label=""
        @click="iskljuciSveOsim(5)"
        name="tab-4"
        :class="tab == 'tab-4' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.igraciT"
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Functional data hover.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Functional data.svg"
          style=""
        />
        <label>{{ $t("players.functionalData.functionalData") }}</label>
      </q-tab>
      <q-tab
        v-if="
          menuItems.find(e => e.label == 'psychologicalProfile') != undefined &&
            menuItems
              .find(e => e.label == 'psychologicalProfile')
              .roles.some(item => userRoles.includes(item))
        "
        no-caps
        label=""
        @click="iskljuciSveOsim(6)"
        name="tab-5"
        :class="tab == 'tab-5' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.konekcijeT"
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Psyhological profile hover.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Psyhological profile.svg"
          style=""
        />
        <label>{{
          $t("players.psychologicalProfile.psychologicalProfile")
        }}</label>
      </q-tab>
      <q-tab
        v-if="
          menuItems.find(e => e.label == 'intelligence') != undefined &&
            menuItems
              .find(e => e.label == 'intelligence')
              .roles.some(item => userRoles.includes(item))
        "
        no-caps
        label=""
        @click="iskljuciSveOsim(7)"
        name="tab-6"
        :class="tab == 'tab-6' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.elemT"
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Intelligence hover.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Intelligence.svg"
          style=""
        />
        <label>{{ $t("players.intelligence.intelligence") }}</label>
      </q-tab>
      <q-tab
        v-if="
          menuItems.find(e => e.label == 'socialCapital') != undefined &&
            menuItems
              .find(e => e.label == 'socialCapital')
              .roles.some(item => userRoles.includes(item))
        "
        no-caps
        label=""
        @click="iskljuciSveOsim(8)"
        name="tab-7"
        :class="tab == 'tab-7' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.tehnikaT"
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Social capital hover.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Social capital.svg"
          style=""
        />
        <label>{{ $t("players.socialCapital.socialCapital") }}</label>
      </q-tab>
      <q-tab
        v-if="
          menuItems.find(e => e.label == 'finance') != undefined &&
            menuItems
              .find(e => e.label == 'finance')
              .roles.some(item => userRoles.includes(item))
        "
        no-caps
        label=""
        @click="iskljuciSveOsim(9)"
        name="tab-9"
        :class="tab == 'tab-9' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.taktikaT"
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Finance hover.svg"
          style=""
        />
        <img
          v-else
          style=""
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Finance.svg"
        />
        <label>{{ $t("players.finance.finance") }}</label>
      </q-tab>
      <q-tab
        v-if="
          menuItems.find(e => e.label == 'guardianAngel') != undefined &&
            menuItems
              .find(e => e.label == 'guardianAngel')
              .roles.some(item => userRoles.includes(item))
        "
        no-caps
        label=""
        @click="iskljuciSveOsim(10)"
        name="tab-10"
        :class="tab == 'tab-10' ? 'plaviGradijent' : 'beliGradijent'"
        class="karticaGradijent "
      >
        <img
          v-if="this.principiT"
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Guardian angel hover.svg"
          style=""
        />
        <img
          v-else
          src="../assets/pro-coach11 assets/ikonice/web/Players subnav/Guardian angel.svg"
          style=""
        />
        <label>{{ $t("players.guardianAngel.guardianAngel") }}</label>
      </q-tab>
      <!-- <q-tab label="Testiranje igrača" name="tab-8"> <i class="fas fa-users-cog fa-2x"></i> </q-tab> -->
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      animated
      style=" background: #ffffff00; padding-top: 0px !important; margin-top: 0px;"
    >
      <!-- style="overflow: auto; height: 80vh;" -->
      <q-tab-panel name="tab-1" style="margin-top: 0px;">
        <sportskiStaz :selektovaniIgrac="selektovaniIgrac"></sportskiStaz>
      </q-tab-panel>
      <q-tab-panel name="tab-1a" style="margin-top: 0px;">
        <procenaIgraca :selektovaniIgrac="selektovaniIgrac"></procenaIgraca>
      </q-tab-panel>
      <q-tab-panel name="tab-2" style="margin-top: 0px;">
        <morfologija :selektovaniIgrac="selektovaniIgrac"></morfologija>
      </q-tab-panel>
      <q-tab-panel name="tab-3" style="margin-top: 15px;">
        <q-tabs
          indicator-color="transparent"
          v-model="tab3"
          style="background-color: unset;"
        >
          <q-tab
            no-caps
            :label="$t('players.motorSkills.power.power')"
            name="tab3-0"
            @click="iskljuciSveOsimMotor(1)"
            :class="this.motor1 ? 'narandzastaPozadina' : 'nemaPozadine'"
            style="border-radius: 10px 0 0 10px;"
          ></q-tab>
          <q-tab
            no-caps
            :label="$t('players.motorSkills.flexibility.flexibility')"
            name="tab3-1"
            @click="iskljuciSveOsimMotor(2)"
            :class="this.motor2 ? 'narandzastaPozadina' : 'nemaPozadine'"
          ></q-tab>
          <q-tab
            no-caps
            :label="$t('players.motorSkills.FMS.FMS')"
            name="tab3-2"
            @click="iskljuciSveOsimMotor(3)"
            :class="this.motor3 ? 'narandzastaPozadina' : 'nemaPozadine'"
          ></q-tab>
          <q-tab
            no-caps
            :label="$t('players.motorSkills.riskOfInjury.riskOfInjury')"
            name="tab3-3"
            @click="iskljuciSveOsimMotor(4)"
            :class="this.motor4 ? 'narandzastaPozadina' : 'nemaPozadine'"
          ></q-tab>
          <q-tab
            no-caps
            disable
            :label="$t('players.motorSkills.posture.posture')"
            name="tab3-4"
            @click="iskljuciSveOsimMotor(5)"
            :class="this.motor5 ? 'narandzastaPozadina' : 'nemaPozadine'"
          ></q-tab>
          <q-tab
            no-caps
            disable
            :label="$t('players.motorSkills.isokinetics.isokinetics')"
            name="tab3-5"
            @click="iskljuciSveOsimMotor(6)"
            :class="this.motor6 ? 'narandzastaPozadina' : 'nemaPozadine'"
          >
          </q-tab>
          <q-tab
            no-caps
            :label="$t('players.motorSkills.speed.speed')"
            name="tab3-6"
            @click="iskljuciSveOsimMotor(7)"
            :class="this.motor7 ? 'narandzastaPozadina' : 'nemaPozadine'"
          ></q-tab>
          <q-tab
            no-caps
            :label="$t('players.motorSkills.agility.agility')"
            name="tab3-7"
            @click="iskljuciSveOsimMotor(8)"
            :class="this.motor8 ? 'narandzastaPozadina' : 'nemaPozadine'"
            style="border-radius: 0px 10px 10px 0px;"
          >
          </q-tab>
        </q-tabs>
        <q-tab-panels
          v-model="tab3"
          animated
          style="overflow: auto;  background-color: unset;"
        >
          <!-- style="overflow: auto; height: 80vh;" -->
          <q-tab-panel name="tab3-0" style="margin-top: 0px;">
            <snaga :selektovaniIgrac="selektovaniIgrac"></snaga>
          </q-tab-panel>
          <q-tab-panel name="tab3-1" style="margin-top: 0px;">
            <fleksibiolnost
              :selektovaniIgrac="selektovaniIgrac"
            ></fleksibiolnost>
          </q-tab-panel>
          <q-tab-panel name="tab3-2" style="margin-top: 0px;">
            <fms :selektovaniIgrac="selektovaniIgrac"></fms>
          </q-tab-panel>
          <q-tab-panel name="tab3-3" style="margin-top: 0px;">
            <identifikacijaRizikaPovredjivanja
              :selektovaniIgrac="selektovaniIgrac"
            ></identifikacijaRizikaPovredjivanja>
          </q-tab-panel>
          <q-tab-panel name="tab3-4" style="margin-top: 0px;">
            <postura :selektovaniIgrac="selektovaniIgrac"></postura>
          </q-tab-panel>
          <q-tab-panel name="tab3-5" style="margin-top: 0px;">
            <h5>Izokinetika</h5>
          </q-tab-panel>
          <q-tab-panel name="tab3-6" style="margin-top: 0px;">
            <brzina :selektovaniIgrac="selektovaniIgrac"></brzina>
          </q-tab-panel>
          <q-tab-panel name="tab3-7" style="margin-top: 0px;">
            <agilnost :selektovaniIgrac="selektovaniIgrac"></agilnost>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>
      <q-tab-panel name="tab-4" style="margin-top: 0px;">
        <funkcionalniPodaci
          :selektovaniIgrac="selektovaniIgrac"
        ></funkcionalniPodaci>
      </q-tab-panel>
      <q-tab-panel name="tab-5" style="margin-top: 15px;">
        <q-tabs
          indicator-color="transparent"
          v-model="tab5"
          style="background-color: unset;"
        >
          <q-tab
            no-caps
            :label="$t('players.tests')"
            name="tab5-0"
            @click="iskljuciSveOsimPsi(1)"
            :class="this.psi1 ? 'narandzastaPozadina' : 'nemaPozadine'"
            style="border-radius: 10px 0 0 10px;"
          ></q-tab>
          <q-tab
            no-caps
            :label="$t('players.assessmentAndSelfAssessment')"
            name="tab5-1"
            @click="iskljuciSveOsimPsi(2)"
            :class="this.psi2 ? 'narandzastaPozadina' : 'nemaPozadine'"
            style="border-radius: 0 10px 10px 0;"
          ></q-tab>
        </q-tabs>
        <q-tab-panels
          v-model="tab5"
          animated
          style="overflow: auto;  background-color: unset;"
        >
          <!-- style="overflow: auto; height: 80vh;" -->
          <q-tab-panel name="tab5-0" style="margin-top: 0px;">
            <psiholoskiProfilPsiholog
              :selektovaniIgrac="selektovaniIgrac"
            ></psiholoskiProfilPsiholog>
          </q-tab-panel>
          <q-tab-panel name="tab5-1" style="margin-top: 0px;">
            <psiholoskiProfilTrener
              :selektovaniIgrac="selektovaniIgrac"
            ></psiholoskiProfilTrener>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>
      <q-tab-panel name="tab-6" style="margin-top: 0px;">
        <inteligencija :selektovaniIgrac="selektovaniIgrac"></inteligencija>
      </q-tab-panel>
      <q-tab-panel name="tab-7" style="margin-top: 0px;">
        <socijalniKapital
          :selektovaniIgrac="selektovaniIgrac"
        ></socijalniKapital>
      </q-tab-panel>
      <!-- <q-tab-panel name="tab-8">

        </q-tab-panel> -->
      <q-tab-panel name="tab-9" style="margin-top: 0px;">
        <finansije :selektovaniIgrac="selektovaniIgrac"></finansije>
      </q-tab-panel>
      <q-tab-panel name="tab-10" style="margin-top: 0px;">
        <andjeoCuvar :selektovaniIgrac="selektovaniIgrac"></andjeoCuvar>
      </q-tab-panel>
    </q-tab-panels>

    <!-- </template>
    </q-splitter> -->
  </q-page>
</template>

<script>
import igraciOsnoviPodaci from "../components/administracija/igraciOsnoviPodaci";
import postura from "../components/postura";

import sportskiStaz from "../components/igraci/sportskiStazKomponenta";
import procenaIgraca from "../components/igraci/procenaIgracaKomponenta";
import morfologija from "../components/igraci/morfologijaKomponenta";

import snaga from "../components/igraci/motorickeSposobnosti/snagaKomponenta";
import fleksibiolnost from "../components/igraci/motorickeSposobnosti/fleksibilnostKomponenta";
import fms from "../components/igraci/motorickeSposobnosti/fmsKomponenta";
import identifikacijaRizikaPovredjivanja from "../components/igraci/motorickeSposobnosti/identifikacijaRizikaPovredjivanjaKomponenta";
import brzina from "../components/igraci/motorickeSposobnosti/brzinaKomponenta";
import agilnost from "../components/igraci/motorickeSposobnosti/agilnostKomponenta";

import funkcionalniPodaci from "../components/igraci/funkcionalniPodaciKomponenta";

import psiholoskiProfilPsiholog from "../components/igraci/psiholoskiProfil/psiholoskiProfilPsihologKomponenta";
import psiholoskiProfilTrener from "../components/igraci/psiholoskiProfil/psiholoskiProfilTrenerKomponenta";

import inteligencija from "../components/igraci/inteligencijaKomponenta";
import socijalniKapital from "../components/igraci/socijalniKapitalKomponenta";
import finansije from "../components/igraci/finansijeKomponenta";
import andjeoCuvar from "../components/igraci/andjeoCuvarKomponenta";

export default {
  components: {
    postura,
    igraciOsnoviPodaci,
    morfologija,
    agilnost,
    fleksibiolnost,
    snaga,
    fms,
    brzina,
    inteligencija,
    socijalniKapital,
    funkcionalniPodaci,
    identifikacijaRizikaPovredjivanja,

    finansije,
    psiholoskiProfilPsiholog,
    psiholoskiProfilTrener,
    sportskiStaz,
    procenaIgraca,
    andjeoCuvar
  },
  props: ["selektovaniIgrac", "menuItems", "userRoles"],
  data() {
    return {
      tab: "",
      tab3: "tab3-0",
      tab5: "tab5-0",
      splitterModel: 17,
      korisniciT: false,
      ulogeT: false,
      timT: false,
      profT: false,
      igraciT: false,
      konekcijeT: false,
      elemT: false,
      tehnikaT: false,
      taktikaT: false,
      principiT: false,
      testT: false,
      motor1: true,
      motor2: false,
      motor3: false,
      motor4: false,
      motor5: false,
      motor6: false,
      motor7: false,
      motor8: false,
      psi1: true,
      psi2: false
    };
  },
  mounted() {
    if (
      this.menuItems.find(e => e.label == "sportTrails") != undefined &&
      this.menuItems
        .find(e => e.label == "sportTrails")
        .roles.some(item => this.userRoles.includes(item))
    ) {
      this.tab = "tab-1";
      this.korisniciT = true;
    } else if (
      this.menuItems.find(e => e.label == "playerRating") != undefined &&
      this.menuItems
        .find(e => e.label == "playerRating")
        .roles.some(item => this.userRoles.includes(item))
    ) {
      this.tab = "tab-1a";
      this.ulogeT = true;
    } else if (
      this.menuItems.find(e => e.label == "morphologicalCharacteristic") !=
        undefined &&
      this.menuItems
        .find(e => e.label == "morphologicalCharacteristic")
        .roles.some(item => this.userRoles.includes(item))
    ) {
      this.tab = "tab-2";
      this.timT = true;
    } else if (
      this.menuItems.find(e => e.label == "motorSkills") != undefined &&
      this.menuItems
        .find(e => e.label == "motorSkills")
        .roles.some(item => this.userRoles.includes(item))
    ) {
      this.tab = "tab-3";
      this.profT = true;
    } else if (
      this.menuItems.find(e => e.label == "functionalData") != undefined &&
      this.menuItems
        .find(e => e.label == "functionalData")
        .roles.some(item => this.userRoles.includes(item))
    ) {
      this.tab = "tab-4";
      this.igraciT = true;
    } else if (
      this.menuItems.find(e => e.label == "psychologicalProfile") !=
        undefined &&
      this.menuItems
        .find(e => e.label == "psychologicalProfile")
        .roles.some(item => this.userRoles.includes(item))
    ) {
      this.tab = "tab-5";
      this.konekcijeT = true;
    } else if (
      this.menuItems.find(e => e.label == "intelligence") != undefined &&
      this.menuItems
        .find(e => e.label == "intelligence")
        .roles.some(item => this.userRoles.includes(item))
    ) {
      this.tab = "tab-6";
      this.elemT = true;
    } else if (
      this.menuItems.find(e => e.label == "socialCapital") != undefined &&
      this.menuItems
        .find(e => e.label == "socialCapital")
        .roles.some(item => this.userRoles.includes(item))
    ) {
      this.tab = "tab-7";
      this.tehnikaT = true;
    } else if (
      this.menuItems.find(e => e.label == "finance") != undefined &&
      this.menuItems
        .find(e => e.label == "finance")
        .roles.some(item => this.userRoles.includes(item))
    ) {
      this.tab = "tab-9";
      this.taktikaT = true;
    } else if (
      this.menuItems.find(e => e.label == "guardianAngel") != undefined &&
      this.menuItems
        .find(e => e.label == "guardianAngel")
        .roles.some(item => this.userRoles.includes(item))
    ) {
      this.tab = "tab-10";
      this.principiT = true;
    }
  },
  methods: {
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
    iskljuciSveOsimMotor(poslato) {
      this.motor1 = poslato == 1 ? true : false;
      this.motor2 = poslato == 2 ? true : false;
      this.motor3 = poslato == 3 ? true : false;
      this.motor4 = poslato == 4 ? true : false;
      this.motor5 = poslato == 5 ? true : false;
      this.motor6 = poslato == 6 ? true : false;
      this.motor7 = poslato == 7 ? true : false;
      this.motor8 = poslato == 8 ? true : false;
    },
    iskljuciSveOsimPsi(poslato) {
      this.psi1 = poslato == 1 ? true : false;
      this.psi2 = poslato == 2 ? true : false;
    }
  }
};
</script>

<style scoped>
.container {
  background-image: linear-gradient(to bottom, #b4d0e9, #f5f8fb);
}

.karticaGradijent {
  min-width: 150px;
  height: 70px;
  margin: 0 10px 0 0;
  border-radius: 4px;
}

.plaviGradijent {
  background: linear-gradient(
    135deg,
    #3b5d99 50%,
    #3d5791 0%,
    #3d5791 65%,
    #3d548c 10%
  ) !important;
  color: white;
}

.beliGradijent {
  background: linear-gradient(
    135deg,
    #ffffff 50%,
    #fafcfd 0%,
    #fafcfd 65%,
    #f6f8fb 10%
  ) !important;
  color: #3b5d99;
}

.debljinaPet {
  font-family: Poppins;
  font-size: 14px;
  font-weight: normal;
}

.nemaPozadine {
  background-color: white !important;
  color: #323b62;
}

.narandzastaPozadina {
  background-color: #ff4b00;
  color: white;
}

@font-face {
  font-family: Poppins;
  src: url("../assets/pro-coach11 assets/font/Poppins/Poppins-Medium.ttf");
}

div {
  font-family: Poppins;
}
</style>
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
