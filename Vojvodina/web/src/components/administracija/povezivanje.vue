/*
Dakle, postupak formiranja jednog tima bi bio sledeći:
1. učitamo spisak svih timova
2. slektujemo tim za koji želimo da pravimo selekciju
3. učitamo spisak trenera
4. učitam o spisak kondicionih trenera (ili su i oni treneri?)
5. učitamo spisak igrača
6. izaberemo trenera
7. izaberemeo kondicionog trenera
8. izabaremeo igrača koga dodajemo u tim
9. učitamo spisak svih pozicija
10. dodlimo primarnu poziciju igraču
11. dodelimo sekundarnu poziciju igraču
12. dodelimo tercijalnu poziciju igraču
13. ponovimo to za sve igrače koje dodajemo u tim
14. SAVE
- snimimo igrace u tim, jednog po jednog
- povezemo pozicije igraca u tom timu (jednu po jednu ili sve..?)
- povezemo trenera sa timom
- povezemo kondiciong trenera sa timom
15. ende
*/
<template>
  <q-page class="q-pa-sm">
    <q-splitter v-model="splitterModel" separator-class="bg-red" separator-style="width: 0px; height:80vh"
      style="height: 100%">
      <template v-slot:before>
        <div class="scroll" style="height: 100%">
          <div class="row">
            <div style="width: 96%;">
              <q-item style="
                  padding: 10px 0px;
                  ">
                <q-item-section>
                  <q-select style="
                    background: white;
                    border-radius: 5px;
                    " outlined :label="$t('administration.connections.team')" option-value="value" option-label="label"
                    :options="listaTimova" map-options v-model="selektovaniTim" v-on:input="promenaTimaBre" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <!-- tabela strucni stab -->
          <q-expansion-item class="overflow-hidden"
            style="border-radius: 10px; margin-right: 20px; background: unset;padding: 0px;"
            header-style="background: #3b5d99; color: white;" icon="fas fa-users-cog fa-2x"
            expand-icon-class="text-white" @click="tabelaJedanZatvorena = !tabelaJedanZatvorena; jednaUkljucenaFn()">
            <template v-slot:header>
              <span style="width: 100%;">
                <span
                  style="display: inline-block; margin: 9px 0px">{{ $t('administration.connections.professionalStaff') }}</span>
                <q-input outlined @click.stop class="dugmeSearch" dense debounce="300" v-model="filterTim">
                  <template v-slot:append>
                    <q-icon name="search" color="blue-10" />
                  </template>
                </q-input>
              </span>
            </template>
            <q-table :data="dataTim" :hide-header="mode === 'grid'" :columns="columnsTim" row-key="id"
              :grid="modeTim == 'grid'" :filter="filterTim" :pagination.sync="paginationTim"
              :rows-per-page-label="$t('table.rowsPerPage')" :no-data-label="$t('table.noData')"
              :loading-label="$t('table.loadingLabel')" :no-results-label="$t('table.noResultLabel')"
              selection="multiple" :selected-rows-label="getSelectedStringTim" :selected.sync="selectedTim"
              @selection="onSelection1" :loading="loadingUtakmice" class="mojaTabela my-sticky-header-table tabela1"
              style="
                background-color: unset;
                box-shadow: unset;
              "
              table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
              color="blue-10">


              <template v-slot:header-cell-action="props">
                <q-th style="color: #ffffff00">
                  {{ props.col.label }}
                </q-th>
              </template>
              <template v-slot:body-cell-ime="props">
                <q-td :props="props">
                  <div class="" id="username">
                    {{ props.row.ime }}
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-expansion-item>

          <q-expansion-item class="overflow-hidden"
            style="border-radius: 10px; margin-top:12px; margin-right: 20px; background: unset;"
            header-style=" background: #ff4b00; color: white;"
            @click="tabelaDvaZatvorena = !tabelaDvaZatvorena; jednaUkljucenaFn()" expand-icon-class="text-white">
            <!-- tabela igraca      -->
            <template v-slot:header>
              <span style="width: 100%;">
                <span style="display: inline-block; margin: 9px 0px">{{ $t('administration.connections.players') }}</span>
                <q-input outlined @click.stop class="dugmeSearch" dense debounce="300" v-model="filter">
                  <template v-slot:append>
                    <q-icon name="search" color="blue-10" />
                  </template>
                </q-input>
              </span>
            </template>
            <q-table ref="table" :data="data" :hide-header="mode === 'grid'" :columns="columns" row-key="id"
              :grid="mode == 'grid'" :filter="filter" :pagination.sync="pagination"
              :rows-per-page-label="$t('table.rowsPerPage')" :no-data-label="$t('table.noData')"
              :loading-label="$t('table.loadingLabel')" :no-results-label="$t('table.noResultLabel')"
              selection="multiple" :selected-rows-label="getSelectedString" :selected.sync="selected"
              @selection="onSelection" :loading="loadingUtakmice1" class="mojaTabela my-sticky-header-table tabela2"
              style="
                background-color: unset;
                box-shadow: unset;
              "
              table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
              color="blue-10">
              <template v-slot:body-cell-action="props1">

                <q-td :props="props1">
                  <div class="q-gutter-sm">
                    <q-btn @click="pozicije(props1.row)" dense color="primary" icon="person">
                      <q-tooltip>{{ $t('administration.connections.positionDef') }}</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>
              <template v-slot:header-cell-action="props">
                <q-th style="color: #ffffff00">
                  {{ props.col.label }}
                </q-th>
              </template>
              <template v-slot:body-cell-igrac="props">
                <q-td :props="props">
                  <div class="" id="username">
                    {{ props.row.igrac }}
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-expansion-item>
        </div>
      </template>

      <template v-slot:after>
        <div class="scroll" style="height: 100%">
          <!-- <div class="q-gutter-sm">
            <q-btn
              round
              style="
                position:fixed;
                bottom: 20px;
                right:55px;
                z-index: 10;
                background: #ff4b00;
                color: white;"
              icon="save"
              @click="snimiEkipu()"
            >
              <q-tooltip style="color:red" content-class="bg-accent">{{$t('administration.connections.saveTeamData')}}</q-tooltip>
            </q-btn>
          </div> -->

          <div class>
            <div class>
              <!--   <div v-if="this.ekipa != undefined" class="row">
            <p style="font-size: initial; font-family: sans-serif;">Селектовани тим:</p>
            <p style="font-size: initial; font-family: sans-serif; color:red;">{{this.ekipa.imeTima}}</p>
              </div>-->
              <div style="margin: 15px 10px">
                <q-card v-for="d in ekipa.strucni_tim" :key="d.id + '@2'" bordered
                  style="display: inline-block; width: calc(50% - 10px); margin: 5px; background: #f5f8fb;"
                  :style="{ backgroundColor: [lastAddedStaffID == d.id ? '#c9f2df' : '#f5f8fb'] }">
                  <q-menu touch-position context-menu>
                    <q-list dense style="min-width: 100px">
                      <q-item clickable v-close-popup>
                        <q-item-section
                          @click="skloniStrucniTim(d, true)">{{ $t('administration.connections.delete') }}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                  <q-card-section class="col">
                    <div class="text-h col-2" style="height: 50px">{{ d.rolesOpisno[1] }} : {{ d.ime + " " + d.prezime }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <span v-for="igrac in selected" :key="igrac.id + '@1'" class="clickMouse" style="
                    width: 110px;
                    margin: 15px;
                    background-color: #e5edf4;
                    text-align: center;
                    display: inline-block;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                    border-radius: 4px;
                    overflow: hidden;
                  " :style="{ border: [lastAddedPlayerID == igrac.id ? '5px solid #c9f2df' : 'unset'] }" v-close-popup>
                <q-menu touch-position context-menu>
                  <q-list dense style="min-width: 100px">
                    <q-item clickable v-close-popup>
                      <q-item-section
                        @click="pozicije(igrac, true)">{{ $t('administration.connections.changeData') }}</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup>
                      <q-item-section
                        @click="brisanje(igrac, true)">{{ $t('administration.connections.delete') }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
                <img :src="igrac.fotografija" style="width: 110px; height: 146px; object-fit: cover;" />
                <p class='backgroundChange'
                  style="margin: 0px; font-size: 10pt;  margin-top: -6px; padding: 3px; background-color:#7c92cc; color: white;">
                  {{ igrac.ime }} <br> {{ igrac.prezime }} </p>
                <p class='backgroundChange flex flex-center'
                  :style="{ backgroundColor: [vratiBojuPozicije(igrac.primarnaPozicija.code)] }"
                  style="height: 75px; font-size: 10pt; margin: 0px; padding: 10px; background-color:#323b62; color: white;">
                  <span>{{ igrac.primarnaPozicija != undefined ? igrac.primarnaPozicija.name : '' }}</span></p>
              </span>

              <!-- <div v-for="d in selected" :key="d.id">
                <q-card bordered style="margin: 22px;">
                  <q-card-section class="row1">
                    <div class="text-h6 row">{{d.ime + " " + d.prezime}}</div>
                    <q-card-section class="row">
                      <div class="text-h6 col-3">
                        <q-img
                          :src="d.fotografija"
                          spinner-color="white"
                          style="height: 110px; max-width: 110px; border: ridge; margin: 7px; margin-top: 4px; box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75); border-radius: 10px;"
                        />
                      </div>
                      <div class="col" style="padding-left: 4%;">
                        <div class="row">
                        </div>
                        <div v-if="d.primarnaPozicija != null" class="row" style="padding: 5px 0px">
                          <p style="font-size: initial; font-family: cursive;">{{$t('administration.connections.positionPrim')}}</p>
                          <p
                            style="font-size: initial; font-family: sans-serif; color:red;"
                          >{{d.primarnaPozicija.name}}</p>
                        </div>
                        <div
                          v-if="d.sekundarnaPozicija != null"
                          class="row"
                          style="padding: 5px 0px"
                        >
                          <p
                            style="font-size: initial; font-family: cursive;"
                          >{{$t('administration.connections.positionSec')}}</p>
                          <p
                            style="font-size: initial; font-family: sans-serif; color:red;"
                          >{{d.sekundarnaPozicija.name}}</p>
                        </div>
                        <div v-if="d.tercijarnaPozicija != null" class="row">
                          <p
                            style="font-size: initial; font-family: cursive;"
                          >{{$t('administration.connections.positionTerc')}}</p>
                          <p
                            style="font-size: initial; font-family: sans-serif; color:red;"
                          > {{d.tercijarnaPozicija.name}}</p>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card-section>
                </q-card>
              </div> -->
            </div>
          </div>
        </div>
      </template>
    </q-splitter>

    <!-- dialog za pozicije -->
    <q-dialog persistent v-model="dialog_za_pozicije">
      <q-card style="width: 600px; max-width: 60vw;">
        <q-card-section>
          <q-btn icon="close" @click="closePozicije" flat round dense style="float: right;" v-close-popup />

          <div class="text-h6" style="text-align: center;">
            {{ $t('administration.connections.defPosition') }}
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>

              <q-item class="formular row" style="height: 110px; width: 100%; padding: 10px">
                <q-item-section class="col-2">
                  <img :src="editedItem.fotografija" spinner-color="white"
                    style="height: 90px; max-width: 90px; object-fit: cover; margin: 7px; margin-top: 4px;" />

                </q-item-section>

                <q-item-section class="column" style=" width: 100%;">
                  <q-item>
                    <!-- <q-item style="width: 60%; display: inline-block;"> -->
                    <q-item-section>
                      <label class="custom-field one">
                        <q-input borderless dense placeholder=" " disable v-model="editedItem.igrac"
                          @focus="popniPlaceholder('Span-IP0')" @input="popniPlaceholder('Span-IP0')"
                          @blur="spustiPlaceholder('Span-IP0', editedItem.igrac)" />
                        <span id="Span-IP0" class="placeholder">{{ $t('administration.connections.player') }}</span>
                      </label>
                    </q-item-section>
                  </q-item>
                </q-item-section>

                <q-item class="formular1 ponisti" style="width: 35%; margin-top: 10px;">
                  <label class="custom-field one datumInput">
                    <q-input borderless dense placeholder=" " v-model="editedItem.datumPrelaska"
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1'); promenaDatuma(editedItem.id, editedItem.datumPrelaska)"
                      @blur="spustiPlaceholder('Span-IP1', editedItem.datumPrelaska)" ref="input1" mask="##/##/####"
                      :rules="[val => valiDate(val) || 'DD/MM/YYYY']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">

                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="editedItem.datumPrelaska" mask="DD/MM/YYYY"
                              @input="() => $refs.qDateProxy.hide()"></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>

                    <span id="Span-IP1" class="placeholder">{{ $t('administration.connections.transferDate') }}</span>
                  </label>
                </q-item>
              </q-item>
              <!-- <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.prezime" label="Prezime"></q-input>
                    </q-item-section>
              </q-item>-->

              <!-- v-on:input="promenaPrimarnePozicije"
              use-chips-->

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select borderless class="selektKlass" option-value="ident" option-label="name"
                    :options="listaPozicija" map-options ref="select1" @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="spustiPlaceholder('Span-SL1', editedItem.primarnaPozicija)"
                    v-model="editedItem.primarnaPozicija"
                    v-on:input="promenaPrimarnePozicije(editedItem.id, editedItem.primarnaPozicija)" :rules="[
                      (val) =>
                        (val !== null && val !== '' && val != undefined) ||
                        $t('administration.connections.enterPos'),
                    ]" />
                  <span @click="$refs.select1.showPopup()" id="Span-SL1"
                    class="placeholder placeholder1">{{ $t('administration.connections.positionPrim1') }}</span>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select borderless class="selektKlass" option-value="ident" option-label="name"
                    :options="listaPozicija" map-options ref="select2" @focus="popniPlaceholder('Span-SL2')"
                    @input="popniPlaceholder('Span-SL2')"
                    @blur="spustiPlaceholder('Span-SL2', editedItem.sekundarnaPozicija)"
                    v-model="editedItem.sekundarnaPozicija"
                    v-on:input="promenaSekundarnePozicije(editedItem.id, editedItem.sekundarnaPozicija)" :rules="[
                      (val) =>
                        (val !== null && val !== '' && val != undefined) ||
                        $t('administration.connections.enterPos'),
                    ]" />
                  <span @click="$refs.select2.showPopup()" id="Span-SL2"
                    class="placeholder placeholder1">{{ $t('administration.connections.positionSec1') }}</span>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="custom-field one">
                  <q-select borderless class="selektKlass" option-value="ident" option-label="name"
                    :options="listaPozicija" map-options ref="select3" @focus="popniPlaceholder('Span-SL3')"
                    @input="popniPlaceholder('Span-SL3')"
                    @blur="spustiPlaceholder('Span-SL3', editedItem.tercijarnaPozicija)"
                    v-model="editedItem.tercijarnaPozicija"
                    v-on:input="promenaTercijarnePozicije(editedItem.id, editedItem.tercijarnaPozicija)" :rules="[
                      (val) =>
                        (val !== null && val !== '' && val != undefined) ||
                        $t('administration.connections.enterPos'),
                    ]" />
                  <span @click="$refs.select3.showPopup()" id="Span-SL3"
                    class="placeholder placeholder1">{{ $t('administration.connections.positionTerc1') }}</span>
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="center" class="bg-white text-teal ponisti">
          <q-btn :label="$t('administration.players.cancel')" @click="closePozicije" type="submit"
            style="background-color: #f5f8fb; color: #323b62; width: 20%; margin: 10px;" v-close-popup></q-btn>
          <q-btn :label="$t('administration.players.save')" @click="addRow" type="submit"
            style="background-color: #ff4b00; color: white; width: 20%; margin: 10px;"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- kraj dialoga za pozicije -->

    <!-- dailog za brisanje igraca -->
    <q-dialog persistent v-model="dialog_za_brisanje_igraca">
      <q-card style="width: 600px; max-width: 60vw;">
        <q-card-section>
          <q-btn icon="close" @click="closePozicije" flat round dense style="float: right;" v-close-popup />

          <div class="text-h6" style="text-align: center;">
            {{ $t('administration.connections.playerDel') }}
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular row" style="height: 110px; width: 100%; padding: 10px">
                <q-item-section class="col-2">
                  <img :src="editedItem.fotografija" spinner-color="white"
                    style="height: 90px; max-width: 90px; object-fit: cover; margin: 7px; margin-top: 4px;" />
                </q-item-section>
                <q-item-section class="column" style=" width: 100%;">
                  <q-item>
                    <!-- <q-item style="width: 60%; display: inline-block;"> -->
                    <q-item-section>
                      <label class="custom-field one">
                        <q-input borderless dense placeholder=" " disable v-model="editedItem.igrac"
                          @focus="popniPlaceholder('Span-IP2')" @input="popniPlaceholder('Span-IP2')"
                          @blur="spustiPlaceholder('Span-IP2', editedItem.igrac)" />
                        <span id="Span-IP2" class="placeholder">{{ $t('administration.connections.player') }}</span>
                      </label>
                    </q-item-section>
                  </q-item>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple @click="podigni()">
                <q-item-section avatar>
                  <q-radio @input="podigni()" v-model="izborBrisanja" val="brisiRegularno" color="teal" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('administration.connections.playerLeave') }}</q-item-label>
                </q-item-section>
              </q-item>

              <!-- <q-item v-if="izborBrisanja=='brisiRegularno'" class="formular ponisti" style="">
                <q-input dense outlined v-model="editedItem.datumPrestanka" :label="$t('administration.connections.dateTermination')" mask="date" :rules="['date']" class="datumKlasa">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                        <q-date v-model="editedItem.datumPrestanka" @input="() => $refs.qDateProxy1.hide()"></q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item> -->
              <q-item v-if="izborBrisanja == 'brisiRegularno'" class="formular1 ponisti"
                style="width: 35%; margin-top: 10px;">
                <label class="custom-field one datumInput">
                  <q-input borderless dense placeholder=" " v-model="editedItem.datumPrestanka"
                    @focus="popniPlaceholder('Span-IP3')"
                    @input="popniPlaceholder('Span-IP3'); () => $refs.qDateProxy1.hide()"
                    @blur="spustiPlaceholder('Span-IP3', editedItem.datumPrestanka)" ref="input3" mask="##/##/####"
                    :rules="[val => valiDate(val) || 'DD/MM/YYYY']">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">

                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date v-model="editedItem.datumPrestanka" mask="DD/MM/YYYY"
                            @input="() => $refs.qDateProxy.hide()"></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <span id="Span-IP3" class="placeholder">{{ $t('administration.connections.dateTermination') }}</span>
                </label>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <q-radio v-model="izborBrisanja" val="brisiGreska" color="red" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('administration.connections.playerDel') }}</q-item-label>
                  <q-item-label caption>{{ $t('administration.connections.typeErr') }}</q-item-label>
                </q-item-section>
              </q-item>

            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="center" class="bg-white text-teal ponisti">
          <q-btn :label="$t('administration.players.cancel')" @click="closeBrisanje" type="submit"
            style="background-color: #f5f8fb; color: #323b62; width: 20%; margin: 10px;" v-close-popup></q-btn>
          <q-btn :label="$t('administration.connections.accept')" @click="idemoNaBrisanje()" type="submit"
            style="background-color: #ff4b00; color: white; width: 20%; margin: 10px;"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- kraj dialoga za brisanje igraca -->


  </q-page>
