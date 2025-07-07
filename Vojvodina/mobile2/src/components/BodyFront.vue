<template>
  <div>
    <q-card-section class="row items-center q-pb-none" style="background-color: white;">
      <q-space></q-space>
      <q-btn icon="close" flat round dense v-close-popup></q-btn>
    </q-card-section>
    <img :style="stopalaColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-1.png">
    <img :style="skocniZglobColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-2.png">
    <img :style="potkolenicaColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-3.png">
    <img :style="kolenaColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-4.png">
    <img :style="prednjaLozaColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-5.png">
    <img :style="kukoviColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-6.png">
    <img :style="trbuhColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-7.png">
    <img :style="grudniKosColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-8.png">
    <img :style="rameColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-9.png">
    <img :style="vratColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-10.png">
    <img :style="glavaColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-11.png">
    <img :style="rukeColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/napred/brojevi/napred-12.png">
    <img style="background-color: white; max-height: 70vh; position:absolute; z-index: -2"
      src="../images/napred/napred__0018_Layer-0.png">
    <img :style="potkolenicaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0000_potkolenica_desno.png">
    <img :style="potkolenicaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0001_potkolenica_levo.png">
    <img :style="stopalaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0002_stopala.png">
    <img :style="skocniZglobColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0003_skocni_zglob_desni.png">
    <img :style="skocniZglobColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0004_skocni_zglob_levi.png">
    <img :style="kolenaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0005_koleno_desno.png">
    <img :style="kolenaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0006_koleno_levo.png">
    <img :style="prednjaLozaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0007_prednja_loza_desno.png">
    <img :style="prednjaLozaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0008_prednja_loza_levo.png">
    <img :style="kukoviColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0009_kukovi.png">
    <img :style="trbuhColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0010_trbuh.png">
    <img :style="grudniKosColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0011_grudni_kos.png">
    <img :style="rukeColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0012_ruka_desna.png">
    <img :style="rukeColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0013_ruka_leva.png">
    <img :style="rameColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0014_rame_desno.png">
    <img :style="rameColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0015_rame_levo.png">
    <img :style="vratColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0016_vrat.png">
    <img :style="glavaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/napred/napred__0017_glava.png">

    <img style="max-height: 70vh;opacity: 0;" src="../images/telo-napred.png" usemap="#image_map" id="target-img-1">
    <map class="slika" name="image_map">
      <area @click="submit_osecaj('Glava', 10)" alt="broj 11" title="broj 11"
        coords="130,74,104,91,90,97,73,86,69,66,79,54,88,52,103,51" shape="poly">
      <area @click="submit_osecaj('Rameni pojas', 8)" alt="broj 9" title="broj 9"
        coords="91,164,63,184,43,185,32,171,31,158,38,145,61,139" shape="poly">
      <area @click="submit_osecaj('Vrat', 9)" alt="broj 10" title="broj 10"
        coords="204,107,230,91,240,84,254,88,263,103,261,119,252,126,237,133" shape="poly">
      <area @click="submit_osecaj('Grudni koš', 7)" alt="broj 8" title="broj 8"
        coords="203,161,226,144,242,138,257,142,269,156,264,170,256,179,240,186" shape="poly">
      <area @click="submit_osecaj('Kukovi', 5)" alt="broj 6" title="broj 6"
        coords="210,291,229,275,237,268,254,267,272,278,274,299,262,312,245,314" shape="poly">
      <area @click="submit_osecaj('Trbuh', 6)" alt="broj 7" title="broj 7"
        coords="140,234,109,256,89,258,78,242,80,224,95,211,112,216" shape="poly">
      <area @click="submit_osecaj('Ruke', 11)" alt="broj 12" title="broj 12"
        coords="76,293,43,270,25,273,13,289,14,304,28,318,48,314" shape="poly">
      <area @click="submit_osecaj('Prednja loža natkolenice', 4)" alt="broj 5" title="broj 5"
        coords="123,428,93,408,76,407,59,426,69,446,89,453" shape="poly">
      <area @click="submit_osecaj('Kolena', 3)" alt="broj 4" title="broj 4"
        coords="224,466,247,449,266,444,284,455,279,481,257,490" shape="poly">
      <area @click="submit_osecaj('Potkolenice', 2)" alt="broj 3" title="broj 3"
        coords="121,523,93,501,70,502,61,521,68,540,91,546" shape="poly">
      <area @click="submit_osecaj('Skočni zglob', 1)" alt="broj 2" title="broj 2"
        coords="204,596,226,580,243,574,261,583,261,611,239,623" shape="poly">
      <area @click="submit_osecaj('Stopala', 0)" alt="broj 1" title="broj 1"
        coords="137,615,111,597,92,592,78,611,82,632,106,639" shape="poly">
      <area alt="Stopala" title="Stopala" @click="submit_osecaj('Stopala', 0)"
        coords="170,602,171,607,169,612,167,608,168,602,161,603,145,607,147,614,144,622,141,629,141,635,144,637,173,637,174,632,173,637,179,637,210,636,209,630,200,623,192,610,193,604,187,601,177,599"
        shape="poly">
      <area alt="Skočni zglob" title="Skočni zglob" @click="submit_osecaj('Skočni zglob', 1)"
        coords="144,606,150,605,157,602,165,601,172,601,178,599,185,600,193,603,192,592,185,590,173,589,169,601,165,590,157,592,150,591,144,592"
        shape="poly">
      <area alt="Potkolenice" title="Potkolenice" @click="submit_osecaj('Potkolenice', 2)"
        coords="129,475,141,479,151,480,163,479,161,486,162,494,165,504,166,511,166,522,165,531,165,541,164,551,163,559,163,573,164,588,144,590,141,577,137,559,133,544,128,529,127,515,127,502,129,491,129,482"
        shape="poly">
      <area alt="Potkolenice" title="Potkolenice" @click="submit_osecaj('Potkolenice', 2)"
        coords="178,480,185,482,196,482,204,481,212,479,212,497,210,517,208,531,203,549,199,563,193,590,174,588,174,568,173,547,171,532,170,517,173,504,175,492"
        shape="poly">
      <area alt="Kolena" title="Kolena" @click="submit_osecaj('Kolena', 3)"
        coords="128,455,136,453,145,452,153,453,160,454,166,457,165,469,163,478,156,480,149,480,141,479,132,476,129,475,129,467"
        shape="poly">
      <area alt="Kolena" title="Kolena" @click="submit_osecaj('Kolena', 3)"
        coords="175,455,184,451,192,451,201,452,210,453,213,455,213,465,212,478,205,481,196,482,186,482,178,480,177,471,175,463"
        shape="poly">
      <area alt="Kukovi" title="Kukovi" @click="submit_osecaj('Kukovi', 5)"
        coords="124,265,217,264,218,283,226,320,220,322,212,322,204,325,194,331,187,336,178,346,173,352,167,345,159,336,152,329,143,323,133,320,119,317,120,300,123,282"
        shape="poly">
      <area alt="Prednja loža natkolenice" title="Prednja loža natkolenice"
        @click="submit_osecaj('Prednja loža natkolenice', 4)"
        coords="120,316,128,318,136,320,142,323,148,326,154,332,161,337,167,345,172,350,179,347,183,342,188,336,194,331,202,327,214,323,221,322,227,322,228,335,230,348,231,358,230,375,228,393,226,406,222,420,219,431,215,444,214,454,204,453,194,451,183,452,175,453,176,443,175,430,175,417,174,404,173,395,171,388,169,403,167,416,167,429,168,442,167,454,161,454,154,453,147,453,139,453,129,452,127,441,125,425,122,415,119,402,117,386,115,372,114,360,115,347,116,336,117,326"
        shape="poly">
      <area alt="Trbuh" title="Trbuh" @click="submit_osecaj('Trbuh', 6)"
        coords="121,197,143,199,157,198,170,194,179,195,186,196,195,198,209,201,218,201,223,198,221,212,222,221,221,229,219,239,216,250,216,263,124,265,126,254,127,245,127,235,125,226,122,218"
        shape="poly">
      <area alt="Grudni koš" title="Grudni koš" @click="submit_osecaj('Grudni koš', 7)"
        coords="119,185,119,176,120,166,124,157,128,150,134,144,140,138,145,136,153,135,164,134,173,133,183,134,193,134,200,135,208,140,216,146,220,154,223,163,225,173,225,183,224,196,215,200,206,200,198,199,190,197,182,195,175,194,167,194,161,197,153,198,142,198,129,199,121,198"
        shape="poly">
      <area alt="Rameni pojas" title="Rameni pojas" @click="submit_osecaj('Rameni pojas', 8)"
        coords="207,138,213,137,220,137,230,136,239,143,246,150,252,163,253,173,252,185,239,182,226,176,225,168,222,158,219,151,214,145,211,143"
        shape="poly">
      <area alt="Rameni pojas" title="Rameni pojas" @click="submit_osecaj('Rameni pojas', 8)"
        coords="141,137,136,143,128,151,122,162,119,169,120,175,112,177,100,179,92,181,92,172,93,164,96,157,100,151,107,144,115,139,122,136"
        shape="poly">
      <area alt="Glava" title="Glava" @click="submit_osecaj('Glava', 10)"
        coords="169,112,175,110,181,107,186,103,192,98,192,88,196,90,200,81,201,71,200,69,197,70,195,67,197,61,197,54,194,45,188,39,181,36,173,33,166,34,157,37,151,41,146,48,143,55,143,61,144,71,140,70,139,76,144,89,147,89,147,95,149,101,152,105,157,109,163,111"
        shape="poly">
      <area alt="Vrat" title="Vrat" @click="submit_osecaj('Vrat', 9)"
        coords="125,135,133,128,141,123,147,118,151,111,150,102,158,109,164,111,171,111,179,107,184,103,192,97,191,111,197,116,205,121,214,128,228,135,208,138,202,135,193,134,184,133,176,132,165,133,157,133,147,136,141,137,132,137"
        shape="poly">
      <area alt="Ruke" title="Ruke" @click="submit_osecaj('Ruke', 11)"
        coords="226,177,225,196,223,209,223,221,223,231,226,246,226,259,228,275,231,287,236,303,241,322,242,339,241,364,244,373,245,387,249,389,250,379,252,396,264,399,263,393,268,396,270,391,270,382,269,374,272,363,272,354,278,364,284,368,289,365,284,360,280,354,278,347,270,340,265,335,261,326,260,313,260,295,261,278,261,260,259,251,255,237,254,224,252,205,252,194,252,185"
        shape="poly">
      <area alt="Ruke" title="Ruke" @click="submit_osecaj('Ruke', 11)"
        coords="120,176,121,195,120,201,123,209,123,221,121,229,118,242,116,252,115,266,115,275,110,292,105,307,100,325,98,338,100,348,99,362,96,376,93,389,89,387,89,378,85,398,80,397,79,401,73,401,74,394,68,394,68,385,68,376,68,369,68,362,68,356,64,359,59,365,52,366,51,363,56,358,60,353,63,345,69,340,75,335,79,330,80,316,81,292,80,272,81,260,86,241,88,233,89,220,92,203,93,191,92,182"
        shape="poly">
    </map>

    <!-- <q-menu
        touch-position
      >

        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section>Open...</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>New</q-item-section>
          </q-item>
          <q-separator ></q-separator>
          <q-item clickable v-close-popup>
            <q-item-section>Quit</q-item-section>
          </q-item>
        </q-list>

      </q-menu> -->

  </div>
