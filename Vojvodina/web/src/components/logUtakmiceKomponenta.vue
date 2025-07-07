<template>
  <q-page class="q-pa-sm">
    <q-table
      :title="$t('matches.theCourseOfTheMatch')"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="userName"
      :grid="mode=='grid'"
      :filter="filter"
      :pagination.sync="pagination"
      :rows-per-page-label="$t('matches.rowsPerPage')"
      :no-data-label="$t('matches.noData')"
      :loading-label="$t('matches.loading')"
      :no-results-label="$t('log.noResultLabel')"
      :loading="loadingLog"
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
          :label="$t('log.newItem')"
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
          >{{props.inFullscreen ? $t('matches.exitFullscreen') : $t('matches.enterFullscreen')}}</q-tooltip>
        </q-btn> -->

        <q-btn
          flat
          round
          dense
          class="plavaKlasaTekst"
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="mode = mode === 'grid' ? 'list' : 'grid'; separator = mode === 'grid' ? 'none' : 'horizontal'"
          v-if="!props.inFullscreen"
        >
          <q-tooltip
            :disable="$q.platform.is.mobile"
            v-close-popup
          >{{mode==='grid' ? $t('matches.list') : $t('matches.grid')}}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('matches.exportCSV')"
          no-caps
          @click="exportTable"
        />
      </template>

      <template v-slot:header-cell-action="props">
        <q-th style="color: #ffffff00; min-width: 110px">
          {{ props.col.label }}
        </q-th>
      </template>
      <template v-slot:body-cell-ocenaIzvodjenja="props">
        <q-td v-if="props.value == 1" style="text-align: center">
          <q-icon name="add" color="green" size="32px" />
        </q-td>
        <q-td v-else-if="props.value == -1" style="text-align: center">
          <q-icon name="remove" color="red" size="32px" />
        </q-td>
        <q-td v-else>
          <!-- <q-icon name="remove" color="red" size="32px" /> -->
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props" v-if="props.value == props.row.action">
          <div class="q-gutter-sm">
            <!-- {{props.value}} -->
            <q-btn
              @click="deleteItem(props.row)"
              id="dugmeBrisi"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="delete"
            >
              <q-tooltip>{{ $t("matches.delete") }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="editItem(props.row)"
              id="dugmeEdit"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="edit"
            >
              <q-tooltip>{{ $t("matches.changeData") }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>

    <!-- dialog za tok utakmice -->
    <q-dialog persistent v-model="new_customer">
      <q-card
        style="
          width: 600px;
          max-width: 60vw;
          border-radius: 5px;
          box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7);
          color: #323b62;
      ">
        <q-card-section>
          <q-btn
            icon="close"
            @click="close(); activeEditing = false"
            flat
            round
            dense
            style="float: right;"
            v-close-popup
          ></q-btn>
          <div class="text-h6"
              style="text-align: center;">
            {{this.naslov}}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">

          <q-list>

            <q-item v-if="editedIndex > -1">
              <q-input
                dense
                outlined
                class="datumInput"
                v-model="samoVreme"
                mask="fulltime"
                :rules="['fulltime']"
                style="padding: 0px"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="samoVreme" with-seconds format24h >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('matches.close')" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>

            <q-item v-else>
              <q-input
                dense
                outlined
                class="datumInput"
                v-model="samoDatum"
                mask="##/##/####"
                :rules="[val => valiDate(val) || 'DD/MM/YYYY']"
                style="padding: 0px"
              >
                 <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="samoDatum" mask="DD/MM/YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('matches.close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                dense
                outlined
                class="datumInput"
                v-model="samoVreme"
                mask="##:##:##"
                :rules="['fulltime']"
                style="padding: 0px; position:absolute; right: 18px;"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="samoVreme" with-seconds format24h >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('matches.close')" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>



            <q-item>
              <q-item-section class="custom-field one">
                <q-select
                  borderless
                  class="selektKlass"
                  option-value="value"
                  option-label="label"
                  :options="igraci"
                  v-model="editedItem.igrac"
                  emit-value
                  map-options
                  ref="select1"
                  :readonly="activeEditing"
                  :disabled="activeEditing"
                  @focus="popniPlaceholder('Span-SL1')"
                  @input="popniPlaceholder('Span-SL1')"
                  @blur="spustiPlaceholder('Span-SL1', editedItem.igrac)"
                  />
                  <span @click="$refs.select1.showPopup()" id="Span-SL1" class="placeholder placeholder1">{{$t('log.player')}}</span>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section class="custom-field one">
                <q-select
                  borderless
                  class="selektKlass"
                  option-value="value"
                  option-label="label"
                  :options="listaTipova"
                  v-model="editedItem.type"
                  emit-value
                  map-options
                  ref="select2"
                  :readonly="activeEditing"
                  :disabled="activeEditing"
                  @focus="popniPlaceholder('Span-SL2')"
                  @input="popniPlaceholder('Span-SL2'); promenaTipa()"
                  @blur="spustiPlaceholder('Span-SL2', editedItem.type)"
                />
                <span @click="$refs.select2.showPopup()" id="Span-SL2" class="placeholder placeholder1">{{$t('log.typeOfEvenet')}}</span>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section class="custom-field one">
                <q-select
                  borderless
                  class="selektKlass"
                  option-value="value"
                  option-label="label"
                  :options="dataStavke"
                  v-model="editedItem.oCemSeRadi"
                  emit-value
                  map-options
                  ref="select3"
                  :readonly="editedItem.type == '' || activeEditing"
                  :disabled="editedItem.type == '' || activeEditing"
                  @focus="popniPlaceholder('Span-SL3')"
                  @input="popniPlaceholder('Span-SL3'); promenaStavke()"
                  @blur="spustiPlaceholder('Span-SL3', editedItem.oCemSeRadi)"
                />
                <span @click="$refs.select3.showPopup()" id="Span-SL3" class="placeholder placeholder1">{{$t('matches.item')}}</span>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section class="custom-field one">
                <q-select
                  borderless
                  class="selektKlass"
                  option-value="value"
                  option-label="label"
                  :options="listaOcena"
                  v-model="editedItem.ocenaIzvodjenja"
                  emit-value
                  map-options
                  ref="select4"
                  :readonly="activeEditing"
                  :disabled="activeEditing"
                  @focus="popniPlaceholder('Span-SL4')"
                  @input="popniPlaceholder('Span-SL4')"
                  @blur="spustiPlaceholder('Span-SL4', editedItem.ocenaIzvodjenja)"
                />
                <span @click="$refs.select4.showPopup()" id="Span-SL4" class="placeholder placeholder1">{{$t('log.score')}}</span>
              </q-item-section>
            </q-item>


              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      borderless
                      dense
                      placeholder=" "
                      readonly
                      disable
                      v-model="editedItem.uneo"
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')"
                      @blur="spustiPlaceholder('Span-IP1', editedItem.uneo)"
                    />
                    <span id="Span-IP1" class="placeholder ">{{$t('log.filled')}}</span>
                  </label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn
            :label="$t('administration.user.cancel')"
            @click="close(); activeEditing = false"
            type="submit"
            style="background-color: #f5f8fb; color: #323b62; width: 20%; margin: 10px;"
            v-close-popup
          ></q-btn>
          <q-btn
            :label="$t('administration.user.save')"
            @click="addRow(); activeEditing = false"
            type="submit"
            style="background-color: #ff4b00; color: white; width: 20%; margin: 10px;"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- dialog za tok utakmice -->
    <q-dialog v-model="dataPreview">
      <q-card
        style="
          width: 600px;
          max-width: 60vw;
          border-radius: 5px;
          box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7);
          color: #323b62;
      ">
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
          <div class="text-h6"
              style="text-align: center;">
            {{this.naslov}}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">

          <q-list>

            <q-item v-if="editedIndex > -1">
              <q-input readonly outlined dense class="datumInputReadOnly" v-model="samoVreme" mask="fulltime" :rules="['fulltime']" style="padding: 0px" />
            </q-item>

            <q-item v-else>
              <q-input readonly outlined dense class="datumInputReadOnly" v-model="samoDatum" />
              <q-input readonly outlined dense class="datumInputReadOnly" v-model="samoVreme" style="position: absolute; right: 15px;" />
            </q-item>



            <q-item>
              <q-item-section>
                <q-select
                  readonly
                  borderless
                  style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                  :label="$t('log.player')"
                  :options="igraci"
                  v-model="editedItem.igrac"
                  emit-value map-options
                  />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-select
                  readonly
                  borderless
                  style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                  :label="$t('log.typeOfEvenet')"
                  :options="listaTipova"
                  v-on:input="promenaTipa()"
                  v-model="editedItem.type"
                  emit-value map-options
                  />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-select
                  readonly
                  borderless
                  style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                  :label="$t('matches.item')"
                  :options="dataStavke"
                  v-on:input="promenaStavke()"
                  v-model="editedItem.oCemSeRadi"
                  emit-value map-options
                  />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-select
                  readonly
                  borderless
                  style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                  :label="$t('log.score')"
                  :options="listaOcena"
                  v-model="editedItem.ocenaIzvodjenja"
                  emit-value map-options
                  />
              </q-item-section>
            </q-item>


              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      readonly
                      v-model="editedItem.uneo"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="spustiPlaceholder('Span-IP2', editedItem.uneo)"
                    />
                    <span id="Span-IP2" class="placeholder">{{$t('log.filled')}}</span>
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
      naslov: this.$t('log.theCourseOfTheMatch'),
      listOptions: [],
      listaTipova: [
          // {
          //   label: 'Početak utakmice',
          //   value: 'START'
          // },
          {
            label: this.$t('matches.techniqueScore'),
            value: 'TEHNIKA'
          },
          {
            label: this.$t('matches.tacticsScore'),
            value: 'TAKTIKA'
          },
          {
            label: this.$t('matches.principleOfTheGameScore'),
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
            label: this.$t('matches.goal'),
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
            label: this.$t('log.notScored'),
            value: 0
          },
          {
            label: '-',
            value: -1
          },
        ],
      customer: {},
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      editedItem: {
        ident: 0,
        bazaTaktikeSifrarnikStavke: null,
        bazaTehnikeSifrarnikStavke: null,
        igrac: '',
        oCemSeRadi: '',
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
        oCemSeRadi: '',
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
          label: this.$t('log.inputTime'),
          align: "left",
          field: "vremeUnosa",
          sortable: true,
          format: val => date.formatDate(val, 'DD/MM/YYYY HH:mm:ss')
        },
        {
          name: "type",
          align: "left",
          label: this.$t('log.typeOfEvenet'),
          field: "type",
          sortable: true
        },
        {
          name: "igrac",
          align: "left",
          label: this.$t('log.player'),
          field: "igrac",
          sortable: true
        },
        {
          name: "oCemSeRadi",
          align: "left",
          label: this.$t('matches.item'),
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
          label: this.$t('log.performanceScore'),
          field: "ocenaIzvodjenja",
          sortable: true
        },
        {
          name: "uneo",
          align: "left",
          label: this.$t('log.filled'),
          field: "uneo",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t('matches.action'),
          field: "action",
          sortable: true
        }
      ],
      data: [],
      pagination: {
        sortBy: 'vremeUnosa',
        descending: true,
        rowsPerPage: 10000
      },
      activeEditing: false
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
    popniPlaceholder(id){
      var izabraniPlaceholder = document.getElementById(id)

      izabraniPlaceholder.style.top = '0px'
      izabraniPlaceholder.style.backgroundColor = 'white'
      izabraniPlaceholder.style.fontSize = '9pt'
      izabraniPlaceholder.style.width = 'unset'
      izabraniPlaceholder.style.padding = '3px'
      izabraniPlaceholder.style.color = 'black'
    },
    spustiPlaceholder(id, val){
      var izabraniPlaceholder = document.getElementById(id)

      if(val === '' || val == null || val.length == 0){
        izabraniPlaceholder.style.top = '22px'
        izabraniPlaceholder.style.backgroundColor = 'unset'
        izabraniPlaceholder.style.fontSize = 'unset'
        izabraniPlaceholder.style.padding = '3px'
        izabraniPlaceholder.style.color = '#aaa'
      }
    },
    otvoriPreviewDialog(item){
      console.log(item)
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.samoDatum = date.formatDate(this.editedItem.vremeUnosa, 'DD/MM/YYYY')
      this.samoVreme = date.formatDate(this.editedItem.vremeUnosa, 'HH:mm:ss')
      this.dataPreview = true
    },
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
      this.editedItem.vremeUnosa = this.getDateTime1(Date.now());
      this.editedItem.uneo = window.$userName
      this.samoDatum = date.formatDate(this.editedItem.vremeUnosa, 'DD/MM/YYYY')
      this.samoVreme = date.formatDate(this.editedItem.vremeUnosa, 'HH:mm:ss')
      this.new_customer=true
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    dajLog(item) {
        debugger

        let _bazaTehnikeSifrarnikStavke = item.bazaTehnikeSifrarnikStavke == null ? '' : item.bazaTehnikeSifrarnikStavke.bazaTehnikeSifrarnikGrupe.grupa + '-' + item.bazaTehnikeSifrarnikStavke.naziv
        let _bazaTaktikeSifrarnikStavke = item.bazaTaktikeSifrarnikStavke == null ? '' : item.bazaTaktikeSifrarnikStavke.bazaTaktikeSifrarnikGrupe.grupa + '-' + item.bazaTaktikeSifrarnikStavke.naziv
        let _principIgre = item.principIgre == null ? '' : item.principIgre.naziv

        let _bazaTehnikeSifrarnikStavkeID = item.bazaTehnikeSifrarnikStavke == null ? '' : item.bazaTehnikeSifrarnikStavke.ident
        let _bazaTaktikeSifrarnikStavkeID = item.bazaTaktikeSifrarnikStavke == null ? '' : item.bazaTaktikeSifrarnikStavke.ident
        let _principIgreID = item.principIgre == null ? '' : item.principIgre.ident

        let _igrac = item.igrac == null ? '' : item.igrac.ime + ' ' + item.igrac.prezime
        let _igracID = item.igrac == null ? '' : item.igrac.id

        let nekoIme = item.strucniStab.ime == null ? '' : item.strucniStab.ime
        let nekoPrezime = item.strucniStab.prezime == null ? '' : item.strucniStab.prezime
        let neko = nekoIme + ' ' + nekoPrezime

        let stavkaKojaSeOcenjuje = null;
        if(_bazaTehnikeSifrarnikStavke != '') stavkaKojaSeOcenjuje = _bazaTehnikeSifrarnikStavke
        if(_bazaTaktikeSifrarnikStavke != '') stavkaKojaSeOcenjuje = _bazaTaktikeSifrarnikStavke
        if(_principIgre != '') stavkaKojaSeOcenjuje = _principIgre

        return {
          ident: item.ident,
          vremeUnosa: new Date((new Date(item.vremeUnosa).getTime() + 2 * 60 * 60 * 1000)).toString(),
          type: item.type,
          bazaTehnikeSifrarnikStavke: _bazaTehnikeSifrarnikStavke,
          bazaTaktikeSifrarnikStavke: _bazaTaktikeSifrarnikStavke,
          bazaTehnikeSifrarnikStavkeID: _bazaTehnikeSifrarnikStavkeID,
          bazaTaktikeSifrarnikStavkeID: _bazaTaktikeSifrarnikStavkeID,
          oCemSeRadi: stavkaKojaSeOcenjuje,
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
      promenaStavke() {
        switch (this.editedItem.type) {
          case 'TEHNIKA':
            this.editedItem.bazaTehnikeSifrarnikStavkeID = this.editedItem.oCemSeRadi
            break;
          case 'TAKTIKA':
            this.editedItem.bazaTaktikeSifrarnikStavkeID = this.editedItem.oCemSeRadi
            break;
          case 'PRINCIP_IGRE':
            this.editedItem.principIgreID = this.editedItem.oCemSeRadi
            break;
          default:
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
    getDateTime(a) {
      if(isNaN(a))
        var timeStamp = new Date(a.split("/")[2], parseInt(a.split("/")[1])-1, a.split("/")[0], 3, 0, 0)
      else
        var timeStamp = new Date(a)
        const vrati = timeStamp.toISOString();
      return vrati
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
            message: self.$t('matches.dataDeletedSuccessfully'),
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
          if(isNaN(this.editedItem.igrac)){

          }

          Object.assign(this.data[this.editedIndex], this.editedItem);
          this.naslov = this.$t('log.changeItem');
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

        debugger
        switch (this.editedItem.type) {
          case 'TEHNIKA':
            identBazaTehnikeSifrarnikStavke = this.editedItem.bazaTehnikeSifrarnikStavkeID
            identBazaTaktikeSifrarnikStavke = null
            identPrincipIgre = null
            break;
          case 'TAKTIKA':
            identBazaTehnikeSifrarnikStavke = null
            identBazaTaktikeSifrarnikStavke = this.editedItem.bazaTaktikeSifrarnikStavkeID
            identPrincipIgre = null
            break;
          case 'PRINCIP_IGRE':
            identBazaTehnikeSifrarnikStavke = null
            identBazaTaktikeSifrarnikStavke = null
            identPrincipIgre = this.editedItem.principIgreID
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
            vremeUnosa: this.getDateTime1(date.formatDate(this.editedItem.vremeUnosa, 'YYYY-MM-DD') + "T" + this.samoVreme + ".000Z")
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
            identBazaTehnikeSifrarnikStavke = this.editedItem.oCemSeRadi
            identBazaTaktikeSifrarnikStavke = null
            identPrincipIgre = null
            break;
          case 'TAKTIKA':
            identBazaTehnikeSifrarnikStavke = null
            identBazaTaktikeSifrarnikStavke = this.editedItem.oCemSeRadi
            identPrincipIgre = null
            break;
          case 'PRINCIP_IGRE':
            identBazaTehnikeSifrarnikStavke = null
            identBazaTaktikeSifrarnikStavke = null
            identPrincipIgre = this.editedItem.oCemSeRadi
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
            vremeUnosa: this.getDateTime1(date.formatDate(this.editedItem.vremeUnosa, 'YYYY-MM-DD') + "T" + this.samoVreme + ".000Z")
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
              message: self.$t('matches.eventSuccessfullyAdded'),
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
      this.activeEditing = true;
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      //debugger

      this.samoDatum = date.formatDate(this.editedItem.vremeUnosa, 'DD/MM/YYYY')
      this.samoVreme = date.formatDate(this.editedItem.vremeUnosa, 'HH:mm:ss')
      this.new_customer = true;
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    close() {
      this.new_customer = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    podigniPopunjenePlaceholdere(){
      var i = 0
      var sviInputi = document.getElementById("Span-IP" + i);
      while(!(i > 1 && sviInputi == null)){
        if(sviInputi != null){
          var val = sviInputi.parentElement.children[0].getElementsByTagName("input")[0].value

          if(val != '' && val != null)
            this.popniPlaceholder("Span-IP" + i)
        }

        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0
      var sviSelektovi = document.getElementById("Span-SL" + i);
      while(!(i > 1 && sviSelektovi == null)){
        if(sviSelektovi != null){
          var val = sviSelektovi.parentElement.children[0].innerText.split("\n").length

          if(val > 1)
            this.popniPlaceholder("Span-SL" + i)
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

      const status = exportFile("logUtakmice.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: self.$t('matches.browserForbids'),
          color: "negative",
          icon: "warning"
        });
      }
    }
  }
};
</script>


<style scoped>
.dugmeNewNesto {
  background-color: #ff4b00;
  color: white;
  width: 140px;
  height: 40px;
  border-radius: 5px;
}

.dugmeSearch {
  width: 300px;
  height: 40px;
  margin: 20px 20px 20px 30px;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 #bdcedc;
  background-color: #fff;
}

.dugmeCVS {
  width: 140px;
  height: 40px;
  border-radius: 5px;
  background-color: #3b5d99;
  color: white;
  margin: 0 10px;
}

.plavaKlasaTekst {
  color: #3b5d99;
}

.plavaKlasaPozadina {
  background-color: #3b5d99;
}

tbody tr:hover td #dugmeEdit {
  background-color: #00afff !important;
  color: #ffffff !important;
}
tbody tr:hover td #dugmeBrisi {
  background-color: #ff4a4a !important;
  color: #ffffff !important;
}
tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}

.q-field__control:hover {
  background-color: white;
  color:#3b5d99;
}

/* Video Explanation - https://youtu.be/3AK3vspZvvM */
body {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  font-size: 16px;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.custom-field {
  position: relative;
  font-size: 14px;
  /* border-top: 20px solid transparent; */
  margin-bottom: 5px;
  --field-padding: 12px;
}

.custom-field input {
  border: none;
  -webkit-appearance: none;
  -ms-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: #f2f2f2;
  padding: var(--field-padding);
  border-radius: 5px;
  width: 100%;
  outline: none;
  font-size: 14px;
}

.custom-field .placeholder {
  position: absolute;
  left: var(--field-padding);
  width: calc(100% - (var(--field-padding) * 2));
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  top: 22px;
  line-height: 100%;
  transform: translateY(-50%);
  color: #aaa;
  transition:
    top 0.3s ease,
    color 0.3s ease,
    font-size 0.3s ease;
}

.custom-field input.dirty + .placeholder,
.custom-field input:focus + .placeholder,
.custom-field input:not(:placeholder-shown) + .placeholder {
  top: -10px;
  font-size: 12px;
  color: #222;
}

.custom-field .error-message {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 12px;
  background: #d30909;
  color: #fff;
  height: 24px;
}

.custom-field .error-message:empty {
  opacity: 0;
}

/* ONE */
.custom-field.one input {
  background: #f5f8fb;
  /* border: 2px solid #ddd; */
  transition: border-color 0.3s ease;
}

.custom-field.one input + .placeholder {
  left: 8px;
  padding: 0 5px;
}

.custom-field.one input.dirty,
.custom-field.one input:not(:placeholder-shown),
.custom-field.one input:focus {
  border: 2px solid #3b5d99;
  background: none;
  /* transition-delay: 0.1s */
}

.custom-field.one input.dirty + .placeholder,
.custom-field.one input:not(:placeholder-shown) + .placeholder,
.custom-field.one input:focus + .placeholder {
  top: 0;
  font-size: 12px;
  color: #222;
  background: #fff;
  width: auto
}

/* TWO */
.custom-field.two input {
  border-radius: 0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background:
    linear-gradient(90deg, #222, #222) center bottom/0 0.15em no-repeat,
    linear-gradient(90deg, #ccc, #ccc) left bottom/100% 0.15em no-repeat,
    linear-gradient(90deg, #fafafa, #fafafa) left bottom/100% no-repeat;
  transition: background-size 0.3s ease;
}

.custom-field.two input.dirty,
.custom-field.two input:not(:placeholder-shown),
.custom-field.two input:focus {
  background-size: 100% 0.15em, 100% 0.1em, 100%;
}

</style>

// Sobzirom da je sve fiksne visine iznad tabele izravunao sam da ej to magican broj 280
<style lang="sass" scoped>

.mojaTabela div:first-child
  padding-top: 0px
  padding-bottom: 0px

.mojaTabela
  q-table-top
  padding-top: 0px !important
  padding-bottom: 0px
  table
    border-spacing: 0 5px
  tr
    color: #323b62
    height: 50px
    border-radius: 5px
    font-weight: 500
    box-shadow: 0px 0px 3px -5px rgba(0,0,0,0.15)
  tr:nth-child(even)
    background-color: #f5f8fb
  tr:nth-child(odd)
    background-color: #ffffff
  td:first-child,
  th:first-child
    border-radius: 10px 0 0 10px
  td:last-child,
  th:last-child
    border-radius: 0 10px 10px 0


.my-sticky-header-table
  /* height or max-height is important */
  height: 310px


  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 5px

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
