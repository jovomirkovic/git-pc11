<template>
  <q-page class="q-pa-sm">
    <q-table
      :title="$t('tacticalElements.assessmentOfTacticalElement')"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="ident"
      :grid="mode == 'grid'"
      :filter="filter"
      :pagination.sync="pagination"
      :rows-per-page-label="$t('table.rowsPerPage')"
      :no-data-label="$t('table.noData')"
      :loading-label="$t('table.loadingLabel')"
      :no-results-label="$t('table.noResultLabel')"
      :loading="loadingUtakmice"
      class="mojaTabela my-sticky-header-table"
      style="
            background-color: unset;
            box-shadow: unset;
          "
      table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10"
    >
      <template
        v-if="igrac != $t('tacticalElements.selectPlayer') + ' ->'"
        v-slot:top-right="props"
      >
        <q-btn
          v-if="Object.keys(selektovaniIgrac).length != 0"
          @click="novaOcena()"
          :label="$t('tacticalElements.newScore')"
          class="q-mr-xs dugmeNewNesto"
        />

        <q-input
          outlined
          class="dugmeSearch"
          dense
          debounce="300"
          v-model="filter"
        >
          <!--  :placeholder="$t('table.search')" -->
          <template v-slot:append>
            <q-icon name="search" color="blue-10" />
          </template>
        </q-input>

        <!-- <q-btn
              flat
              round
              dense
              class="plavaKlasaTekst"
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              v-if="mode === 'list'"
            >
              <q-tooltip
                :disable="$q.platform.is.mobile"
                v-close-popup
              >{{props.inFullscreen ? $t('tacticalElements.exitFullscreen') : $t('tacticalElements.enterFullscreen')}}</q-tooltip>
            </q-btn> -->

        <q-btn
          flat
          round
          dense
          class="plavaKlasaTekst"
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="
            mode = mode === 'grid' ? 'list' : 'grid';
            separator = mode === 'grid' ? 'none' : 'horizontal';
          "
          v-if="!props.inFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            mode === "grid"
              ? $t("tacticalElements.list")
              : $t("tacticalElements.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('table.exportToCSV')"
          no-caps
          @click="exportTable"
        />
      </template>

      <template v-slot:header-cell-action="props">
        <q-th style="color: #ffffff00; width: 110px">
          {{ props.col.label }}
        </q-th>
      </template>

      <template v-slot:body-cell="props">
        <q-td :props="props" v-if="props.value == props.row.action">
          <div class="q-gutter-sm">
            <q-btn
              @click="deleteItem(props.row)"
              id="dugmeBrisi"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="delete"
            >
              <q-tooltip>{{ $t("tacticalElements.delete") }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="editItem(props.row)"
              id="dugmeEdit"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="edit"
            >
              <q-tooltip>{{ $t("tacticalElements.changeData") }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>

        <q-td
          :props="props"
          v-else-if="props.value == props.row.vremeOcene"
          @click="otvoriPreviewDialog(props.row)"
        >
          <div class="" id="username">
            {{ props.row.vremeOcene }}
          </div>
        </q-td>

        <q-td :props="props" v-else @click="otvoriPreviewDialog(props.row)">
          <div>
            {{ props.value }}
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog persistent v-model="new_customer">
      <q-card
        style="
              width: 600px;
              max-width: 60vw;
              border-radius: 5px;
              box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7);
              color: #323b62;
            "
      >
        <q-card-section>
          <q-btn
            icon="close"
            @click="close"
            flat
            round
            dense
            style="float: right;"
            v-close-popup
          ></q-btn>
          <div class="text-h6" style="text-align: center;">
            {{ $t("tacticalElements.score") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular ponisti" style="">
                <label class="custom-field one datumInput">
                  <q-input
                    :readonly="readonly"
                    borderless
                    dense
                    placeholder=" "
                    v-model="editedItem.vremeOcene"
                    @focus="popniPlaceholder('Span-IP1')"
                    @input="popniPlaceholder('Span-IP1')"
                    @blur="spustiPlaceholder('Span-IP1', editedItem.vremeOcene)"
                    ref="input1"
                    mask="##/##/####"
                    :rules="[val => valiDate(val) || 'DD/MM/YYYY']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="editedItem.vremeOcene"
                            @input="() => $refs.qDateProxy.hide()"
                            mask="DD/MM/YYYY"
                          ></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <span id="Span-IP1" class="placeholder">{{
                    $t("tacticalElements.date")
                  }}</span>
                </label>
              </q-item>

              <br /><br /><br />
              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="listaGrupa"
                    v-model="editedItem.grupaIdent"
                    emit-value
                    map-options
                    ref="select1"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="
                      popniPlaceholder('Span-SL1');
                      promenaGrupe();
                    "
                    @blur="spustiPlaceholder('Span-SL1', editedItem.grupaIdent)"
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        $t('tacticalElements.pleaseSelectAGroup')
                    ]"
                  />
                  <span
                    @click="$refs.select1.showPopup()"
                    id="Span-SL1"
                    class="placeholder placeholder1"
                    >{{ $t("tacticalElements.group") }}</span
                  >
                </q-item-section>
                <!-- TODO ovde gore neceda radi prevod  -->
              </q-item>
              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="listaStavki"
                    v-model="editedItem.taktikaIdent"
                    emit-value
                    map-options
                    ref="select2"
                    @focus="popniPlaceholder('Span-SL2')"
                    @input="popniPlaceholder('Span-SL2')"
                    @blur="
                      spustiPlaceholder('Span-SL2', editedItem.taktikaIdent)
                    "
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        $t('tacticalElements.pleaseChooseYourTechnique')
                    ]"
                  />
                  <span
                    @click="$refs.select2.showPopup()"
                    id="Span-SL2"
                    class="placeholder placeholder1"
                    >{{ $t("tacticalElements.tactics") }}</span
                  >
                </q-item-section>
              </q-item>
              <!-- <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.taktikaIdent" label="Taktika"></q-input>
                    </q-item-section>
                  </q-item> -->
              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    :disable="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.nivoUsvajanja"
                    option-value="value"
                    option-label="label"
                    use-chips
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select3"
                    @focus="popniPlaceholder('Span-SL3')"
                    @input="popniPlaceholder('Span-SL3')"
                    @blur="
                      spustiPlaceholder('Span-SL3', editedItem.nivoUsvajanja)
                    "
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        $t('tacticalElements.levelOfAdoption')
                    ]"
                  />
                  <span
                    @click="$refs.select3.showPopup()"
                    id="Span-SL3"
                    class="placeholder placeholder1"
                    >{{ $t("tacticalElements.levelOfAdoption") }}</span
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions
          :class="{ sakriDugmice: readonly }"
          align="center"
          class="bg-white text-teal"
        >
          <q-btn
            :label="$t('administration.user.cancel')"
            @click="close"
            type="submit"
            style="background-color: #f5f8fb; color: #323b62; width: 20%; margin: 10px;"
            v-close-popup
          ></q-btn>
          <q-btn
            :label="$t('administration.user.save')"
            @click="addRow"
            type="submit"
            style="background-color: #ff4b00; color: white; width: 20%; margin: 10px;"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dataPreview">
      <q-card
        style="
              width: 600px;
              max-width: 60vw;
              border-radius: 5px;
              box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7);
              color: #323b62;
            "
      >
        <q-card-section>
          <q-btn
            icon="close"
            @click="close"
            flat
            round
            dense
            style="float: right;"
            v-close-popup
          ></q-btn>
          <div class="text-h6" style="text-align: center;">
            {{ $t("tacticalElements.score") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular ponisti" style="">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="editedItem.vremeOcene"
                  :label="$t('tacticalElements.date')"
                  class="datumInputReadOnly"
                  mask="##/##/####"
                />
              </q-item>

              <br /><br /><br />
              <q-item>
                <q-item-section>
                  <q-select
                    readonly
                    borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    :label="$t('tacticalElements.group')"
                    :options="listaGrupa"
                    v-model="editedItem.grupaIdent"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <!-- TODO ovde gore neceda radi prevod  -->
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    readonly
                    borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    :label="$t('tacticalElements.tactics')"
                    :options="listaStavki"
                    v-model="editedItem.taktikaIdent"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
              <!-- <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.taktikaIdent" label="Taktika"></q-input>
                    </q-item-section>
                  </q-item> -->
              <q-item>
                <q-item-section>
                  <q-select
                    readonly
                    borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    v-model="editedItem.nivoUsvajanja"
                    :label="$t('tacticalElements.levelOfAdoption')"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
//import moment from 'moment';
const moment = require("moment");

import { exportFile } from "quasar";
import { date } from "quasar";
let timeStamp = Date.now();

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  props: {
    initial: {
      type: Object,
      default: moment
    }
  },
  computed: {
    // yourYear () {
    //     return moment(this.editedItem.vremeOcene).format('DD-MM-YYYY HH:mm') //.format('YYYY-MM-DDTHH:mm:ss.sssZ') //.format('DD-MM-YYYY HH:mm:ss.mmmZ')
    //   },
    vremeOceneLocal() {
      return date.formatDate(this.editedItem.vremeOcene, "YYYY-MM-DD HH:mm");
      //return moment(this.editedItem.vremeOcene).format('DD-MM-YYYY HH:mm')
    }
  },
  components: {},
  props: ["selektovaniIgrac"],
  data() {
    return {
      readonly: false,
      loadingUtakmice: false,
      listaGrupa: [],
      selektovanaGrupa: null,
      listaStavki: [],
      selektovanaStavka: null,
      igrac: "",
      igracID1: 0,
      timID1: 0,
      date: "",
      filter: "",
      customer: {},
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      editedItem: {
        vremeOcene: "",
        ident: 0,
        grupaIdent: null,
        nazivGrupe: "",
        taktikaIdent: null,
        nazivTaktike: "",
        igracIdent: this.igracID1,
        nivoUsvajanja: 0,
        sekundarnaNogaSlicno: 0,
        selekcijaIdent: 0,
        bazaTaktikeSifrarnikStavkeIdent: null,
        trenerIdent: 0
      },
      defaultItem: {
        vremeOcene: "",
        ident: 0,
        grupaIdent: null,
        nazivGrupe: "",
        taktikaIdent: null,
        nazivTaktike: "",
        igracIdent: this.igracID1,
        nivoUsvajanja: 0,
        sekundarnaNogaSlicno: 0,
        selekcijaIdent: 0,
        bazaTaktikeSifrarnikStavkeIdent: null,
        trenerIdent: 0
      },
      mode: "list",
      listaOd1Do5: [],
      columns: [
        {
          name: "vremeOcene",
          required: true,
          label: this.$t("tacticalElements.date"),
          align: "left",
          field: "vremeOcene",
          sortable: true,
          format: val => date.formatDate(val, "DD/MM/YYYY")
        },
        {
          name: "nazivGrupe",
          align: "left",
          label: this.$t("tacticalElements.group"),
          field: "nazivGrupe",
          sortable: true
        },
        {
          name: "nazivTaktike",
          align: "left",
          label: this.$t("tacticalElements.tactics"),
          field: "nazivTaktike",
          sortable: true
        },
        {
          name: "nivoUsvajanja",
          align: "left",
          label: this.$t("tacticalElements.levelOfAdoption"),
          field: "nivoUsvajanja",
          sortable: true
        },

        {
          name: "action",
          align: "left",
          label: this.$t("tacticalElements.action"),
          field: "action",
          sortable: true
        }
      ],
      data: [],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  watch: {
    selektovaniIgrac: function(val) {
      this.igrac = val.igrac;
      this.igracID1 = val.igracID;
      this.timID1 = val.selektovaniTim.value;

      this.getDataZaID();
      this.getDataGrupe();
      this.getDataElements(); // pokupimo opisne ocene
    },
    selektovanaGrupa: function(val) {
      this.selektovanaStavka = "";
      this.getDataStavke();
    }
  },
  mounted() {
    if (
      this.selektovaniIgrac != undefined &&
      this.selektovaniIgrac.igracID != undefined
    ) {
      this.igrac = this.selektovaniIgrac.igrac;
      this.igracID1 = this.selektovaniIgrac.igracID;
      this.timID1 = this.selektovaniIgrac.selektovaniTim.value;

      this.getDataElements(); // pokupimo opisne ocene
      this.getDataZaID(); //idemo da uzmenmo podatke iz baze
      this.getDataGrupe(); //pokupimo odma i grupe
    }

    this.date = Date.now();
    this.editedItem.vremeOcene = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");

    // change table height
    var temp = document.querySelectorAll(".q-table__middle");
    for (var i = 0; i < temp.length; i++)
      temp[i].style.setProperty("max-height", "calc(100vh - 200px)");
  },
  methods: {
    getDataElements() {
      let self = this;
      let linkStr = this.$apiPutanja + "/element-fudbalske-igre-sifrarnik";
      //debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          debugger;
          console.log("elementi ocene");
          console.log(response.data);
          self.listaOd1Do5 = [];
          response.data.forEach(entry => {
            self.listaOd1Do5.push({
              label: entry.sifra + " - " + entry.naziv,
              value: entry.sifra
            });
          });
          debugger;
          console.log(self.listaOd1Do5);
          self.loadingUtakmice = false;
        })
        .catch(e => {
          //this.errors.push(e);
          this.loadingUtakmice = false;
          console.log("Greska: " + e);
        });
    },
    popniPlaceholder(id) {
      var izabraniPlaceholder = document.getElementById(id);

      izabraniPlaceholder.style.top = "0px";
      izabraniPlaceholder.style.backgroundColor = "white";
      izabraniPlaceholder.style.fontSize = "9pt";
      izabraniPlaceholder.style.width = "unset";
      izabraniPlaceholder.style.padding = "3px";
      izabraniPlaceholder.style.color = "black";
    },
    spustiPlaceholder(id, val) {
      var izabraniPlaceholder = document.getElementById(id);

      if (val === "" || val == null || val.length == 0) {
        izabraniPlaceholder.style.top = "22px";
        izabraniPlaceholder.style.backgroundColor = "unset";
        izabraniPlaceholder.style.fontSize = "unset";
        izabraniPlaceholder.style.padding = "3px";
        izabraniPlaceholder.style.color = "#aaa";
      }
    },
    compare(a, b) {
      return a == date.formatDate(b, "DD-MM-YYYY");
    },
    valiDate(date) {
      let dateformat = /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])/;

      // Matching the date through regular expression
      if (date.match(dateformat)) {
        let operator = date.split("/");

        // Extract the string into month, date and year
        let datepart = [];
        if (operator.length > 1) {
          datepart = date.split("/");
        }
        let day = parseInt(datepart[0]);
        let month = parseInt(datepart[1]);
        let year = parseInt(datepart[2]);

        // Create a list of days of a month
        let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month == 1 || (month > 2 && month < 13)) {
          if (day > ListofDays[month - 1]) {
            //to check if the date is out of range
            console.log("Invalid date");
            return false;
          }
        } else if (month == 2) {
          let leapYear = false;
          if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
          if (leapYear == false && day >= 29) {
            console.log("Invalid date");
            return false;
          } else if (leapYear == true && day > 29) {
            console.log("Invalid date format!");
            return false;
          }
        } else {
          console.log("Invalid date format!");
          return false;
        }
      } else {
        console.log("Invalid date format!");
        return false;
      }
      return true;
    },
    otvoriPreviewDialog(item) {
      console.log(item);
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.vremeOcene =
        this.editedItem.vremeOcene
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.vremeOcene
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.vremeOcene
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.readonly = true;
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje grupa
    //........................................
    getDataGrupe() {
      let linkStr = this.$apiPutanja + "/baza-taktike-sifrarnik-grupa";
      let self = this;
      //debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          debugger;
          this.listaGrupa = response.data.map(this.dajGrupe);
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    dajGrupe(item) {
      return { label: item.grupa, value: item.ident };
    },
    promenaGrupe() {
      this.selektovanaStavka = "";
      this.getDataStavke();
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka stavki
    //........................................
    getDataStavke() {
      let linkStr =
        this.$apiPutanja +
        "/baza-taktike-sifrarnik-stavke?identGrupe=" +
        this.editedItem.grupaIdent;
      debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          this.listaStavki = response.data.map(this.dajStavke);
          console.log(this.data);
          //debugger
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    dajStavke(item) {
      return { label: item.naziv, value: item.ident };
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka
    //........................................
    getDataZaID() {
      let linkStr = this.$apiPutanja + "/ocena-taktike/igrac/" + this.igracID1;
      this.loadingUtakmice = true;
      debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          debugger;
          this.data = response.data;
          this.loadingUtakmice = false;
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          this.loadingUtakmice = false;
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje novog igraca
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/ocena-taktike";
      var self = this;
      var vremeOcene1;
      try {
        vremeOcene1 = this.getDateTime(this.editedItem.vremeOcene);
      } catch (error) {}

      var dataString = {
        //"vremeOcene": vremeOcene1,
        igracIdent: this.igracID1,
        nivoUsvajanja: this.editedItem.nivoUsvajanja,
        selekcijaIdent: this.timID1,
        bazaTaktikeSifrarnikStavkeIdent: this.editedItem.taktikaIdent,
        trenerIdent: window.$userID,
        vremeOcene: vremeOcene1
      };
      debugger;
      let data1 = JSON.stringify(dataString);

      debugger;
      this.$axios
        .post(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function(response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("tacticalElements.newScoreSuccessfullyAdded"),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena merenja
    //........................................
    putData() {
      debugger;
      let linkStr =
        this.$apiPutanja + "/ocena-taktike/" + this.editedItem.ident;
      var self = this;
      var vremeOcene1;
      try {
        vremeOcene1 = this.getDateTime(this.editedItem.vremeOcene);
      } catch (error) {}

      var dataString = {
        igracIdent: this.igracID1,
        nivoUsvajanja: this.editedItem.nivoUsvajanja,
        selekcijaIdent: this.timID1,
        bazaTaktikeSifrarnikStavkeIdent: this.editedItem.taktikaIdent,
        trenerIdent: window.$userID,
        vremeOcene: vremeOcene1
      };

      let data1 = JSON.stringify(dataString);

      debugger;
      this.$axios
        .put(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function(response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("tacticalElements.scoreDataSuccessfullyChanged"),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje/deaktiviranje igraca
    //........................................
    deleteData(item) {
      let linkStr = this.$apiPutanja + "/ocena-taktike/" + item.ident;
      var self = this;
      this.$axios
        .delete(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function(response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("tacticalElements.scoreDataDeletedSuccessfully"),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // pomocna f-ja za formatiranje datuma
    //........................................
    getDateTime(a) {
      if (isNaN(a))
        var timeStamp = new Date(
          a.split("/")[2],
          parseInt(a.split("/")[1]) - 1,
          a.split("/")[0],
          3,
          0,
          0
        );
      else var timeStamp = new Date(a);
      const vrati = timeStamp.toISOString();
      return vrati;
    },
    addRow() {
      let sveOK = true;

      if (
        this.editedItem.grupaIdent == null ||
        this.editedItem.grupaIdent == ""
      )
        sveOK = false;
      if (
        this.editedItem.taktikaIdent == null ||
        this.editedItem.taktikaIdent == ""
      )
        sveOK = false;
      if (
        this.editedItem.nivoUsvajanja == null ||
        this.editedItem.nivoUsvajanja === ""
      )
        sveOK = false;
      //if(this.editedItem.sekundarnaNogaSlicno == null || this.editedItem.sekundarnaNogaSlicno == '')  sveOK = false

      if (sveOK == false) {
        this.$q.notify({
          message: this.$t("tacticalElements.dataNotSaved"),
          color: "red"
        });
        this.zacrveniPrazne();
      } else {
        if (this.editedIndex > -1) {
          Object.assign(this.data[this.editedIndex], this.editedItem);
          this.putData();
        } else {
          this.postData();
        }
        this.close();
      }
    },
    zacrveniPrazne() {
      debugger;
      let self = this;
      var i = 0;
      var sviInputi = document.getElementById("Span-IP" + i);

      while (!(i > 1 && sviInputi == null)) {
        if (sviInputi != null && this.$refs["input" + i] != undefined) {
          this.$refs["input" + i].validate();
        }

        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0;
      var sviSelektovi = document.getElementById("Span-SL" + i);
      while (!(i > 1 && sviSelektovi == null)) {
        debugger;
        if (sviSelektovi != null && this.$refs["select" + i] != undefined) {
          this.$refs["select" + i].validate();
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    deleteItem(item) {
      var self = this;
      const index = this.data.indexOf(item);
      let obj = {
        title: self.$t("tacticalElements.warning"),
        message: self.$t("tacticalElements.areYouSureDelete"),
        customCloseBtnText: self.$t("tacticalElements.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("tacticalElements.yes"),
        onConfirm: onConfirmWrapper,
        type: "warning",
        showXclose: true
      };
      this.$Simplert.open(obj);
      function onConfirmWrapper() {
        self.data.splice(index, 1);
        debugger;
        self.deleteData(item);
      }
    },
    novaOcena() {
      this.editedItem.vremeOcene = this.getDateTime(Date.now());
      this.editedItem.vremeOcene =
        this.editedItem.vremeOcene
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.vremeOcene
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.vremeOcene
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    editItem(item) {
      debugger;
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      //this.editedItem.vremeOcene = item.vremeOcene.this.$moment('en-US', 'America/Los_Angeles', 'LLLL ss')
      this.editedItem.vremeOcene =
        this.editedItem.vremeOcene
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.vremeOcene
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.vremeOcene
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.new_customer = true;
      this.readonly = false;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
      this.promenaGrupe();
    },
    close() {
      this.new_customer = false;
      this.readonly = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    podigniPopunjenePlaceholdere() {
      var i = 0;
      var sviInputi = document.getElementById("Span-IP" + i);
      while (!(i > 1 && sviInputi == null)) {
        if (sviInputi != null) {
          var val = sviInputi.parentElement.children[0].getElementsByTagName(
            "input"
          )[0].value;

          if (val != "" && val != null) this.popniPlaceholder("Span-IP" + i);
        }

        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0;
      var sviSelektovi = document.getElementById("Span-SL" + i);
      while (!(i > 1 && sviSelektovi == null)) {
        if (sviSelektovi != null) {
          var val = sviSelektovi.parentElement.children[0].innerText.split("\n")
            .length;

          if (val > 1) this.popniPlaceholder("Span-SL" + i);
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("ocenaTaktike.csv", content, "text/csv");
      let self = this;
      if (status !== true) {
        this.$q.notify({
          message: self.$t("tacticalElements.browserForbids"),
          color: "negative",
          icon: "warning"
        });
      }
    }
  }
};
</script>

<style scoped>
.custom-file-input {
  color: transparent;
}
.custom-file-input::-webkit-file-upload-button {
  visibility: hidden;
}
.custom-file-input::before {
  width: 98%;
  content: "Izaberi fotografiju";
  color: #0000008f;
  display: inline-block;
  /* background: linear-gradient(top, #f9f9f9, #e3e3e3); */
  border: 1px solid #c2c2c2;
  border-radius: 3px;
  padding: 8px 10px;
  outline: none;
  white-space: nowrap;
  cursor: pointer;
  text-shadow: 1px 1px #fff;
  font-weight: 400;
  font-size: 11pt;
}
.custom-file-input:hover::before {
  border-color: black;
}
/*.custom-file-input:active::before {
   background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
}*/

tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}
.sakriDugmice {
  display: none;
}
</style>