</template>
<script>
// import ImageMap from "../../node_modules/image-map/dist/image-map.js";
import ImageMap from "image-map";

export default {
  name: 'q-app',
  props: ['inicijalniNivoBola', 'globalTest'],
  data: function () {
    return {
      dialogInstance: null, // Store the dialog instance
      nivoBola: this.inicijalniNivoBola,
      potkolenicaColorus: '',
      stopalaColorus: '',
      skocniZglobColorus: '',
      kolenaColorus: '',
      prednjaLozaColorus: '',
      kukoviColorus: '',
      trbuhColorus: '',
      grudniKosColorus: '',
      rukeColorus: '',
      rameColorus: '',
      vratColorus: '',
      glavaColorus: '',
      redFilter: 'filter: invert(14%) sepia(54%) saturate(7446%) hue-rotate(357deg) brightness(104%) contrast(115%);',
      orangeFilter: 'filter: invert(74%) sepia(32%) saturate(2706%) hue-rotate(346deg) brightness(98%) contrast(106%);',
      yellowFilter: 'filter: invert(92%) sepia(97%) saturate(3359%) hue-rotate(356deg) brightness(100%) contrast(108%);',
      greenFilter: 'filter: invert(90%) sepia(23%) saturate(7495%) hue-rotate(95deg) brightness(102%) contrast(104%);'
    }
  },
  methods: {
    onStart: function () {
      var tmp = this.nivoBola;
      if (tmp[0] == 1)
        this.stopalaColorus = this.greenFilter;
      else if (tmp[0] == 2)
        this.stopalaColorus = this.yellowFilter;
      else if (tmp[0] == 3)
        this.stopalaColorus = this.orangeFilter;
      else if (tmp[0] == 4)
        this.stopalaColorus = this.redFilter;
      else
        this.stopalaColorus = '';


      if (tmp[1] == 1)
        this.skocniZglobColorus = this.greenFilter;
      else if (tmp[1] == 2)
        this.skocniZglobColorus = this.yellowFilter;
      else if (tmp[1] == 3)
        this.skocniZglobColorus = this.orangeFilter;
      else if (tmp[1] == 4)
        this.skocniZglobColorus = this.redFilter;
      else
        this.skocniZglobColorus = '';


      if (tmp[2] == 1)
        this.potkolenicaColorus = this.greenFilter;
      else if (tmp[2] == 2)
        this.potkolenicaColorus = this.yellowFilter;
      else if (tmp[2] == 3)
        this.potkolenicaColorus = this.orangeFilter;
      else if (tmp[2] == 4)
        this.potkolenicaColorus = this.redFilter;
      else
        this.potkolenicaColorus = '';


      if (tmp[3] == 1)
        this.kolenaColorus = this.greenFilter;
      else if (tmp[3] == 2)
        this.kolenaColorus = this.yellowFilter;
      else if (tmp[3] == 3)
        this.kolenaColorus = this.orangeFilter;
      else if (tmp[3] == 4)
        this.kolenaColorus = this.redFilter;
      else
        this.kolenaColorus = '';


      if (tmp[5] == 1)
        this.kukoviColorus = this.greenFilter;
      else if (tmp[5] == 2)
        this.kukoviColorus = this.yellowFilter;
      else if (tmp[5] == 3)
        this.kukoviColorus = this.orangeFilter;
      else if (tmp[5] == 4)
        this.kukoviColorus = this.redFilter;
      else
        this.kukoviColorus = '';


      if (tmp[4] == 1)
        this.prednjaLozaColorus = this.greenFilter;
      else if (tmp[4] == 2)
        this.prednjaLozaColorus = this.yellowFilter;
      else if (tmp[4] == 3)
        this.prednjaLozaColorus = this.orangeFilter;
      else if (tmp[4] == 4)
        this.prednjaLozaColorus = this.redFilter;
      else
        this.prednjaLozaColorus = '';


      if (tmp[6] == 1)
        this.trbuhColorus = this.greenFilter;
      else if (tmp[6] == 2)
        this.trbuhColorus = this.yellowFilter;
      else if (tmp[6] == 3)
        this.trbuhColorus = this.orangeFilter;
      else if (tmp[6] == 4)
        this.trbuhColorus = this.redFilter;
      else
        this.trbuhColorus = '';


      if (tmp[7] == 1)
        this.grudniKosColorus = this.greenFilter;
      else if (tmp[7] == 2)
        this.grudniKosColorus = this.yellowFilter;
      else if (tmp[7] == 3)
        this.grudniKosColorus = this.orangeFilter;
      else if (tmp[7] == 4)
        this.grudniKosColorus = this.redFilter;
      else
        this.grudniKosColorus = '';


      if (tmp[8] == 1)
        this.rameColorus = this.greenFilter;
      else if (tmp[8] == 2)
        this.rameColorus = this.yellowFilter;
      else if (tmp[8] == 3)
        this.rameColorus = this.orangeFilter;
      else if (tmp[8] == 4)
        this.rameColorus = this.redFilter;
      else
        this.rameColorus = '';


      if (tmp[10] == 1)
        this.glavaColorus = this.greenFilter;
      else if (tmp[10] == 2)
        this.glavaColorus = this.yellowFilter;
      else if (tmp[10] == 3)
        this.glavaColorus = this.orangeFilter;
      else if (tmp[10] == 4)
        this.glavaColorus = this.redFilter;
      else
        this.glavaColorus = '';


      if (tmp[9] == 1)
        this.vratColorus = this.greenFilter;
      else if (tmp[9] == 2)
        this.vratColorus = this.yellowFilter;
      else if (tmp[9] == 3)
        this.vratColorus = this.orangeFilter;
      else if (tmp[9] == 4)
        this.vratColorus = this.redFilter;
      else
        this.vratColorus = '';


      if (tmp[11] == 1)
        this.rukeColorus = this.greenFilter;
      else if (tmp[11] == 2)
        this.rukeColorus = this.yellowFilter;
      else if (tmp[11] == 3)
        this.rukeColorus = this.orangeFilter;
      else if (tmp[11] == 4)
        this.rukeColorus = this.redFilter;
      else
        this.rukeColorus = '';




      ImageMap('img[usemap]', 350);
    },
    // localStorage.setItem("nivoBola", this.nivoBola);
    notify: function () {
      this.$q.notify('Running on Quasar v' + this.$q.version)
    },
    submit_osecaj(deo_tela, indeks) {
      console.log("AAAA")
      this.dialogInstance = this.$q.dialog({
        title: deo_tela,
        message: 'Izaberite jednu od opcija:',
        options: {
          type: 'radio',
          model: 'opt1',
          // inline: true
          items: [
            { label: 'Normalno stanje', value: 1, color: 'secondary' },
            { label: 'Upala', value: 2 },
            { label: 'Bol', value: 3 },
            { label: 'Jak bol', value: 4 }
          ]
        },
        // cancel: true,
        // persistent: true,
        ok: 'Potvrdi',
        cancel: 'Zatvori'
      }).onOk(data => {
        if (deo_tela == 'Stopala') {
          if (data == 1)
            this.stopalaColorus = this.greenFilter;
          else if (data == 2)
            this.stopalaColorus = this.yellowFilter;
          else if (data == 3)
            this.stopalaColorus = this.orangeFilter;
          else if (data == 4)
            this.stopalaColorus = this.redFilter;
          else
            this.stopalaColorus = '';
        } else if (deo_tela == 'Skočni zglob') {
          if (data == 1)
            this.skocniZglobColorus = this.greenFilter;
          else if (data == 2)
            this.skocniZglobColorus = this.yellowFilter;
          else if (data == 3)
            this.skocniZglobColorus = this.orangeFilter;
          else if (data == 4)
            this.skocniZglobColorus = this.redFilter;
          else
            this.skocniZglobColorus = '';
        } else if (deo_tela == 'Potkolenice') {
          if (data == 1)
            this.potkolenicaColorus = this.greenFilter;
          else if (data == 2)
            this.potkolenicaColorus = this.yellowFilter;
          else if (data == 3)
            this.potkolenicaColorus = this.orangeFilter;
          else if (data == 4)
            this.potkolenicaColorus = this.redFilter;
          else
            this.potkolenicaColorus = '';
        } else if (deo_tela == 'Kolena') {
          if (data == 1)
            this.kolenaColorus = this.greenFilter;
          else if (data == 2)
            this.kolenaColorus = this.yellowFilter;
          else if (data == 3)
            this.kolenaColorus = this.orangeFilter;
          else if (data == 4)
            this.kolenaColorus = this.redFilter;
          else
            this.kolenaColorus = '';
        } else if (deo_tela == 'Kukovi') {
          if (data == 1)
            this.kukoviColorus = this.greenFilter;
          else if (data == 2)
            this.kukoviColorus = this.yellowFilter;
          else if (data == 3)
            this.kukoviColorus = this.orangeFilter;
          else if (data == 4)
            this.kukoviColorus = this.redFilter;
          else
            this.kukoviColorus = '';
        } else if (deo_tela == 'Prednja loža natkolenice') {
          if (data == 1)
            this.prednjaLozaColorus = this.greenFilter;
          else if (data == 2)
            this.prednjaLozaColorus = this.yellowFilter;
          else if (data == 3)
            this.prednjaLozaColorus = this.orangeFilter;
          else if (data == 4)
            this.prednjaLozaColorus = this.redFilter;
          else
            this.prednjaLozaColorus = '';
        } else if (deo_tela == 'Trbuh') {
          if (data == 1)
            this.trbuhColorus = this.greenFilter;
          else if (data == 2)
            this.trbuhColorus = this.yellowFilter;
          else if (data == 3)
            this.trbuhColorus = this.orangeFilter;
          else if (data == 4)
            this.trbuhColorus = this.redFilter;
          else
            this.trbuhColorus = '';
        } else if (deo_tela == 'Grudni koš') {
          if (data == 1)
            this.grudniKosColorus = this.greenFilter;
          else if (data == 2)
            this.grudniKosColorus = this.yellowFilter;
          else if (data == 3)
            this.grudniKosColorus = this.orangeFilter;
          else if (data == 4)
            this.grudniKosColorus = this.redFilter;
          else
            this.grudniKosColorus = '';
        } else if (deo_tela == 'Rameni pojas') {
          if (data == 1)
            this.rameColorus = this.greenFilter;
          else if (data == 2)
            this.rameColorus = this.yellowFilter;
          else if (data == 3)
            this.rameColorus = this.orangeFilter;
          else if (data == 4)
            this.rameColorus = this.redFilter;
          else
            this.rameColorus = '';
        } else if (deo_tela == 'Glava') {
          if (data == 1)
            this.glavaColorus = this.greenFilter;
          else if (data == 2)
            this.glavaColorus = this.yellowFilter;
          else if (data == 3)
            this.glavaColorus = this.orangeFilter;
          else if (data == 4)
            this.glavaColorus = this.redFilter;
          else
            this.glavaColorus = '';
        } else if (deo_tela == 'Vrat') {
          if (data == 1)
            this.vratColorus = this.greenFilter;
          else if (data == 2)
            this.vratColorus = this.yellowFilter;
          else if (data == 3)
            this.vratColorus = this.orangeFilter;
          else if (data == 4)
            this.vratColorus = this.redFilter;
          else
            this.vratColorus = '';
        } else if (deo_tela == 'Ruke') {
          if (data == 1)
            this.rukeColorus = this.greenFilter;
          else if (data == 2)
            this.rukeColorus = this.yellowFilter;
          else if (data == 3)
            this.rukeColorus = this.orangeFilter;
          else if (data == 4)
            this.rukeColorus = this.redFilter;
          else
            this.rukeColorus = '';
        }
        // console.log('>>>> OK, received', data)
        if (data !== 'opt1') {
          switch (indeks) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
              this.nivoBola[indeks] = data;
              break;
          }
        }
      }).onCancel(() => {
        // console.log(this.nivoBola);
      }).onDismiss(() => {
        // console.log(this.nivoBola);
      });
      this.$emit("menjaj-test", true)
    }
  },
  // beforeUnmount() {
  //   if (this.dialogInstance != null) this.dialogInstance.hide()
  // },
  mounted() {
    console.log(this.inicijalniNivoBola);

    this.onStart();
  },
  watch: {
    globalTest(newValue) {
      // if (newValue == false) {
      //   this.dialogInstance.hide()
      // }
    },
  }
}
</script>
<style scoped>
/* .slika{
    height: inherit;
    widows: inherit;
  } */
</style>
