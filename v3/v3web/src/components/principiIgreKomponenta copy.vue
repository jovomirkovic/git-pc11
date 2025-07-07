/* ako prepravka krene po zlu */

<template>
  <q-page class="q-pa-sm">
    <q-table
      title="Principi igre"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="ident"
      :grid="mode == 'grid'"
      :filter="filter"
      :pagination.sync="pagination"
      rows-per-page-label="Broj redova po strani"
      table-header-style="font-weight: bold; background: #ffeb3b4f; color: red; font-style: italic;"
    >
      <template v-slot:top-right="props">
        <q-btn
          @click="otvordeDialog()"
          outline
          color="primary"
          label="Novi princip"
          class="q-mr-xs"
        />

        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Pretraživanje"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          v-if="mode === 'list'"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            props.inFullscreen
              ? "Izađi iz moda celog ekrana"
              : "Otvori ceo ekran"
          }}</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="
            mode = mode === 'grid' ? 'list' : 'grid';
            separator = mode === 'grid' ? 'none' : 'horizontal';
          "
          v-if="!props.inFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            mode === "grid" ? "Lista" : "Mreža"
          }}</q-tooltip>
        </q-btn>

        <q-btn
          color="primary"
          icon-right="archive"
          label="Izvoz u CSV"
          no-caps
          @click="exportTable"
        />
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              @click="editItem(props.row)"
              dense
              color="primary"
              icon="edit"
            >
              <q-tooltip>
                Izmena podataka
              </q-tooltip>
            </q-btn>
            <q-btn
              @click="deleteItem(props.row)"
              dense
              color="red"
              icon="delete"
            >
              <q-tooltip>
                Brisanje
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog persistent v-model="new_customer">
      <q-card style="width: 600px; max-width: 60vw;">
        <q-card-section>
          <div class="text-h6">
            Unos
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <!--                   <q-item class="formular ponisti" style="">
                    <q-input dense outlined v-model="editedItem.datumVreme" label="Datum " mask="date" :rules="['date']" class="datumKlasa">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="editedItem.datumVreme" @input="() => $refs.qDateProxy.hide()"></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item> -->

              <q-item>
                <q-item-section>
                  <q-input
                    dense
                    outlined
                    v-model="editedItem.naziv"
                    label="Naziv"
                  ></q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    dense
                    outlined
                    v-model="editedItem.opis"
                    label="Opis"
                  ></q-input>
                </q-item-section>
              </q-item>
              <div class="row">
                <q-item style="width:90%">
                  <q-item-section>
                    <q-input
                      dense
                      outlined
                      v-model="editedItem.elementTaktike.naziv"
                      label="Element taktike"
                    ></q-input>
                  </q-item-section>
                </q-item>
                <q-btn
                  flat
                  round
                  dense
                  icon="more_vert"
                  @click="IzborTaktikeFN()"
                />
              </div>
              <div class="row">
                <q-item style="width:90%">
                  <q-item-section>
                    <q-input
                      dense
                      outlined
                      v-model="editedItem.identPrimarnogElementaTehnike"
                      label="Primarni element tehnike"
                    ></q-input>
                  </q-item-section>
                </q-item>
                <q-btn
                  flat
                  round
                  dense
                  icon="more_vert"
                  @click="izborPrimarneTehnikeFN()"
                />
              </div>
              <div class="row">
                <q-item style="width:90%">
                  <q-item-section>
                    <q-input
                      dense
                      outlined
                      v-model="editedItem.identSekundarnogElementaTehnike"
                      label="Sekundarni element tehnike"
                    ></q-input>
                  </q-item-section>
                </q-item>
                <q-btn
                  flat
                  round
                  dense
                  icon="more_vert"
                  @click="izborSekundarneTehnikeFN()"
                />
              </div>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            label="Odustani"
            @click="close"
            type="submit"
            color="primary"
            v-close-popup
          />
          <q-btn
            label="Snimi"
            @click="addRow"
            type="submit"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- dialog za izbor primarne tehnike -->
    <q-dialog persistent v-model="izborPrimarneTehnike">
      <q-card style="width: 600px; max-width: 60vw;">
        <q-card-section>
          <div class="text-h6">
            Izaberite tehniku
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    label="Grupa"
                    option-value="value"
                    option-label="label"
                    :options="listaGrupaTehnike"
                    v-model="selektovanaGrupaTehnike"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    label="Stavke grupe"
                    option-value="value"
                    option-label="label"
                    :options="listaStavkiTehnike"
                    v-model="selektovanaStavkaPrimarneTehnike"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            label="Odustani"
            @click="zatvoriDialogPrimarneTehnike"
            type="submit"
            color="primary"
            v-close-popup
          />
          <q-btn
            label="Snimi"
            @click="izabranaPrimarneTehnikeFN"
            type="submit"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- dialog za izbor sekundarne tehnike -->
    <q-dialog persistent v-model="izborSekundarneTehnike">
      <q-card style="width: 600px; max-width: 60vw;">
        <q-card-section>
          <div class="text-h6">
            Izaberite sekundarnu tehniku
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    label="Grupa"
                    option-value="value"
                    option-label="label"
                    :options="listaGrupaTehnike"
                    v-model="selektovanaGrupaTehnike"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    label="Stavke grupe"
                    option-value="value"
                    option-label="label"
                    :options="listaStavkiTehnike"
                    v-model="selektovanaStavkaSekundarneTehnike"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            label="Odustani"
            @click="zatvoriDialogSekundarneTehnike"
            type="submit"
            color="primary"
            v-close-popup
          />
          <q-btn
            label="Snimi"
            @click="izbranaSekundarneTehnikeFN"
            type="submit"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- dialog za izbor taktike -->
    <q-dialog persistent v-model="izborTaktike">
      <q-card style="width: 600px; max-width: 60vw;">
        <q-card-section>
          <div class="text-h6">
            Izaberite taktiku
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    label="Grupa"
                    option-value="value"
                    option-label="label"
                    :options="listaGrupaTaktike"
                    v-model="selektovanaGrupaTaktike"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    label="Stavke grupe"
                    option-value="value"
                    option-label="label"
                    :options="listaStavkiTaktike"
                    v-model="selektovanaStavkaTaktike"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            label="Odustani"
            @click="zatvoriDialogTaktike"
            type="submit"
            color="primary"
            v-close-popup
          />
          <q-btn
            label="Snimi"
            @click="izbranaTaktikaFN"
            type="submit"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
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
import promenaIgraca from "../components/promenaIgracaKomponenta";
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
      listaGrupaTehnike: [],
      listaGrupaTaktike: [],
      selektovanaGrupaTehnike: null,
      selektovanaGrupaTaktike: null,
      listaStavkiTehnike: [],
      listaStavkiTaktike: [],
      selektovanaStavkaPrimarneTehnike: null,
      selektovanaStavkaSekundarneTehnike: null,
      selektovanaStavkaTaktike: null,
      dialog_za_promenu_igraca: false, //dialog
      izborPrimarneTehnike: false, //dialog
      izborSekundarneTehnike: false,
      izborTaktike: false, //dialog
      igrac: "",
      igracID1: 0,
      timID1: 0,
      date: "",
      filter: "",
      customer: {},
      new_customer: false, //dialog
      editedIndex: -1,
      editedItem: {
        //datumVreme: "",
        elemetTaktike: "",
        grupaElementaTaktike: "",
        ident: 0,
        elementTaktike: {},
        identGrupeElementaTaktike: 0,
        identPrimarneGrupeElemetaTehnike: 0,
        identPrimarnogElementaTehnike: 0,
        identSekundarneGrupeElemetaTehnike: 0,
        identSekundarnogElementaTehnike: 0,
        naziv: "",
        opis: "",
        primarnaGrupaElementaTehnike: "",
        primarniElemetTehnike: "",
        sekundarnaGrupaElementaTehnike: "",
        sekundarniElementTehnike: ""
      },
      defaultItem: {
        //datumVreme: "",
        elemetTaktike: "",
        grupaElementaTaktike: "",
        ident: 0,
        elementTaktike: {},
        identGrupeElementaTaktike: 0,
        identPrimarneGrupeElemetaTehnike: 0,
        identPrimarnogElementaTehnike: 0,
        identSekundarneGrupeElemetaTehnike: 0,
        identSekundarnogElementaTehnike: 0,
        naziv: "",
        opis: "",
        primarnaGrupaElementaTehnike: "",
        primarniElemetTehnike: "",
        sekundarnaGrupaElementaTehnike: "",
        sekundarniElementTehnike: ""
      },
      mode: "list",
      columns: [
        // {
        //   name: "datumVreme",
        //   required: true,
        //   label: "Datum",
        //   align: "left",
        //   field: "datumVreme",
        //   sortable: true
        // },
        {
          name: "naziv",
          align: "left",
          label: "Naziv",
          field: "naziv",
          sortable: true
        },
        {
          name: "opis",
          align: "left",
          label: "Opis",
          field: "opis",
          sortable: true
        },

        {
          name: "action",
          align: "left",
          label: "Akcija",
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
    this.igrac = window.$igracName;
    this.igracID1 = window.$igracID;
    this.timID1 = window.$timID;
    this.date = Date.now();
    debugger;
    this.getData(); //idemo da uzmenmo podatke iz baze
    this.getDataGrupe(); //pokupimo odma i grupe tehnike
    this.getDataGrupeTaktike(); //i taktike
  },
  methods: {
    izborPrimarneTehnikeFN() {
      this.izborPrimarneTehnike = true;
    },
    izabranaPrimarneTehnikeFN() {
      debugger;
      this.editedItem.identPrimarnogElementaTehnike = this.selektovanaStavkaPrimarneTehnike;
    },
    izborSekundarneTehnikeFN() {
      debugger;
      this.izborSekundarneTehnike = true;
    },
    izbranaSekundarneTehnikeFN() {
      this.editedItem.identSekundarnogElementaTehnike = this.selektovanaStavkaSekundarneTehnike;
    },
    izbranaTaktikaFN() {
      debugger;
      this.editedItem.ElementTaktike.ident = this.selektovanaStavkaTaktike;
      this.editedItem.ElementTaktike.naziv =
        this.grupaElementaTaktike + " " + this.elementTaktike;
    },
    zatvoriDialogPrimarneTehnike() {
      this.izborPrimarneTehnike = false;
    },
    zatvoriDialogSekundarneTehnike() {
      this.izborSekundarneTehnike = false;
    },
    zatvoriDialogTaktike() {
      this.izborTaktike = false;
    },
    IzborTaktikeFN() {
      this.izborTaktike = true;
    },
    prenesiOvde(jen, dva, tri) {
      debugger;
      this.igrac = jen;
      this.igracID1 = dva;
      this.timID1 = tri;
      debugger;
      this.getData(); //idemo da uzmenmo podatke iz baze
    },
    izborIgraca() {
      this.dialog_za_promenu_igraca = true;
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje grupa технике
    //........................................
    getDataGrupe() {
      let linkStr = this.$apiPutanja + "/baza-tehnike-sifrarnik-grupa";
      let self = this;
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
          this.listaGrupaTehnike = response.data.map(this.dajGrupe);
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje grupa тактике
    //........................................
    getDataGrupeTaktike() {
      let linkStr = this.$apiPutanja + "/baza-taktike-sifrarnik-grupa";
      let self = this;
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
          this.listaGrupaTaktike = response.data.map(this.dajGrupe);
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
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka stavki
    //........................................
    getDataStavke() {
      let linkStr =
        this.$apiPutanja +
        "/baza-tehnike-sifrarnik-stavke?identGrupe=" +
        this.selektovanaGrupaTehnike;
      debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(response => {
          this.listaStavkiTehnike = response.data.map(this.dajStavke);
          console.log(this.data);
          //debugger
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka stavki
    //........................................
    getDataStavkeTaktike() {
      let linkStr =
        this.$apiPutanja +
        "/baza-taktike-sifrarnik-stavke?identGrupe=" +
        this.selektovanaGrupaTaktike;
      debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(response => {
          this.listaStavkiTaktike = response.data.map(this.dajStavke);
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
    getData() {
      let linkStr = this.$apiPutanja + "/princip-igre";
      debugger;
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
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje novog igraca
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/princip-igre";
      var self = this;
      var datumVreme1;
      try {
        datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      } catch (error) {}

      var dataString = {
        //"datumVreme": datumVreme1,
        identElementaTaktike: this.editedItem.ElementaTaktike.ident,
        identPrimarnogElementaTehnike: this.editedItem
          .identPrimarnogElementaTehnike,
        identSekundarnogElementaTehnike: this.editedItem
          .identSekundarnogElementaTehnike,
        naziv: this.editedItem.naziv,
        opis: this.editedItem.opis
      };
      debugger;
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
          self.getData();
          self.$q.notify({
            message: "Novi princip je uspešno dodat!",
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
    // izmena
    //........................................
    putData() {
      debugger;
      let linkStr = this.$apiPutanja + "/princip-igre/" + this.editedItem.ident;
      var self = this;
      //let datumVreme1 = this.getDateTime(this.editedItem.datumVreme);

      var dataString = {
        identElementaTaktike: this.editedItem.ElementaTaktike.ident,
        identPrimarnogElementaTehnike: this.editedItem
          .identPrimarnogElementaTehnike,
        identSekundarnogElementaTehnike: this.editedItem
          .identSekundarnogElementaTehnike,
        naziv: this.editedItem.naziv,
        opis: this.editedItem.opis
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
          self.getData();
          self.$q.notify({
            message: "Podaci su uspesno promenjeni!",
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
      let linkStr = this.$apiPutanja + "/princip-igre/" + item.ident;
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
          self.getData();
          self.$q.notify({
            message: "Podaci su uspesno obrisani!",
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
      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem);
        this.putData();
      } else {
        this.postData();
      }
      this.close();
    },
    deleteItem(item) {
      const index = this.data.indexOf(item);
      let obj = {
        title: "Upozorenje!",
        message: "Da li zaista želite da izbrišete tekući zapis?",
        customCloseBtnText: "Ne",
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: "Da, želim",
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
      this.new_customer = true;
    },
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.new_customer = true;
    },
    close() {
      this.new_customer = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
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

      const status = exportFile("principiIgre.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Pregledač ne dozvoljava snimanje fajlova...",
          color: "negative",
          icon: "warning"
        });
      }
    }
  },
  watch: {
    selektovanaGrupaTehnike: function(val) {
      this.selektovanaStavkaPrimarneTehnike = "";
      //this.selektovanaStavkaSekundarneTehnike = "";
      this.getDataStavke();
    },
    selektovanaGrupaTaktike: function(val) {
      this.selektovanaStavkaSekundarneTaktike = "";
      this.getDataStavkeTaktike();
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
</style>
