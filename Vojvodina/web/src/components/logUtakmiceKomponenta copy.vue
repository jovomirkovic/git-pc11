<template>
  <q-page class="q-pa-sm">
    <q-table
      title="Tok utkmice"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="userName"
      :grid="mode=='grid'"
      :filter="filter"
      :pagination.sync="pagination"
      rows-per-page-label="Broj redova po strani"
      :no-data-label="$t('table.noData')"
          :loading-label="$t('table.loadingLabel')"
      no-results-label="Nije pronađen ni jedan zapis koji odgovara filteru."
      table-header-style="font-weight: bold; background: #ffeb3b4f; color: red; font-style: italic;"
      :loading="loadingLog"
    >
      <template v-slot:top-right="props">
        <q-btn
          @click="otvordeDialog()"
          outline
          color="primary"
          label="Nova stavka"
          class="q-mr-xs"
        />

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
              <q-tooltip>Izmena podataka </q-tooltip>
            </q-btn>
            <q-btn @click="deleteItem(props.row)" dense color="red" icon="delete">
              <q-tooltip>Brisanje</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>

    <!-- dialog za tok utakmice -->
    <q-dialog persistent v-model="new_customer">
      <q-card style="width: 800px; max-width: 80vw; border-radius: 5px; box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7);">
        <q-card-section>
          <div class="text-h6">
            {{this.naslov}}
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">

          <q-list>

            <q-item v-if="editedIndex > -1">
              <q-input filled v-model="samoVreme" mask="fulltime" :rules="['fulltime']">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="samoVreme" with-seconds format24h >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zatvori" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>

            <q-item v-else>
              <q-input filled v-model="samoDatum">
                 <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="samoDatum" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zatvori" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input filled v-model="samoVreme">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="samoVreme" with-seconds format24h >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zatvori" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>



            <q-item>
              <q-item-section>
                <q-select dense outlined label="Igrač" option-value="value" option-label="label"
                  :options="igraci" v-model="editedItem.igracID" emit-value map-options />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-select dense outlined label="Tip događaja" option-value="value" option-label="label"
                  :options="listaTipova" v-on:input="promenaTipa()" v-model="editedItem.type" emit-value map-options
                  />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-select dense outlined label="Stavka" option-value="value" option-label="label"
                  :options="dataStavke" v-model="editedItem.oCemSeRadi" emit-value map-options />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-select dense outlined label="Ocena" option-value="value" option-label="label"
                  :options="listaOcena" v-model="editedItem.ocenaIzvodjenja" emit-value map-options />
              </q-item-section>
            </q-item>


              <q-item>
                <q-item-section>
                  <q-input dense disable outlined v-model="editedItem.uneo" label="Uneo"></q-input>
                </q-item-section>
              </q-item>


<!--
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    label="Uloga"
                    option-value="value"
                    option-label="label"
                    multiple
                    use-chips
                    :options="listOptions"
                    v-model="editedItem.roles"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-input dense outlined v-model="editedItem.ime" label="Ime"></q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input dense outlined v-model="editedItem.prezime" label="Prezime"></q-input>
                </q-item-section>
              </q-item> -->
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn label="Odustani" @click="close" type="submit" color="primary" v-close-popup ></q-btn>
          <q-btn label="Snimi" @click="addRow" type="submit" color="primary" v-close-popup ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { exportFile } from "quasar";
