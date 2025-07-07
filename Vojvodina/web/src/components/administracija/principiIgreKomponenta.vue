<template>
  <q-page class="q-pa-sm">
        <q-table
          :title="$t('administration.principlesOfTheGame.gamePrinc')"
          :data="data"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="ident"
          :grid="mode=='grid'"
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
            <q-btn @click="otvordeDialog()" :label="$t('administration.principlesOfTheGame.newPrinc')" class="q-mr-xs dugmeNewNesto" />

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
              @click="mode = mode === 'grid' ? 'list' : 'grid'; separator = mode === 'grid' ? 'none' : 'horizontal'"
              v-if="!props.inFullscreen"
            >
              <q-tooltip
                :disable="$q.platform.is.mobile"
                v-close-popup
              >{{mode==='grid' ?  $t('table.list') :  $t('table.grid')}}</q-tooltip>
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
            <q-td :props="props" v-if="props.value ==props.row.action">
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

            <q-td :props="props" v-else-if="props.value == props.row.naziv" @click="otvoriPreviewDialog(props.row)">
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
              <div class="text-h6"
                 style="text-align: center;">
                <!-- Unos -->
                {{$t('administration.principlesOfTheGame.entry')}}
              </div>
            </q-card-section>
            <!-- <q-separator inset></q-separator> -->
            <q-card-section class="q-pt-none">
              <q-form class="q-gutter-md">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <!-- <q-input dense outlined v-model="editedItem.naziv" :label="$t('administration.principlesOfTheGame.name')"></q-input> -->
                      <label class="custom-field one">
                        <q-input
                      :readonly="readonly"
                          hide-bottom-space
                          borderless
                          dense
                          placeholder=" "
                          v-model="editedItem.naziv"
                          @focus="popniPlaceholder('Span-IP1')"
                          @input="popniPlaceholder('Span-IP1')"
                          @blur="spustiPlaceholder('Span-IP1', editedItem.naziv)"
                          ref="input1"
                          :rules="[
                            (val) =>
                              (val !== null && val !== '') ||
                              $t('administration.principlesOfTheGame.enterName'),
                          ]"
                         />
                        <span id="Span-IP1" class="placeholder">{{$t('administration.principlesOfTheGame.name')}}</span>
                      </label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <label class="custom-field one">
                        <q-input
                      :readonly="readonly"
                          hide-bottom-space
                          borderless
                          dense
                          placeholder=" "
                          v-model="editedItem.opis"
                          @focus="popniPlaceholder('Span-IP2')"
                          @input="popniPlaceholder('Span-IP2')"
                          @blur="spustiPlaceholder('Span-IP2', editedItem.opis)"
                          ref="input2"
                        />
                        <span id="Span-IP2" class="placeholder">{{$t('administration.principlesOfTheGame.desc')}}</span>
                      </label>
                    </q-item-section>
                  </q-item>
                  <q-item class="column" style="border: 1px solid #323b623a; border-radius: 4px; margin: 20px; padding: 20px 20px 10px 20px">
                    <q-item-section class="custom-field one" style="margin: 0px; margin-bottom: 10px">
                      <q-select
                      :readonly="readonly"
                        borderless
                        class="selektKlass"
                        option-value="value"
                        option-label="label"
                        :options="listaGrupaTaktike"
                        v-model="editedItem.identGrupeElementaTaktike"
                        emit-value
                        map-options
                        ref="select1"
                        @focus="popniPlaceholder('Span-SL1')"
                        @input="popniPlaceholder('Span-SL1'); getDataStavkeTaktike()"
                        @blur="spustiPlaceholder('Span-SL1', editedItem.identGrupeElementaTaktike)"
                        >
                          <template v-if="editedItem.identGrupeElementaTaktike" v-slot:append>
                            <q-icon name="cancel" @click.stop.prevent="editedItem.identGrupeElementaTaktike = ''" class="cursor-pointer" />
                          </template>
                        </q-select>
                      <span @click="$refs.select1.showPopup()" id="Span-SL1" class="placeholder placeholder1">{{$t('administration.principlesOfTheGame.tacElem')}}</span>
                    </q-item-section>
                    <q-item-section class="custom-field one" style="margin: 0px">
                      <q-select
                      :readonly="readonly"
                        :disable="editedItem.identGrupeElementaTaktike == ''"
                        borderless
                        class="selektKlass"
                        option-value="value"
                        option-label="label"
                        :options="listaStavkiTaktike"
                        v-model="editedItem.identElementaTaktike"
                        emit-value
                        map-options
                        ref="select2"
                        @focus="popniPlaceholder('Span-SL2')"
                        @input="popniPlaceholder('Span-SL2')"
                        @blur="spustiPlaceholder('Span-SL2', editedItem.identElementaTaktike)"
                        >
                          <template v-if="editedItem.identElementaTaktike" v-slot:append>
                            <q-icon name="cancel" @click.stop.prevent="editedItem.identElementaTaktike = ''" class="cursor-pointer" />
                          </template>
                        </q-select>
                      <span @click="$refs.select2.showPopup()" id="Span-SL2" class="placeholder placeholder1">{{$t('administration.principlesOfTheGame.grpItems')}}</span>
                    </q-item-section>
                  </q-item>


                  <q-item class="column" style="border: 1px solid #323b623a; border-radius: 4px; margin: 20px; padding: 20px 20px 10px 20px">
                    <q-item-section class="custom-field one" style="margin: 0px; margin-bottom: 10px">
                      <q-select
                      :readonly="readonly"
                        borderless
                        class="selektKlass"
                        option-value="value"
                        option-label="label"
                        :options="listaGrupaTehnike"
                        v-model="editedItem.identPrimarneGrupeElemetaTehnike"
                        emit-value
                        map-options
                        ref="select3"
                        @focus="popniPlaceholder('Span-SL3')"
                        @input="popniPlaceholder('Span-SL3'); getDataStavke(editedItem.identPrimarneGrupeElemetaTehnike)"
                        @blur="spustiPlaceholder('Span-SL3', editedItem.identPrimarneGrupeElemetaTehnike)"
                        >
                          <template v-if="editedItem.identPrimarneGrupeElemetaTehnike" v-slot:append>
                            <q-icon name="cancel" @click.stop.prevent="editedItem.identPrimarneGrupeElemetaTehnike = ''" class="cursor-pointer" />
                          </template>
                        </q-select>
                      <span @click="$refs.select3.showPopup()" id="Span-SL3" class="placeholder placeholder1">{{$t('administration.principlesOfTheGame.grpPrimElem')}}</span>
                    </q-item-section>
                    <q-item-section class="custom-field one" style="margin: 0px">
                      <q-select
                      :readonly="readonly"
                        :disable="editedItem.identPrimarneGrupeElemetaTehnike == ''"
                        borderless
                        class="selektKlass"
                        option-value="value"
                        option-label="label"
                        :options="listaStavkiTehnike"
                        v-model="editedItem.identPrimarnogElementaTehnike"
                        emit-value
                        map-options
                        ref="select4"
                        @focus="popniPlaceholder('Span-SL4')"
                        @input="popniPlaceholder('Span-SL4')"
                        @blur="spustiPlaceholder('Span-SL4', editedItem.identPrimarnogElementaTehnike)"
                        >
                          <template v-if="editedItem.identPrimarnogElementaTehnike" v-slot:append>
                            <q-icon name="cancel" @click.stop.prevent="editedItem.identPrimarnogElementaTehnike = ''" class="cursor-pointer" />
                          </template>
                        </q-select>
                      <span @click="$refs.select4.showPopup()" id="Span-SL4" class="placeholder placeholder1">{{$t('administration.principlesOfTheGame.primElem')}}</span>
                    </q-item-section>
                  </q-item>

                  <q-item class="column" style="border: 1px solid #323b623a; border-radius: 4px; margin: 20px; padding: 20px 20px 10px 20px">
                    <q-item-section class="custom-field one" style="margin: 0px; margin-bottom: 10px">
                      <q-select
                      :readonly="readonly"
                        borderless
                        class="selektKlass"
                        option-value="value"
                        option-label="label"
                        :options="listaGrupaTehnike"
                        v-model="editedItem.identSekundarneGrupeElemetaTehnike"
                        emit-value
                        map-options
                        ref="select5"
                        @focus="popniPlaceholder('Span-SL5')"
                        @input="popniPlaceholder('Span-SL5'); getDataStavke(editedItem.identSekundarneGrupeElemetaTehnike)"
                        @blur="spustiPlaceholder('Span-SL5', editedItem.identSekundarneGrupeElemetaTehnike)"
                        >
                          <template v-if="editedItem.identSekundarneGrupeElemetaTehnike" v-slot:append>
                            <q-icon name="cancel" @click.stop.prevent="editedItem.identSekundarneGrupeElemetaTehnike = ''" class="cursor-pointer" />
                          </template>
                        </q-select>
                      <span @click="$refs.select5.showPopup()" id="Span-SL5" class="placeholder placeholder1">{{$t('administration.principlesOfTheGame.grpSecElem')}}</span>
                    </q-item-section>
                    <q-item-section class="custom-field one" style="margin: 0px">
                      <q-select
                      :readonly="readonly"
                        :disable="editedItem.identSekundarneGrupeElemetaTehnike == ''"
                        borderless
                        class="selektKlass"
                        option-value="value"
                        option-label="label"
                        :options="listaStavkiTehnike"
                        v-model="editedItem.identSekundarnogElementaTehnike"
                        emit-value
                        map-options
                        ref="select6"
                        @focus="popniPlaceholder('Span-SL6')"
                        @input="popniPlaceholder('Span-SL6')"
                        @blur="spustiPlaceholder('Span-SL6', editedItem.identSekundarnogElementaTehnike)"
                        >
                          <template v-if="editedItem.identSekundarnogElementaTehnike" v-slot:append>
                            <q-icon name="cancel" @click.stop.prevent="editedItem.identSekundarnogElementaTehnike = ''" class="cursor-pointer" />
                          </template>
                        </q-select>
                      <span @click="$refs.select6.showPopup()" id="Span-SL6" class="placeholder placeholder1">{{$t('administration.principlesOfTheGame.secElem')}}</span>
                    </q-item-section>
                  </q-item>

                </q-list>
              </q-form>
            </q-card-section>

            <q-card-actions :class="{ sakriDugmice: readonly }" align="center" class="bg-white text-teal">
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
              <div class="text-h6"
                 style="text-align: center;">
                <!-- Unos -->
                {{$t('administration.principlesOfTheGame.entry')}}
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
                          v-model="editedItem.naziv"
                          :label="$t('administration.principlesOfTheGame.name')"
                         />
                        <span class="placeholder">{{$t('administration.principlesOfTheGame.name')}}</span>
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
                          :label="$t('administration.principlesOfTheGame.desc')"
                        />
                        <span class="placeholder">{{$t('administration.principlesOfTheGame.desc')}}</span>
                      </label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-select
                        readonly
                        borderless
                        style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                        :label="$t('administration.principlesOfTheGame.tacElem')"
                        :options="listaGrupaTaktike"
                        v-model="editedItem.identGrupeElementaTaktike"
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
                          style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                          :label="$t('administration.principlesOfTheGame.grpItems')"
                          :options="listaStavkiTaktike"
                          v-model="editedItem.identElementaTaktike"
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
                          style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                          :label="$t('administration.principlesOfTheGame.grpPrimElem')"
                          :options="listaGrupaTehnike"
                          v-model="editedItem.identPrimarneGrupeElemetaTehnike"
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
                        style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                        :label="$t('administration.principlesOfTheGame.primElem')"
                        :options="listaStavkiTehnike"
                        v-model="editedItem.identPrimarnogElementaTehnike"
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
                        style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                        :label="$t('administration.principlesOfTheGame.grpSecElem')"
                        :options="listaGrupaTehnike"
                        v-model="editedItem.identSekundarneGrupeElemetaTehnike"
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
                        style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                        :label="$t('administration.principlesOfTheGame.secElem')"
                        :options="listaStavkiTehnike"
                        v-model="editedItem.identSekundarnogElementaTehnike"
                        emit-value
                        map-options
                      />
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
import promenaIgraca from "../../components/promenaIgracaKomponenta"
let timeStamp = Date.now()

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
      listaGrupaTehnike: [],
      listaGrupaTaktike: [],
      listaStavkiTehnike: [],
      listaStavkiTaktike: [],
      igrac: '',
      igracID1: 0,
      timID1: 0,
      date: "",
      filter: "",
      customer: {},
      new_customer: false,              //dialog
      dataPreview: false,              //dialog
      editedIndex: -1,
      editedItem: {
        //datumVreme: "",
        // elemetTaktike: "",
        //grupaElementaTaktike: "",
        ident: 0,
        identElementaTaktike: '',
        identGrupeElementaTaktike: "",
        identPrimarneGrupeElemetaTehnike: "",
        identPrimarnogElementaTehnike: "",
        identSekundarneGrupeElemetaTehnike: "",
        identSekundarnogElementaTehnike:"",
        naziv: "",
        opis: "",
        // primarnaGrupaElementaTehnike: "",
        // primarniElemetTehnike: "",
        // sekundarnaGrupaElementaTehnike: "",
        // sekundarniElementTehnike: ""
      },
      defaultItem: {
        //datumVreme: "",
        //elemetTaktike: "",
        //grupaElementaTaktike: "",
        ident: 0,
        identElementaTaktike: '',
        identGrupeElementaTaktike: "",
        identPrimarneGrupeElemetaTehnike: "",
        identPrimarnogElementaTehnike: "",
        identSekundarneGrupeElemetaTehnike: "",
        identSekundarnogElementaTehnike:"",
        naziv: "",
        opis: "",
        // primarnaGrupaElementaTehnike: "",
        // primarniElemetTehnike: "",
        // sekundarnaGrupaElementaTehnike: "",
        // sekundarniElementTehnike: ""
      },

      defaultItemCopyFix: {
        //datumVreme: "",
        //elemetTaktike: "",
        //grupaElementaTaktike: "",
        ident: 0,
        identElementaTaktike: '',
        identGrupeElementaTaktike: "",
        identPrimarneGrupeElemetaTehnike: "",
        identPrimarnogElementaTehnike: "",
        identSekundarneGrupeElemetaTehnike: "",
        identSekundarnogElementaTehnike:"",
        naziv: "",
        opis: "",
        // primarnaGrupaElementaTehnike: "",
        // primarniElemetTehnike: "",
        // sekundarnaGrupaElementaTehnike: "",
        // sekundarniElementTehnike: ""
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
          label: this.$t('administration.principlesOfTheGame.name'),
          field: "naziv",
          sortable: true
        },
        {
          name: "opis",
          align: "left",
          label: this.$t('administration.principlesOfTheGame.desc'),
          field: "opis",
          sortable: true
        },

        {
            name: "action",
            align: "left",
            label: this.$t('table.action'),
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
    this.date = Date.now()
    debugger
    this.getData() //idemo da uzmenmo podatke iz baze
    this.getDataGrupe()   //pokupimo odma i grupe tehnike
    this.getDataGrupeTaktike()  //i taktike
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

      if(val === '' || val.length == 0){
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
      this.readonly = true;
      this.new_customer = true
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
      this.getDataStavkeTaktike()
      if(this.editedItem.identPrimarneGrupeElemetaTehnike != null)
      this.getDataStavke(this.editedItem.identPrimarneGrupeElemetaTehnike)
      if(this.editedItem.identSekundarneGrupeElemetaTehnike != null)
      this.getDataStavke(this.editedItem.identSekundarneGrupeElemetaTehnike)
    },


    //''''''''''''''''''''''''''''''''''''''''
    // citanje grupa технике
    //........................................
    getDataGrupe() {
      let linkStr = this.$apiPutanja +  '/baza-tehnike-sifrarnik-grupa'
      let self = this;
      this.loadingUtakmice = true
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
            this.listaGrupaTehnike = response.data.map(this.dajGrupe);
            debugger

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
      let linkStr = this.$apiPutanja +  '/baza-taktike-sifrarnik-grupa'
      let self = this;
      this.loadingUtakmice = true
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
            this.listaGrupaTaktike = response.data.map(this.dajGrupe);
            debugger

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
    getDataStavke(a) {
      let linkStr = this.$apiPutanja +  '/baza-tehnike-sifrarnik-stavke?identGrupe=' + a
      this.loadingUtakmice = true
      debugger;
        this.$axios
          .get(linkStr,{
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer  " + window.$token
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
      if(this.editedItem.identGrupeElementaTaktike == null)
        return
      let linkStr = this.$apiPutanja +  '/baza-taktike-sifrarnik-stavke?identGrupe=' + this.editedItem.identGrupeElementaTaktike
      debugger;
        this.$axios
          .get(linkStr,{
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer  " + window.$token
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
            this.data = response.data;
            this.loadingUtakmice = false
            debugger
        })
        .catch(e => {
            //this.errors.push(e);
            this.loadingUtakmice = false
            console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje novog igraca
    //........................................
    postData() {
    debugger
      let linkStr = this.$apiPutanja +  '/princip-igre'
      var self=this;
      var datumVreme1
      try {
        datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      } catch (error) {

      }

       var dataString = {
        //"datumVreme": datumVreme1,
        "identElementaTaktike": this.editedItem.identElementaTaktike,
        "identPrimarnogElementaTehnike": this.editedItem.identPrimarnogElementaTehnike,
        "identSekundarnogElementaTehnike": this.editedItem.identSekundarnogElementaTehnike,
        "naziv": this.editedItem.naziv,
        "opis": this.editedItem.opis
      };
      console.log(dataString)
debugger
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
          self.getData();
          self.$q.notify({
            message: self.$t('administration.principlesOfTheGame.msgPositive'),
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
    // izmena
    //........................................
    putData() {
    debugger
      let linkStr = this.$apiPutanja +  '/princip-igre/' + this.editedItem.ident
      var self=this;
      //let datumVreme1 = this.getDateTime(this.editedItem.datumVreme);

      var dataString = {
        "identElementaTaktike": this.editedItem.identElementaTaktike,
        "identPrimarnogElementaTehnike": this.editedItem.identPrimarnogElementaTehnike,
        "identSekundarnogElementaTehnike": this.editedItem.identSekundarnogElementaTehnike,
        "naziv": this.editedItem.naziv,
        "opis": this.editedItem.opis
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
            message: self.$t('administration.principlesOfTheGame.msgChange'),
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
      let linkStr = this.$apiPutanja +  '/princip-igre/' + item.ident
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
          self.getData();
          self.$q.notify({
            message: self.$t('administration.principlesOfTheGame.msgDel'),
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
    getDateTime1(a) {
      const aa = new Date(a);
      return aa.toISOString();
    },
    getDateTime(a) {
      debugger
      let timeStamp = new Date(a)
      //let vrati = date.formatDate(a, 'YYYY-MM-DDTHH:mm:ss.SSS') + "Z"
      const vrati = timeStamp.toISOString();
      return vrati
    },
    addRow() {

      let sveOK = true;

      if(this.editedItem.identElementaTaktike == null) this.editedItem.identElementaTaktike = ''
      if(this.editedItem.identGrupeElementaTaktike == null) this.editedItem.identGrupeElementaTaktike = ''
      if(this.editedItem.identPrimarneGrupeElemetaTehnike == null) this.editedItem.identPrimarneGrupeElemetaTehnike = ''
      if(this.editedItem.identPrimarnogElementaTehnike == null) this.editedItem.identPrimarnogElementaTehnike = ''
      if(this.editedItem.identSekundarneGrupeElemetaTehnike == null) this.editedItem.identSekundarneGrupeElemetaTehnike = ''
      if(this.editedItem.identSekundarnogElementaTehnike == null) this.editedItem.identSekundarnogElementaTehnike = ''
      if(this.editedItem.naziv == null || this.editedItem.naziv == '')  sveOK = false

      if(sveOK == false) {
        this.$q.notify({
            message: this.$t('administration.principlesOfTheGame.notSaved'),
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
          this.close()
      }
    },
    zacrveniPrazne(){
      let self = this
      var i = 0
      var sviInputi = document.getElementById("Span-IP" + i);

      while(!(i > 1 && sviInputi == null)){
        if(sviInputi != null){
          this.$refs['input'+i].validate()
        }

        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0
      var sviSelektovi = document.getElementById("Span-SL" + i);
      while(!(i > 1 && sviSelektovi == null)){
        debugger
        if(sviSelektovi != null){
          this.$refs['select'+i].validate()
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },

    deleteItem(item) {
      const index = this.data.indexOf(item);
            let obj = {
              title: this.$t('administration.user.war'),
              message: this.$t('administration.principlesOfTheGame.msgDelConf'),
              customCloseBtnText: this.$t('administration.user.txtNo'),
              disableOverlayClick: true,
              useConfirmBtn: true,
              customConfirmBtnText: this.$t('administration.user.txtYes'),
              onConfirm: onConfirmWrapper,
              type: "warning",
              showXclose: true
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
      this.editedItem.datumVreme = this.getDateTime(Date.now());
      this.new_customer=true
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.new_customer = true;
      this.readonly = false;
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
      this.getDataStavkeTaktike()
      if(this.editedItem.identPrimarneGrupeElemetaTehnike != null)
      this.getDataStavke(this.editedItem.identPrimarneGrupeElemetaTehnike)
      if(this.editedItem.identSekundarneGrupeElemetaTehnike != null)
      this.getDataStavke(this.editedItem.identSekundarneGrupeElemetaTehnike)
    },
    close () {
      this.new_customer = false
      this.readonly = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
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

      const status = exportFile("principiIgre.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: this.$t('administration.principlesOfTheGame.msgPrtSc'),
          color: "negative",
          icon: "warning"
        });
      }
    }
  },
  watch : {


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
  content: 'Izaberi fotografiju';
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
.dugmeNewNesto {
  width: 150px;
}

tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}

.sakriDugmice{
  display: none;
}

</style>
