<template>
  <q-page class="q-pa-sm">

        <q-table
          title="Formacije"
          :data="data"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="name"
          :grid="mode=='grid'"
          :filter="filter"
          :pagination.sync="pagination"
          rows-per-page-label="Broj redova po strani"
          :no-data-label="$t('table.noData')"
          :loading-label="$t('table.loadingLabel')"
          no-results-label="Nije pronađen nijedan zapis koji odgovara filteru."
          table-header-style="font-weight: bold; background: #ffeb3b4f; color: red; font-style: italic;"
        >
<!--           selection="single"
          :selected.sync="selected" -->

          <template v-slot:top-right="props">
            <q-btn @click="otvordeDialog()" outline color="primary" label="Nova formacija" class="q-mr-xs" />

            <q-input outlined dense debounce="300" v-model="filter" placeholder="Pretraživanje">
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
              <q-tooltip
                :disable="$q.platform.is.mobile"
                v-close-popup
              >{{props.inFullscreen ? 'Izađi iz moda celog ekrana' : 'Otvori ceo ekran'}}</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              :icon="mode === 'grid' ? 'list' : 'grid_on'"
              @click="mode = mode === 'grid' ? 'list' : 'grid'; separator = mode === 'grid' ? 'none' : 'horizontal'"
              v-if="!props.inFullscreen"
            >
              <q-tooltip
                :disable="$q.platform.is.mobile"
                v-close-popup
              >{{mode==='grid' ? 'Lista' : 'Mreža'}}</q-tooltip>
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
                <q-btn @click="editItem(props.row)" dense color="primary" icon="edit">
                    <q-tooltip>
                      Izmena podataka o formaciji
                    </q-tooltip>
                </q-btn>
                <q-btn @click="deleteItem(props.row)" dense color="red" icon="delete">
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
                {{this.naslov}}
              </div>
            </q-card-section>
            <q-separator inset></q-separator>
            <q-card-section class="q-pt-none">
              <q-form class="q-gutter-md">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.name" label="Naziv formacije"></q-input>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.description" label="Opis"></q-input>
                    </q-item-section>
                  </q-item>

                </q-list>

<!-- tabela strucni stab
:selected.sync="listaSelektovanihPozicija"
-->

          <q-table
          title="Pozicije u formaciji"
          :data="listaPozicija"
          :hide-header="modePozicije === 'grid'"
          :columns="columnsPozicije"
          row-key="ident"
          :grid="modePozicije=='grid'"
          :filter="filterPozicije"
          :pagination.sync="paginationPozicije"
          rows-per-page-label="Broj redova po strani"
          table-header-style="font-weight: bold; background: #ffeb3b4f; color: red; font-style: italic;"
          :selected.sync="editedItem.pozicije"
          selection="multiple"
        >


          <template v-slot:top-right="props1">
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Pretraživanje">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              flat
              round
              dense
              :icon="mode === 'grid' ? 'list' : 'grid_on'"
              @click="modePozicije = modePozicije === 'grid' ? 'list' : 'grid'; separator = modePozicije === 'grid' ? 'none' : 'horizontal'"
              v-if="!props1.inFullscreen"
            >
              <q-tooltip
                :disable="$q.platform.is.mobile"
                v-close-popup
              >{{mode==='grid' ? 'Lista' : 'Mreža'}}</q-tooltip>
            </q-btn>

          </template>
          <template v-slot:body-cell-action="props1">
            <q-td :props="props1">
              <div class="q-gutter-sm">

              </div>
            </q-td>
          </template>
        </q-table>




              </q-form>
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn label="Odustani" @click="close" type="submit" color="primary" v-close-popup />
              <q-btn label="Snimi" @click="addRow" type="submit" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>



    </q-page>

</template>