import {date} from 'quasar';

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  props: ['ajdiTekme','igraciSelekcije'],
  data() {
    return {
      samoVreme: "",                    //vreme iz loga, ali samo vreme bez datuma
      samoDatum: "",
      loadingLog: false,               //indikator ucitavanje podataka
      igraci: this.igraciSelekcije,
      idUtakmice: this.ajdiTekme,
      dialogZaPromenuVremena: false,
      filter: "",
      dataStavke: [],
      naslov: "Tok utakmice",
      listOptions: [],
      listaTipova: [
          // {
          //   label: 'Početak utakmice',
          //   value: 'START'
          // },
          {
            label: 'Ocena tehnike',
            value: 'TEHNIKA'
          },
          {
            label: 'Ocena taktike',
            value: 'TAKTIKA'
          },
          {
            label: 'Ocena principa igre',
            value: 'PRINCIP_IGRE'
          },
          // {
          //   label: 'Kraj prvog pluvremena',
          //   value: 'HALFTIME_END'
          // },
          // {
          //   label: 'Početak drugog pluvremena',
          //   value: 'HALFTIME_START'
          // },
          // {
          //   label: 'Zamena',
          //   value: 'ZAMENA'
          // },
          {
            label: 'Gol',
            value: 'GOL'
          },
          // {
          //   label: 'Kraj utakmice',
          //   value: 'END'
          // }
        ],
      listaOcena: [{
            label: '+',
            value: 1
          },
          {
            label: 'Bez ocene',
            value: 0
          },
          {
            label: '-',
            value: -1
          },
        ],
      customer: {},
      new_customer: false,
      editedIndex: -1,
      editedItem: {
        ident: 0,
        bazaTaktikeSifrarnikStavke: null,
        bazaTehnikeSifrarnikStavke: null,
        igrac: '',
        igracID: 0,
        oCemSeRadi: '',
        oCemSeRadiID: "",
        ocenaIzvodjenja: '',
        principIgre: '',
        type: '',
        uneo: '',
        vremeUnosa: ''
      },
      defaultItem: {
        ident: 0,
        bazaTaktikeSifrarnikStavke: null,
        bazaTehnikeSifrarnikStavke: null,
        igrac: '',
        igracID: 0,
        oCemSeRadi: '',
        oCemSeRadiID: "",
        ocenaIzvodjenja: '',
        principIgre: '',
        type: '',
        uneo: '',
        vremeUnosa: ''
      },
      mode: "list",
      columns: [
        {
          name: "vremeUnosa",
          label: "Vreme unosa",
          align: "left",
          field: "vremeUnosa",
          sortable: true,
          format: val => date.formatDate(val, 'DD/MM/YYYY HH:mm:ss')
        },
        {
          name: "type",
          align: "left",
          label: "Tip događaja",
          field: "type",
          sortable: true
        },
        {
          name: "igrac",
          align: "left",
          label: "Igrač",
          field: "igrac",
          sortable: true
        },
        {
          name: "oCemSeRadi",
          align: "left",
          label: "Stavka",
          field: "oCemSeRadi",
          sortable: true
        },
        // {
        //   name: "bazaTehnikeSifrarnikStavke",
        //   align: "left",
        //   label: "Sifra tehnike",
        //   field: "bazaTehnikeSifrarnikStavke",
        //   sortable: true
        // },
        // {
        //   name: "bazaTaktikeSifrarnikStavke",
        //   align: "left",
        //   label: "Sifra taktike",
        //   field: "bazaTaktikeSifrarnikStavke",
        //   sortable: true
        // },
        // {
        //   name: "principIgre",
        //   align: "left",
        //   label: "Princip igre",
        //   field: "principIgre",
        //   sortable: true
        // },
        {
          name: "ocenaIzvodjenja",
          align: "left",
          label: "Ocena izvođenja",
          field: "ocenaIzvodjenja",
          sortable: true
        },
        {
          name: "uneo",
          align: "left",
          label: "Uneo",
          field: "uneo",
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
    //this.getData() //idemo da uzmenmo podatke iz baze
    this.getData(this.idUtakmice);
    this.igraci = this.igraci.map(this.dajIgrace)
    console.log(this.igraci)
    debugger
  },
  methods: {
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o elementim
    //........................................
    getData(ajdi) {
      let linkStr = this.$apiPutanja + "/element-sa-utakmice/utakmica/" + ajdi;
      this.loadingLog = true;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          this.data = response.data.map(this.dajLog);;
          this.loadingLog = false
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
          this.loadingLog = false
        });
    },
    otvordeDialog() {
      this.editedItem.vremeUnosa = this.getDateTime(Date.now());
      this.editedItem.uneo = window.$userName
      this.new_customer=true
    },
    dajLog(item) {
        debugger

        let _bazaTehnikeSifrarnikStavke = item.bazaTehnikeSifrarnikStavke == null ? '' : item.bazaTehnikeSifrarnikStavke.bazaTehnikeSifrarnikGrupe.grupa + '-' + item.bazaTehnikeSifrarnikStavke.naziv
        let _bazaTehnikeSifrarnikStavkeID = item.bazaTehnikeSifrarnikStavke == null ? '' : item.bazaTehnikeSifrarnikStavke.ident
        let _bazaTaktikeSifrarnikStavke = item.bazaTaktikeSifrarnikStavke == null ? '' : item.bazaTaktikeSifrarnikStavke.bazaTaktikeSifrarnikGrupe.grupa + '-' + item.bazaTaktikeSifrarnikStavke.naziv
        let _bazaTaktikeSifrarnikStavkeID = item.bazaTaktikeSifrarnikStavke == null ? '' : item.bazaTaktikeSifrarnikStavke.ident
        let _igrac = item.igrac == null ? '' : item.igrac.ime + ' ' + item.igrac.prezime
        let _igracID = item.igrac == null ? '' : item.igrac.id
        let _principIgre = item.principIgre == null ? '' : item.principIgre.naziv
        let _principIgreID = item.principIgre == null ? '' : item.principIgre.ident

        let nekoIme = item.strucniStab.ime == null ? '' : item.strucniStab.ime
        let nekoPrezime = item.strucniStab.prezime == null ? '' : item.strucniStab.prezime
        let neko = nekoIme + ' ' + nekoPrezime

        let stavkaKojaSeOcenjuje = null;
        let stavkaKojaSeOcenjujeID = null;
        if(_bazaTehnikeSifrarnikStavke != '') stavkaKojaSeOcenjuje = _bazaTehnikeSifrarnikStavke
        if(_bazaTaktikeSifrarnikStavke != '') stavkaKojaSeOcenjuje = _bazaTaktikeSifrarnikStavke
        if(_principIgre != '') stavkaKojaSeOcenjuje = _principIgre

        if(_bazaTehnikeSifrarnikStavke != '') stavkaKojaSeOcenjujeID = _bazaTehnikeSifrarnikStavkeID
        if(_bazaTaktikeSifrarnikStavke != '') stavkaKojaSeOcenjujeID = _bazaTaktikeSifrarnikStavkeID
        if(_principIgre != '') stavkaKojaSeOcenjujeID = _principIgreID


        return {
          ident: item.ident,
          vremeUnosa: item.vremeUnosa,
          type: item.type,
          bazaTehnikeSifrarnikStavke: _bazaTehnikeSifrarnikStavke,
          bazaTehnikeSifrarnikStavkeID: _bazaTehnikeSifrarnikStavkeID,
          bazaTaktikeSifrarnikStavke: _bazaTaktikeSifrarnikStavke,
          bazaTaktikeSifrarnikStavkeID: _bazaTaktikeSifrarnikStavkeID,
          oCemSeRadi: stavkaKojaSeOcenjuje,
          oCemSeRadiID: stavkaKojaSeOcenjujeID,
          igrac: _igrac,
          igracID: _igracID,
          uneo: neko,
          principIgre: _principIgre,
          principIgreID: _principIgreID,
          ocenaIzvodjenja: item.ocenaIzvodjenja,

        };
      },
      promenaTipa() {
        debugger
        this.editedItem.oCemSeRadi = ''
        this.editedItem.ocenaIzvodjenja = ''
        switch (this.editedItem.type) {
          case 'TEHNIKA':
            this.getDataTehnika();
            break;
          case 'TAKTIKA':
            this.getDataTaktika();
            break;
          case 'PRINCIP_IGRE':
            this.getDataPrincipIgre();
            break;

          default:
            this.dataStavke = [];
            this.editedItem.oCemSeRadi = ''
            this.editedItem.igrac = ''
            this.editedItem.ocenaIzvodjenja = 0
            break;
        }
      },
      //''''''''''''''''''''''''''''''''''''''''
      // citanje tehnike
      //........................................
      getDataTehnika() {
        let linkStr = this.$apiPutanja +  '/zadati-nivo-tehnike'
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
              this.dataStavke = response.data.map(this.dajStavke);
              debugger
            })
            .catch(e => {
              //this.errors.push(e);
              console.log("Greska: " + e);
            });
      },
      //''''''''''''''''''''''''''''''''''''''''
      // citanje tehnike
      //........................................
      getDataTaktika() {
        let linkStr = this.$apiPutanja +  '/zadati-nivo-taktike'
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
              this.dataStavke = response.data.map(this.dajStavke);
              debugger
            })
            .catch(e => {
              //this.errors.push(e);
              console.log("Greska: " + e);
            });
      },
    //''''''''''''''''''''''''''''''''''''''''
      // citanje principa igre
      //........................................
      getDataPrincipIgre() {
        let linkStr = this.$apiPutanja + '/princip-igre'
        debugger;
            this.$axios
            .get(linkStr,{
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer  " + window.$token
                    }
                })
            .then(response => {
                debugger
                //this.data = response.data;
                this.dataStavke = response.data.map(this.dajStavkeZaPrincip);
                debugger
            })
            .catch(e => {
                //this.errors.push(e);
                console.log("Greska: " + e);
            });
        },
        dajStavkeZaPrincip(item) {
        debugger
        return { label: item.naziv + '-' + item.opis, value: item.ident, nazivGrupe: item.naziv, nazivStavke: item.opis };
      },
    //''''''''''''''''''''''''''''''''''''''''
    // pomocna f-ja za formatiranje datuma
    //........................................
    getDateTime() {
      debugger
      const today = new Date();
      return today.toISOString();
    },
    getDateTime1(a) {
      debugger
      let timeStamp = new Date(a)
      //let vrati = date.formatDate(a, 'YYYY-MM-DDTHH:mm:ss.SSS') + "Z"
      const vrati = timeStamp.toISOString();
      return vrati
    },
    dajIgrace(item) {
      return { label: item.ime + ' ' + item.prezime, value: item.id };
    },
    dajStavke(item) {
      debugger
      return { label: item.grupa + '-' + item.naziv, value: item.identStavke };
    },
    //''''''''''''''''''''''''''''''''''''''''
    // pomocna f-ja za promenu igraca
    //........................................
    promeniIgraca() {
      this.editedItem.vremeUnosa = this.getDateTime1(this.editedItem.vremeUnosa)
      this.dialogZaPromenuVremena = true
    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje zapisa
    //........................................
      deleteData(item) {
      let linkStr = this.$apiPutanja +  '/element-sa-utakmice/' + item.ident
      var self=this;
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
          self.getData(self.idUtakmice);
          self.$q.notify({
            message: "Podaci su uspešno obrisani!",
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          self.$q.notify({
            message: "Podaci NISU uspešno obrisani!",
            color: "red",
            actions: [
              { label: 'U redu', color: 'white', handler: () => { /* ... */ } }
            ]
          });
        });

    },
    addRow() {

      debugger
      // this.$refs.userName.validate()
      // if(this.$refs.userName.hasError) {
      //   this.formHasError = true
      //    this.$q.notify({
      //     color: 'negative',
      //     message: 'Попуните сва потребна поља'
      //   })

      // } else {
      //   if (this.editedIndex > -1) {
      //     debugger;
      //     Object.assign(this.data[this.editedIndex], this.editedItem);
      //     this.naslov = "Izmena podataka за корисника";
      //     this.putData();
      //   } else {
      //     this.naslov = "Novi korisnik";
      //     //this.data.push(this.editedItem);
      //     this.postData();
      //   }
      //   this.close();
      // }

      if (this.editedIndex > -1) {
          debugger;
          Object.assign(this.data[this.editedIndex], this.editedItem);
          this.naslov = "Izmena stavke";
          this.putLogUtakmice();
        } else {
          //ovde nema dodavanja loga!
          //this.naslov = "Izmena stavke";
          this.postLogUtakmice();
        }
        this.close();

    },
      //''''''''''''''''''''''''''''''''''''''''
      // izmena loga - toka utakmice
      //........................................
      putLogUtakmice() {
        debugger;

        var identBazaTaktikeSifrarnikStavke, identBazaTehnikeSifrarnikStavke, identPrincipIgre

        switch (this.editedItem.type) {
          case 'TEHNIKA':
            identBazaTehnikeSifrarnikStavke = this.editedItem.identBazaTehnikeSifrarnikStavkeID
            identBazaTaktikeSifrarnikStavke = null
            identPrincipIgre = null
            break;
          case 'TAKTIKA':
            identBazaTehnikeSifrarnikStavke = null
            identBazaTaktikeSifrarnikStavke = this.editedItem.identBazaTaktikeSifrarnikStavkeID
            identPrincipIgre = null
            break;
          case 'PRINCIP_IGRE':
            identBazaTehnikeSifrarnikStavke = null
            identBazaTaktikeSifrarnikStavke = null
            identPrincipIgre = this.editedItem.identPrincipIgreID
            break;

          default:
            identBazaTehnikeSifrarnikStavke = null
            identBazaTaktikeSifrarnikStavke = null
            identPrincipIgre = null
            break;
        }

        //let linkStr = this.$apiPutanja + "/podaci-o-elementu-tokom-utakmice";
        let linkStr = this.$apiPutanja + "/element-sa-utakmice/" + this.editedItem.ident;

        var self = this;

        var dataString = {
            identBazaTaktikeSifrarnikStavke: identBazaTaktikeSifrarnikStavke,
            identBazaTehnikeSifrarnikStavke: identBazaTehnikeSifrarnikStavke,
            identIgrac: this.editedItem.igracID,
            identPrincipIgre: identPrincipIgre,
            identStrucniStab: window.$userID,
            identUtakmica: this.idUtakmice,
            ocenaIzvodjenja: this.editedItem.ocenaIzvodjenja,
            type: this.editedItem.type,
            vremeUnosa: this.getDateTime1(this.samoDatum + "T" + this.samoVreme + ".000Z")
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
            self.getData(self.idUtakmice);
            self.$q.notify({
              icon: 'done',
              message: "Događaj je uspešno promenjen!",
              color: "positive"
            });
          })
          .catch(function (response) {
            //handle error
            console.log(response);
            alert(response);
          });
      },
      //''''''''''''''''''''''''''''''''''''''''
      // dodavanje loga u tok utakmice
      //........................................
      postLogUtakmice() {
        debugger;

        let linkStr = this.$apiPutanja + "/element-sa-utakmice/"

        var self = this;

        var identBazaTaktikeSifrarnikStavke, identBazaTehnikeSifrarnikStavke, identPrincipIgre

        switch (this.editedItem.type) {
          case 'TEHNIKA':
            identBazaTehnikeSifrarnikStavke = this.editedItem.oCemSeRadiID
            identBazaTaktikeSifrarnikStavke = null
            identPrincipIgre = null
            break;
          case 'TAKTIKA':
            identBazaTehnikeSifrarnikStavke = null
            identBazaTaktikeSifrarnikStavke = this.editedItem.oCemSeRadiID
            identPrincipIgre = null
            break;
          case 'PRINCIP_IGRE':
            identBazaTehnikeSifrarnikStavke = null
            identBazaTaktikeSifrarnikStavke = null
            identPrincipIgre = this.editedItem.oCemSeRadiID
            break;

          default:
            identBazaTehnikeSifrarnikStavke = null
            identBazaTaktikeSifrarnikStavke = null
            identPrincipIgre = null
            break;
        }

        var dataString = {
            identBazaTaktikeSifrarnikStavke: identBazaTaktikeSifrarnikStavke,
            identBazaTehnikeSifrarnikStavke: identBazaTehnikeSifrarnikStavke,
            identIgrac: this.editedItem.igrac,
            identPrincipIgre: identPrincipIgre,
            identStrucniStab: window.$userID,
            identUtakmica: this.idUtakmice,
            ocenaIzvodjenja: this.editedItem.ocenaIzvodjenja,
            type: this.editedItem.type,
            vremeUnosa: this.getDateTime1(this.samoDatum + "T" + this.samoVreme + ".000Z")
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
            self.getData(self.idUtakmice);
            self.$q.notify({
              icon: 'done',
              message: "Događaj je uspešno dodat!",
              color: "positive"
            });
          })
          .catch(function (response) {
            //handle error
            console.log(response);
            alert(response);
          });
      },
    deleteItem(item) {
      const index = this.data.indexOf(item);
      this.deleteData(item);
      // let obj = {
      //   title: "Upozorenje!",
      //   message: "Da li zaista želite da izbrišete tekući zapis?",
      //   customCloseBtnText: "Ne",
      //   disableOverlayClick: true,
      //   useConfirmBtn: true,
      //   customConfirmBtnText: "Da, želim",
      //   onConfirm: onConfirmWrapper,
      //   type: "warning",
      //   showXclose: true
      // };
      // this.$Simplert.open(obj);
      // var self = this;
      // function onConfirmWrapper() {
      //   self.data.splice(index, 1);
      //   self.deleteData(item);
      // }
    },
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      //debugger

      this.samoDatum = date.formatDate(this.editedItem.vremeUnosa, 'YYYY-MM-DD')
      this.samoVreme = date.formatDate(this.editedItem.vremeUnosa, 'HH:mm:ss')
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

      const status = exportFile("logUtakmice.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Pregledač ne dozvoljava snimanje fajlova...",
          color: "negative",
          icon: "warning"
        });
      }
    }
  }
};
</script>

<style scoped>
</style>
