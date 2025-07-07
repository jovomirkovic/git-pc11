<template>
  <div>
    <q-card-section class="row items-center q-pb-none" style="background-color: white;">
      <q-space></q-space>
      <q-btn icon="close" flat round dense v-close-popup></q-btn>
    </q-card-section>
    <img :style="listoviColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/nazad/brojevi/nazad-13.png">
    <img :style="zadnjaLozaColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/nazad/brojevi/nazad-14.png">
    <img :style="gluteusColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/nazad/brojevi/nazad-15.png">
    <img :style="donjaLedjaColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/nazad/brojevi/nazad-16.png">
    <img :style="gornjaLedjaColorus" style="max-height: 70vh; position:absolute; z-index: 0"
      src="../images/nazad/brojevi/nazad-17.png">
    <img style="background-color: white; max-height: 70vh; position:absolute; z-index: -2"
      src="../images/nazad/nazad__0007_Layer-0.png">
    <img :style="listoviColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/nazad/nazad__0000_list_levi.png">
    <img :style="listoviColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/nazad/nazad__0001_list_desni.png">
    <img :style="zadnjaLozaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/nazad/nazad__0002_zadnja_loza_desno.png">
    <img :style="zadnjaLozaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/nazad/nazad__0003_zadnja_loza_levo.png">
    <img :style="gluteusColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/nazad/nazad__0004_gluteus.png">
    <img :style="donjaLedjaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/nazad/nazad__0005_donja_ledja.png">
    <img :style="gornjaLedjaColorus" style=" max-height: 70vh; position:absolute; z-index: -1"
      src="../images/nazad/nazad__0006_gornja_ledja.png">

    <img style=" max-height: 70vh;background-color: white; opacity: 0;" src="../images/telo-nazad.png"
      usemap="#image_map_1">
    <map name="image_map_1">
      <area @click="submit_osecaj('Gornja leđa', 16)" alt="broj 17" title="broj 17"
        coords="113,182,90,163,62,157,47,173,52,193,74,209" shape="poly">
      <area @click="submit_osecaj('Donja leđa', 15)" alt="broj 16" title="broj 16"
        coords="171,239,202,215,220,216,231,231,232,253,210,267" shape="poly">
      <area @click="submit_osecaj('Gluteus', 14)" alt="broj 15" title="broj 15"
        coords="101,319,68,296,46,302,36,318,47,341,70,341" shape="poly">
      <area @click="submit_osecaj('Zadnja loža natkolenice', 13)" alt="broj 14" title="broj 14"
        coords="188,410,222,386,244,393,250,413,240,431,220,434" shape="poly">
      <area @click="submit_osecaj('Listovi', 12)" alt="broj 13" title="broj 13"
        coords="97,515,66,492,43,496,38,515,43,531,61,539,96,515" shape="poly">
      <area alt="Gluteus" title="Gluteus" @click="submit_osecaj('Gluteus', 14)"
        coords="91,265,101,268,109,270,117,271,128,273,140,273,150,272,163,269,171,267,185,264,188,279,189,284,189,294,189,304,192,312,193,322,194,339,187,342,179,346,169,350,158,352,149,352,141,350,139,348,135,352,126,351,118,351,106,351,93,349,86,347,78,343,79,329,81,316,82,306,84,295,88,283,89,274"
        shape="poly">
      <area alt="Listovi" title="Listovi" @click="submit_osecaj('Listovi', 12)"
        coords="98,459,114,459,127,459,133,457,131,464,133,474,135,484,138,498,139,507,137,526,137,541,136,554,135,567,136,573,137,581,116,581,113,564,109,546,105,530,102,520,99,509,99,498,99,490,99,476,99,466"
        shape="poly">
      <area alt="Listovi" title="Listovi" @click="submit_osecaj('Listovi', 12)"
        coords="145,460,158,461,165,459,173,458,179,456,180,466,180,478,183,489,183,502,181,512,178,525,173,541,170,552,168,562,165,574,165,585,159,585,153,585,142,583,144,576,145,565,146,555,146,541,145,529,144,521,144,512,143,501,145,491,146,483,147,473,146,466"
        shape="poly">
      <area alt="Zadnja loža natkolenice" title="Zadnja loža natkolenice"
        @click="submit_osecaj('Zadnja loža natkolenice', 13)"
        coords="78,344,86,347,100,350,110,350,120,351,130,351,137,348,143,351,154,352,165,350,175,348,183,344,194,339,193,353,192,367,188,388,184,405,182,420,181,435,179,454,171,459,163,460,151,459,145,460,143,447,141,430,141,417,141,404,140,395,140,386,138,376,135,392,135,400,134,413,135,424,134,438,133,455,128,458,120,460,104,459,98,459,97,444,94,432,91,421,86,407,83,395,81,381,79,370,78,357"
        shape="poly">
      <area alt="Donja leđa" title="Donja leđa" @click="submit_osecaj('Donja leđa', 15)"
        coords="88,222,97,222,113,225,136,225,156,225,168,224,182,221,182,231,183,238,184,247,185,255,186,264,178,267,166,270,149,272,137,273,124,272,111,270,101,268,91,265,91,256,91,249,93,243,92,235,90,227"
        shape="poly">
      <area alt="Gornja leđa" title="Gornja leđa" @click="submit_osecaj('Gornja leđa', 16)"
        coords="182,222,183,214,187,208,187,196,186,186,185,169,183,157,178,148,170,136,160,134,147,133,136,131,126,131,117,131,109,132,98,136,94,143,89,153,85,162,83,172,83,178,84,188,84,197,85,207,86,214,88,221,97,222,109,225,120,225,132,225,145,226,156,226,166,225,177,223,182,222"
        shape="poly">
    </map>
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
      gluteusColorus: '',
      listoviColorus: '',
      donjaLedjaColorus: '',
      gornjaLedjaColorus: '',
      zadnjaLozaColorus: '',
      redFilter: 'filter: invert(14%) sepia(54%) saturate(7446%) hue-rotate(357deg) brightness(104%) contrast(115%);',
      orangeFilter: 'filter: invert(74%) sepia(32%) saturate(2706%) hue-rotate(346deg) brightness(98%) contrast(106%);',
      yellowFilter: 'filter: invert(92%) sepia(97%) saturate(3359%) hue-rotate(356deg) brightness(100%) contrast(108%);',
      greenFilter: 'filter: invert(90%) sepia(23%) saturate(7495%) hue-rotate(95deg) brightness(102%) contrast(104%);'
    }
  },
  methods: {
    onStart: function () {
      var tmp = this.nivoBola;


      if (tmp[14] == 1)
        this.gluteusColorus = this.greenFilter;
      else if (tmp[14] == 2)
        this.gluteusColorus = this.yellowFilter;
      else if (tmp[14] == 3)
        this.gluteusColorus = this.orangeFilter;
      else if (tmp[14] == 4)
        this.gluteusColorus = this.redFilter;
      else
        this.gluteusColorus = '';


      if (tmp[12] == 1)
        this.listoviColorus = this.greenFilter;
      else if (tmp[12] == 2)
        this.listoviColorus = this.yellowFilter;
      else if (tmp[12] == 3)
        this.listoviColorus = this.orangeFilter;
      else if (tmp[12] == 4)
        this.listoviColorus = this.redFilter;
      else
        this.listoviColorus = '';


      if (tmp[13] == 1)
        this.zadnjaLozaColorus = this.greenFilter;
      else if (tmp[13] == 2)
        this.zadnjaLozaColorus = this.yellowFilter;
      else if (tmp[13] == 3)
        this.zadnjaLozaColorus = this.orangeFilter;
      else if (tmp[13] == 4)
        this.zadnjaLozaColorus = this.redFilter;
      else
        this.zadnjaLozaColorus = '';


      if (tmp[15] == 1)
        this.donjaLedjaColorus = this.greenFilter;
      else if (tmp[15] == 2)
        this.donjaLedjaColorus = this.yellowFilter;
      else if (tmp[15] == 3)
        this.donjaLedjaColorus = this.orangeFilter;
      else if (tmp[15] == 4)
        this.donjaLedjaColorus = this.redFilter;
      else
        this.donjaLedjaColorus = '';


      if (tmp[16] == 1)
        this.gornjaLedjaColorus = this.greenFilter;
      else if (tmp[16] == 2)
        this.gornjaLedjaColorus = this.yellowFilter;
      else if (tmp[16] == 3)
        this.gornjaLedjaColorus = this.orangeFilter;
      else if (tmp[16] == 4)
        this.gornjaLedjaColorus = this.redFilter;
      else
        this.gornjaLedjaColorus = '';
    },
    slika: function () {
      ImageMap('img[usemap]', 0);
    },
    submit_osecaj(deo_tela, indeks) {
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
        if (deo_tela == 'Gluteus') {
          if (data == 1)
            this.gluteusColorus = this.greenFilter;
          else if (data == 2)
            this.gluteusColorus = this.yellowFilter;
          else if (data == 3)
            this.gluteusColorus = this.orangeFilter;
          else if (data == 4)
            this.gluteusColorus = this.redFilter;
          else
            this.gluteusColorus = '';
        } else if (deo_tela == 'Listovi') {
          if (data == 1)
            this.listoviColorus = this.greenFilter;
          else if (data == 2)
            this.listoviColorus = this.yellowFilter;
          else if (data == 3)
            this.listoviColorus = this.orangeFilter;
          else if (data == 4)
            this.listoviColorus = this.redFilter;
          else
            this.listoviColorus = '';
        } else if (deo_tela == 'Zadnja loža natkolenice') {
          if (data == 1)
            this.zadnjaLozaColorus = this.greenFilter;
          else if (data == 2)
            this.zadnjaLozaColorus = this.yellowFilter;
          else if (data == 3)
            this.zadnjaLozaColorus = this.orangeFilter;
          else if (data == 4)
            this.zadnjaLozaColorus = this.redFilter;
          else
            this.zadnjaLozaColorus = '';
        } else if (deo_tela == 'Donja leđa') {
          if (data == 1)
            this.donjaLedjaColorus = this.greenFilter;
          else if (data == 2)
            this.donjaLedjaColorus = this.yellowFilter;
          else if (data == 3)
            this.donjaLedjaColorus = this.orangeFilter;
          else if (data == 4)
            this.donjaLedjaColorus = this.redFilter;
          else
            this.donjaLedjaColorus = '';
        } else if (deo_tela == 'Gornja leđa') {
          if (data == 1)
            this.gornjaLedjaColorus = this.greenFilter;
          else if (data == 2)
            this.gornjaLedjaColorus = this.yellowFilter;
          else if (data == 3)
            this.gornjaLedjaColorus = this.orangeFilter;
          else if (data == 4)
            this.gornjaLedjaColorus = this.redFilter;
          else
            this.gornjaLedjaColorus = '';
        }
        if (data !== 'opt1') {
          switch (indeks) {
            case 9:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
              this.nivoBola[indeks] = data;
              break;
          }
        }
      }).onCancel(() => {
        // console.log(this.nivoBola);
      }).onDismiss(() => {
        // console.log(this.nivoBola);
      });

      console.log("this.dialogInstance")
      console.log(this.dialogInstance)

      this.$emit("menjaj-test", true)
    }
  },
  // beforeUnmount() {
  //   if (this.dialogInstance != null) this.dialogInstance.hide()
  // },
  mounted() {
    console.log(this.inicijalniNivoBola);
    this.slika();
    console.log("f-ja slika je pokrenuta");
    this.onStart();
  },
  watch: {
    globalTest(newValue) {
      // if (newValue == false) {
      //   console.log("this.dialogInstance")
      //   console.log(this.dialogInstance)
      //   this.dialogInstance.hide()
      // }
    },
  }
}
</script>
