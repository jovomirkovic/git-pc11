<template>
  <q-page class="q-pa-sm">
    <!-- <div class="row"
          style="
            position: absolute;
            top: -90px;
            z-index: 5000;
            margin: 0 30%;"
            >
            <h5> {{$t('players.playerRating.selectedPlayer')}}: {{igrac}}</h5>
            <q-btn style="padding:22px;margin:10px;color:red" flat round icon="people" @click="izborIgraca()" >
              <q-tooltip>{{$t('players.playerRating.selectedPlayer')}}</q-tooltip>
            </q-btn>
        </div> -->
    <q-table
      :title="$t('players.playerRating.pca')"
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
      style="background-color: unset; box-shadow: unset"
      table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10"
    >
      <template
        v-if="igr != $t('players.playerRating.selectPlayer') + ' ->'"
        v-slot:top-right="props"
      >
        <q-btn
          v-if="Object.keys(selektovaniIgrac).length != 0"
          @click="otvordeDialog()"
          :label="$t('players.playerRating.newAssessment')"
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
              >{{props.inFullscreen ? $t('players.playerRating.exitFullscreen') : $t('players.playerRating.enterFullscreen')}}</q-tooltip>
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
              ? $t("players.playerRating.list")
              : $t("players.playerRating.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('players.playerRating.exportCSV')"
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
              <q-tooltip>{{ $t("players.playerRating.delete") }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="editItem(props.row)"
              id="dugmeEdit"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="edit"
            >
              <q-tooltip>{{ $t("players.playerRating.changeData") }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>

        <q-td
          :props="props"
          v-else-if="props.value == props.row.faca"
          @click="otvoriPreviewDialog(props.row)"
        >
          <div class="" id="username">
            {{ props.row.faca }}
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
            style="float: right"
            v-close-popup
          ></q-btn>
          <div class="text-h6" style="text-align: center">
            {{ $t("players.playerRating.data") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <!--                   <q-item class="formular ponisti" style="">
                    <q-input dense outlined v-model="editedItem.datumPrelaska" label="Datum prelaska " mask="date" :rules="['date']" class="datumKlasa">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="editedItem.datumPrelaska" @input="() => $refs.qDateProxy.hide()"></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item> -->

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="listaProcena"
                    v-model="editedItem.tipProcena"
                    emit-value
                    map-options
                    ref="select1"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="spustiPlaceholder('Span-SL1', editedItem.tipProcena)"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        $t('players.playerRating.sellectAssessment'),
                    ]"
                  />
                  <span
                    @click="$refs.select1.showPopup()"
                    id="Span-SL1"
                    class="placeholder placeholder1"
                    >{{ $t("players.playerRating.typeOfAssessment") }}</span
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined type="number" suffix="%" v-model="editedItem.procena" :label="$t('players.playerRating.estimateValue')"
                      :rules="[
                        val => val !== null && val !== '' || $t('players.playerRating.insertAssessment'),
                        val => val > 0 && val < 101 || $t('players.playerRating.check100')
                      ]"
                      ></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      type="number"
                      v-model="editedItem.procena"
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')"
                      @blur="spustiPlaceholder('Span-IP1', editedItem.procena)"
                      ref="input1"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          $t('players.playerRating.insertAssessment'),
                        (val) =>
                          (val > 0 && val < 101) ||
                          $t('players.playerRating.check100'),
                      ]"
                    />
                    <span id="Span-IP1" class="placeholder">{{
                      $t("players.playerRating.estimateValue")
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
            style="
              background-color: #f5f8fb;
              color: #323b62;
              width: 20%;
              margin: 10px;
            "
            v-close-popup
          ></q-btn>
          <q-btn
            :label="$t('administration.user.save')"
            @click="addRow"
            type="submit"
            style="
              background-color: #ff4b00;
              color: white;
              width: 20%;
              margin: 10px;
            "
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
            style="float: right"
            v-close-popup
          ></q-btn>
          <div class="text-h6" style="text-align: center">
            {{ $t("players.playerRating.data") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-select
                    readonly
                    borderless
                    style="
                      background: #f5f8fb;
                      color: #323b62;
                      height: 45px;
                      border-radius: 5px;
                      padding-left: 14px !important;
                    "
                    :label="$t('players.playerRating.typeOfAssessment')"
                    :options="listaProcena"
                    v-model="editedItem.tipProcena"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      suffix="%"
                      v-model="editedItem.procena"
                      :label="$t('players.playerRating.estimateValue')"
                    />
                    <span class="placeholder">{{
                      $t("players.playerRating.estimateValue")
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
      readonly: false,
      loadingUtakmice: false,
      date: "",
      filter: "",
      customer: {},
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      listaProcena: [
        {
          label: this.$t("players.playerRating.reprezentacija"),
          value: "1",
        },
        {
          label: this.$t("players.playerRating.fkCZ"),
          value: "2",
        },
        {
          label: this.$t("players.playerRating.superliga"),
          value: "3",
        },
        {
          label: this.$t("players.playerRating.prvaLiga"),
          value: "4",
        },
        {
          label: this.$t("players.playerRating.olympicMedalist"),
          value: "5",
        },
        {
          label: this.$t("players.playerRating.olympicParticipation"),
          value: "6",
        },
        {
          label: this.$t("players.playerRating.nationalRecord"),
          value: "7",
        },
        {
          label: this.$t("players.playerRating.identifiedTalent"),
          value: "8",
        },
      ],
      editedItem: {
        ident: 0,
        igr: {},
        procena: null,
        strucniStab: {},
        tipProcena: "",
      },
      defaultItem: {
        ident: 0,
        igr: {},
        procena: null,
        strucniStab: {},
        tipProcena: "",
      },

      mode: "list",
      columns: [
        // {
        //   name: "datumPrelaska",
        //   required: true,
        //   label: "Datum prelaska",
        //   align: "left",
        //   field: "datumPrelaska",
        //   sortable: true
        // },
        {
          name: "faca",
          align: "left",
          label: this.$t("players.playerRating.whoassesed"),
          field: "faca",
          sortable: true,
        },
        {
          name: "tipProcena",
          align: "left",
          label: this.$t("players.playerRating.typeOfAssessment"),
          field: "tipProcena",
          sortable: true,
        },
        {
          name: "procena",
          align: "left",
          label: this.$t("players.playerRating.assessment"),
          field: "procena",
          sortable: true,
        },
        {
          name: "action",
          align: "left",
          label: this.$t("players.playerRating.action"),
          field: "action",
          sortable: true,
        },
      ],
      data: [],
      igr: "",
      igrID: "",
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  watch: {
    selektovaniIgrac: function (val) {
      this.igr = val.igrac;
      this.igrID = val.igracID;

      this.getDataZaID();
    },
  },
  mounted() {
    // this.igrac = window.$igracName;
    // this.igracID1 = window.$igracID;
    if (this.selektovaniIgrac.igracID != undefined) {
      this.igr = this.selektovaniIgrac.igrac;
      this.igrID = this.selektovaniIgrac.igracID;

      this.getDataZaID();
    }

    // this.editedItem.datumPrelaska = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    // this.editedItem.datumPrestanka = new Date().toJSON().slice(0,10).replace(/-/g,'/');
  },
  methods: {
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
      let linkStr = this.$apiPutanja + "/procena-igraca/igrac/" + this.igrID;
      this.loadingUtakmice = true;
      //debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then((response) => {
          debugger;
          this.data = response.data.map(this.dajProcene);
          this.loadingUtakmice = false;
          debugger;
        })
        .catch((e) => {
          //this.errors.push(e);
          this.loadingUtakmice = false;
          console.log("Greska: " + e);
        });
    },
    dajProcene(item) {
      let self = this;
      //debugger
      return {
        ident: item.ident,
        igrac: item.ime + " " + item.prezime,
        ime: item.ime,
        prezime: item.prezime,
        procena: item.procena,
        faca: item.strucniStab.ime + " " + item.strucniStab.prezime,
        tipProcena:
          this.listaProcena.filter((e) => e.value == item.tipProcena)[0]
            ?.label || "asdf",
      };
      function dajTipove(a) {
        var vrati;
        switch (a) {
          case "Reprezentacija i LŠ":
            vrati = "Reprezentacija i LŠ";
            break;
          case "FK Crvena Zvezda":
            vrati = "FK Crvena Zvezda";
            break;
          case "Superliga":
            vrati = "Superliga";
            break;
          case "Prva liga":
            vrati = "Prva liga";
            break;
        }
        return vrati;
      }
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje novog igraca
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/procena-igraca";
      var self = this;
      //let datumVreme1 = this.getDateTime(this.editedItem.datumPrelaska);
      //let datumVreme2 = this.getDateTime(this.editedItem.datumPrestanka);

      var dataString = {
        //datumPrelaska: datumVreme1,
        identIgrac: this.igrID,
        identStrucniStab: window.$userID,
        procena: this.editedItem.procena,
        tipProcena: this.editedItem.tipProcena,
      };

      let data1 = JSON.stringify(dataString);

      debugger;
      this.$axios
        .post(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then(function (response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("players.playerRating.newAdded"),
            color: "green",
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena procene
    //........................................
    putData() {
      debugger;
      let linkStr =
        this.$apiPutanja + "/procena-igraca/" + this.editedItem.ident;
      var self = this;
      //let datumVreme1 = this.getDateTime(this.editedItem.datumPrelaska);
      //let datumVreme2 = this.getDateTime(this.editedItem.datumPrestanka);

      var dataString = {
        //datumPrelaska: datumVreme1,
        identIgrac: this.igrID,
        identStrucniStab: window.$userID,
        procena: this.editedItem.procena,
        tipProcena: this.editedItem.tipProcena,
      };

      let data1 = JSON.stringify(dataString);

      debugger;
      this.$axios
        .put(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then(function (response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("players.playerRating.dataChanged"),
            color: "green",
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje/deaktiviranje igraca
    //........................................
    deleteData(item) {
      let linkStr = this.$apiPutanja + "/procena-igraca/" + item.ident;
      var self = this;
      this.$axios
        .delete(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then(function (response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("players.playerRating.dataDeleted"),
            color: "green",
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //alert(response);
        });
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
        this.editedItem.tipProcena == null ||
        this.editedItem.tipProcena == ""
      )
        sveOK = false;
      if (this.editedItem.procena == null || this.editedItem.procena == "")
        sveOK = false;

      if (sveOK == false) {
        this.$q.notify({
          message: this.$t("administration.user.notSaved"),
          color: "red",
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
        title: self.$t("players.playerRating.warning"),
        message: self.$t("players.playerRating.areYouSureDelete"),
        customCloseBtnText: self.$t("players.playerRating.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("players.playerRating.yes"),
        onConfirm: onConfirmWrapper,
        type: "warning",
        showXclose: true,
      };
      this.$Simplert.open(obj);
      function onConfirmWrapper() {
        self.data.splice(index, 1);
        debugger;
        self.deleteData(item);
      }
    },
    otvordeDialog() {
      //this.editedItem.datumVreme = this.getDateTime(Date.now());
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    editItem(item) {
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
          var val =
            sviInputi.parentElement.children[0].getElementsByTagName("input")[0]
              .value;

          if (val != "" && val != null) this.popniPlaceholder("Span-IP" + i);
        }

        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0;
      var sviSelektovi = document.getElementById("Span-SL" + i);
      console.log("sviSelektovi");
      console.log("Span-SL" + i);
      console.log(sviSelektovi);
      while (!(i > 1 && sviSelektovi == null)) {
        if (sviSelektovi != null) {
          var val =
            sviSelektovi.parentElement.children[0].innerText.split("\n").length;

          if (val > 1) this.popniPlaceholder("Span-SL" + i);
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.data.map((row) =>
            this.columns
              .map((col) =>
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

      const status = exportFile("procenaIgraca.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: self.$t("players.playerRating.browserForbids"),
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
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
