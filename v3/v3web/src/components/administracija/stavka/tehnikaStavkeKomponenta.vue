<template>
  <q-page class="q-pa-sm">
    <q-splitter
      v-model="splitterModel"
      separator-class="bg-red"
      separator-style="width: 0px; height:100vh"
      style="height: 100%"
    >
      <template v-slot:before>
        <!-- tabela za grupe -->

        <q-table
          :title="$t('administration.technique.items.grpTech')"
          :data="dataGrupe"
          :hide-header="mode === 'grid'"
          :columns="columnsGrupe"
          row-key="grupa"
          :grid="mode == 'grid'"
          :filter="filterGrupe"
          :pagination.sync="pagination"
          :rows-per-page-label="$t('table.rowsPerPage')"
          :no-data-label="$t('table.noData')"
          :loading-label="$t('table.loadingLabel')"
          :no-results-label="$t('table.noResultLabel')"
          selection="single"
          :selected.sync="selectedGrupa"
          :loading="loadingUtakmice"
          class="mojaTabelaJedan my-sticky-header-table"
          style="
            background-color: unset;
            box-shadow: unset;
          "
          table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
          color="blue-10"
        >
          <template>
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
          </template>

          <template v-slot:header-cell-action="props">
            <q-th style="color: #ffffff00; width: 110px;">
              {{ props.col.label }}
            </q-th>
          </template>

          <template v-slot:body-cell-grupa="props">
            <q-td :props="props">
              <div class="" id="username">
                {{ props.row.grupa }}
              </div>
            </q-td>
          </template>
        </q-table>
      </template>

      <template v-slot:after>
        <q-table
          :title="$t('administration.technique.items.techItemsG')"
          :data="data"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="id"
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
              v-if="selectedGrupa.length > 0"
              @click="otvordeDialog()"
              :label="$t('administration.technique.items.newItem')"
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
              v-else-if="props.value == props.row.naziv"
              @click="otvoriPreviewDialog(props.row)"
            >
              <div class="" id="username">
                {{ props.row.naziv }}
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
                {{ $t("administration.technique.items.techItems") }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form class="q-gutter-md">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <label class="custom-field one">
                        <q-input
                          :readonly="readonly"
                          borderless
                          dense
                          placeholder=" "
                          v-model="editedItem.naziv"
                          @focus="popniPlaceholder('Span-IP1')"
                          @input="popniPlaceholder('Span-IP1')"
                          @blur="
                            spustiPlaceholder('Span-IP1', editedItem.naziv)
                          "
                          ref="input1"
                          :rules="[
                            val =>
                              (val !== null && val !== '') ||
                              $t('administration.technique.items.nameEnter')
                          ]"
                        />
                        <span id="Span-IP1" class="placeholder">{{
                          $t("administration.technique.items.name")
                        }}</span>
                      </label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <label>{{
                        $t("administration.technique.items.desc")
                      }}</label>
                      <q-editor
                        :readonly="readonly"
                        v-model="editedItem.opis"
                        :label="$t('administration.technique.items.desc')"
                        min-height="5rem"
                      />
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <label class="custom-field one">
                        <input
                          :readonly="readonly"
                          type="text"
                          placeholder=" "
                          v-model="editedItem.videoZapis"
                          ref="input2"
                          :label="$t('administration.technique.items.video')"
                        />
                        <span class="placeholder">{{
                          $t("administration.technique.items.video")
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
                {{ $t("administration.technique.items.techItems") }}
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
                          placeholder=" "
                          readonly
                          v-model="editedItem.naziv"
                          :label="$t('administration.technique.items.name')"
                        />
                        <span class="placeholder">{{
                          $t("administration.technique.items.name")
                        }}</span>
                      </label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <label>{{
                        $t("administration.technique.items.desc")
                      }}</label>
                      <q-card flat bordered>
                        <q-card-section
                          v-html="editedItem.opis"
                          style="border: 0.5px solid #323b62; border-radius: 5px;"
                        />
                      </q-card>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <label class="custom-field one">
                        <input
                          type="text"
                          placeholder=" "
                          readonly
                          v-model="editedItem.videoZapis"
                          :label="$t('administration.technique.items.video')"
                        />
                        <span class="placeholder">{{
                          $t("administration.technique.items.video")
                        }}</span>
                      </label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </template>
    </q-splitter>
  </q-page>
</template>

<script>
//import principiIgreVue from '../pages/principiIgre.vue';

export default {
  data() {
    return {
      readonly: false,
      loadingUtakmice: false,
      naslov: "Stavke tehnike za grupu: ",
      filter: "",
      filterGrupe: "",
      splitterModel: 20,
      selectedGrupa: [],
      customer: {},
      new_customer: false,
      dataPreview: false,
      dialog_za_pozicije: false,
      editedIndex: -1,
      editedItem: {
        ident: 0,
        bazaTehnikeSifrarnikGrupeIdent: 0,
        naziv: "",
        opis: "",
        sifra: 0,
        videoZapis: ""
      },
      defaultItem: {
        ident: 0,
        bazaTehnikeSifrarnikGrupeIdent: 0,
        naziv: "",
        opis: "",
        sifra: 0,
        videoZapis: ""
      },
      columns: [
        // {
        //   name: "sifra",
        //   align: "left",
        //   label: "Šifra",
        //   field: "sifra",
        //   sortable: true
        // },
        {
          name: "naziv",
          align: "left",
          label: this.$t("administration.technique.items.name"),
          field: "naziv",
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
      mode: "list",
      columnsGrupe: [
        {
          name: "grupa",
          required: true,
          label: this.$t("administration.technique.items.group"),
          align: "left",
          field: "grupa",
          sortable: true
        }
      ],
      data: [],
      dataGrupe: [],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  beforeMount() {},
  mounted() {
    debugger;
    this.getDataGrupe(); //idemo da uzmenmo podatke iz baze

    // change table height
    var temp = document.querySelectorAll(".q-table__middle");
    for (var i = 0; i < temp.length; i++)
      temp[i].style.setProperty("max-height", "calc(100vh - 380px)");
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
    // citanje grupa
    //........................................
    getDataGrupe() {
      let linkStr = this.$apiPutanja + "/baza-tehnike-sifrarnik-grupa";
      let self = this;
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
          self.dataGrupe = response.data;
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
    // citanje podataka
    //........................................
    getDataStavke() {
      let linkStr =
        this.$apiPutanja +
        "/baza-tehnike-sifrarnik-stavke?identGrupe=" +
        this.selectedGrupa[0].ident;
      debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(response => {
          this.data = response.data;
          console.log(this.data);
          //debugger
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje nove role
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/baza-tehnike-sifrarnik-stavke";
      var self = this;
      //let datetime = this.getDateTime();

      var dataString = {
        bazaTehnikeSifrarnikGrupeIdent: this.selectedGrupa[0].ident,
        naziv: this.editedItem.naziv,
        opis: this.editedItem.opis,
        sifra: this.editedItem.sifra,
        videoZapis: this.editedItem.videoZapis
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
          self.getDataStavke();
          self.$q.notify({
            message: self.$t("administration.technique.items.msgPositive"),
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
    // izmena role
    //........................................
    putData() {
      debugger;
      let linkStr =
        this.$apiPutanja +
        "/baza-tehnike-sifrarnik-stavke/" +
        this.editedItem.ident;
      var self = this;

      var dataString = {
        bazaTehnikeSifrarnikGrupeIdent: this.selectedGrupa[0].ident,
        naziv: this.editedItem.naziv,
        opis: this.editedItem.opis,
        sifra: this.editedItem.sifra,
        videoZapis: this.editedItem.videoZapis
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
          self.getDataStavke();
          self.$q.notify({
            message: self.$t("administration.technique.items.msgChange"),
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
    // brisanje/deaktiviranje role
    //........................................
    deleteData(item) {
      debugger;
      let linkStr =
        this.$apiPutanja + "/baza-tehnike-sifrarnik-stavke/" + item.ident;
      var self = this;
      debugger;
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
          self.getDataStavke();
          self.$q.notify({
            message: self.$t("administration.technique.items.msgDel"),
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
    // брисање записа у локау, и позивање функције за брисање записа у бази
    //........................................
    deleteItem(item) {
      const index = this.data.indexOf(item);
      let obj = {
        title: this.$t("administration.technique.items.war"),
        message: this.$t("administration.technique.items.msgDelConf"),
        customCloseBtnText: this.$t("administration.technique.items.txtNo"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: this.$t("administration.technique.items.txtYes"),
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

    //''''''''''''''''''''''''''''''''''''''''
    // dodavanje novog i editovanje zapisa
    //........................................
    addRow() {
      debugger;
      let sveOK = true;

      if (this.editedItem.naziv == null || this.editedItem.naziv == "")
        sveOK = false;

      if (sveOK == false) {
        this.$q.notify({
          message: this.$t("administration.technique.items.notSaved"),
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
      let self = this;
      var i = 0;
      var sviInputi = document.getElementById("Span-IP" + i);

      while (!(i > 1 && sviInputi == null)) {
        if (sviInputi != null) {
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
          this.$refs["select" + i].validate();
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
    //''''''''''''''''''''''''''''''''''''''''
    // извоз података у CSV формат
    //........................................
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

      const status = exportFile("tehnika-stavke.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: this.$t("administration.technique.items.msgPrtSc"),
          color: "negative",
          icon: "warning"
        });
      }
    }
  },
  watch: {
    selectedGrupa: function(val) {
      debugger;
      //console.log(this.selectedGrupa[0].ident)
      if (this.selectedGrupa.length > 0) {
        this.getDataStavke();
      } else {
        this.data = [];
      }
    }
  }
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
