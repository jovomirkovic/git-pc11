<template>
  <q-page class="q-pa-sm">
    <!-- <div class="row">
            <h5> Izabrani igrač: {{this.igrac}}</h5>
            <q-btn style="padding:22px;margin:10px;color:red" flat round icon="people" @click="izborIgraca()" >
              <q-tooltip>Izbor igrača</q-tooltip>
            </q-btn>
        </div> -->
    <q-table
      :title="$t('administration.testData.datatest')"
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
      <template v-slot:top-right="props">
        <q-btn
          @click="otvordeDialog()"
          :label="$t('administration.testData.newTest')"
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
              >{{props.inFullscreen ? $t('table.exitFullScreen') : $t('table.fullScreen')}}</q-tooltip>
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
            mode === "grid" ? $t("table.list") : $t("table.grid")
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
              <q-tooltip>{{ $t("table.delete") }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="editItem(props.row)"
              id="dugmeEdit"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="edit"
            >
              <q-tooltip>{{ $t("table.editData") }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>

        <q-td
          :props="props"
          v-else-if="props.value == props.row.datumVreme"
          @click="otvoriPreviewDialog(props.row)"
        >
          <div class="" id="username">
            {{ props.row.datumVreme }}
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
            {{ $t("administration.testData.tests") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular ponisti" style="width: 55%; ">
                <label class="custom-field one datumInput">
                  <q-input
                    :readonly="readonly"
                    borderless
                    dense
                    v-model="editedItem.datumVreme"
                    ref="inpput0"
                    input-style="width: 240px"
                    @focus="popniPlaceholder('Span-IP0')"
                    @input="popniPlaceholder('Span-IP0')"
                    @blur="spustiPlaceholder('Span-IP0', editedItem.datumVreme)"
                    mask="##/##/####"
                    :rules="[val => valiDate(val) || 'DD/MM/YYYY HH:mm']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy1"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            :readonly="readonly"
                            mask="DD/MM/YYYY"
                            v-model="editedItem.datumVreme"
                            @input="() => $refs.qDateProxy1.hide()"
                          ></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <span id="Span-IP0" class="placeholder">{{
                    $t("administration.professionalStaff.contractExpiration")
                  }}</span>
                </label>
              </q-item>
              <q-item style="width: 45%; display: inline-block;">
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="listaKategorija"
                    v-model="editedItem.kategorijaTesta"
                    emit-value
                    map-options
                    ref="select1"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="
                      spustiPlaceholder('Span-SL1', editedItem.kategorijaTesta)
                    "
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        $t('administration.testData.datatest')
                    ]"
                  />
                  <span
                    @click="$refs.select1.showPopup()"
                    id="Span-SL1"
                    class="placeholder placeholder1"
                    >{{ $t("administration.testData.categTest") }}</span
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="listaVrednosti"
                    v-model="editedItem.vrednostKojaSeUtvrdjuje"
                    emit-value
                    map-options
                    ref="select2"
                    @focus="popniPlaceholder('Span-SL2')"
                    @input="popniPlaceholder('Span-SL2')"
                    @blur="
                      spustiPlaceholder(
                        'Span-SL2',
                        editedItem.vrednostKojaSeUtvrdjuje
                      )
                    "
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        $t('administration.testData.testValuePick')
                    ]"
                  />
                  <span
                    @click="$refs.select2.showPopup()"
                    id="Span-SL2"
                    class="placeholder placeholder1"
                    >{{ $t("administration.testData.testValue") }}</span
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label>
                    {{ $t("administration.testData.desc") }}
                  </label>
                  <q-editor
                    :readonly="readonly"
                    v-model="editedItem.opis"
                    :label="$t('administration.testData.desc')"
                    min-height="5rem"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label>
                    {{ $t("administration.testData.protocol") }}
                  </label>
                  <q-editor
                    :readonly="readonly"
                    v-model="editedItem.protokol"
                    :label="$t('administration.testData.protocol')"
                    min-height="5rem"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.instrument" :label="$t('administration.testData.instrument')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.instrument"
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')"
                      @blur="
                        spustiPlaceholder('Span-IP1', editedItem.instrument)
                      "
                    />
                    <span id="Span-IP1" class="placeholder">{{
                      $t("administration.testData.instrument")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.operater" :label="$t('administration.testData.operator')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.operater"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="spustiPlaceholder('Span-IP2', editedItem.operater)"
                    />
                    <span id="Span-IP2" class="placeholder">{{
                      $t("administration.testData.operator")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.institucija" :label="$t('administration.testData.institution')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.institucija"
                      @focus="popniPlaceholder('Span-IP3')"
                      @input="popniPlaceholder('Span-IP3')"
                      @blur="
                        spustiPlaceholder('Span-IP3', editedItem.institucija)
                      "
                    />
                    <span id="Span-IP3" class="placeholder">{{
                      $t("administration.testData.institution")
                    }}</span>
                  </label>
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
            {{ $t("administration.testData.tests") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular ponisti" style="">
                <label class="custom-field one">
                  <input
                    readonly
                    type="text"
                    placeholder=" "
                    v-model="editedItem.datumVreme"
                    :label="$t('administration.testData.date')"
                  />
                  <span class="placeholder">{{
                    $t("administration.professionalStaff.contractExpiration")
                  }}</span>
                </label>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-select
                    readonly
                    borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    :label="$t('administration.testData.categTest')"
                    :options="listaKategorija"
                    v-model="editedItem.kategorijaTesta"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    readonly
                    borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    :label="$t('administration.testData.testValue')"
                    :options="listaVrednosti"
                    v-model="editedItem.vrednostKojaSeUtvrdjuje"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-card-section
                    style="border: 0.5px solid #323b62; border-radius: 5px;"
                    v-html="editedItem.opis"
                  />
                </q-item-section>
                <label
                  style="background-color: #ffffff; color: #323b62; margin-left: 12px !important; position: absolute; top: 0px; padding: 0px 5px"
                >
                  {{ $t("administration.testData.desc") }}
                </label>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-card-section
                    style="border: 0.5px solid #323b62; border-radius: 5px;"
                    v-html="editedItem.protokol"
                  />
                </q-item-section>
                <label
                  style="background-color: #ffffff; color: #323b62; margin-left: 12px !important; position: absolute; top: 0px; padding: 0px 5px"
                >
                  {{ $t("administration.testData.protocol") }}
                </label>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.instrument"
                      :label="$t('administration.testData.instrument')"
                    />
                    <span class="placeholder">{{
                      $t("administration.testData.instrument")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.operater"
                      :label="$t('administration.testData.operator')"
                    />
                    <span class="placeholder">{{
                      $t("administration.testData.operator")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.institucija"
                      :label="$t('administration.testData.institution')"
                    />
                    <span class="placeholder">{{
                      $t("administration.testData.institution")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog persistent v-model="dialog_za_promenu_igraca">
      <promenaIgraca @update-snimi="prenesiOvde"></promenaIgraca>
    </q-dialog>
  </q-page>
</template>

<script>
import { exportFile } from "quasar";
import { date } from "quasar";
import promenaIgraca from "../../components/promenaIgracaKomponenta";

let timeStamp = Date.now();

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  components: {
    promenaIgraca
  },
  data() {
    return {
      readonly: false,
      loadingUtakmice: false,
      dialog_za_promenu_igraca: false,
      igrac: "",
      date: "",
      filter: "",
      customer: {},
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      listaKategorija: [
        {
          label: this.$t("administration.testData.motorika"),
          value: "motorika"
        },
        {
          label: this.$t("administration.testData.funkcionalni"),
          value: "funkcionalni"
        },
        {
          label: this.$t("administration.testData.psiholoski"),
          value: "psihološki"
        }
      ],
      listaVrednosti: [
        {
          label: this.$t("administration.testData.pojedinacna"),
          value: "pojedinačna"
        },
        {
          label: this.$t("administration.testData.baterija"),
          value: "baterija"
        }
      ],
      editedItem: {
        datumVreme: "",
        ident: 0,
        identKorisnik: 0,
        korisnikImePrezime: "",
        userIdent: null, //this.igracID1,
        institucija: "",
        instrument: "",
        kategorijaTesta: "",
        operater: "",
        opis: "",
        protokol: "",
        vrednostKojaSeUtvrdjuje: "",
        sifraTesta: ""
      },
      defaultItem: {
        datumVreme: "",
        ident: 0,
        identKorisnik: 0,
        korisnikImePrezime: "",
        userIdent: null, // this.igracID1,
        institucija: "",
        instrument: "",
        kategorijaTesta: "",
        operater: "",
        opis: "",
        protokol: "",
        vrednostKojaSeUtvrdjuje: "",
        sifraTesta: ""
      },
      mode: "list",
      columns: [
        {
          name: "datumVreme",
          required: true,
          label: this.$t("administration.testData.date"),
          align: "left",
          field: "datumVreme",
          sortable: true,
          format: val => date.formatDate(val, "DD/MM/YYYY")
        },
        {
          name: "kategorijaTesta",
          align: "left",
          label: this.$t("administration.testData.categTest"),
          field: "kategorijaTesta",
          sortable: true
        },
        {
          name: "vrednostKojaSeUtvrdjuje",
          align: "left",
          label: this.$t("administration.testData.value"),
          field: "vrednostKojaSeUtvrdjuje",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t("table.action"),
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
  mounted() {
    //this.igrac = window.$igracName;
    //this.igracID1 = window.$igracID;
    //this.editedItem.datumVreme = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    debugger;
    this.getDataZaID(); //idemo da uzmenmo podatke iz baze
  },
  methods: {
    valiDate(date) {
      let dateformat = /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])/;

      date = date.split(" ")[0];
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
    otvoriPreviewDialog(item) {
      console.log(item);
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // this.editedItem.datumVreme = this.editedItem.datumVreme.slice(0,10).replace(/-/g,'/').split("/")[2] + "/" + this.editedItem.datumVreme.slice(0,10).replace(/-/g,'/').split("/")[1] + "/" + this.editedItem.datumVreme.slice(0,10).replace(/-/g,'/').split("/")[0]
      this.editedItem.datumVreme = date.formatDate(
        this.editedItem.datumRodjenja,
        "DD/MM/YYYY"
      );

      this.readonly = true;
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje igraca
    //........................................
    getDataZaID() {
      let linkStr =
        this.$apiPutanja +
        "/podaci-o-testiranju-igraca/igrac/" +
        window.$userID;
      this.loadingUtakmice = true;
      //debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
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
      let linkStr = this.$apiPutanja + "/podaci-o-testiranju-igraca";
      var self = this;
      var datumVreme1;
      try {
        datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      } catch (error) {}

      var dataString = {
        datumVreme: datumVreme1,
        ident: 0,
        identKorisnik: null, // ide ulogovani korisnik, iz bekenda! za sad... this.editedItem.identKorisnik,
        korisnikImePrezime: "", // this.editedItem.korisnikImePrezime,
        userIdent: window.$userID, //igracID1,
        institucija: this.editedItem.institucija,
        instrument: this.editedItem.instrument,
        kategorijaTesta: this.editedItem.kategorijaTesta,
        operater: this.editedItem.operater,
        opis: this.editedItem.opis,
        protokol: this.editedItem.protokol,
        vrednostKojaSeUtvrdjuje: this.editedItem.vrednostKojaSeUtvrdjuje
      };

      let data1 = JSON.stringify(dataString);

      debugger;
      this.$axios
        .post(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(function(response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("administration.testData.msgPositive"),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena merenja
    //........................................
    putData() {
      debugger;
      let linkStr =
        this.$apiPutanja +
        "/podaci-o-testiranju-igraca/" +
        this.editedItem.ident;
      var self = this;
      var datumVreme1;
      try {
        datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      } catch (error) {}

      var dataString = {
        datumVreme: datumVreme1,
        ident: 0,
        identKorisnik: null, // ide ulogovani korisnik, iz bekenda! za sad... this.editedItem.identKorisnik,
        korisnikImePrezime: "", // this.editedItem.korisnikImePrezime,
        userIdent: window.$userID, // this.igracID1,
        institucija: this.editedItem.institucija,
        instrument: this.editedItem.instrument,
        kategorijaTesta: this.editedItem.kategorijaTesta,
        operater: this.editedItem.operater,
        opis: this.editedItem.opis,
        protokol: this.editedItem.protokol,
        vrednostKojaSeUtvrdjuje: this.editedItem.vrednostKojaSeUtvrdjuje
      };

      let data1 = JSON.stringify(dataString);

      debugger;
      this.$axios
        .put(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(function(response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("administration.testData.msgChange"),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje/deaktiviranje igraca
    //........................................
    deleteData(item) {
      let linkStr =
        this.$apiPutanja + "/podaci-o-testiranju-igraca/" + item.ident;
      var self = this;
      this.$axios
        .delete(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(function(response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("administration.testData.msgDel"),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    prenesiOvde(jen, dva) {
      debugger;
      this.igrac = jen;
      this.igracID1 = dva;
      debugger;
      this.getDataZaID(); //idemo da uzmenmo podatke iz baze
    },
    izborIgraca() {
      this.dialog_za_promenu_igraca = true;
    },
    //''''''''''''''''''''''''''''''''''''''''
    // pomocna f-ja za formatiranje datuma
    //........................................
    getDateTime1(a) {
      const aa = new Date(a);
      return aa.toISOString();
    },
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
      debugger;
      let sveOK = true;

      if (
        this.editedItem.kategorijaTesta == null ||
        this.editedItem.kategorijaTesta == ""
      )
        sveOK = false;
      if (
        this.editedItem.vrednostKojaSeUtvrdjuje == null ||
        this.editedItem.vrednostKojaSeUtvrdjuje == ""
      )
        sveOK = false;

      if (sveOK == false) {
        this.$q.notify({
          icon: "warning",
          message: this.$t("administration.testData.notSaved"),
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
      const index = this.data.indexOf(item);
      let obj = {
        title: this.$t("administration.testData.war"),
        message: this.$t("administration.testData.msgDelConf"),
        customCloseBtnText: this.$t("administration.testData.txtNo"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: this.$t("administration.testData.txtYes"),
        onConfirm: onConfirmWrapper,
        type: "warning",
        showXclose: true
      };
      this.$Simplert.open(obj);
      var self = this;
      function onConfirmWrapper() {
        self.data.splice(index, 1);
        debugger;
        self.deleteData(item);
      }
    },
    otvordeDialog() {
      this.editedItem.datumVreme = this.getDateTime(Date.now());
      this.editedItem.datumVreme =
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.datumVreme
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
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.datumVreme =
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.new_customer = true;
      this.readonly = false;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
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

      const status = exportFile("podaciOTestovima.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: this.$t("administration.testData.msgPrtSc"),
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
.datumKlasa {
  height: 40px;
  padding: 0px;
}
tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}
.sakriDugmice {
  display: none;
}
</style>
