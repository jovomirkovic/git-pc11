<template>
  <q-page class="q-pa-sm">
    <q-table :title="$t('trainingExercises.trainingExercises')" :data="filteredData" :hide-header="mode === 'grid'"
      :columns="columns" row-key="ident" :grid="mode == 'grid'" :pagination.sync="pagination"
      :rows-per-page-label="$t('table.rowsPerPage')" :no-data-label="$t('table.noData')"
      :loading-label="$t('table.loadingLabel')" :no-results-label="$t('table.noResultLabel')" :loading="loadingUtakmice"
      class="mojaTabela my-sticky-header-table" style="
            background-color: unset;
            box-shadow: unset;
          "
      table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10">
      <!--           selection="single"
          :selected.sync="selected" -->

      <template v-slot:top-right="props">
        <q-btn @click="otvordeDialog()" :label="$t('trainingExercises.newExercise')" class="q-mr-xs dugmeNewNesto"
          style="width: unset !important" />

        <q-input outlined class="dugmeSearch" dense debounce="300" v-model="filter" @input="filtrirajTV">
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
              >{{props.inFullscreen ? $t('trainingExercises.exitFullscreen') : $t('trainingExercises.enterFullscreen')}}</q-tooltip>
            </q-btn> -->

        <q-btn flat round dense class="plavaKlasaTekst" :icon="mode === 'grid' ? 'list' : 'grid_on'" @click="
          mode = mode === 'grid' ? 'list' : 'grid';
        separator = mode === 'grid' ? 'none' : 'horizontal';
        " v-if="!props.inFullscreen">
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            mode === "grid"
              ? $t("trainingExercises.list")
              : $t("trainingExercises.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn class="dugmeCVS" :label="$t('table.exportToCSV')" no-caps @click="exportTable" />
      </template>

      <template v-slot:header-cell-action="props">
        <q-th style="color: #ffffff00; width: 110px">
          {{ props.col.label }}
        </q-th>
      </template>

      <template v-slot:body-cell="props">
        <q-td :props="props" v-if="props.value == props.row.action">
          <div class="q-gutter-sm">
            <q-btn @click="deleteItem(props.row)" id="dugmeBrisi" round dense
              style="background-color: #e5edf4; color: #3b5d99; float: right" icon="delete">
              <q-tooltip> {{ $t("trainingExercises.delete") }}</q-tooltip>
            </q-btn>
            <q-btn @click="editItem(props.row)" id="dugmeEdit" round dense
              style="background-color: #e5edf4; color: #3b5d99; float: right" icon="edit">
              <q-tooltip> {{ $t("trainingExercises.changeData") }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>

        <q-td :props="props" v-else-if="props.value == props.row.naziv" @click="otvoriPreviewDialog(props.row)">
          <div class="" id="username">
            {{ props.row.naziv }}
          </div>
        </q-td>

        <q-td :props="props" v-else-if="props.value == props.row.kategorija" @click="otvoriPreviewDialog(props.row)">
          <div>
            {{ props.value }}
          </div>
        </q-td>

        <q-td :props="props" v-else @click="otvoriPreviewDialog(props.row)">
          <div>
            {{ props.value.join(", ") }}
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog persistent v-model="new_customer">
      <q-card style="
              width: 600px;
              max-width: 60vw;
              border-radius: 5px;
              box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7);
              color: #323b62;
              overflow-x: visible;
            ">
        <q-card-section>
          <q-btn icon="close" @click="close" flat round dense style="float: right;" v-close-popup></q-btn>
          <div class="text-h6" style="text-align: center;">
            {{ $t("trainingExercises.trainingExercises") }}
            <!-- <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn> -->
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.naziv" :label="$t('trainingExercises.exerciseName')"></q-input> -->
                  <label class="custom-field one">
                    <q-input :readonly="readonly" hide-bottom-space borderless dense placeholder=" "
                      v-model="editedItem.naziv" @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')" @blur="spustiPlaceholder('Span-IP1', editedItem.naziv)"
                      ref="input1" :rules="[
                        val =>
                          (val !== null && val !== '') ||
                          $t('trainingExercises.enterName')
                      ]" />
                    <span id="Span-IP1" class="placeholder">{{
                      $t("trainingExercises.exerciseName")
                      }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select :readonly="readonly" borderless class="selektKlass" option-value="value"
                    option-label="label" :options="listOptionsKategorije" v-model="editedItem.kategorija" emit-value
                    map-options ref="select1" @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')" @blur="spustiPlaceholder('Span-SL1', editedItem.kategorija)"
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        $t('trainingExercises.pleaseSelectCategory')
                    ]" />
                  <span @click="$refs.select1.showPopup()" id="Span-SL1" class="placeholder placeholder1">{{
                    $t("trainingExercises.selectCategory") }}</span>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="custom-field one">
                  <q-select :disable="readonly" borderless class="selektKlass" option-value="value" option-label="label"
                    multiple use-chips :options="listOptions" v-model="editedItem.identUzrastiList" emit-value
                    map-options ref="select2" :style="{
                      height: [
                        editedItem.identUzrastiList.length > 7 ? '80px' : '40px'
                      ]
                    }" @focus="popniPlaceholder('Span-SL2')" @input="popniPlaceholder('Span-SL2')" @blur="
                      spustiPlaceholder('Span-SL2', editedItem.identUzrastiList)
                      " :rules="[
                      val =>
                        (val !== null && val !== '' && val.length !== 0) ||
                        $t('trainingExercises.pleaseSelectAge')
                    ]" />
                  <span @click="$refs.select2.showPopup()" id="Span-SL2" class="placeholder placeholder1">{{
                    $t("trainingExercises.selectAges") }}</span>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.opis" label="Opis"></q-input> -->
                  <quill-editor :disable="readonly" class="editor" ref="myTextEditor" :value="editedItem.opis"
                    :options="editorOption" @change="onEditorChange($event)" @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)" @ready="onEditorReady($event)" style="margin-bottom: 100px;" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions :class="{ sakriDugmice: readonly }" align="center" class="bg-white text-teal">
          <q-btn :label="$t('administration.user.cancel')" @click="close" type="submit"
            style="background-color: #f5f8fb; color: #323b62; width: 20%; margin: 10px;" v-close-popup></q-btn>
          <q-btn :label="$t('administration.user.save')" @click="addRow" type="submit"
            style="background-color: #ff4b00; color: white; width: 20%; margin: 10px;"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dataPreview">
      <q-card style="
              width: 600px;
              max-width: 60vw;
              border-radius: 5px;
              box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7);
              color: #323b62;
          ">
        <q-card-section>
          <q-btn icon="close" @click="close" flat round dense style="float: right;" v-close-popup></q-btn>
          <div class="text-h6" style="text-align: center;">
            {{ $t("trainingExercises.trainingExercises") }}
            <!-- <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn> -->
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input readonly type="text" placeholder=" " v-model="editedItem.naziv"
                      :label="$t('trainingExercises.exerciseName')" />
                    <span class="placeholder">{{
                      $t("trainingExercises.exerciseName")
                      }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-select borderless readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                    :label="$t('trainingExercises.selectCategory')" :options="listOptionsKategorije"
                    v-model="editedItem.kategorija" emit-value map-options />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select borderless readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                    :label="$t('trainingExercises.selectAges')" multiple :options="listOptions"
                    v-model="editedItem.identUzrastiList" emit-value map-options />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section v-html="editedItem.opis"
                  style="border: 0.5px solid #323b62; border-radius: 5px; padding: 15px">
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

import { quillEditor } from "vue-quill-editor";

// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import debounce from "lodash/debounce";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      readonly: false,
      loadingUtakmice: false,
      filter: "",
      customer: {},
      new_customer: false,
      dataPreview: false,
      listOptions: [],
      listOptionsKategorije: [
        {
          label: this.$t("trainingExercises.individual"),
          value: "INDIVIDUALNO"
        },
        { label: this.$t("trainingExercises.group"), value: "GRUPNO" },
        { label: this.$t("trainingExercises.team"), value: "TIMSKI" },
        {
          label: this.$t("trainingExercises.physicalExercise"),
          value: "VEZBA_FIZICKE_PRIPREME"
        }
      ],
      editedIndex: -1,
      editedItem: {
        ident: 0,
        kategorija: "",
        naziv: "",
        opis: "",
        identUzrastiList: []
      },
      defaultItem: {
        ident: 0,
        kategorija: "",
        naziv: "",
        opis: "",
        identUzrastiList: []
      },
      mode: "list",
      columns: [
        {
          name: "naziv",
          required: true,
          label: this.$t("trainingExercises.name"),
          align: "left",
          field: "naziv",
          sortable: true
        },
        {
          name: "kategorija",
          align: "left",
          label: this.$t("trainingExercises.category"),
          field: "kategorija",
          sortable: true
        },
        // {
        //   name: "opis",
        //   align: "left",
        //   label: "Opis",
        //   field: "opis",
        //   sortable: true,
        //   style: 'max-width: 400px; overflow: hidden; text-overflow: ellipsis;',

        // },
        {
          name: "identUzrastiList",
          align: "left",
          label: this.$t("trainingExercises.ages"),
          field: "identUzrastiList",
          sortable: true,
          format: (val, row) => {
            var tmp = [];
            val.forEach(function (entry, index) {
              if (index == val.length - 1) tmp.push(entry.label);
              else tmp.push(entry.label + ", ");
            });
            return tmp;
          }
        },
        {
          name: "action",
          align: "left",
          label: this.$t("trainingExercises.action"),
          field: "action",
          sortable: true
        }
      ],
      data: [],
      filteredData: [],

      pagination: {
        rowsPerPage: 10
      },
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image", "video"]
          ],
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      }
    };
  },
  mounted() {
    this.getDataUzrasti(); //idemo da uzmenmo podatke iz baze
    this.a = window.$igracName;

    // change table height
    var temp = document.querySelectorAll(".q-table__middle");
    for (var i = 0; i < temp.length; i++)
      temp[i].style.setProperty("max-height", "calc(100vh - 200px)");
  },
  methods: {
    filtrirajTV() {
      let self = this;
      this.filteredData = [];
      this.data.forEach(function (entry) {
        if (self.filter.includes("*")) {
          var missCounter = 0
          self.filter.split("*").forEach(entry2 => {
            if (
              !entry.naziv.toLowerCase().includes(entry2.toLowerCase())
            )
              missCounter += 1
          })
          if (missCounter == 0)
            self.filteredData.push(entry);
        } else if (
          entry.naziv.toLowerCase().includes(self.filter.toLowerCase())
        )
          self.filteredData.push(entry);
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
    // citanje podataka o ulogama
    //........................................
    getDataUzrasti() {
      let linkStr = this.$apiPutanja + "/uzrast";
      var self = this;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          self.listOptions = response.data.map(self.dajUzraste);
          console.log("OVO JE LST OPCIJA");
          console.log(this.listOptions);
          console.log("OVO JE LST OPCIJA");
          debugger;
          self.getData();
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    dajUzraste(item) {
      return { label: item.naziv, value: item.ident };
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka
    //........................................
    getData() {
      let linkStr = this.$apiPutanja + "/trenazna-vezba";
      var self = this;
      self.loadingUtakmice = true;
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
          self.data = response.data;

          self.data.forEach(function (entry, index) {
            entry.identUzrastiList.forEach(function (entry1, index1) {
              self.listOptions.forEach(function (entry2) {
                if (entry1 == entry2.value)
                  self.data[index].identUzrastiList[index1] = entry2;
              });
            });
          });
          self.filteredData = self.data

          console.log("OVO SU VRACENE TRENAZNE VEZBE");
          console.log(self.data);
          console.log("OVO SU VRACENE TRENAZNE VEZBE");
          self.loadingUtakmice = false;
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          self.loadingUtakmice = false;
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje novog zapisa
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/trenazna-vezba";
      var self = this;
      let datetime = this.getDateTime1();

      var dataString = {
        kategorija: this.editedItem.kategorija,
        naziv: this.editedItem.naziv,
        opis: this.editedItem.opis,
        identUzrastiList: this.editedItem.identUzrastiList
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
        .then(function (response) {
          debugger;
          console.log(response);
          self.getData();
          self.$q.notify({
            message: self.$t("trainingExercises.newExerciseSuccessfullyAdded"),
            color: "green"
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena tima
    //........................................
    putData() {
      debugger;
      let linkStr =
        this.$apiPutanja + "/trenazna-vezba/" + this.editedItem.ident;
      var self = this;
      let datetime = this.getDateTime1();

      var listaIdentaUzrast = [];
      this.editedItem.identUzrastiList.forEach(function (entry) {
        listaIdentaUzrast.push(entry.value);
      });

      var dataString = {
        kategorija: this.editedItem.kategorija,
        naziv: this.editedItem.naziv,
        opis: this.editedItem.opis,
        identUzrastiList: listaIdentaUzrast
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
        .then(function (response) {
          debugger;
          console.log(response);
          self.getData();
          self.$q.notify({
            message: self.$t("trainingExercises.teamDataChangedSuccessfully"),
            color: "green"
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje/deaktiviranje tima
    //........................................
    deleteData(item) {
      debugger;
      let linkStr = this.$apiPutanja + "/trenazna-vezba/" + item.ident;
      var self = this;
      debugger;
      this.$axios
        .delete(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function (response) {
          debugger;
          console.log(response);
          self.getData();
          self.$q.notify({
            message: self.$t("trainingExercises.dataDeletedSuccessfully"),
            color: "green"
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // pomocna f-ja za formatiranje datuma
    //........................................
    getDateTime1() {
      const today = new Date();
      return today.toISOString();
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

      if (this.editedItem.naziv == null || this.editedItem.naziv == "")
        sveOK = false;
      if (
        this.editedItem.kategorija == null ||
        this.editedItem.kategorija == ""
      )
        sveOK = false;
      if (
        this.editedItem.identUzrastiList == null ||
        this.editedItem.identUzrastiList == ""
      )
        sveOK = false;
      if (sveOK == false) {
        this.$q.notify({
          message: this.$t("administration.user.notSaved"),
          color: "red"
        });
        this.zacrveniPrazne();
      } else {
        debugger;
        if (this.editedIndex > -1) {
          debugger;
          Object.assign(this.data[this.editedIndex], this.editedItem);
          this.putData();
          this.close();
        } else {
          this.postData();
          this.close();
        }
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
    //''''''''''''''''''''''''''''''''''''''''
    // брисање записа у локау, и позивање функције за брисање записа у бази
    //........................................
    deleteItem(item) {
      const index = this.data.indexOf(item);
      var self = this;
      let obj = {
        title: self.$t("trainingExercises.warning"),
        message: self.$t("trainingExercises.areYouSureDelete"),
        customCloseBtnText: self.$t("trainingExercises.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("trainingExercises.yes"),
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

      const status = exportFile("trenazneVezbe.csv", content, "text/csv");
      let self = this;
      if (status !== true) {
        this.$q.notify({
          message: self.$t("trainingExercises.browserForbids"),
          color: "negative",
          icon: "warning"
        });
      }
    },
    onEditorChange(value) {
      this.editedItem.opis = value.html;
    },
    onEditorBlur(editor) {
      console.log("editor blur!", editor);
    },
    onEditorFocus(editor) {
      console.log("editor focus!", editor);
    },
    onEditorReady(editor) {
      console.log("editor ready!", editor);
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
