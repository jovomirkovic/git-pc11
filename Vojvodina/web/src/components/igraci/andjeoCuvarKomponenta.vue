<template>
  <q-page class="q-pa-sm">
    <!-- <div class="row"
          style="
            position: absolute;
            top: -90px;
            z-index: 5000;
            margin: 0 30%;"
            >
            <h5> {{$t('players.guardianAngel.selectedPlayer')}}: {{this.igrac}}</h5>
            <q-btn style="padding:22px;margin:10px;color:red" flat round icon="people" @click="izborIgraca()" >
              <q-tooltip>{{$t('players.guardianAngel.browsePlayers')}}</q-tooltip>
            </q-btn>
        </div> -->
    <q-table
      :title="$t('players.guardianAngel.playerTracking')"
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
      class="mojaTabela my-sticky-header-table"
      :loading="loadingUtakmice"
      style="
            background-color: unset;
            box-shadow: unset;
          "
      table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10"
    >
      <template
        v-if="igr != $t('players.guardianAngel.selectPlayer') + ' ->'"
        v-slot:top-right="props"
      >
        <q-btn
          v-if="Object.keys(selektovaniIgrac).length != 0"
          @click="otvordeDialog()"
          :label="$t('players.guardianAngel.newRecord')"
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
              >{{props.inFullscreen ? $t('players.guardianAngel.exitFullscreen') : $t('players.guardianAngel.enterFullscreen')}}</q-tooltip>
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
              ? $t("players.guardianAngel.list")
              : $t("players.guardianAngel.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('players.guardianAngel.exportCSV')"
          no-caps
          @click="exportTable"
        />
      </template>

      <template v-slot:header-cell-action="props">
        <q-th style="color: #ffffff00; width: 110px;">
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
              <q-tooltip>{{ $t("players.guardianAngel.delete") }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="editItem(props.row)"
              id="dugmeEdit"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="edit"
            >
              <q-tooltip>{{
                $t("players.guardianAngel.changeData")
              }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>

        <q-td
          :props="props"
          v-else-if="props.value == props.row.pracenjeOd"
          @click="otvoriPreviewDialog(props.row)"
        >
          <div class="" id="username">
            {{ props.value }}
          </div>
        </q-td>

        <q-td :props="props" v-else @click="otvoriPreviewDialog(props.row)">
          <div>
            {{ props.value }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-dobarIgrac="props">
        <q-td :props="props">{{ props.row }}</q-td>
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
            {{ $t("players.guardianAngel.tracking") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular ponisti" style="width: 50%">
                <label class="custom-field one datumInput">
                  <q-input
                    :readonly="readonly"
                    borderless
                    dense
                    placeholder=" "
                    v-model="editedItem.pracenjeOd"
                    @focus="popniPlaceholder('Span-IP0')"
                    @input="popniPlaceholder('Span-IP0')"
                    @blur="spustiPlaceholder('Span-IP0', editedItem.pracenjeOd)"
                    ref="input0"
                    mask="##:##"
                    :rules="[val => valiDate(val) || 'HH:MM']"
                  >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            :readonly="readonly"
                            v-model="editedItem.pracenjeOd"
                            mask="HH:mm"
                            format24h
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <span id="Span-IP0" class="placeholder">{{
                    $t("players.guardianAngel.from")
                  }}</span>
                </label>
              </q-item>

              <q-item class="formular ponisti" style="width: 50%">
                <label class="custom-field one datumInput">
                  <q-input
                    :readonly="readonly"
                    borderless
                    dense
                    placeholder=" "
                    v-model="editedItem.pracenjeDo"
                    @focus="popniPlaceholder('Span-IP1')"
                    @input="popniPlaceholder('Span-IP1')"
                    @blur="spustiPlaceholder('Span-IP1', editedItem.pracenjeDo)"
                    ref="input1"
                    mask="##:##"
                    :rules="[val => valiDate(val) || 'HH:MM']"
                  >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            :readonly="readonly"
                            v-model="editedItem.pracenjeDo"
                            mask="HH:mm"
                            format24h
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <span id="Span-IP1" class="placeholder">{{
                    $t("players.guardianAngel.to")
                  }}</span>
                </label>
              </q-item>

              <q-item style="margin-top: 20px">
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      :readonly="readonly"
                      type="text"
                      placeholder=" "
                      v-model="editedItem.opis"
                      :label="$t('players.guardianAngel.notes')"
                    />
                    <span class="placeholder">{{
                      $t("players.guardianAngel.notes")
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
            {{ $t("players.guardianAngel.tracking") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.pracenjeOd"
                    />
                    <span class="placeholder">{{
                      $t("players.guardianAngel.from")
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
                      v-model="editedItem.pracenjeDo"
                    />
                    <span class="placeholder">{{
                      $t("players.guardianAngel.to")
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
                      v-model="editedItem.opis"
                      :label="$t('players.guardianAngel.notes')"
                    />
                    <span class="placeholder">{{
                      $t("players.guardianAngel.notes")
                    }}</span>
                  </label>
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
  components: {},
  props: ["selektovaniIgrac"],
  data() {
    return {
      loadingUtakmice: false,
      dialog_za_promenu_igraca: false,
      date: "",
      filter: "",
      customer: {},
      new_customer: false,
      readonly: false,
      dataPreview: false,
      editedIndex: -1,
      listaOd1Do10: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
        { label: "7", value: "7" },
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "10", value: "10" }
      ],
      editedItem: {
        ident: 0,
        identIgrac: this.igrID,
        identTrener: 0,
        opis: "",
        pracenjeDo: "",
        pracenjeOd: ""
      },
      defaultItem: {
        ident: 0,
        identIgrac: this.igrID,
        identTrener: 0,
        opis: "",
        pracenjeDo: "",
        pracenjeOd: ""
      },
      mode: "list",
      columns: [
        {
          name: "pracenjeOd",
          required: true,
          label: this.$t("players.guardianAngel.trackingFrom"),
          align: "left",
          field: "pracenjeOd",
          sortable: true
          //format: val => date.formatDate(val, 'HH:mm')
        },
        {
          name: "pracenjeDo",
          required: true,
          label: this.$t("players.guardianAngel.trackingTo"),
          align: "left",
          field: "pracenjeDo",
          sortable: true
          //format: val => date.formatDate(val, 'HH:mm')
        },
        {
          name: "opis",
          align: "left",
          label: this.$t("players.guardianAngel.notes"),
          field: "opis",
          sortable: true
        },
        // { TODO: Cemu sluzi ovaj dobar igrac, trenutno je prazan???
        //   name: "dobarIgracIgRang",
        //   align: "left",
        //   label: this.$t('players.guardianAngel.goodPlayer'),
        //   field: "dobarIgracIgRang",
        //   sortable: true
        // },
        {
          name: "action",
          align: "left",
          label: this.$t("players.guardianAngel.action"),
          field: "action",
          sortable: true
        }
      ],
      data: [],
      igr: "",
      igrID: "",
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  watch: {
    selektovaniIgrac: function(val) {
      this.igr = val.igrac;
      this.igrID = val.igracID;

      this.getDataZaID();
    }
  },
  mounted() {
    if (this.selektovaniIgrac.igracID != undefined) {
      this.igr = this.selektovaniIgrac.igrac;
      this.igrID = this.selektovaniIgrac.igracID;

      this.getDataZaID();
    }

    this.editedItem.datumVreme = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");
  },
  methods: {
    valiDate(time) {
      var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
        time
      );
      return isValid;
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
        izabraniPlaceholder.style.padding = "0px";
        izabraniPlaceholder.style.color = "#aaa";
      }
    },
    otvoriPreviewDialog(item) {
      console.log(item);
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
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
      let linkStr = this.$apiPutanja + "/igrac-spijun/igrac/" + this.igrID;
      this.loadingUtakmice = true;
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
      let linkStr = this.$apiPutanja + "/igrac-spijun";
      var self = this;
      var datumVreme1;
      try {
        datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      } catch (error) {}

      var dataString = {
        identIgrac: this.igrID,
        identTrener: window.$userID,
        opis: this.editedItem.opis,
        pracenjeDo: this.editedItem.pracenjeDo.toString(),
        pracenjeOd: this.editedItem.pracenjeOd.toString()
      };

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
            message: self.$t(
              "players.guardianAngel.newMeasurementSuccessfullyAdded"
            ),
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
    // izmena pracenja
    //........................................
    putData() {
      debugger;
      let linkStr = this.$apiPutanja + "/igrac-spijun/" + this.editedItem.ident;
      var self = this;

      var dataString = {
        identIgrac: this.igrID,
        identTrener: window.$userID,
        opis: this.editedItem.opis,
        pracenjeDo: this.editedItem.pracenjeDo.toString(),
        pracenjeOd: this.editedItem.pracenjeOd.toString()
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
            message: self.$t(
              "players.guardianAngel.measurementDataChangedSuccessfully"
            ),
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
      let linkStr = this.$apiPutanja + "/igrac-spijun/" + item.ident;
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
            message: self.$t(
              "players.guardianAngel.measurementDataDeletedSuccessfully"
            ),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    prenesiOvde(jen, dva) {
      debugger;
      this.igr = jen;
      this.igrID = dva;
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
      debugger;
      let timeStamp = new Date(a);
      //let vrati = date.formatDate(a, 'YYYY-MM-DDTHH:mm:ss.SSS') + "Z"
      const vrati = timeStamp.toISOString();
      return vrati;
    },
    addRow() {
      debugger;
      let sveOK = true;

      if (
        this.editedItem.pracenjeOd == null ||
        this.editedItem.pracenjeOd == "" ||
        this.editedItem.pracenjeDo == null ||
        this.editedItem.pracenjeDo == ""
      )
        sveOK = false;

      if (sveOK == false) {
        this.$q.notify({
          message: this.$t("administration.user.notSaved"),
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
        title: self.$t("players.guardianAngel.warning"),
        message: self.$t("players.guardianAngel.areYouSureDelete"),
        customCloseBtnText: self.$t("players.guardianAngel.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("players.guardianAngel.yes"),
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
    otvordeDialog() {
      this.editedItem.datumVreme = this.getDateTime(Date.now());
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    editItem(item) {
      console.log(item);
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
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

      const status = exportFile("pracenje.csv", content, "text/csv");
      let self = this;
      if (status !== true) {
        this.$q.notify({
          message: self.$t("players.guardianAngel.browserForbids"),
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
