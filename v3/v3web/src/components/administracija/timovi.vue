<template>
  <q-page class="q-pa-sm">
    <q-table
      :title="$t('administration.teams.team')"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="sifrTima"
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
      <template v-slot:top-right="props">
        <q-btn
          @click="otvordeDialog()"
          :label="$t('administration.teams.newTeam')"
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
          v-else-if="props.value == props.row.imeTima"
          @click="otvoriPreviewDialog(props.row)"
        >
          <div class="" id="username">
            {{ props.row.imeTima }}
          </div>
        </q-td>

        <q-td :props="props" v-else @click="otvoriPreviewDialog(props.row)">
          <div>
            {{ props.value }}
          </div>
        </q-td>
      </template>
    </q-table>

    <!-- :readonly="readonly"
              treba na svaki input da se stavi
          -->
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
            {{ $t("administration.teams.team") }}
            <!-- <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn> -->
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.imeTima" :label="$t('administration.teams.teamName')"
                      :rules="[val => val !== null && val !== '' || $t('administration.teams.enterTeamName')]"
                      ></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.imeTima"
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')"
                      @blur="spustiPlaceholder('Span-IP1', editedItem.imeTima)"
                      ref="input1"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          $t('administration.teams.enterTeamName'),
                      ]"
                    />
                    <span id="Span-IP1" class="placeholder">{{
                      $t("administration.teams.teamName")
                    }}</span>
                  </label>
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
                    :options="listOptions"
                    v-model="editedItem.uzrastTima"
                    emit-value
                    map-options
                    ref="select1"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="spustiPlaceholder('Span-SL1', editedItem.uzrastTima)"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        $t('administration.teams.pickAgePls'),
                    ]"
                  />
                  <span
                    @click="$refs.select1.showPopup()"
                    id="Span-SL1"
                    class="placeholder placeholder1"
                    >{{ $t("administration.teams.pickAge") }}</span
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
                    :options="listOptions"
                    v-model="editedItem.rangTakmicenja"
                    emit-value
                    map-options
                    ref="select2"
                    @focus="popniPlaceholder('Span-SL2')"
                    @input="popniPlaceholder('Span-SL2')"
                    @blur="
                      spustiPlaceholder('Span-SL2', editedItem.rangTakmicenja)
                    "
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        $t('administration.teams.pickCompAgePls'),
                    ]"
                  />
                  <span
                    @click="$refs.select2.showPopup()"
                    id="Span-SL2"
                    class="placeholder placeholder1"
                    >{{ $t("administration.teams.pickCompAge") }}</span
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.mesto" :label="$t('administration.teams.place')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.mesto"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="spustiPlaceholder('Span-IP2', editedItem.mesto)"
                      ref="input2"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          $t('administration.teams.pickPlacePls'),
                      ]"
                    />
                    <span id="Span-IP2" class="placeholder">{{
                      $t("administration.teams.place")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <!-- <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.datumEvidentiranja" label="Datum evidentiranja"></q-input>
                    </q-item-section>
                  </q-item> -->
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
            {{ $t("administration.teams.team") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      readonly
                      placeholder=" "
                      v-model="editedItem.imeTima"
                      :label="$t('administration.teams.teamName')"
                    />
                    <span class="placeholder">{{
                      $t("administration.teams.teamName")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="
                      background: #f5f8fb;
                      color: #323b62;
                      height: 45px;
                      border-radius: 5px;
                      padding-left: 14px !important;
                    "
                    :label="$t('administration.teams.pickAge')"
                    :options="listOptions"
                    v-model="editedItem.uzrastTima"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="
                      background: #f5f8fb;
                      color: #323b62;
                      height: 45px;
                      border-radius: 5px;
                      padding-left: 14px !important;
                    "
                    :label="$t('administration.teams.pickCompAge')"
                    :options="listOptions"
                    v-model="editedItem.rangTakmicenja"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      readonly
                      v-model="editedItem.mesto"
                      :label="$t('administration.teams.username')"
                    />
                    <span class="placeholder">{{
                      $t("administration.teams.place")
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

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  data() {
    return {
      readonly: false,
      loadingUtakmice: false,
      filter: "",
      customer: {},
      dataPreview: false,
      new_customer: false,
      listOptions: [
        { label: "U7", value: "U7" },
        { label: "U8", value: "U8" },
        { label: "U9", value: "U9" },
        { label: "U10", value: "U10" },
        { label: "U11", value: "U11" },
        { label: "U12", value: "U12" },
        { label: "U13", value: "U13" },
        { label: "U14", value: "U14" },
        { label: "U15", value: "U15" },
        { label: "U16", value: "U16" },
        { label: "U17", value: "U17" },
        { label: "U18", value: "U18" },
        { label: "U19", value: "U19" },
        { label: "U20", value: "U20" },
        { label: "U21", value: "U21" },
        { label: "Senior", value: "SENIOR" },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        imeTima: "",
        uzrastTima: "",
        rangTakmicenja: "",
        mesto: "",
        datumEvidentoranja: "",
        active: true,
      },
      defaultItem: {
        id: 0,
        imeTima: "",
        uzrastTima: "",
        rangTakmicenja: "",
        mesto: "",
        datumEvidentoranja: "",
        active: true,
      },
      mode: "list",
      columns: [
        {
          name: "imeTima",
          required: true,
          label: this.$t("administration.teams.teamName"),
          align: "left",
          field: "imeTima",
          sortable: true,
        },
        {
          name: "uzrastTima",
          align: "left",
          label: this.$t("administration.teams.age"),
          field: "uzrastTima",
          sortable: true,
          sort: (a, b) =>
            parseInt(a.replace("U", ""), 10) - parseInt(b.replace("U", ""), 10),
        },
        {
          name: "mesto",
          align: "left",
          label: this.$t("administration.teams.place"),
          field: "mesto",
          sortable: true,
        },
        {
          name: "datumEvidentiranja",
          align: "left",
          label: this.$t("administration.teams.dateReg"),
          field: "datumEvidentiranja",
          sortable: true,
          format: (val) => date.formatDate(val, "DD/MM/YYYY"),
        },
        {
          name: "action",
          align: "left",
          label: this.$t("table.action"),
          field: "action",
          sortable: true,
        },
      ],
      data: [],
      // data: [
      //   {
      //     id: 1,
      //     imeTima: "Шампиони",
      //     uzrastTima: "U11",
      //     mesto: "Крагујевац",
      //     datumEvidentoranja: "1-1-2019",
      //     active: true
      //   },
      //   {
      //     id: 1,
      //     imeTima: "Клинци из Блока",
      //     uzrastTima: "U9",
      //     mesto: "Београд",
      //     datumEvidentoranja: "1-1-2019",
      //     active: true
      //   },
      //   {
      //     id: 1,
      //     imeTima: "Џајини пулени",
      //     uzrastTima: "U17",
      //     mesto: "Uб",
      //     datumEvidentoranja: "1-1-2019",
      //     active: true
      //   },
      //   {
      //     id: 1,
      //     imeTima: "Хијене 21",
      //     uzrastTima: "U17",
      //     mesto: "Београд",
      //     datumEvidentoranja: "1-1-2019",
      //     active: true
      //   },
      // ],
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  mounted() {
    this.getData(); //idemo da uzmenmo podatke iz baze
    this.a = this.$igracName;
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
    // citanje podataka
    //........................................
    getData() {
      let linkStr = this.$apiPutanja + "/selekcije";
      this.loadingUtakmice = true;
      debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then((response) => {
          debugger;
          this.data = response.data;
          this.loadingUtakmice = false;
          debugger;
        })
        .catch((e) => {
          //this.errors.push(e);
          debugger;
          this.loadingUtakmice = false;
          console.log("Greska: " + e);
        });
    },

    getData1() {
      console.log("timovi getData");
      //console.log("Final menuItems:", JSON.stringify(this.menuItems, null, 2));
      fetch("https://redstar-dev.atomdataservices.com/selekcije", {
        method: "GET",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.$token,
        },
      })
        .then((response) => {
          debugger;
          this.data = response.data;
          this.loadingUtakmice = false;
          debugger;
        })
        .catch((e) => {
          //this.errors.push(e);
          debugger;
          this.loadingUtakmice = false;
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje novog zapisa
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/selekcije";
      var self = this;
      let datetime = this.getDateTime();

      var dataString = {
        active: 1,
        datumEvidentiranja: datetime,
        ident: this.editedItem.ident,
        imeTima: this.editedItem.imeTima,
        mesto: this.editedItem.mesto,
        uzrastTima: this.editedItem.uzrastTima,
        rangTakmicenja: this.editedItem.rangTakmicenja,
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
          self.getData();
          self.$q.notify({
            message: self.$t("administration.teams.msgPositive"),
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
    // izmena tima
    //........................................
    putData() {
      debugger;
      let linkStr = this.$apiPutanja + "/selekcije/" + this.editedItem.ident;
      var self = this;
      let datetime = this.getDateTime();

      var dataString = {
        active: 1,
        datumEvidentiranja: datetime,
        ident: this.editedItem.ident,
        imeTima: this.editedItem.imeTima,
        mesto: this.editedItem.mesto,
        uzrastTima: this.editedItem.uzrastTima,
        rangTakmicenja: this.editedItem.rangTakmicenja,
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
          self.getData();
          self.$q.notify({
            message: self.$t("administration.teams.msgChange"),
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
    // brisanje/deaktiviranje tima
    //........................................
    deleteData(item) {
      debugger;
      let linkStr = this.$apiPutanja + "/selekcije/" + item.ident;
      var self = this;
      debugger;
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
          self.getData();
          self.$q.notify({
            message: self.$t("administration.teams.msgDel"),
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
    getDateTime() {
      const today = new Date();
      return today.toISOString();
    },
    addRow() {
      let sveOK = true;

      if (this.editedItem.imeTima == null || this.editedItem.imeTima == "")
        sveOK = false;
      if (
        this.editedItem.uzrastTima == null ||
        this.editedItem.uzrastTima == ""
      )
        sveOK = false;
      if (
        this.editedItem.rangTakmicenja == null ||
        this.editedItem.rangTakmicenja == ""
      )
        sveOK = false;

      if (sveOK == false) {
        this.$q.notify({
          message: this.$t("administration.teams.notSaved"),
          color: "red",
        });
        this.zacrveniPrazne();
      } else {
        if (this.editedIndex > -1) {
          Object.assign(this.data[this.editedIndex], this.editedItem);
          this.putData();
        } else {
          //this.data.push(this.editedItem);
          this.postData();
        }
        this.close();
      }
    },
    //''''''''''''''''''''''''''''''''''''''''
    // брисање записа у локау, и позивање функције за брисање записа у бази
    //........................................
    deleteItem(item) {
      const index = this.data.indexOf(item);
      let obj = {
        title: this.$t("administration.teams.war"),
        message: this.$t("administration.teams.msgDelConf"),
        customCloseBtnText: this.$t("administration.teams.txtNo"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: this.$t("administration.teams.txtYes"),
        onConfirm: onConfirmWrapper,
        type: "warning",
        showXclose: true,
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
    zacrveniPrazne() {
      let self = this;
      var i = 0;
      var sviInputi = document.getElementById("Span-IP" + i);

      while (!(i > 1 && sviInputi == null)) {
        if (sviInputi != null) {
          var val =
            sviInputi.parentElement.children[0].getElementsByTagName("input")[0]
              .value;
          debugger;
          if (val == "" && val == null) this.$refs["input" + i].validate();
          this.$refs["input" + i].validate();
        }

        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0;
      var sviSelektovi = document.getElementById("Span-SL" + i);
      while (!(i > 1 && sviSelektovi == null)) {
        debugger;
        if (sviSelektovi != null) {
          var val =
            sviSelektovi.parentElement.children[0].innerText.split("\n").length;

          if (val <= 1) this.$refs["select" + i].validate();
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
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

      const status = exportFile("timovi.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: this.$t("administration.teams.msgPrtSc"),
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
};
</script>

<style scoped>
tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}

.sakriDugmice {
  display: none;
}
</style>