</template>

<script>
//import principiIgreVue from '../pages/principiIgre.vue';

export default {
  data() {
    return {
      loadingUtakmice: false,
      loadingUtakmice1: false,
      izborBrisanja: '',
      filter: "",
      filterTim: "",
      splitterModel: 35.5,
      tabelaJedanZatvorena: true,
      tabelaDvaZatvorena: true,
      selected: [],
      selectedTim: [],
      selektovaniTim: null,
      selektovaniTrener: null,
      selektovaniKondicioniTrener: null,
      // selektovanaPozicija1: null,
      // selektovanaPozicija2: null,
      // selektovanaPozicija3: null,
      // selektovanaPozicija1List: [],
      // selektovanaPozicija2List: [],
      // selektovanaPozicija3List: [],
      listOptions: [],
      listaTimova: [],
      listaPozicija: [],
      ekipa: [],
      customer: {},
      dialog_za_pozicije: false,
      dialog_za_brisanje_igraca: false,
      primarnaPozicijaTemp: [],
      sekundarnaPozicijaTemp: [],
      tercijarnaPozicijaTemp: [],
      editedIndex: -1,
      lastAddedPlayerID: null,
      lastAddedStaffID: null,
      editedItem: {
        adresa: "",
        brojDeceUPorodici: 0,
        brojPasosa: "",
        datumRodjenja: "",
        drzavljanstvo: "",
        email: "",
        fotografija: "",
        id: 0,
        ime: "",
        kakoJeDosaoUKlub: "",
        kojeJeDetePoRedu: 0,
        mobilni: "",
        nadimak: "",
        obrazovanjeRoditelja: "",
        password: "",
        pol: "",
        prezime: "",
        primarnaPozicija: {},
        roditeljiZaposleni: "",
        roles: [],
        saKimZivi: "",
        sekundarnaPozicija: {},
        tercijarnaPozicija: {},
        userName: "",
        uspehPorodice: "",
        vaznostPasosa: "",
        datumPrelaska: "",
        datum: "",
        datumPrestanka: ""
      },
      defaultItem: {
        adresa: "",
        brojDeceUPorodici: 0,
        brojPasosa: "",
        datumRodjenja: "",
        drzavljanstvo: "",
        email: "",
        fotografija: "",
        id: 0,
        ime: "",
        kakoJeDosaoUKlub: "",
        kojeJeDetePoRedu: 0,
        mobilni: "",
        nadimak: "",
        obrazovanjeRoditelja: "",
        password: "",
        pol: "",
        prezime: "",
        primarnaPozicija: {},
        roditeljiZaposleni: "",
        roles: [],
        saKimZivi: "",
        sekundarnaPozicija: {},
        tercijarnaPozicija: {},
        userName: "",
        uspehPorodice: "",
        vaznostPasosa: "",
        datumPrelaska: "",
        datum: "",
        datumPrestanka: "",

      },
      mode: "list",
      modeTim: "list",
      columns: [
        {
          name: "igrac",
          required: true,
          label: this.$t('administration.connections.player'),
          align: "left",
          field: "igrac",
          sortable: true
        },

        // {
        //   name: "ime",
        //   required: true,
        //   label: "Ime",
        //   align: "left",
        //   field: "ime",
        //   sortable: true
        // },
        // {
        //   name: "prezime",
        //   align: "left",
        //   label: "Prezime",
        //   field: "prezime",
        //   sortable: true
        // },
        {
          name: "godiste",
          align: "left",
          label: this.$t('administration.connections.birthYear'),
          field: "godiste",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t('administration.connections.positions'),
          field: "action",
          sortable: true
        }
      ],
      data: [],
      pagination: {
        rowsPerPage: 25
      },
      columnsTim: [
        {
          name: "ime",
          required: true,
          label: this.$t('administration.connections.name'),
          align: "left",
          field: "ime",
          sortable: true
        },
        {
          name: "prezime",
          align: "left",
          label: this.$t('administration.connections.surname'),
          field: "prezime",
          sortable: true
        },
        {
          name: "rolesOpisno",
          align: "left",
          label: this.$t('administration.connections.type'),
          field: "rolesOpisno",
          sortable: true
        }
      ],
      dataTim: [],
      paginationTim: {
        rowsPerPage: 10
      }
    };
  },
  beforeMount() { },
  mounted() {
    debugger;
    this.getDataSelekcije(); //idemo da uzmenmo podatke iz baze
    // this.getDataIgraci();
    // this.getDataTim();
    // this.getDataPozicije();



    // change table height
    var temp = document.querySelectorAll(".my-sticky-header-table");
    // .my-sticky-header-table pravi problem treba tu da stavimo da je height unset
    for (var i = 0; i < temp.length; i++)
      temp[i].style.setProperty('height', 'unset');
    //   temp[i].style.setProperty('max-height', 'calc(85vh - 280px)');
  }, methods: {

    vratiBojuPozicije(code) {
      if (code == "GK")
        return "#e5b145"
      if (code == "LB" || code == "LBM" || code == "LCB" || code == "CB" || code == "RCB" || code == "RB" || code == "LOB" || code == "LWB" || code == "ROB" || code == "RWB")
        return "#7883fb"
      if (code == "LMD" || code == "CDM" || code == "RDM" || code == "LCM" || code == "CM" || code == "LM" || code == "RCM" || code == "RM" || code == "LAM" || code == "CAM" || code == "RAM")
        return "#49b756"
      if (code == "LF" || code == "CF" || code == "RF" || code == "LW" || code == "LST" || code == "ST" || code == "RST" || code == "RW")
        return "#e53a3b"
    },
    skloniStrucniTim(item) {

      console.log(item)
      console.log(this.selectedTim)
      const index = this.selectedTim.indexOf(item);
      this.selectedTim.splice(index, 1)
      let self = this
      setTimeout(() => {
        console.log(2)

        // self.selectedTim.sort((a,b) => (a.id == this.lastAddedStaffID ? -1 : (a.ime + " " + a.prezime > b.ime + " " + b.prezime) ? 1 : ((b.ime + " " + b.prezime > a.ime + " " + a.prezime) ? -1 : 0)))
        console.log(3)
        self.snimiEkipu()
        // not the solution
      }, 100);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o ekipi
    //........................................
    getDataEkipa(brlj) {
      let self = this;
      let linkStr = this.$apiPutanja + "/selekcije/full-info/" + brlj;
      this.loadingUtakmice = true
      this.loadingUtakmice1 = true
      //debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          self.ekipa = response.data; //.map(this.dajTimove);
          self.selected = response.data.igraci;
          console.log("self.selected")
          console.log(self.selected)
          // self.selected.sort(
          //   (a,b) =>
          //     (a.id == self.lastAddedPlayerID ? -1 :
          //       (a.ime + " " + a.prezime > b.ime + " " + b.prezime) ? 1 :
          //         ((b.ime + " " + b.prezime > a.ime + " " + a.prezime) ? -1 : 0)))

          var pomocna232 = ["GK", "LB", "LCB", "CB", "RCB", "RB", "LOB", "LWB", "ROB", "RWB", "LDM", "CDM", "RDM", "LM", "LCM", "CM", "RCM", "RM", "LAM", "CAM", "RAM", "LF", "CF", "RF", "LW", "LST", "ST", "RST", "RW"]

          self.selected.sort(
            (a, b) => {
              if (a.id == self.lastAddedPlayerID)
                return -1
              if (pomocna232.indexOf(a.primarnaPozicija.code) > pomocna232.indexOf(b.primarnaPozicija.code))
                return 1;
              if (pomocna232.indexOf(a.primarnaPozicija.code) < pomocna232.indexOf(b.primarnaPozicija.code))
                return -1;
              if (a.ime + " " + a.prezime > b.ime + " " + b.prezime)
                return 1
              if (b.ime + " " + b.prezime > a.ime + " " + a.prezime)
                return -1

              return 0
            })


          console.log("self.selected")
          console.log(self.selected)
          // if(self.lastAddedPlayerID != null){
          //   var tmp = self.selected.filter(e => e.id = self.lastAddedPlayerID)[0]
          //   console.log(tmp)
          //   // self.selected = self.selected.splice(self.selected.indexOf(tmp), 1);
          //   // self.selected.unshift(tmp)


          // }
          self.selectedTim = response.data.strucni_tim;

          setTimeout(() => {
            self.selectedTim.sort((a, b) => (a.id == self.lastAddedStaffID ? -1 : (a.ime + " " + a.prezime > b.ime + " " + b.prezime) ? 1 : ((b.ime + " " + b.prezime > a.ime + " " + a.prezime) ? -1 : 0)))
          }, 100);
          debugger;
        })
        .then(response => {
          this.getDataIgraci();
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka
    //........................................
    getDataSelekcije() {
      let linkStr = this.$apiPutanja + "/selekcije/active/1";
      debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          this.listaTimova = response.data.map(this.dajTimove);
          //debugger
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o igracima
    //........................................
    getDataIgraci() {
      let self = this;
      let linkStr = this.$apiPutanja + "/igraci";
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          self.data = response.data.map(this.dajIgrace);
          console.log("igraci: " + self.data);
          debugger;
        })
        .then(response => {
          this.getDataTim();
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
      function dodaj(item, index) {
        debugger;
        // self.item.push('primarnaPozicija[]')
        // self.item.push('selundarnaPozicija[]')
        // self.item.push('tercijarnaPozicija[]')
        console.log("push: " + self.data);
      }
    },
    dajIgrace(item) {
      let self = this;
      //debugger
      return {
        igrac: item.ime + " " + item.prezime,
        id: item.id,
        ime: item.ime,
        prezime: item.prezime,
        godiste: dajSamoGodinu(item.datumRodjenja),
        fotografija: item.fotografija,
        primarnaPozicija: dajPPoziciju(item.id),
        sekundarnaPozicija: dajSPoziciju(item.id),
        tercijarnaPozicija: dajTPoziciju(item.id),
        datumPrelaska: item.datumPrelaska,
        //istorijaIgracaKrozKlub: item.istorijaIgracaKrozKlub,
        //datumPrelaska: item.datumPrelaska, //proveriti
        //datumPrelaska: item.istorijaIgracaKrozKlub.datumPrestanka
      };
      function dajSamoGodinu(a) {
        var date = new Date(a);
        var year = date.getFullYear();
        return year;
      }
      function dajPPoziciju(ind) {
        for (var i = 0; i < self.selected.length; i++) {
          if (self.selected[i].id == ind) {
            // we found it
            // obj[i].name is the matched result
            return self.selected[i].primarnaPozicija;
          }
        }
      }
      function dajSPoziciju(ind) {
        for (var i = 0; i < self.selected.length; i++) {
          if (self.selected[i].id == ind) {
            // we found it
            // obj[i].name is the matched result
            return self.selected[i].sekundarnaPozicija;
          }
        }
      }
      function dajTPoziciju(ind) {
        for (var i = 0; i < self.selected.length; i++) {
          if (self.selected[i].id == ind) {
            // we found it
            // obj[i].name is the matched result
            return self.selected[i].tercijarnaPozicija;
          }
        }
      }
    },

    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o timu
    //........................................
    getDataTim() {
      //debugger
      let self = this
      let linkStr = this.$apiPutanja + "/strucni-stab";
      this.loadingUtakmice1 = true
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          self.dataTim = response.data;
          console.log("self.dataTim")
          console.log(self.dataTim.rolesOpisno)
          self.dataTim.forEach((entry, index) => {
            self.dataTim[index].rolesOpisno = entry.rolesOpisno.filter(e => !e.includes("Professional staff")).join(", ")
          });
          console.log(self.dataTim.rolesOpisno)
          console.log("self.dataTim")
          debugger;
        })
        .then(response => {
          self.loadingUtakmice1 = false
          self.getDataPozicije();
        })
        .catch(e => {
          //this.errors.push(e);
          this.loadingUtakmice1 = false
          console.log("Greska: " + e);
        });
    },

    //''''''''''''''''''''''''''''''''''''''''
    // citanje sifrarnika pozicja
    //........................................
    getDataPozicije() {
      let linkStr = this.$apiPutanja + "/pozicje-u-timu";
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          debugger;
          this.listaPozicija = response.data; //.map(this.dajPozicije);
          this.loadingUtakmice = false
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          this.loadingUtakmice = false
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // selektovanje/deselektovanje igraca
    //........................................
    onSelection({ rows, added, evt }) {
      debugger;
      if (added == true) {
        this.$q.notify({
          message: this.$t('administration.connections.msgPlayerInfoPos') + rows[0].igrac,
          color: "black"
        });
        this.pozicije(rows[0]); //pokusavamo da nateramo korisnika da odma doda pozicije
      } else {
        this.brisanje(rows[0]) //izbor: ili je greskom dodat, ili zaista vise nije clan ekipe
      }
    },
    //''''''''''''''''''''''''''''''''''''''''
    // selektovanje/deselektovanje tima?
    //........................................
    onSelection1({ rows, added, evt }) {

      console.log(rows)
      this.lastAddedStaffID = rows[0].id
      console.log(1)

      let self = this
      setTimeout(() => {
        console.log(2)

        // self.selectedTim.sort((a,b) => (a.id == this.lastAddedStaffID ? -1 : (a.ime + " " + a.prezime > b.ime + " " + b.prezime) ? 1 : ((b.ime + " " + b.prezime > a.ime + " " + a.prezime) ? -1 : 0)))
        console.log(3)
        self.snimiEkipu()
        // not the solution
      }, 100);

    },
    getSelectedStringTim() {
      return this.selectedTim.length === 0 ? '' : `${this.selectedTim.length} record${this.selectedTim.length > 1 ? 's' : ''} selected`
    },
    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected`
    },
    //''''''''''''''''''''''''''''''''''''''''
    // selektovanje/deselektovanje tima
    //........................................

    //''''''''''''''''''''''''''''''''''''''''
    // повезивање екипе
    //........................................
    snimiEkipu() {
      let linkStr = this.$apiPutanja + "/selekcije/full-info";
      var self = this;
      //let datetime = this.getDateTime(this.editedItem.datumVazenjaUgovora);
      //let datetime1 = this.getDateTime(this.editedItem.vaznostPasosa);
      debugger;

      var dataString = { id: this.ekipa.id };
      var i;
      var igraci;
      var sveOK = true;
      for (var i = 0; i < this.ekipa.igraci.length; i++) {
        if (this.ekipa.igraci[i].primarnaPozicija == undefined) {
          self.$q.notify({
            message:
              self.$t('administration.connections.msgPrimPos') +
              this.ekipa.igraci[i].igrac,
            color: "red"
          });
          sveOK = false;
        }
        if (this.ekipa.igraci[i].sekundarnaPozicija == undefined) {
          self.$q.notify({
            message:
              self.$t('administration.connections.msgSecPos') +
              this.ekipa.igraci[i].igrac,
            color: "orange"
          });
          sveOK = false;
        }
        if (this.ekipa.igraci[i].tercijarnaPozicija == undefined) {
          self.$q.notify({
            message:
              self.$t('administration.connections.msgTerPos') +
              this.ekipa.igraci[i].igrac,
            color: "pink"
          });
          sveOK = false;
        }
      }
      if (sveOK == false) {
        return;
      }

      console.log(this.ekipa.igraci)
      console.log(this.dajIgraceZaPut)
      try {
        igraci = this.ekipa.igraci.map(this.dajIgraceZaPut);
        i = { igraci: igraci };
      } catch (error) {
        self.$q.notify({
          message:
            self.$t('administration.connections.msgEnterData'),
          color: "red"
        });
        return;
      }

      let strucni_tim = this.ekipa.strucni_tim.map(this.dajStrucniTimZaPut); //this.selectedTim.map(this.dajStrucniTimZaPut); //this.ekipa.strucni_tim.map(this.dajStrucniTimZaPut);
      let st = { strucniStabIdentList: strucni_tim };
      Object.assign(dataString, i, st);

      debugger;
      //let dataString = [this.ekipa].map(this.dajEkipuZaPut);
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
          self.getDataEkipa(self.ekipa.id); //osvezimo podatke o ekipi
          self.$q.notify({
            message: self.$t('administration.connections.msgPositive'),
            color: "green"
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    promenaTimaBre() {
      debugger;
      this.ekipa.id = this.selektovaniTim.value;
      this.ekipa.imeTima = this.selektovaniTim.label;
      this.ekipa.mesto = this.selektovaniTim.mesto;
      this.ekipa.uzrast = this.selektovaniTim.uzrast;
      debugger;
      this.getDataEkipa(this.ekipa.id);

      // this.getDataIgraci();
      // this.getDataTim();
      // this.getDataPozicije();

      //this.ekipa[0].children[0].children[0].label=this.selektovaniTim.label
      console.log(this.ekipa);
    },
    promenaDatuma(ind, a) {
      debugger
      for (var i = 0; i < this.selected.length; i++) {
        // look for the entry with a matching `code` value
        if (this.selected[i].id == ind) {
          // we found it
          // obj[i].name is the matched result
          this.selected[i].datumPrelaska = a;
        }
      }
      this.ekipa.igraci = this.selected;
      this.$refs.qDateProxy.hide()
    },
    popniPlaceholder(id) {
      var izabraniPlaceholder = document.getElementById(id)

      izabraniPlaceholder.style.top = '0px'
      izabraniPlaceholder.style.backgroundColor = 'white'
      izabraniPlaceholder.style.fontSize = '9pt'
      izabraniPlaceholder.style.width = 'unset'
      izabraniPlaceholder.style.padding = '3px'
      izabraniPlaceholder.style.color = 'black'
    },
    spustiPlaceholder(id, val) {
      var izabraniPlaceholder = document.getElementById(id)

      if (val === '' || val == null || val.length == 0) {
        izabraniPlaceholder.style.top = '22px'
        izabraniPlaceholder.style.backgroundColor = 'unset'
        izabraniPlaceholder.style.fontSize = 'unset'
        izabraniPlaceholder.style.padding = '0px'
        izabraniPlaceholder.style.color = '#aaa'
      }
    },
    podigni() {
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    podigniPopunjenePlaceholdere() {
      var i = 0
      var sviInputi = document.getElementById("Span-IP" + i);
      while (!(i > 1 && sviInputi == null)) {
        if (sviInputi != null) {
          var val = sviInputi.parentElement.children[0].getElementsByTagName("input")[0].value

          if (val != '' && val != null)
            this.popniPlaceholder("Span-IP" + i)
        }

        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0
      var sviSelektovi = document.getElementById("Span-SL" + i);
      while (!(i > 1 && sviSelektovi == null)) {
        if (sviSelektovi != null) {
          var val = sviSelektovi.parentElement.children[0].innerText.split("\n").length

          if (val > 1)
            this.popniPlaceholder("Span-SL" + i)
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    promenaPrimarnePozicije(ind, a) {
      debugger;

      for (var i = 0; i < this.selected.length; i++) {
        // look for the entry with a matching `code` value
        if (this.selected[i].id == ind) {
          // we found it
          // obj[i].name is the matched result
          this.selected[i].primarnaPozicija = a;
        }
      }

      //this.editedItem.primarnaPozicija = a
      this.ekipa.igraci = this.selected;
    },
    promenaSekundarnePozicije(ind, a) {
      debugger;

      for (var i = 0; i < this.selected.length; i++) {
        // look for the entry with a matching `code` value
        if (this.selected[i].id == ind) {
          // we found it
          // obj[i].name is the matched result
          this.selected[i].sekundarnaPozicija = a;
        }
      }
      this.ekipa.igraci = this.selected;
    },
    promenaTercijarnePozicije(ind, a) {
      debugger;

      for (var i = 0; i < this.selected.length; i++) {
        // look for the entry with a matching `code` value
        if (this.selected[i].id == ind) {
          // we found it
          // obj[i].name is the matched result
          this.selected[i].tercijarnaPozicija = a;
        }
      }
      this.ekipa.igraci = this.selected;
    },

    dajTimove(item) {
      debugger;
      return {
        label: item.imeTima,
        value: item.ident,
        mesto: item.mesto,
        uzrast: item.uzrast
      };
    },
    dajPozicije(item) {
      debugger;
      return { label: item.name, value: item.ident, naziv: item.category };
    },
    function(subarray) {
      //this block will map  [2,7], [13, 47], [55,77] as in their own arrays individually?
      return subarray.map(function (number) {
        //this will iterate each index of the above array?
        return number * 3;
      });
    },
    dajEkipuZaPut(item) {
      debugger;
      return item.map({
        id: item.id,
        igraci: [
          {
            id: item.igraci.id,
            primarnaPozicija: {
              name: item.igraci.primarnaPozicija.name,
              ident: item.igraci.primarnaPozicija.ident,
              code: item.igraci.primarnaPozicija.code,
              category: item.igraci.primarnaPozicija.category
            },
            sekundarnaPozicija: {
              name: item.igraci.sekundarnaPozicija.name,
              ident: item.igraci.sekundarnaPozicija.ident,
              code: item.igraci.sekundarnaPozicija.code,
              category: item.igraci.sekundarnaPozicija.category
            },
            tercijarnaPozicija: {
              name: item.igraci.tercijarnaPozicija.name,
              ident: item.igraci.tercijarnaPozicija.ident,
              code: item.igraci.tercijarnaPozicija.code,
              category: item.igraci.tercijarnaPozicija.category
            }
          }
        ],
        strucni_tim: [
          {
            id: item.strucni_tim.id
          }
        ]
      });
    },
    dajStrucniTimZaPut(item) {
      debugger;
      return item.id;

      // return {
      //             "id": item.id,
      //           }
    },
    dajIgraceZaPut(item, index) {
      debugger;
      if (item.datumPrelaska == undefined) { item.datumPrelaska = this.getDateTime(Date.now()); }
      return {
        id: item.id,
        identPrimarnaPozicija: item.primarnaPozicija.ident,
        identSekundarnaPozicija: item.sekundarnaPozicija.ident,
        identTercijalnaPozicija: item.tercijarnaPozicija.ident,
        datum: this.getDateTime(item.datumPrelaska)
      };
    },
    pozicije(item, test) {
      console.log("POZICIJE")
      console.log("POZICIJE")
      console.log("POZICIJE")
      console.log("POZICIJE")
      console.log("POZICIJE")
      console.log("POZICIJE")

      if (test) {
        item = this.data.filter(e => e.id = item.id)[0]
      }
      console.log(item)
      debugger;
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      //Object.assign(this.data[this.editedIndex], this.editedItem);
      //Object.assign(this.editedItem, item);
      //Object.assign(this.editedItem, this.data[this.editedIndex]);
      this.editedItem.datumPrelaska = this.getDateTime(Date.now());
      this.editedItem.datumPrelaska = this.editedItem.datumPrelaska.slice(0, 10).replace(/-/g, '/').split("/")[2] + "/" + this.editedItem.datumPrelaska.slice(0, 10).replace(/-/g, '/').split("/")[1] + "/" + this.editedItem.datumPrelaska.slice(0, 10).replace(/-/g, '/').split("/")[0]

      this.dialog_za_pozicije = true;
      console.log(item)
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // pomocna f-ja za formatiranje datuma
    //........................................
    getDateTime(a) {
      debugger
      if (isNaN(a) && a.includes("-"))
        var timeStamp = new Date(a.split("-")[0], parseInt(a.split("-")[1]) - 1, a.split("-")[2].split("T")[0], 3, 0, 0)
      else if (isNaN(a))
        var timeStamp = new Date(a.split("/")[2], parseInt(a.split("/")[1]) - 1, a.split("/")[0], 3, 0, 0)
      else
        var timeStamp = new Date(a)
      const vrati = timeStamp.toISOString();
      return vrati
    },
    brisanje(item, test) {
      if (test) {
        console.log("this.$refs['table']")
        console.log(this.$refs['table'])
        // item = this.data.filter(e=> e.id = item.id)[0]

        const index = this.selected.indexOf(item);
        console.log(index)
        console.log(this.selected)
        console.log(item)

        this.selected.splice(index, 1);
        console.log(this.selected)

      }
      debugger;
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.datumPrestanka = this.getDateTime(Date.now());
      this.editedItem.datumPrestanka = this.editedItem.datumPrestanka.slice(0, 10).replace(/-/g, '/').split("/")[2] + "/" + this.editedItem.datumPrestanka.slice(0, 10).replace(/-/g, '/').split("/")[1] + "/" + this.editedItem.datumPrestanka.slice(0, 10).replace(/-/g, '/').split("/")[0]
      this.dialog_za_brisanje_igraca = true;
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    addRow() {
      let self = this;
      debugger;
      // if (this.editedIndex > -1) {
      //   if (
      //     this.editedItem.primarnaPozicija == undefined ||
      //     this.editedItem.sekundarnaPozicija == undefined ||
      //     this.editedItem.tercijarnaPozicija == undefined
      //   ) {
      //     self.$q.notify({
      //       message: self.$t('administration.connections.msgNo'),
      //       color: "red"
      //     });
      //   } else {
      //     Object.assign(this.data[this.editedIndex], this.editedItem);
      //     self.snimiEkipu();
      //     self.lastAddedPlayerID = this.editedItem.id
      //     self.closePozicije();
      //   }
      // } else {
      //   //
      // }
      let sveOK = true;
      debugger

      if (this.editedItem.primarnaPozicija == undefined || this.editedItem.primarnaPozicija == "")
        sveOK = false;
      if (this.editedItem.sekundarnaPozicija == undefined || this.editedItem.sekundarnaPozicija == "")
        sveOK = false;
      if (this.editedItem.tercijarnaPozicija == undefined || this.editedItem.tercijarnaPozicija == "")
        sveOK = false;

      if (sveOK == false) {
        this.$q.notify({
          icon: 'warning',
          message: this.$t("administration.connections.notSaved"),
          color: "red",
        });
        this.zacrveniPrazne();
      } else {
        Object.assign(this.data[this.editedIndex], this.editedItem);
        self.snimiEkipu();
        self.lastAddedPlayerID = this.editedItem.id
        self.closePozicije();
      }
    },
    zacrveniPrazne() {
      debugger
      let self = this
      var i = 0
      var sviInputi = document.getElementById("Span-IP" + i);

      while (!(i > 1 && sviInputi == null)) {
        if (sviInputi != null && this.$refs['input' + i] != undefined) {
          this.$refs['input' + i].validate()
        }

        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0
      var sviSelektovi = document.getElementById("Span-SL" + i);
      while (!(i > 1 && sviSelektovi == null)) {
        debugger
        if (sviSelektovi != null && this.$refs['select' + i] != undefined) {
          this.$refs['select' + i].validate()
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    valiDate(date) {
      let dateformat = /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])/;

      date = date.split(" ")[0]
      // Matching the date through regular expression
      if (date.match(dateformat)) {
        let operator = date.split('/');

        // Extract the string into month, date and year
        let datepart = [];
        if (operator.length > 1) {
          datepart = date.split('/');
        }
        let day = parseInt(datepart[0]);
        let month = parseInt(datepart[1]);
        let year = parseInt(datepart[2]);

        // Create a list of days of a month
        let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month == 1 || (month > 2 && month < 13)) {
          if (day > ListofDays[month - 1]) {
            //to check if the date is out of range
            console.log("Invalid date")
            return false;
          }
        } else if (month == 2) {
          let leapYear = false;
          if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
          if ((leapYear == false) && (day >= 29)) {
            console.log("Invalid date")
            return false;
          }
          else
            if ((leapYear == true) && (day > 29)) {
              console.log('Invalid date format!');
              return false;
            }
        } else {
          console.log('Invalid date format!');
          return false;
        }
      } else {
        console.log("Invalid date format!");
        return false;
      }
      return true;
    },
    closePozicije() {
      this.dialog_za_pozicije = false;
      this.promenaTimaBre()
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 30);
    },
    idemoNaBrisanje() {
      debugger
      if (this.izborBrisanja == 'brisiRegularno') {
        this.krajIgreUSelekciji();
      } else {
        this.dialog_za_brisanje_igraca = false
        let self = this;
        let obj = {
          title: this.$t('administration.user.war'),
          message: this.$t('administration.connections.msgDelConf'),
          customCloseBtnText: this.$t('administration.user.txtNo'),
          disableOverlayClick: true,
          useConfirmBtn: true,
          customConfirmBtnText: this.$t('administration.user.txtYes'),
          onConfirm: onConfirmWrapper,
          onClose: eBasNecu,
          type: 'warning',
          showXclose: true,
        }
        this.$Simplert.open(obj);
        function onConfirmWrapper() {
          self.brisiZauvek();
        }
        function eBasNecu() {
          self.promenaTimaBre();
        }
      }
    },
    krajIgreUSelekciji() {
      this.odeIzSelekcije();
    },
    //''''''''''''''''''''''''''''''''''''''''
    // igrac napusta selekciju
    //........................................
    odeIzSelekcije() {
      debugger
      var self = this;
      if (this.editedItem.naziv_uloge == "" || this.editedItem.naziv_uloge == " ") {
        self.$q.notify({
          message: self.$t('administration.connections.msgEnterRoleName'),
          color: "red"
        });
        return
      }
      let linkStr = this.$apiPutanja + '/istorija-igraca-kroz-klub/set-datum-prestanka-to-active'

      let datetime = this.getDateTime(this.editedItem.datumPrestanka);

      var dataString = {
        datumPrestanka: datetime,
        identSelekcija: this.ekipa.id,
        identIgrac: this.editedItem.id,
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
        .then(function (response) {
          debugger
          console.log(response);
          //self.getData();
          self.$q.notify({
            message: self.$t('administration.connections.msgLeft'),
            color: "green"
          });
          self.snimiEkipu();
          self.closeBrisanje();
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //alert(response);
          self.$q.notify({
            message: self.$t('administration.connections.msgLeftNot'),
            color: "red"
          });
        });

    },
    brisiZauvek() {
      debugger
      let linkStr = this.$apiPutanja + '/selekcije/' + this.ekipa.id + '/igrac/' + this.editedItem.id
      var self = this;
      this.$axios
        .delete(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function (response) {
          debugger
          console.log(response);
          //self.getDataZaID();
          self.closeBrisanje();
          self.$q.notify({
            message: self.$t('administration.connections.msgDel'),
            color: "green"
          });
          self.snimiEkipu();
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    closeBrisanje() {
      this.dialog_za_brisanje_igraca = false;
      this.izborBrisanja = ''
      this.promenaTimaBre()
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 30);
    },
    jednaUkljucenaFn() {
      // change table height
      debugger
      var otvorena = 1;
      if (this.tabelaJedanZatvorena && !this.tabelaDvaZatvorena)
        otvorena = 1;
      else if (!this.tabelaJedanZatvorena && this.tabelaDvaZatvorena)
        otvorena = 0;
      else if (!this.tabelaJedanZatvorena && !this.tabelaDvaZatvorena)
        otvorena = 3;
      // TODO: akobude trebala da se poveca tabela kad je jedna otvorena
      if (otvorena == 3) {
        var temp = document.querySelectorAll(".q-table__middle");
        temp[0].style.setProperty('max-height', 'calc(55vh - 280px)');
        temp[1].style.setProperty('max-height', 'calc(55vh - 280px)');
      }
      else if (otvorena == 1) {
        var temp = document.querySelectorAll(".q-table__middle");
        temp[1].style.setProperty('max-height', 'calc(85vh - 280px)');
        temp[0].style.setProperty('max-height', 'calc(55vh - 280px)');
      }
      else if (otvorena == 0) {
        var temp = document.querySelectorAll(".q-table__middle");
        temp[0].style.setProperty('max-height', 'calc(85vh - 280px)');
        temp[1].style.setProperty('max-height', 'calc(55vh - 280px)');
      }
    },
  },
  watch: {
    selected: function (val) {
      debugger;
      this.ekipa.igraci = this.selected; //.map(this.dajIgrace)
      //console.log(this.ekipa)
    },
    selectedTim: function (val) {
      debugger;
      this.ekipa.strucni_tim = this.selectedTim;
      //console.log(this.ekipa)
    },
    data: function (val) {
      debugger;
      this.ekipa.igraci = this.selected; //.map(this.dajIgrace)
      //this.selected = this.ekipa.igraci
      //console.log(this.ekipa)
    },
    // selectedTim:function(val) {
    //   this.ekipa.strucni_tim = this.selectedTim //.map(this.dajIgrace)
    //   console.log(this.ekipa)
    // },
    selektovaniTim: function (val) {
      this.ekipa.id = this.selektovaniTim.value;
      this.ekipa.imeTima = this.selektovaniTim.label;
      this.ekipa.mesto = this.selektovaniTim.mesto;
      this.ekipa.uzrast = this.selektovaniTim.uzrast;
      console.log(JSON.stringify(this.ekipa));
    },
    // editedItem:function(val) {
    //   debugger
    //   //this.ekipa.igraci = this.selected
    // },
    selektovanaPozicija1List: function (val) {
      //debugger
      //this.ekipa.igraci[this.selektovanaPozicija1List[index]].primarnaPozicija = this.selektovanaPozicija1List.vaznostPasosa //.map(this.dajIgrace)
      //console.log(this.ekipa)
    }
  }
};
</script>


<style scoped>
.dugmeSearch {
  margin: 0px 5px 0px 0px;
  float: right;
}

tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}
</style>