<script>
import { exportFile } from "quasar";

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
      tableKey: 1,
      listaPozicija: [],    //lista svih pozicija
      listaSelektovanihPozicija: [],    //lista selektovanih pozicija za odredjenu formaciju
      filter: "",
      filterPozicije: "",
      naslov: "Formacije",
      customer: {},
      new_customer: false,
      editedIndex: -1,
      editedItem: {
        ident: 0,
        name: "",
        description: "",
        pozicije:[]
      },
      defaultItem: {
        ident: 0,
        name: "",
        description: "",
        pozicije:[]
      },
      mode: "list",
      modePozicije:"list",
      columns: [
        // {
        //   name: "id",
        //   required: true,
        //   label: "Identifikator",
        //   align: "left",
        //   field: "id",
        //   sortable: true
        // },
        {
          name: "name",
          align: "left",
          label: "Formacija",
          field: "name",
          sortable: true
        },
        {
          name: "description",
          align: "left",
          label: "Opis",
          field: "description",
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
      columnsPozicije: [
        {
          name: "name",
          align: "left",
          label: "Pozicija",
          field: "name",
          sortable: true
        },
        {
          name: "code",
          align: "left",
          label: "Kod",
          field: "code",
          sortable: true
        },{
          name: "category",
          align: "left",
          label: "Kategorija",
          field: "category",
          sortable: true
        },

      ],
      data: [],

      pagination: {
        rowsPerPage: 10
      },
      paginationPozicije: {
        rowsPerPage: 10
      },

    };
  },
  beforeMount() {

  },
  mounted() {
    this.getData() //idemo da uzmenmo podatke iz baze
    this.getDataPozicije()  //pozicije
  },
  methods: {
    //''''''''''''''''''''''''''''''''''''''''
    // citanje rola
    //........................................
    getData() {
      let linkStr = this.$apiPutanja +  '/formacija'
      //debugger;
        this.$axios
          .get(linkStr,{
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer  " + window.$token
                }
              })
          .then(response => {
            debugger
            this.data = response.data;
            debugger

          })
          .catch(e => {
            //this.errors.push(e);
            console.log("Greska: " + e);
          });
    },
    getDataPozicijeUformaciji(indeks) {
      let linkStr = this.$apiPutanja +  '/formacija'
      let self = this;
      //debugger;
        this.$axios
          .get(linkStr,{
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer  " + window.$token
                }
              })
          .then(response => {
            debugger
            //self.data = response.data;
            //self.listaSelektovanihPozicija = response.data[indeks].pozicije
            self.editedItem.pozicije = response.data[indeks].pozicije
            debugger

          })
          .catch(e => {
            //this.errors.push(e);
            console.log("Greska: " + e);
          });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje sifrarnika pozicja
    //........................................
    getDataPozicije() {
      let linkStr = this.$apiPutanja +  '/pozicje-u-timu'
        this.$axios
          .get(linkStr,{
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer  " + window.$token
                }
              })
          .then(response => {
            debugger
            this.listaPozicija = response.data  //.map(this.dajPozicije);
            debugger

          })
          .catch(e => {
            //this.errors.push(e);
            console.log("Greska: " + e);
          });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje nove formacije
    //........................................
    postData() {
    debugger
      let linkStr = this.$apiPutanja +  '/formacija'
      var self=this;

      var dataString = {
        description: this.editedItem.description,
        name: this.editedItem.name,
        pozicije: this.editedItem.pozicije  // this.listaSelektovanihPozicija
      };

      let data1 = JSON.stringify(dataString);

debugger
      this.$axios
        .post(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function(response) {
          debugger
          console.log(response);
          self.$q.notify({
            message: "Nova formacija je uspešno dodata!",
          color: "green"
        });
        self.getData();
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          alert(response);
        });

    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena formacije
    //........................................
    putData() {
    debugger
      let linkStr = this.$apiPutanja +  '/formacija/' + this.editedItem.ident
      var self=this;
      let datetime = this.getDateTime();

      var dataString = {
        description: this.editedItem.description,
        name: this.editedItem.name,
        pozicije: this.editedItem.pozicije  //this.listaSelektovanihPozicija
      };

      let data1 = JSON.stringify(dataString);

debugger
      this.$axios
        .put(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function(response) {
          debugger
          console.log(response);
          self.getData();
          self.$q.notify({
            message: "Podaci su uspešno promenjeni!",
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
    // brisanje/deaktiviranje formacije
    //........................................
    deleteData(item) {
    debugger
      let linkStr = this.$apiPutanja +  '/formacija/' + item.ident
      var self=this;
debugger
      this.$axios
        .delete(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function(response) {
          debugger
          console.log(response);
          self.getData();
          self.$q.notify({
            message: "Podaci su uspešno obrisani!",
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
    getDateTime1() {
      const today = new Date();
      return today.toISOString();
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavanje novog i editovanje zapisa
    //........................................
    addRow() {
      debugger
      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem);
        this.naslov = "Izmena podataka"
        this.putData();
      } else {
        this.naslov = "Nova formacija"
        //this.data.push(this.editedItem);
        this.postData();
      }
      this.close()
    },
    //''''''''''''''''''''''''''''''''''''''''
    // брисање записа у локау, и позивање функције за брисање записа у бази
    //........................................
    deleteItem(item) {
      const index = this.data.indexOf(item);
      let obj = {
            title: 'Upozorenje!',
            message: 'Da li zaista želite da izbrišete tekući zapis?',
            customCloseBtnText: 'Ne',
            disableOverlayClick: true,
            useConfirmBtn: true,
            customConfirmBtnText: 'Da, želim',
            onConfirm: onConfirmWrapper,
            type: 'warning',
            showXclose: true,
        }
        this.$Simplert.open(obj);
        var self=this
        function onConfirmWrapper ()  {
            self.data.splice(index, 1);
            debugger
            self.deleteData(item);
        }

    },
    otvordeDialog() {
      //this.editedItem.datumVreme = this.getDateTime(Date.now());
      this.new_customer=true
    },
    //''''''''''''''''''''''''''''''''''''''''
    // едитовање појединачног записа
    //........................................
    editItem(item) {
      debugger
      this.editedIndex = this.data.indexOf(item);
      //this.getDataPozicijeUformaciji(this.editedIndex)
      this.editedItem = Object.assign({}, item);
      //this.listaSelektovanihPozicija = item.pozicije
      //this.getDataPozicijeUformaciji(this.editedIndex)
      this.new_customer = true;
    },
    //''''''''''''''''''''''''''''''''''''''''
    // затварање дијалога
    //........................................
    close () {
      this.new_customer = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
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

      const status = exportFile("formacije.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Pregledač ne dozvoljava snimanje fajlova...",
          color: "negative",
          icon: "warning"
        });
      }
    }
  },
  watch : {
    listaSelektovanihPozicija:function(val) {
      this.listaSelektovanihPozicija = val
      debugger
      console.log(this.listaSelektovanihPozicija)
    },
  },
};
</script>
