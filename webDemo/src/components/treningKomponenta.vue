<template>
  <q-page class="q-pa-sm">
    <q-table :title="$t('trainings.trainings')" :data="data" :hide-header="mode === 'grid'" :columns="columns"
      row-key="ident" :grid="mode == 'grid'" :filter="filter" :pagination.sync="pagination"
      :rows-per-page-label="$t('table.rowsPerPage')" :no-data-label="$t('table.noData')"
      :loading-label="$t('table.loadingLabel')" :no-results-label="$t('table.noResultLabel')" :loading="loadingTreninzi"
      class="mojaTabela my-sticky-header-table" style="
        background-color: unset;
        box-shadow: unset;
      "
      table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10">
      <!--           selection="single"
          :selected.sync="selected" -->

      <template v-slot:top-right="props">
        <q-btn v-if="selektovaniTim != undefined" @click="otvordeDialog()" :label="$t('trainings.newTraining')"
          class="q-mr-xs dugmeNewNesto" />

        <q-input outlined class="dugmeSearch" dense debounce="300" v-model="filter">
          <!--  :placeholder="$t('table.search')" -->
          <template v-slot:append>
            <q-icon name="search" color="blue-10" />
          </template>
        </q-input>

        <!-- <q-btn flat round dense class="plavaKlasaTekst" :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen" v-if="mode === 'list'">
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>
            {{props.inFullscreen ? $t('table.exitFullScreen') : $t('table.fullScreen')}}</q-tooltip>
        </q-btn> -->

        <q-btn flat round dense class="plavaKlasaTekst" :icon="mode === 'grid' ? 'list' : 'grid_on'" @click="
          mode = mode === 'grid' ? 'list' : 'grid';
        separator = mode === 'grid' ? 'none' : 'horizontal';
        " v-if="!props.inFullscreen">
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            mode === "grid" ? $t("table.list") : $t("table.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn class="dugmeCVS" :label="$t('table.exportToCSV')" no-caps @click="exportTable" />
      </template>

      <template v-slot:header-cell-action="props">
        <q-th style="color: #ffffff00; width: 150px">
          {{ props.col.label }}
        </q-th>
      </template>

      <template v-slot:body-cell="props">
        <q-td :props="props" v-if="props.value == props.row.action">
          <div class="q-gutter-sm" style="width: 170px">
            <q-btn @click="deleteItem(props.row)" id="dugmeBrisi" round dense
              style="background-color: #e5edf4; color: #3b5d99; float: right" icon="delete">
              <q-tooltip>{{ $t("table.delete") }}</q-tooltip>
            </q-btn>
            <q-btn @click="editItem(props.row)" id="dugmeEdit" round dense
              style="background-color: #e5edf4; color: #3b5d99; float: right" icon="edit">
              <q-tooltip> {{ $t("trainings.modfTrainingData") }}</q-tooltip>
            </q-btn>
            <q-btn @click="tokTreninga(props.row)" id="dugmeModifaj" round dense
              style="background-color: #e5edf4; color: #3b5d99; float: right" icon="details">
              <q-tooltip>{{ $t("trainings.trainingFlow") }}</q-tooltip>
            </q-btn>
            <q-btn id="dugmeOdrzanTrening" v-if="
              Date.parse(props.row.vremePocetka) +
              parseInt(props.row.vremeTrajanjaTreninga) * 60000 <=
              Date.now() && props.row.opisnaOcenaTreninga.trim() != ''
            " readonly round dense style="background-color: #e5edf4; color: #3b5d99; float: right" icon="check_circle">
              <!-- <q-tooltip>{{ Date(Date.parse(props.row.vremePocetka) + parseInt(props.row.vremeTrajanjaTreninga)*60000)  }}</q-tooltip> -->
              <q-tooltip>{{ $t("trainings.trainingWasHeld") }}</q-tooltip>
            </q-btn>
            <q-btn v-else readonly round dense style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="radio_button_unchecked">
              <q-tooltip>{{ $t("trainings.trainingWasNotHeld") }}</q-tooltip>
              <!-- <q-tooltip>
                "{{ props.row.opisnaOcenaTreninga }}"
                <br>
                {{ new Date(Date.parse(props.row.vremePocetka)).toLocaleString() }}
                <br>
                {{ new Date(Date.parse(props.row.vremePocetka) + parseInt(props.row.vremeTrajanjaTreninga)*60000).toLocaleString() }}
                <br>
                {{ new Date(Date.now()).toLocaleString() }}
              </q-tooltip> -->
              <!-- <q-tooltip>{{ props.row.opisnaOcenaTreninga  }}</q-tooltip> -->
              <!-- <q-tooltip>{{ Date.parse(props.row.datum) + parseInt(props.row.vremeTrajanjaTreninga)*60000 }}</q-tooltip> -->
              <!-- <q-tooltip>{{ Date.parse(props.row.datum) + parseInt(props.row.vremeTrajanjaTreninga)*60000 <= Date.now() && props.row.opisnaOcenaTreninga.trim() != '' }}</q-tooltip> -->
            </q-btn>
          </div>
        </q-td>

        <q-td :props="props" v-else-if="props.value == props.row.datum" @click="otvoriPreviewDialog(props.row)">
          <div class="" id="username">
            {{ props.row.vremePocetka }}
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
            {{ $t("trainings.training") }}
            <!-- <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn> -->
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.lokacija" :label="$t('trainings.location')"></q-input> -->
                  <label class="custom-field one">
                    <q-input :readonly="readonly" hide-bottom-space borderless dense type="text" placeholder=" "
                      v-model="editedItem.lokacija" @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')" @blur="spustiPlaceholder('Span-IP1', editedItem.lokacija)"
                      ref="input1" :rules="[
                        val =>
                          (val !== null && val !== '') ||
                          $t('trainings.enterLocation')
                      ]" />
                    <span id="Span-IP1" class="placeholder">{{
                      $t("trainings.location")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.temperatura" mask="##" :label="$t('trainings.temperature')"></q-input> -->
                  <label class="custom-field one">
                    <q-input :readonly="readonly" borderless dense type="text" placeholder=" "
                      v-model="editedItem.temperatura" ref="input2" @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')" @blur="
                        spustiPlaceholder('Span-IP2', editedItem.temperatura)
                        " />
                    <span id="Span-IP2" class="placeholder">{{ $t("trainings.temperature") }} [°C]</span>
                  </label>
                </q-item-section>
                <q-item-section class="custom-field one" style="margin-top: 10px">
                  <q-select :readonly="readonly" borderless class="selektKlass" option-value="value"
                    option-label="label" :options="listaUslova" v-model="editedItem.uslovi" emit-value map-options
                    ref="select1" @focus="popniPlaceholder('Span-SL1')" @input="popniPlaceholder('Span-SL1')"
                    @blur="spustiPlaceholder('Span-SL1', editedItem.uslovi)" />
                  <span @click="$refs.select1.showPopup()" id="Span-SL1" class="placeholder placeholder1">{{
                    $t("trainings.conditions") }}</span>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select :readonly="readonly" borderless class="selektKlass" option-value="value"
                    option-label="label" :options="listaPodloga" v-model="editedItem.podloga" emit-value map-options
                    ref="select2" @focus="popniPlaceholder('Span-SL2')" @input="popniPlaceholder('Span-SL2')"
                    @blur="spustiPlaceholder('Span-SL2', editedItem.podloga)" />
                  <span @click="$refs.select2.showPopup()" id="Span-SL2" class="placeholder placeholder1">{{
                    $t("trainings.base") }}</span>
                </q-item-section>
                <q-item-section class="custom-field one">
                  <q-select :readonly="readonly" borderless class="selektKlass" option-value="value"
                    option-label="label" :options="listaTipovaTreninga" v-model="editedItem.tipTreninga" emit-value
                    map-options ref="select3" @focus="popniPlaceholder('Span-SL3')"
                    @input="popniPlaceholder('Span-SL3')" @blur="
                      spustiPlaceholder('Span-SL3', editedItem.tipTreninga)
                      " :rules="[
                        val =>
                          (val !== null && val !== '') ||
                          $t('trainings.enterTrainingType')
                      ]" />
                  <span @click="$refs.select3.showPopup()" id="Span-SL3" class="placeholder placeholder1">{{
                    $t("trainings.trainingType") }}</span>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one datumInput">
                    <q-input :readonly="readonly" borderless dense placeholder=" " v-model="editedItem.vremePocetka"
                      mask="##/##/#### - ##:##" @focus="popniPlaceholder('Span-IP3')"
                      @input="popniPlaceholder('Span-IP3')" @blur="
                        spustiPlaceholder('Span-IP3', editedItem.vremePocetka)
                        " ref="input3" :rules="[val => valiDate(val) || 'DD/MM/YYYY HH:mm']">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-date :readonly="readonly" v-model="editedItem.vremePocetka" mask="DD/MM/YYYY - HH:mm">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>

                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-time :readonly="readonly" v-model="editedItem.vremePocetka" mask="DD/MM/YYYY - HH:mm"
                              format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <span id="Span-IP3" style="left: 40px" class="placeholder">{{ $t("trainings.trainingStart")
                      }}</span>
                    <!-- <label class="custom-field one">
                    <input type="text" placeholder=" "
                    v-model="editedItem.vremePocetka"
                    :label="$t('trainings.trainingStart')"
                    />
                    <span class="placeholder">{{$t('trainings.trainingStart')}}</span>
                  </label> -->
                  </label>
                </q-item-section>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.vremeTrajanja" :label="$t('trainings.trainingDurationMin')"></q-input> -->
                  <label class="custom-field one">
                    <q-input :readonly="readonly" borderless dense placeholder=" " v-model="editedItem.vremeTrajanja"
                      @focus="popniPlaceholder('Span-IP4')" @input="popniPlaceholder('Span-IP4')" @blur="
                        spustiPlaceholder('Span-IP4', editedItem.vremeTrajanja)
                        " ref="input4" :rules="[
                          val =>
                            (val !== null && val !== '') ||
                            $t('trainings.enterTrainingDuration')
                        ]" />
                    <span id="Span-IP4" class="placeholder">{{ $t("trainings.trainingDurationMin") }} [min]</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined multiline v-model="editedItem.opisniCiljTreningaUPripremi"
                    :label="$t('trainings.preparationGoal')"></q-input> -->
                  <label class="custom-field one">
                    <q-input :readonly="readonly" hide-bottom-space borderless dense placeholder=" "
                      v-model="editedItem.opisniCiljTreningaUPripremi" @focus="popniPlaceholder('Span-IP5')"
                      @input="popniPlaceholder('Span-IP5')" @blur="
                        spustiPlaceholder(
                          'Span-IP5',
                          editedItem.opisniCiljTreningaUPripremi
                        )
                        " ref="input5" />
                    <span id="Span-IP5" class="placeholder">{{
                      $t("trainings.preparationGoal")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.opisnaOcenaTreninga" :label="$t('trainings.trainingEvaluation')"></q-input> -->
                  <label class="custom-field one">
                    <q-input :readonly="readonly" hide-bottom-space borderless dense placeholder=" "
                      v-model="editedItem.opisnaOcenaTreninga" @focus="popniPlaceholder('Span-IP6')"
                      @input="popniPlaceholder('Span-IP6')" @blur="
                        spustiPlaceholder(
                          'Span-IP6',
                          editedItem.opisnaOcenaTreninga
                        )
                        " ref="input6" />
                    <span id="Span-IP6" class="placeholder">{{
                      $t("trainings.trainingEvaluation")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <!-- <q-item>
                <q-item-section>
                  <q-select
                  borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                    :option-label="(item) => item === null ? null : item.ime + ' ' + item.prezime"
                    :option-value="(item) => item === null ? null : item.ime + ' ' + item.prezime"
                    :label="$t('trainings.players')"
                    multiple
                    :options="igraciSelekcije"
                    v-model="prisutniIgraciNaTreningu"
                  />
                </q-item-section>
              </q-item> -->
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
            {{ $t("trainings.training") }}
            <!-- <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn> -->
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input readonly type="text" placeholder=" " v-model="editedItem.lokacija"
                      :label="$t('trainings.location')" />
                    <span class="placeholder">{{
                      $t("trainings.location")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input readonly type="text" placeholder=" " v-model="editedItem.temperatura"
                      :label="$t('trainings.temperature')" />
                    <span class="placeholder">{{
                      $t("trainings.temperature")
                    }}</span>
                  </label>
                </q-item-section>
                <q-item-section>
                  <q-select readonly borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; "
                    :label="$t('trainings.conditions')" :options="listaUslova" v-model="editedItem.uslovi" emit-value
                    map-options />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-select readonly borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    :label="$t('trainings.base')" :options="listaPodloga" v-model="editedItem.podloga" emit-value
                    map-options />
                </q-item-section>
                <q-item-section>
                  <q-select readonly borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    :label="$t('trainings.trainingType')" :options="listaTipovaTreninga"
                    v-model="editedItem.tipTreninga" emit-value map-options />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-input readonly outlined dense class="datumInputReadonly" v-model="editedItem.vremePocetka"
                    :label="$t('trainings.trainingStart')" mask="##/##/#### - ##:##">
                  </q-input>
                </q-item-section>
                <q-item-section>
                  <label class="custom-field one">
                    <input readonly type="text" placeholder=" " v-model="editedItem.vremeTrajanjaTreninga"
                      :label="$t('trainings.trainingDurationMin')" />
                    <span class="placeholder">{{
                      $t("trainings.trainingDurationMin")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input readonly type="text" placeholder=" " v-model="editedItem.opisniCiljTreningaUPripremi"
                      :label="$t('trainings.preparationGoal')" />
                    <span class="placeholder">{{
                      $t("trainings.preparationGoal")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input readonly type="text" placeholder=" " v-model="editedItem.opisnaOcenaTreninga"
                      :label="$t('trainings.trainingEvaluation')" />
                    <span class="placeholder">{{
                      $t("trainings.trainingEvaluation")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-select readonly borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                    :option-label="item =>
                      item === null ? null : item.ime + ' ' + item.prezime
                      " :option-value="item =>
                        item === null ? null : item.ime + ' ' + item.prezime
                        " :label="$t('trainings.players')" multiple :options="igraciSelekcije"
                    v-model="prisutniIgraciNaTreningu" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- POCETAK DRUGOG POKUSAJA ZA DIALOG ZA TRENING -->

    <q-dialog :full-width="maximizedToggle" :full-height="maximizedToggle" v-model="dialogZaTokTreninga" persistent
      @mousemove="onMouseMove()" @mouseup="onMouseUp()" style="user-select: none;">
      <q-card style="width: 100vw; max-width: 100vw; height:100%; overflow: hidden; " flat bordered>
        <!-- Za potrebe zabrane izmene, ukoliko je utakmica vec gotova? -->
        <div v-if="zabraniKlik"
          style="background-color: rgba(1, 1, 1, 0.7);bottom: 0;left: 0;position: fixed;right: 0;top: 0; z-index: 1000; filter:blur(4px);">
        </div>
        <!-- Ako je i ovo izgleda kao da se konstantno ucitava? -->
        <q-spinner v-if="zabraniKlik" style="position: absolute; top: 45%; left: 45%;z-index: 1001;" color="primary"
          size="3em" :thickness="10" />

        <!-- HEADER - samo prikaz nekih informacija -->
        <q-item style="height: 10%">
          <q-item-section>
            <q-item-label>{{ $t("trainings.trainingFlow") }}</q-item-label>
            <q-item-label caption>
              {{ izabraniTrening.lokacija }} -
              {{ izabraniTrening.tipTreninga }} ({{
                izabraniTrening.vremePocetka
              }})
            </q-item-label>
            <!-- FULLSCREEN - ugasen -->
            <!-- <q-btn style="width: 30px;position: absolute; right:50px; display:block" dense flat icon="fullscreen_exit" @click="povecaj1(a); getBlokTreninga(identIzabranogTreninga);" :disable="!maximizedToggle" />
            <q-btn style="width: 30px;position: absolute; right:10px; display:block" dense flat icon="fullscreen" @click="smanji1(a); getBlokTreninga(identIzabranogTreninga);" :disable="maximizedToggle" /> -->
          </q-item-section>
          <q-btn icon="close" flat round dense style="float: right; width: fit-content; width: 40px; height: 40px;"
            v-close-popup></q-btn>
        </q-item>

        <q-separator style="background: #f5f8fb !important; height: 1px;" />

        <q-card-section horizontal style="height:90%">
          <!-- Sekcija za vremenska linja -->
          <q-card-section class="col-9" id="ovdeUbaciKlonove">
            <!-- Donji header (prisustvo, odbacivanje elementa i promena velicine vremenske linije) -->

            <div class="vanTabele">
              <div class="uTabeli">
                <q-btn @click="otvoriDialogZaProzivku" style="width: 180px" class="dugmeNewNesto">{{
                  $t("trainings.rollCall") }}</q-btn>
              </div>
              <div class="uTabeli" style="text-align: center;">
                <q-btn style="" @click="skratiUtakmicu1()" class="dugmeNewNesto1" :disable="dozvolaZaIzmenu"><i
                    class="fas fa-angle-double-left" style="padding-right: 10px;"></i>-15 min</q-btn>
                <q-btn style="" @click="produziUtakmicu1()" class="dugmeNewNesto1" :disable="dozvolaZaIzmenu">+15 min
                  <i class="fas fa-angle-double-right" style="padding-left: 10px"></i></q-btn>
              </div>
              <div class="uTabeli" style="text-align: -webkit-right;">
                <div style="text-align: center; margin: auto; background-color: #e5edf4;
                        width: 140px; height: 40px; border-radius: 5px;
                        display:flex;" id="brisi">
                  <span class="material-icons" style="font-size: 30px; color: #3b5d99; margin: auto;">
                    delete
                  </span>
                </div>
              </div>
            </div>

            <!-- Vremenske linije -->
            <div v-for="(items, index) in sviTimelinovi" :key="index" style="margin: 25px 0px;">
              <!-- Sekcija iznad vremenskih linija za prikaz vremena -->
              <!-- kraceTrajanjeIzabranogTreninga - broj sekcija treninga u trajanju od 5 minuta -->
              <div class="row" id="timeline">
                <div class="col" v-for="i in kraceTrajanjeIzabranogTreninga" :key="i + 10"
                  style="padding: 2px; font-size: 8pt;">
                  <span v-if="i % 2 == 1">{{
                    (vremePocetkaTreningaUMinutima + (i - 1) * 5)
                    | minutesToTimeOfDay
                    }}</span>
                </div>
              </div>

              <!-- Ovo su kvadraici - interesuju nas pozicije ovih grupa -->
              <!-- kraceTrajanjeIzabranogTreninga - broj sekcija treninga u trajanju od 5 minuta -->
              <div class="row" style="border-left: 1px solid #000000ff;border-right: 1px solid #000000ff;"
                :id="'timelineBroj' + index">
                <div class="col" v-for="i in kraceTrajanjeIzabranogTreninga" :key="i + ' - sekcija od 5 minuta'"
                  style="border-bottom: 1px solid #000000ff; border-top: 1px solid #000000ff; border-right: 1px solid #0000003f; border-left: 0px; padding: 2px; height: 50px;">
                </div>
              </div>
            </div>

            <!-- Ovo je losa zamena za donju marginu -->
            <br /><br /><br /><br />

            <!-- Trenazne vezbe u toku treninga -->
            <q-card v-for="element in sviKlonovi" :key="(element.id + 1) * -1" bordered :id="'klonovi' + element.id"
              class="my-card trenazne-vezbe" :style="{ backgroundColor: allColors[element.id] }"
              style="user-select: none;height:44px; width: 250px; position: absolute; left:0px;margin-top:3px;">
              <!-- Desni klik, izmena ili brisanje trenazne vezbe -->
              <q-menu :offset="[-50, 10]" context-menu>
                <q-list dense style="min-width: 100px;">
                  <q-item @click="postavkeTrenazneVezbe(element)" clickable v-close-popup>
                    <q-item-section avatar>
                      <q-icon color="primary" name="settings" />
                    </q-item-section>
                    <q-item-section>
                      {{ $t("trainings.details") }}</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item @click="obrisiElement(element)" clickable v-close-popup>
                    <q-item-section avatar>
                      <q-icon color="primary" name="delete" />
                    </q-item-section>
                    <q-item-section>{{
                      $t("trainings.delete")
                    }}</q-item-section>
                  </q-item>
                  <q-item @click="seeDescription(element)" clickable v-close-popup>
                    <q-item-section avatar>
                      <q-icon color="primary" name="info" />
                    </q-item-section>
                    <q-item-section>{{
                      $t('trainings.seeDescription')
                    }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>

              <!-- PRIKAZ - Vreme pocetka trenazne vezbe -->
              <span :id="'leviSat' + element.id"
                style="width: 70px; text-align:center; background-color: #0000000f; border-radius: 10px; border: 1px solid #c5c5c5; position:absolute; bottom: -30px; left: -35px; display: none;">{{
                  trenutniSatL }}</span>
              <!-- PRIKAZ - Vreme trajanja trenazne vezbe -->
              <span :id="'desniSat' + element.id"
                style="width: 70px; text-align:center; background-color: #0000000f; border-radius: 10px; border: 1px solid #c5c5c5; position:absolute; bottom: -30px; right: -35px; display: none;">{{
                  trenutniSatD }}</span>

              <!-- Izgled kvadrata trenazne vezbe -->
              <q-card-section style="padding: 0px; width: 100%;height: 100%;margin: 0px;">
                <div class="row" style="height: 100%;">
                  <!-- Promena trajanja trenazne vezbe - leva strana -->
                  <div class="col-1 strelice" style="text-align: left;margin: auto;width:10px;"
                    @mousedown="onMouseLeft(element)">
                    <i class="fas fa-grip-lines-vertical"></i>
                  </div>

                  <div class="col"
                    style="text-align:center;width:100%; margin: auto;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
                    @mousedown="onMouseDown1(element)">
                    <span style="width:70%; margin: 0px 10px;">
                      {{ element.naziv }}
                    </span>
                  </div>

                  <!-- Promena trajanja trenazne vezbe - leva strana -->
                  <div class="col-1 strelice" style="text-align: right;margin: auto;width: 10px;"
                    @mousedown="onMouseRight(element)">
                    <i class="fas fa-grip-lines-vertical"></i>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Opis trenazne vezbe -->

            <q-dialog v-model="procitajOpis">
              <q-card>
                <q-card-section>
                  <q-btn icon="close" flat round dense style="float: right; width: fit-content;" v-close-popup></q-btn>
                  <div class="text-h6" v-html="naslovTrenaze"></div>
                </q-card-section>

                <q-card-section class="q-pa-none">
                  <!-- <div v-html="pomocniElementZaDialog.opis"></div> -->
                  <quill-editor disabled class="editor" :value="pomocniElementZaDialog.opis"
                    :options="{ modules: { toolbar: [] } }" />
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat :label="$t('trainings.ok')" color="primary" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <!-- Izmena detalja trenazne vezbe -->
            <q-dialog v-model="dialogZaPostavkeTrenazneVezbe">
              <q-card style="width: 1400px; max-width: 100vw;">
                <q-card-section class="q-pa-md" style="text-align:center">
                  <q-btn icon="close" flat round dense style="float: right; width: fit-content;" v-close-popup></q-btn>
                  <div class="text-h6" v-html="naslovTrenaze"></div>
                  <q-btn :label="$t('trainings.seeDescription')" color="primary" @click="procitajOpis = true" />
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pt-none row">
                  <q-card-section class="q-pa-md  col-3">
                    <!-- kmeeeeeeeeeee -->
                    <!-- <div class="bg-grey-2 q-pa-sm rounded-borders">
                        Accepted genres:
                        <q-option-group
                          name="accepted_genres"
                          v-model="accepted"
                          :options="options"
                          type="checkbox"
                          color="primary"
                          inline
                        />
                      </div> -->
                    <div class="naslovcic" style="padding-left: 5px">
                      <p>{{ $t("trainings.naslovPridruzivanje") }}</p>
                    </div>
                    <q-btn style="width: 100px; margin: 2.5px" color="primary" :label="$t('trainings.everybody')"
                      @click="
                        prisutniIgraciNaTreningu.forEach(function (entry) {
                          if (!igraciIzabraniPrivremeno.includes(entry))
                            igraciIzabraniPrivremeno.push(entry);
                        })
                        " />
                    <q-btn style="width: 40px; margin: 2.5px;" color="red" icon="remove"
                      @click="igraciIzabraniPrivremeno = []" />
                    <q-btn style="width: 100px; margin: 2.5px" color="primary" :label="$t('trainings.goalkeeper')"
                      @click="
                        prisutniIgraciNaTreningu.forEach(function (entry) {
                          if (entry.primarnaPozicija.category == 'GOLMAN')
                            if (!igraciIzabraniPrivremeno.includes(entry))
                              igraciIzabraniPrivremeno.push(entry);
                        })
                        " />
                    <q-btn style="width: 40px; margin: 2.5px;" color="red" icon="remove" @click="
                      igraciIzabraniPrivremeno = igraciIzabraniPrivremeno.filter(
                        function (value, index, arr) {
                          return value.primarnaPozicija.category != 'GOLMAN';
                        }
                      )
                      " />

                    <br />
                    <q-btn style="width: 100px; margin: 2.5px" color="primary" :label="$t('trainings.quarterback')"
                      @click="
                        prisutniIgraciNaTreningu.forEach(function (entry) {
                          if (entry.primarnaPozicija.category == 'BEK')
                            if (!igraciIzabraniPrivremeno.includes(entry))
                              igraciIzabraniPrivremeno.push(entry);
                        })
                        " />
                    <q-btn style="width: 40px; margin: 2.5px;" color="red" icon="remove" @click="
                      igraciIzabraniPrivremeno = igraciIzabraniPrivremeno.filter(
                        function (value, index, arr) {
                          return value.primarnaPozicija.category != 'BEK';
                        }
                      )
                      " />
                    <q-btn style="width: 100px; margin: 2.5px" color="primary" :label="$t('trainings.midfielder')"
                      @click="
                        prisutniIgraciNaTreningu.forEach(function (entry) {
                          if (entry.primarnaPozicija.category == 'VEZNI')
                            if (!igraciIzabraniPrivremeno.includes(entry))
                              igraciIzabraniPrivremeno.push(entry);
                        })
                        " />
                    <q-btn style="width: 40px; margin: 2.5px;" color="red" icon="remove" @click="
                      igraciIzabraniPrivremeno = igraciIzabraniPrivremeno.filter(
                        function (value, index, arr) {
                          return value.primarnaPozicija.category != 'VEZNI';
                        }
                      )
                      " />
                    <br />

                    <q-btn style="width: 100px; margin: 2.5px" color="primary" :label="$t('trainings.winger')" @click="
                      prisutniIgraciNaTreningu.forEach(function (entry) {
                        if (entry.primarnaPozicija.category == 'KRILO')
                          if (!igraciIzabraniPrivremeno.includes(entry))
                            igraciIzabraniPrivremeno.push(entry);
                      })
                      " />
                    <q-btn style="width: 40px; margin: 2.5px;" color="red" icon="remove" @click="
                      igraciIzabraniPrivremeno = igraciIzabraniPrivremeno.filter(
                        function (value, index, arr) {
                          return value.primarnaPozicija.category != 'KRILO';
                        }
                      )
                      " />
                    <q-btn style="width: 100px; margin: 2.5px" color="primary" :label="$t('trainings.attacker')" @click="
                      prisutniIgraciNaTreningu.forEach(function (entry) {
                        if (entry.primarnaPozicija.category == 'NAPADAC')
                          if (!igraciIzabraniPrivremeno.includes(entry))
                            igraciIzabraniPrivremeno.push(entry);
                      })
                      " />
                    <q-btn style="width: 40px; margin: 2.5px;" color="red" icon="remove" @click="
                      igraciIzabraniPrivremeno = igraciIzabraniPrivremeno.filter(
                        function (value, index, arr) {
                          return value.primarnaPozicija.category != 'NAPADAC';
                        }
                      )
                      " />
                    <q-btn style="width: 295px; margin: 2.5px; color: black" icon="person"
                      :label="$t('trainings.players')" @click="otvoriDialogZaIzborIgracaZaVezbu()" />
                    <!-- <q-select
                        use-input
                        hide-selected
                        filled
                        v-model="igraciIzabraniPrivremeno"
                        multiple
                        :options="prisutniIgraciNaTreningu"
                        :option-value="(item) => item === null ? null : item.ime + ' ' + item.prezime"
                        :option-label="(item) => item === null ? null : item.primarnaPozicija.category + ' | ' + item.ime + ' ' + item.prezime" :label="$t('trainings.players')"
                        style="width: 300px" @input="dodajIgracaVeznog(pomocniElementZaDialog)" >

                        <template v-slot:option="scope">
                          <q-item
                            v-bind="scope.itemProps"
                            v-on="scope.itemEvents"
                            :style="{backgroundColor: scope.opt.primarnaPozicija.category == 'BEK' ? '#0000ff20' : scope.opt.primarnaPozicija.category == 'GOLMAN' ? '#ff000020' : scope.opt.primarnaPozicija.category == 'BEK' ? '#ffff0020' : '#00ffff20'}"
                          >
                              <q-item-label
                              v-html="scope.opt.primarnaPozicija.category + ' | ' + scope.opt.ime + ' ' + scope.opt.prezime"
                              ></q-item-label>
                          </q-item>
                        </template>
                      </q-select> -->

                    <q-scroll-area style="height: 350px; max-width: 300px;">
                      <q-list bordered separator style="width: 300px">
                        <q-item clickable v-ripple v-for="(e, index) in igraciIzabraniPrivremeno" :key="index" :style="{
                          backgroundColor:
                            e.primarnaPozicija.category == 'BEK'
                              ? '#0000ff20'
                              : e.primarnaPozicija.category == 'GOLMAN'
                                ? '#ff000020'
                                : e.primarnaPozicija.category == 'BEK'
                                  ? '#ffff0020'
                                  : '#00ffff20'
                        }">
                          <q-item-section>{{ e.ime }} {{ e.prezime }}</q-item-section>
                          <q-item-section avatar>
                            <q-icon color="primary" name="delete" @click="obrisiVezanog(pomocniElementZaDialog, e)" />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-scroll-area>
                  </q-card-section>

                  <q-separator vertical />
                  <div class="flex-col" style="width:45%">
                    <q-item style="margin-bottom: 5px">
                      <q-item-section class="custom-field one" style="width: 100%">
                        <q-select borderless class="selektKlass" v-model="izabranBalans" :options="optionBalans"
                          ref="select4" @focus="popniPlaceholder('Span-SL4')" @input="popniPlaceholder('Span-SL4')"
                          @blur="spustiPlaceholder('Span-SL4', izabranBalans)" />
                        <span @click="$refs.select4.showPopup()" id="Span-SL4" class="placeholder placeholder1">{{
                          $t("trainings.exerciseBalance") }}</span>
                      </q-item-section>
                    </q-item>

                    <q-item style="margin-bottom: 5px">
                      <q-item-section class="custom-field one" style="width: 100%">
                        <q-select borderless class="selektKlass" v-model="izabranIET" multiple use-chips
                          :options="dataStavkeTehnike" ref="select5" :style="{
                            height: [
                              (izabranIET.length == 0 ? 1 : izabranIET.length) *
                              40 +
                              'px'
                            ]
                          }" @focus="popniPlaceholder('Span-SL5')" @input="popniPlaceholder('Span-SL5')"
                          @blur="spustiPlaceholder('Span-SL5', izabranIET)" />
                        <span @click="$refs.select5.showPopup()" id="Span-SL5" class="placeholder placeholder1">{{
                          $t("trainings.technicalSelection") }}</span>
                      </q-item-section>
                    </q-item>

                    <q-item style="margin-bottom: 5px">
                      <q-item-section class="custom-field one" style="width: 100%">
                        <q-select borderless class="selektKlass" v-model="izabranET" multiple use-chips
                          :options="dataStavkeTaktike" ref="select6" :style="{
                            height: [
                              (izabranIET.length == 0 ? 1 : izabranIET.length) *
                              40 +
                              'px'
                            ]
                          }" @focus="popniPlaceholder('Span-SL6')" @input="popniPlaceholder('Span-SL6')"
                          @blur="spustiPlaceholder('Span-SL6', izabranET)" />
                        <span @click="$refs.select6.showPopup()" id="Span-SL6" class="placeholder placeholder1">{{
                          $t("trainings.tacticsElement") }}</span>
                      </q-item-section>
                    </q-item>

                    <q-item style="margin-bottom: 5px">
                      <q-item-section class="custom-field one" style="width: 100%">
                        <q-select borderless class="selektKlass" v-model="izabranProstor" :options="optionProstor"
                          ref="select7" @focus="popniPlaceholder('Span-SL7')" @input="popniPlaceholder('Span-SL7')"
                          @blur="spustiPlaceholder('Span-SL7', izabranProstor)" />
                        <span @click="$refs.select7.showPopup()" id="Span-SL7" class="placeholder placeholder1">{{
                          $t("trainings.trainingSpace") }}</span>
                      </q-item-section>
                    </q-item>
                  </div>

                  <q-separator vertical />

                  <q-card-section class="q-pa-md q-ma-md col-3">
                    <!-- <q-select v-model="izabranoFizickoOpterecenje" :options="borgovaSkala" label="Fizicko opterecenje"
                        option-value="value" option-label="label" />
                      <q-select v-model="izabranTeTaNivo" :options="borgovaSkala" label="TeTa Nivo" option-value="value"
                        option-label="label" />
                      <q-select v-model="izabranoMentalnoOpterecenje" :options="borgovaSkala"
                        label="Mentalno optereenje" option-value="value" option-label="label" />
                       -->
                    <!--
                        PRIPREMA ZA MATRICU ZA UNOS, TEST NA MENTALNOM OPTERECENJU
                        HOCES DA STAVIS DA DRUGE BOJE BUDDA AKTIVAN
                      -->
                    <div class="naslovcic">
                      <p>{{ $t("trainings.naslovIzaberi") }}</p>
                    </div>
                    <q-radio name="Mentalno Opterećenje" v-model="izabranaOpcijaOpterecenja" val="M"
                      :label="$t('trainings.mentalLoad')" style="width: 100%;">
                      <span style="font-weight: bold" v-if="izabranoMentalnoOpterecenje != null">
                        ({{ borgovaSkala.filter(e => e.value == izabranoMentalnoOpterecenje)[0].label }})
                      </span></q-radio>
                    <q-radio name="Fizičko Opterećenje" v-model="izabranaOpcijaOpterecenja" val="F"
                      :label="$t('trainings.physicalExercise')" style="width: 100%;">
                      <span style="font-weight: bold" v-if="izabranoFizickoOpterecenje != null">
                        ({{ borgovaSkala.filter(e => e.value == izabranoFizickoOpterecenje)[0].label }})
                      </span></q-radio>
                    <q-radio name="TeTa Nivo" v-model="izabranaOpcijaOpterecenja" val="T"
                      :label="$t('trainings.TeTaLevel')" style="width: 100%;">
                      <span style="font-weight: bold" v-if="izabranTeTaNivo != null">
                        ({{
                          borgovaSkala.filter(e => e.value == izabranTeTaNivo).length > 0 ? borgovaSkala.filter(e =>
                            e.value
                            == izabranTeTaNivo)[0].label : '' }})
                      </span></q-radio>

                    <br />
                    <!-- <q-field standout :label="$t('trainings.descriptionLoad')" stack-label readonly >
                        <template v-slot:control >
                          <div class="self-center full-width no-outline" tabindex="0" >{{labelOpterecenja}}</div>
                        </template>
                      </q-field> -->
                    <q-btn style="background-color: #ddd;width: 50px; height: 50px; margin: 1px;" />
                    <q-btn color="primary" @click="promeniVrednostOpterecenju(entry)"
                      @mouseenter="labelOpterecenja = entry.label" @mouseleave="labelOpterecenja = ''"
                      v-for="entry in borgovaSkala" :key="entry.label" style="width: 50px; height: 50px; margin: 1px;">
                      {{ entry.value }}
                      <q-tooltip>
                        {{ entry.label }}
                      </q-tooltip>
                    </q-btn>

                    <q-rating v-model="ocenaTrenazneVezbe" size="2em" :max="5" color="primary"
                      style="padding-top: 30px;" />
                    <p style="font-size: 8pt; padding-left: 5px;">
                      {{ $t("trainings.evaluation") }}
                    </p>
                  </q-card-section>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                  <q-btn flat :label="$t('administration.user.cancel')" color="primary" v-close-popup />
                  <q-btn flat :label="$t('administration.user.save')"
                    @click="sacuvajVezaneIgrace(pomocniElementZaDialog)" color="primary" :disable="dozvolaZaIzmenu" />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <!-- Dodavanje i sklanjanje vremenskih linija -->
            <q-card-section style="position:fixed; bottom:30px;">
              <q-btn style="margin:5px;" :label="$t('trainings.obrisiTimeline')" @click="obrisiTimeline()"
                class="dugmeNewNesto2"><span style="font-size: 23px; font-weight: 400; padding-left: 5px;">
                  -
                </span></q-btn>
              <q-btn style="margin:5px;" :label="$t('trainings.dodajTimeline')"
                @click="sviTimelinovi.push({ x: 0, y: 0, width: 0, height: 0 })" class="dugmeNewNesto2"><span
                  style="font-size: 23px; font-weight: 400; padding-left: 5px;">
                  +
                </span></q-btn>
            </q-card-section>
          </q-card-section>

          <!-- LISTA Trenaznih vezbi odakle se kopiraju i prebacuju na vremensku liniju -->

          <q-card-section class="col-3" style="background: #f5f8fb; color: #323b62; overflow: auto;">
            <h5 style="margin-left: 9%; margin-top: 0px; margin-bottom: 20px;">
              {{ $t("trainings.trainingExercises") }}
            </h5>

            <!-- Pretraga, filter trenaznih vezbi -->
            <q-input outlined class="dugmeSearch1" dense debounce="300" v-model="pretraga" @input="filtrirajTV">
              <template v-slot:append>
                <q-icon name="search" color="blue-10" />
              </template>
            </q-input>

            <!-- Trenazne vezvbe koje se prebacuju -->
            <q-card v-for="(element, index) in kopijaDataVezbe" :key="element.ident" flat bordered
              :id="'tv' + element.ident" class="my-card trenazne-vezbe"
              style="user-select: none; height:40px; width: 85%; margin: 0 auto;"
              :style="{ top: 0 + index * 10 + 'px' }" @mousedown="onMouseDown(element)">
              <q-card-section style="padding: 10px 0px; height: 40px; background: #e5edf4;">
                <div style="
                    padding: 0 5%;
                    display:
                    inline-block;
                    text-align:left;
                    width:100%;
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;">
                  {{ element.naziv }}
                </div>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card-section>

        <!-- Sekcija za generalno cuvanje i otkazivanje elementa bloka -->
        <q-card-section style="position:fixed; left:60%; bottom:30px;">
          <q-btn round style="margin:5px; color: #3b5d99; background: #f5f8fb;" type="submit" size="20px" v-close-popup>
            <i aria-hidden="true" role="presentation" style="font-weight:900;"
              class="material-icons q-icon notranslate">close</i>
          </q-btn>
          <q-btn round style="margin:5px; color: white; background: #ff4b00;" @click="snimiPromeneElemenatabloka1()"
            type="submit" icon="save" size="20px" :disable="dozvolaZaIzmenu" />
        </q-card-section>

        <!-- Dialog za prozivku -->
        <q-dialog persistent v-model="dialogProzivke">
          <q-card style="width: 1000px; max-width: 90vw;">
            <q-card-section>
              <span class="text-h6">
                {{ $t("trainings.RollCall") }}
                <!-- <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn> -->
              </span>
              <q-btn icon="close" flat round dense style="float: right; width: fit-content;" v-close-popup></q-btn>
            </q-card-section>

            <q-separator inset></q-separator>
            <q-card-section class="q-pt-none">
              <q-form class="q-gutter-md">
                <q-list>
                  <!-- <q-item>
                    <q-item-section>
                        <q-select filled v-model="prisutniIgraciNaTreningu" multiple :options="igraciSelekcije"
                          :option-label="(item) => item === null ? null : item.ime + ' ' + item.prezime"
                          :option-value="(item) => item === null ? null : item.ime + ' ' + item.prezime"
                          :label="$t('trainings.players')"
                          />
                    </q-item-section>
                  </q-item> -->
                  <q-item>
                    <q-item-section style="flex-direction: row; max-height: 70vh; overflow: auto;">
                      <div v-for="(igrac, index) in igraciSelekcije" :key="index" style="
                          width: 23%;
                          background-color:#e5edf4;
                          margin: 5px;
                          padding: 7px 5px;
                          border-radius: 5px;
                          cursor: pointer;
                        " :style="{
                          backgroundColor: [
                            prisutniIgraciNaTreningu.indexOf(igrac) != -1
                              ? '#e5edf4'
                              : '#f5f8fb'
                          ]
                        }" @click="
                          prisutniIgraciNaTreningu.indexOf(igrac) == -1
                            ? prisutniIgraciNaTreningu.push(igrac)
                            : prisutniIgraciNaTreningu.splice(
                              prisutniIgraciNaTreningu.indexOf(igrac),
                              1
                            )
                          ">
                        <q-checkbox v-model="prisutniIgraciNaTreningu" :val="igrac" />
                        <span>
                          {{ igrac.ime + " " + igrac.prezime }}
                        </span>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-form>
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn :label="$t('administration.user.cancel')" @click="close" type="submit" color="primary"
                v-close-popup />
              <q-btn :label="$t('administration.user.save')" @click="azurirajProzvane()" type="submit" color="primary"
                :disable="dozvolaZaIzmenu" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- dialog za izbor igraca za vezbu-->
        <q-dialog persistent v-model="dialogZaIzborIgracaZaVezbu">
          <q-card style="width: 1000px; max-width: 90vw;">
            <q-card-section>
              <span class="text-h6">
                {{ $t("trainings.players") }}
                <!-- <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn> -->
              </span>
              <q-btn icon="close" flat round dense style="float: right; width: fit-content;" v-close-popup></q-btn>
            </q-card-section>

            <q-separator inset></q-separator>
            <q-card-section class="q-pt-none">
              <q-form class="q-gutter-md">
                <q-list>
                  <!-- <q-item>
                    <q-item-section>
                        <q-select filled v-model="prisutniIgraciNaTreningu" multiple :options="igraciSelekcije"
                          :option-label="(item) => item === null ? null : item.ime + ' ' + item.prezime"
                          :option-value="(item) => item === null ? null : item.ime + ' ' + item.prezime"
                          :label="$t('trainings.players')"
                          />
                    </q-item-section>
                  </q-item> -->
                  <q-item>
                    <q-item-section style="flex-direction: row; max-height: 70vh; overflow: auto;">
                      <div v-for="(igrac, index) in prisutniIgraciNaTreningu" :key="index" style="
                          width: 23%;
                          background-color:#e5edf4;
                          margin: 5px;
                          padding: 7px 5px;
                          border-radius: 5px;
                          cursor: pointer;
                        " :style="{
                          backgroundColor: [
                            igraciIzabraniPrivremeno.indexOf(igrac) != -1
                              ? '#e5edf4'
                              : '#f5f8fb'
                          ]
                        }" @click="
                          igraciIzabraniPrivremeno.indexOf(igrac) == -1
                            ? igraciIzabraniPrivremeno.push(igrac)
                            : igraciIzabraniPrivremeno.splice(
                              igraciIzabraniPrivremeno.indexOf(igrac),
                              1
                            );
                        dodajIgracaVeznog(pomocniElementZaDialog);
                        ">
                        <q-checkbox v-model="igraciIzabraniPrivremeno" :val="igrac" />
                        <span>
                          {{ igrac.ime + " " + igrac.prezime }}
                        </span>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-form>
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn :label="$t('administration.user.close')" @click="close" type="submit" color="primary"
                v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card>
    </q-dialog>

    <q-dialog v-model="potvrdiPromenu" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red" text-color="white" />
          <span class="q-ml-sm">{{ $t("trainings.unsavedItems") }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('administration.user.cancel')" color="primary" v-close-popup @click="
            produziUtakmicuTest = false;
          skratiUtakmicuTest = false;
          povecajDialogTest = false;
          smanjiDialogTest = false;
          snimiPromeneTest = false;
          " />
          <q-btn v-if="produziUtakmicuTest" flat :label="$t('trainings.continue')" color="primary" v-close-popup
            @click="produziUtakmicu()" :disable="dozvolaZaIzmenu" />
          <q-btn v-if="skratiUtakmicuTest" flat :label="$t('trainings.continue')" color="primary" v-close-popup
            @click="skratiUtakmicu()" :disable="dozvolaZaIzmenu" />
          <q-btn v-if="povecajDialogTest" flat :label="$t('trainings.continue')" color="primary" v-close-popup
            @click="povecaj(a)" :disable="dozvolaZaIzmenu" />
          <q-btn v-if="smanjiDialogTest" flat :label="$t('trainings.continue')" color="primary" v-close-popup
            @click="smanji(a)" :disable="dozvolaZaIzmenu" />
          <q-btn v-if="snimiPromeneTest" flat :label="$t('trainings.continue')" color="primary" v-close-popup
            @click="snimiPromeneElemenatabloka()" :disable="dozvolaZaIzmenu" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- KRAJ DRUGOG POKUSAJA ZA DIALOG ZA TRENING -->

    <!--










        MISLIM DA JESVUDA PO MALO PROBLEM SA REDOSLEDOM POZIVA - POLUODRADJENO (uglavnom radi, mozda  ima jos koja greska [.getBoundingRect])

        da se proveri desna strelica na razlicitim velicinama ekrana  - ODRADJENO - (bilo je ofsetovano za poziciju q-card sto je razlicito za ralzicite ekrane)

        da se proveri (cuvanje i?) citanje opet - ODRADJENO (radi kako valja sa tajmerima)

        //  POSLATO, CEKAMO ODGOVOR
        da se popravi DELETE za celu utakmicu - ODRADJENO
        da se vidi zsto nema vezanih igraca


        Sirina se ne cuva kada se prvi put napravi element  - ODRADJENO (sad radi zbog ovog dole sto radi)
        Izbacuje gresku kad pokusava da sacuva sve elemente na zatvaranje toka treninga sa sacuvaj za tek napravljene treninge  - ODRADJENO (ponovo se ucitavaju svi iz baze pre cuvanja)
        Da se napravi da nema skrol levo-desno  - ODRADJENO (css -> overflow-x: hidden)

        Da se bira koliko traje utakmica a ne da bude fiksno kao sad (magicni broj 120 minuta)  - ODRADJENO
        Da se napravi kako se unosi ocena - ODRADJENO

        promeniti default vrednosti za slanje i ostalo..  - ODRADJENO (ja mislim)
        Da se prijavljuju greske  - ODRADJENO
        Kolizija da se popravi  - SKORO SVE ODRADJENO (moglo b i se dodati 1px razmakaizmedju ovih u koliziji)

        NIJE JEDAN PX DOVOLJNO,POSTO KAD UHVATIS IVICU MIS ODMAH RASIRI ELEMENT JERBI TREBALO DA JE VUCE NEGDE DRUD
        NIJE BITNOKAPIRAS, KAD PROBAS JASNO JE, TO TREBA DA POPRAVIS TU POZICIJU ELEMENTA U DNOSU NA POZICIJU MUSA




        (umesto, za sada pored) kante +-15 minuta treninga

        pobrisati ili iskomentarisati sve console.log()-ove


 -->
  </q-page>
</template>

<script>
import { exportFile, date } from "quasar";
import { quillEditor } from "vue-quill-editor";

// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

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
  props: ["selektovaniIgrac"],
  data() {
    return {
      readonly: false,
      identIzabranogTreninga: null,
      loadingTreninzi: false, //indikator punjnja tabele treninga za selekotovani ID ekip
      listaTimova: [], //lista svih timova
      selektovaniTim: null, //objekat za selektovani tim
      igraciSelekcije: [],
      igraciSelekcijeKopija: [],
      ocenaTrenazneVezbe: 0,
      naslovTrenaze: "",
      brojTimelinova: 3, //inicijalni broj paralelnih sesija na nreningu
      sviTimelinovi: [
        {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        },
        {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        },
        {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      ],
      sviKlonovi: [],
      mouseDown: false,
      mouseIsDown: false,
      mouseIsLeft: false,
      mouseIsRight: false,
      filter: "",
      customer: {},
      new_customer: false,
      dataPreview: false,
      listOptions: [],
      listaTipovaTreninga: [
        {
          label: this.$t("trainings.fudbalskiKolektivni"),
          value: "FUDBALSKI_KOLEKTIVNI"
        },
        {
          label: this.$t("trainings.dodatniIndividualni"),
          value: "DODATNI_INDIVIDUALNI"
        },
        {
          label: this.$t("trainings.treningFizickePripreme"),
          value: "TRENING_FIZICKE_PRIPREME"
        }
      ],
      listaUslova: [
        {
          label: this.$t("trainings.uZatvorenomProstoru"),
          value: "U_ZATVORENOM_PROSTORU"
        },
        {
          label: this.$t("trainings.suvo"),
          value: "SUVO"
        },
        {
          label: this.$t("trainings.kisa"),
          value: "KISA"
        },
        {
          label: this.$t("trainings.sneg"),
          value: "SNEG"
        }
      ],
      listaPodloga: [
        {
          label: this.$t("trainings.trava"),
          value: "TRAVA"
        },
        {
          label: this.$t("trainings.vestackaTrava"),
          value: "VESTACKA_TRAVA"
        },
        {
          label: this.$t("trainings.parket"),
          value: "PARKET"
        }
      ],
      editedIndex: -1,
      editedItem: {
        ident: 0,
        datum: "",
        identStrucniStab: 0,
        lokacija: "",
        opisnaOcenaTreninga: "",
        opisniCiljTreningaUPripremi: "",
        podloga: "TRAVA",
        temperatura: 0,
        tipTreninga: "",
        uslovi: "",
        vremePocetka: "",
        vremeTrajanja: ""
      },
      defaultItem: {
        ident: 0,
        datum: "",
        identStrucniStab: 0,
        lokacija: "",
        opisnaOcenaTreninga: "",
        opisniCiljTreningaUPripremi: "",
        podloga: "TRAVA",
        temperatura: 0,
        tipTreninga: "",
        uslovi: "",
        vremePocetka: ""
      },
      mode: "list",
      columns: [
        {
          name: "vremePocetka",
          required: true,
          label: this.$t("trainings.date"),
          align: "left",
          field: "vremePocetka",
          sortable: true,
          sort: (a, b, rowA, rowB) => Date.parse(a) - Date.parse(b),
          sortOrder: "da",
          format: val => date.formatDate(val, "DD/MM/YYYY - HH:mm")
        },
        {
          name: "lokacija",
          align: "left",
          label: this.$t("trainings.location"),
          field: "lokacija",
          sortable: true
        },
        {
          name: "podloga",
          align: "left",
          label: this.$t("trainings.base"),
          field: "podloga",
          sortable: true
        },
        {
          name: "tipTreninga",
          align: "left",
          label: this.$t("trainings.trainingType"),
          field: "tipTreninga",
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
      data: [],
      dataVezbe: [],
      kopijaDataVezbe: [],
      pretraga: "",
      dataStavkeTaktike: [],
      dataStavkeTehnike: [],

      pagination: {
        sortBy: "vremePocetka",
        descending: true,
        rowsPerPage: 10
      },
      dialogZaTokTreninga: false,
      dialogZaGrupu: false,
      igraciPrivremeno1: [
        {
          izabran: false,
          ime: "a"
        },
        {
          izabran: false,
          ime: "b"
        },
        {
          izabran: false,
          ime: "c"
        },
        {
          izabran: false,
          ime: "d"
        },
        {
          izabran: false,
          ime: "e"
        },
        {
          izabran: false,
          ime: "f"
        },
        {
          izabran: false,
          ime: "g"
        },
        {
          izabran: false,
          ime: "h"
        },
        {
          izabran: false,
          ime: "i"
        },
        {
          izabran: false,
          ime: "j"
        },
        {
          izabran: false,
          ime: "k"
        },
        {
          izabran: false,
          ime: "l"
        },
        {
          izabran: false,
          ime: "m"
        },
        {
          izabran: false,
          ime: "n"
        },
        {
          izabran: false,
          ime: "o"
        },
        {
          izabran: false,
          ime: "p"
        },
        {
          izabran: false,
          ime: "q"
        },
        {
          izabran: false,
          ime: "r"
        },
        {
          izabran: false,
          ime: "s"
        },
        {
          izabran: false,
          ime: "t"
        },
        {
          izabran: false,
          ime: "u"
        },
        {
          izabran: false,
          ime: "v"
        },
        {
          izabran: false,
          ime: "w"
        },
        {
          izabran: false,
          ime: "x"
        },
        {
          izabran: false,
          ime: "y"
        },
        {
          izabran: false,
          ime: "z"
        }
      ],
      igraciPrivremeno: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z"
      ],
      igraciIzabraniPrivremeno: [],
      grupe: [],
      mousePositionX: undefined,
      mousePositionY: undefined,
      izabraniElement: undefined,
      pozicijaElementaX: undefined,
      pozicijaElementaX1: undefined,
      pozicijaElementaY: undefined,
      pozicijaPocetkaVremena: undefined,
      pozicijaKrajaVremena: undefined,
      pozicijaKrajElementaX: undefined,
      pozicijaKrajElementaX1: undefined,
      dialogZaPostavkeTrenazneVezbe: false,
      duzinaJednogMinuta: 0,
      vremePocetkaElementa: undefined,
      vremeKrajaElementa: undefined,
      duzinaTrajanjaElementa: undefined,
      originalnaSirinaElementa: 0,
      trenutniSatL: "",
      trenutniSatD: "",
      optionBalans: [
        this.$t("trainings.deficit"),
        this.$t("trainings.suficit"),
        this.$t("trainings.izjednaceno")
      ],
      izabranBalans: null,
      optionIET: [],
      izabranIET: [],
      optionET: [],
      izabranET: [],
      optionProstor: [
        this.$t("trainings.skraceniProstor"),
        this.$t("trainings.cetvrtinaTerena"),
        this.$t("trainings.polovinaTerena"),
        this.$t("trainings.ceoTeren")
      ],
      izabranProstor: "",
      borgovaSkala: [
        {
          value: 0,
          label: this.$t("trainings.borgovaSkala.0")
        },
        {
          value: 0.3,
          label: this.$t("trainings.borgovaSkala.03")
        },
        {
          value: 0.5,
          label: this.$t("trainings.borgovaSkala.05")
        },
        {
          value: 0.7,
          label: this.$t("trainings.borgovaSkala.07")
        },
        {
          value: 1,
          label: this.$t("trainings.borgovaSkala.1")
        },
        {
          value: 1.5,
          label: this.$t("trainings.borgovaSkala.15")
        },
        {
          value: 2,
          label: this.$t("trainings.borgovaSkala.2")
        },
        {
          value: 2.5,
          label: this.$t("trainings.borgovaSkala.25")
        },
        {
          value: 3,
          label: this.$t("trainings.borgovaSkala.3")
        },
        {
          value: 4,
          label: this.$t("trainings.borgovaSkala.4")
        },
        {
          value: 5,
          label: this.$t("trainings.borgovaSkala.5")
        },
        {
          value: 6,
          label: this.$t("trainings.borgovaSkala.6")
        },
        {
          value: 7,
          label: this.$t("trainings.borgovaSkala.7")
        },
        {
          value: 8,
          label: this.$t("trainings.borgovaSkala.8")
        },
        {
          value: 9,
          label: this.$t("trainings.borgovaSkala.9")
        },
        {
          value: 10,
          label: this.$t("trainings.borgovaSkala.10")
        },
        {
          value: 11,
          label: this.$t("trainings.borgovaSkala.11")
        },
        {
          value: 12,
          label: this.$t("trainings.borgovaSkala.12")
        },
        {
          value: 13,
          label: this.$t("trainings.borgovaSkala.13")
        }
      ],
      izabranoFizickoOpterecenje: null,
      izabranoMentalnoOpterecenje: null,
      izabranTeTaNivo: null,
      vremePocetkaTreninga: null,
      vremePocetkaTreningaUMinutima: null,
      podaciZaPrikaz: null,
      pomocniElementZaDialog: { opis: "" },
      trajanjeIzabranogTreninga: 120,
      kraceTrajanjeIzabranogTreninga: 24,
      sirinaTajmlajna: 0,
      izabraniTrening: { lokacija: "", tipTreninga: "", datum: "" },
      maximizedToggle: false,
      allColors: [
        "#ffcdd2",
        "#f8bbd0",
        "#e1bee7",
        "#d1c4e9",
        "#c5cae9",
        "#bbdefb",
        "#b3e5fc",
        "#b2ebf2",
        "#b2dfdb",
        "#c8e6c9",
        "#dcedc8",
        "#f0f4c3",
        "#fff59d",
        "#ffecb3",
        "#ffe0b2",
        "#ffccbc",
        "#d7ccc8",
        "#f5f5f5",
        "#cfd8dc"
      ],
      prisutniIgraciNaTreningu: [],
      dialogProzivke: false,
      dialogZaIzborIgracaZaVezbu: false,
      izabranaOpcijaOpterecenja: null,
      potvrdiPromenu: false,
      produziUtakmicuTest: false,
      skratiUtakmicuTest: false,
      povecajDialogTest: false,
      smanjiDialogTest: false,
      snimiPromeneTest: false,
      brojMinutaNakonZabraneIzmene: 30,
      dozvolaZaIzmenu: false,
      izabranFilter: [],
      opcijeZaFiltriranjeIgraca: [
        {
          label: "Rock",
          value: "rock"
        },
        {
          label: "Funk",
          value: "funk"
        },
        {
          label: "Pop",
          value: "pop"
        }
      ],
      zabraniKlik: false,
      daLiCuvamoSamoJedanBlok: false,
      procitajOpis: false,
      labelOpterecenja: ""
    };
  },
  watch: {
    selektovaniIgrac: function (val) {
      this.selektovaniTim = val.selektovaniTim;
      this.promenaTima();
      console.log(this.selektovaniTim);
    }
  },
  mounted() {
    console.log("this.selektovaniIgrac");
    console.log(this.selektovaniIgrac);
    if (
      this.selektovaniIgrac != undefined &&
      this.selektovaniIgrac.selektovaniTim != undefined
    ) {
      this.selektovaniTim = this.selektovaniIgrac.selektovaniTim;
      this.promenaTima();
    }
    this.getDataSelekcije(); //selekcije
    //this.getDataZaID() //idemo da uzmenmo podatke iz baze
    this.getDataTaktika();
    this.getDataTehnika();
    this.a = window.$igracName;

    // change table height
    var temp = document.querySelectorAll(".q-table__middle");
    for (var i = 0; i < temp.length; i++)
      temp[i].style.setProperty("max-height", "calc(100vh - 200px)");
  },
  filters: {
    pxToTime: function (value) {
      if (value == undefined) return "";

      var minuteInPx = this.sirinaTajmlajna / this.trajanjeIzabranogTreninga;
      var minutes = value / minuteInPx;

      var sati = Math.floor(minutes / 60);
      var minuti = Math.round(minutes % 60);
      var vreme;

      if (minuti < 10) vreme = sati + "h 0" + minuti + "m";
      else vreme = sati + "h " + minuti + "m";

      return vreme;
    },
    minutesToTimeOfDay: function (value) {
      var hours = Math.floor(value / 60);
      var minutes = Math.round(value % 60);

      return hours + "h " + minutes + "m";
    }
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
    otvoriDialogZaProzivku() {
      console.log("AAA");
      console.log(this.prisutniIgraciNaTreningu);
      this.dialogProzivke = true;
      if (this.prisutniIgraciNaTreningu.length == 0)
        this.prisutniIgraciNaTreningu = this.igraciSelekcije;
    },
    compare(a, b) {
      return a == date.formatDate(b, "DD-MM-YYYY");
    },
    valiDate(date) {
      let dateformat = /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])/;

      date = date.split(" ")[0];
      // Matching the date through regular expression
      if (date.match(dateformat)) {
        let operator = date.split("/");

        // Extract the string into month, date and year
        let datepart = [];
        if (operator.length > 1) {
          datepart = date.split("/");
        }
        let day = parseInt(datepart[0]);
        let month = parseInt(datepart[1]);
        let year = parseInt(datepart[2]);

        // Create a list of days of a month
        let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month == 1 || (month > 2 && month < 13)) {
          if (day > ListofDays[month - 1]) {
            //to check if the date is out of range
            console.log("Invalid date");
            return false;
          }
        } else if (month == 2) {
          let leapYear = false;
          if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
          if (leapYear == false && day >= 29) {
            console.log("Invalid date");
            return false;
          } else if (leapYear == true && day > 29) {
            console.log("Invalid date format!");
            return false;
          }
        } else {
          console.log("Invalid date format!");
          return false;
        }
      } else {
        console.log("Invalid date format!");
        return false;
      }
      return true;
    },
    otvoriDialogZaIzborIgracaZaVezbu() {
      if (this.prisutniIgraciNaTreningu.length == 0)
        this.prisutniIgraciNaTreningu = this.igraciSelekcije;

      this.dialogZaIzborIgracaZaVezbu = true;
    },
    otvoriPreviewDialog(item) {
      debugger;
      console.log(item);
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);

      this.editedItem.vremePocetka = date.formatDate(
        this.editedItem.vremePocetka,
        "DD/MM/YYYY - HH:mm"
      );

      this.readonly = true;
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    /*





      TODO:
        1.  Izgleda da y osa za entry se veze za y osu misa umesto pravu poziciju, proveriti to           ***ODRADJENO***
        2.  Treba nekako da se proveravaju kolizije u dubinu, ne samo ako ja guram nekog, nego ako        ***ODRADJENO*** - odustao od dubine, e guraju se vec se zaustavljaju
            ja guram nekog i zbog mene taj neko gura nekog drugog onda i taj treba da se pomera
        3.  Treba da se naprave posebne funkcije za klonove, jer klonovi ne treba da prave klonove vec    ***ODRADJENO***
            da se izaberu i da se pomeraju i kolizija
        4.  Kao i da im se napravi da moze da se menja velicina, isto obrati paznju na koliziju           ***ODRADJENO***   -   Treba da se popravi kolizija za svaki sa svakim. Da se uporedjuju sredine?
        5.  Da mogu da se dodaju i brisu timeline-ovi                                                     ***ODRADJENO***
        6.  Da mogu da se brisu elementi                                                                  ***ODRADJENO***

        7.  Da se promeni UI da ima sve potrebne infomracije
        8.  Da se napravi da se sve napravljeno salje na server
        9.  Kao i da kad se otvori da se ucita sa servera ukoliko je vec sacuvano
        10. Nesto sa zvezdicama se posebno cuva?





      */
    promeniVrednostOpterecenju(e) {
      switch (this.izabranaOpcijaOpterecenja) {
        case "M":
          this.izabranoMentalnoOpterecenje = e.value;
          break;
        case "F":
          this.izabranoFizickoOpterecenje = e.value;
          break;
        case "T":
          this.izabranTeTaNivo = e.value;
          break;
        default:
          return;
      }
    },
    filtrirajTV() {
      let self = this;

      self.kopijaDataVezbe = [];
      self.dataVezbe.forEach(function (entry) {
        if (self.pretraga.includes("*")) {
          var missCounter = 0
          self.pretraga.split("*").forEach(entry2 => {
            if (
              !entry.naziv.toLowerCase().includes(entry2.toLowerCase())
            )
              missCounter += 1

          })

          if (missCounter == 0)
            self.kopijaDataVezbe.push(entry);
        } else if (
          entry.naziv.toLowerCase().includes(self.pretraga.toLowerCase())
        )
          self.kopijaDataVezbe.push(entry);
      });
    },
    azurirajProzvane() {
      this.editedItem.datum = this.izabraniTrening.datum;
      this.editedItem.lokacija = this.izabraniTrening.lokacija;
      this.editedItem.opisnaOcenaTreninga = this.izabraniTrening.opisnaOcenaTreninga;
      this.editedItem.opisniCiljTreningaUPripremi = this.izabraniTrening.opisniCiljTreningaUPripremi;
      this.editedItem.podloga = this.izabraniTrening.podloga;
      this.editedItem.temperatura = this.izabraniTrening.temperatura;
      this.editedItem.tipTreninga = this.izabraniTrening.tipTreninga;
      this.editedItem.uslovi = this.izabraniTrening.uslovi;
      this.editedItem.vremePocetka = this.izabraniTrening.vremePocetka;
      this.editedItem.vremeTrajanja = this.izabraniTrening.vremeTrajanjaTreninga;
      this.editedItem.vremeTrajanjaTreninga = this.izabraniTrening.vremeTrajanjaTreninga;
      this.editedItem.ident = this.izabraniTrening.ident;
      this.putData();
      this.dialogProzivke = false;
    },
    produziUtakmicu1() {
      var tmp = 0;
      this.sviKlonovi.forEach(function (entry) {
        if (entry.ident == null) tmp++;
      });
      if (tmp > 0) {
        this.potvrdiPromenu = true;
        this.produziUtakmicuTest = true;
      } else {
        this.produziUtakmicu();
      }
    },
    produziUtakmicu() {
      debugger;
      this.potvrdiPromenu = false;
      this.produziUtakmicuTest = false;
      this.editedItem.datum = this.izabraniTrening.datum;
      this.editedItem.lokacija = this.izabraniTrening.lokacija;
      this.editedItem.opisnaOcenaTreninga = this.izabraniTrening.opisnaOcenaTreninga;
      this.editedItem.opisniCiljTreningaUPripremi = this.izabraniTrening.opisniCiljTreningaUPripremi;
      this.editedItem.podloga = this.izabraniTrening.podloga;
      this.editedItem.temperatura = this.izabraniTrening.temperatura;
      this.editedItem.tipTreninga = this.izabraniTrening.tipTreninga;
      this.editedItem.uslovi = this.izabraniTrening.uslovi;
      this.editedItem.vremePocetka = this.izabraniTrening.vremePocetka;
      this.editedItem.vremeTrajanja =
        this.izabraniTrening.vremeTrajanjaTreninga + 15;
      this.editedItem.vremeTrajanjaTreninga =
        this.izabraniTrening.vremeTrajanjaTreninga + 15;
      this.izabraniTrening.vremeTrajanjaTreninga =
        this.izabraniTrening.vremeTrajanjaTreninga + 15;
      this.editedItem.ident = this.izabraniTrening.ident;
      this.putData();

      this.trajanjeIzabranogTreninga = this.trajanjeIzabranogTreninga + 15;
      this.kraceTrajanjeIzabranogTreninga = Math.round(
        this.trajanjeIzabranogTreninga / 5
      );
      this.getBlokTreninga(this.identIzabranogTreninga);
    },
    skratiUtakmicu1() {
      var tmp = 0;
      this.sviKlonovi.forEach(function (entry) {
        if (entry.ident == null) tmp++;
      });
      if (tmp > 0) {
        this.potvrdiPromenu = true;
        this.skratiUtakmicuTest = true;
      } else {
        this.skratiUtakmicu();
      }
    },
    skratiUtakmicu() {
      this.potvrdiPromenu = false;
      this.skratiUtakmicuTest = false;
      var krajPoslednjeVezbe = 15;
      let self = this;
      var pomocna = 0;
      this.sviKlonovi.forEach(function (entry) {
        pomocna = self.pxToTimeMinutes(
          document.getElementById("klonovi" + entry.id).getBoundingClientRect()
            .left +
          document
            .getElementById("klonovi" + entry.id)
            .getBoundingClientRect().width -
          document.getElementById("timelineBroj" + 1).getBoundingClientRect()
            .left
        );

        if (krajPoslednjeVezbe < pomocna) krajPoslednjeVezbe = pomocna;
      });

      krajPoslednjeVezbe =
        krajPoslednjeVezbe + (15 - (krajPoslednjeVezbe % 15));

      if (this.izabraniTrening.vremeTrajanjaTreninga <= krajPoslednjeVezbe) {
        this.$q.notify({
          message: this.$t("trainings.shorteningTraining"),
          color: "negative",
          icon: "warning"
        });
        return;
      }
      debugger;
      this.editedItem.datum = this.izabraniTrening.datum;
      this.editedItem.lokacija = this.izabraniTrening.lokacija;
      this.editedItem.opisnaOcenaTreninga = this.izabraniTrening.opisnaOcenaTreninga;
      this.editedItem.opisniCiljTreningaUPripremi = this.izabraniTrening.opisniCiljTreningaUPripremi;
      this.editedItem.podloga = this.izabraniTrening.podloga;
      this.editedItem.temperatura = this.izabraniTrening.temperatura;
      this.editedItem.tipTreninga = this.izabraniTrening.tipTreninga;
      this.editedItem.uslovi = this.izabraniTrening.uslovi;
      this.editedItem.vremePocetka = this.izabraniTrening.vremePocetka;
      this.editedItem.vremeTrajanja =
        this.izabraniTrening.vremeTrajanjaTreninga - 15;
      this.editedItem.vremeTrajanjaTreninga =
        this.izabraniTrening.vremeTrajanjaTreninga - 15;
      this.izabraniTrening.vremeTrajanjaTreninga =
        this.izabraniTrening.vremeTrajanjaTreninga - 15;
      this.editedItem.ident = this.izabraniTrening.ident;
      this.putData();

      this.trajanjeIzabranogTreninga = this.trajanjeIzabranogTreninga - 15;
      this.kraceTrajanjeIzabranogTreninga = Math.round(
        this.trajanjeIzabranogTreninga / 5
      );
      this.getBlokTreninga(this.identIzabranogTreninga);
    },
    povecaj1(a) {
      var tmp = 0;
      this.sviKlonovi.forEach(function (entry) {
        if (entry.ident == null) tmp++;
      });
      if (tmp > 0) {
        this.potvrdiPromenu = true;
        this.povecajDialogTest = true;
      } else {
        this.povecaj(a);
      }
    },
    povecaj(a) {
      this.potvrdiPromenu = false;
      this.povecajDialogTest = false;
      this.maximizedToggle = false;
      if (this.$q.fullscreen.isActive) this.$q.fullscreen.toggle(a);
    },
    smanji1(a) {
      var tmp = 0;
      this.sviKlonovi.forEach(function (entry) {
        if (entry.ident == null) tmp++;
      });
      if (tmp > 0) {
        this.potvrdiPromenu = true;
        this.smanjiDialogTest = true;
      } else {
        this.smanji(a);
      }
    },
    smanji(a) {
      this.potvrdiPromenu = false;
      this.smanjiDialogTest = false;
      this.maximizedToggle = true;
      if (!this.$q.fullscreen.isActive) this.$q.fullscreen.toggle(a);
    },
    snimiPromeneElemenatabloka1(a) {
      let self = this;
      var pomocna = false;
      this.sviKlonovi.forEach(function (prvi) {
        self.sviKlonovi.forEach(function (drugi) {
          if (prvi.timeline != drugi.timeline) {
            if (
              (prvi.x > drugi.x && prvi.x < drugi.x + drugi.width) ||
              (prvi.x + prvi.width > drugi.x &&
                prvi.x + prvi.width < drugi.x + drugi.width) ||
              (prvi.x <= drugi.x &&
                prvi.x + prvi.width >= drugi.x + drugi.width) ||
              (prvi.x >= drugi.x &&
                prvi.x + prvi.width <= drugi.x + drugi.width)
            ) {
              console.log(prvi);
              if (
                prvi.vezaniIgraci != undefined &&
                drugi.vezaniIgraci != undefined
              )
                prvi.vezaniIgraci.forEach(function (entry) {
                  if (drugi.vezaniIgraci.includes(entry)) {
                    var igrac;
                    self.igraciSelekcije.forEach(function (entry1) {
                      if (entry1.id == entry) igrac = entry1;
                    });

                    console.log("Test");
                    self.$q.notify({
                      message:
                        self.$t("trainings.player") +
                        igrac.ime +
                        " " +
                        igrac.prezime +
                        self.$t("trainings.twoExercises") +
                        " <br><br>(1) " +
                        prvi.naziv +
                        ", <br>(2) " +
                        drugi.naziv,
                      color: "negative",
                      icon: "warning",
                      multiLine: true,
                      timeout: 10000,
                      html: true,
                      actions: [
                        {
                          label: "Dismiss",
                          color: "white",
                          handler: () => {
                            /* ... */
                          }
                        }
                      ]
                    });
                    pomocna = true;
                    return;
                  }
                });
            }
          }
        });
      });
      debugger;

      if (pomocna) return;
      var tmp = 0;
      this.sviKlonovi.forEach(function (entry) {
        if (entry.ident == null) tmp++;
      });
      if (tmp > 0) {
        this.potvrdiPromenu = true;
        this.snimiPromeneTest = true;
      } else {
        this.snimiPromeneElemenatabloka(a);
      }
    },
    snimiPromeneElemenatabloka() {
      this.dialogZaTokTreninga = false;
      this.potvrdiPromenu = false;
      this.snimiPromeneTest = false;
      let self = this;
      this.getBlokTreninga(this.identIzabranogTreninga);
      debugger;
      setTimeout(function () {
        self.sviKlonovi.forEach(function (entry, index) {
          var pocetak = new Date(
            self.vremePocetkaTreninga +
            self.pxToTimeMinutes(entry.x - self.sviTimelinovi[1].x) * 60000
          );

          if (entry.ident != null) {
            self.azurirajBlokTreninga(
              entry.balans,
              entry.stavkaTaktike,
              entry.stavkaTehnike,
              entry.fizicko,
              entry.identTrenazneVezbe,
              self.identIzabranogTreninga,
              entry.vezaniIgraci,
              entry.mentalno,
              entry.ocena,
              entry.opis,
              pocetak.toISOString(),
              entry.prostor,
              entry.teta,
              entry.timeline,
              self.pxToTimeMinutes(entry.width),
              [7, 8],
              entry.prostor,
              entry.ident
            );
            console.log("POSLAT " + index);
          }
        });
        this.identIzabranogTreninga = null;
      }, 4000);
    },
    minutesToTimeOfDayFunction(value) {
      var hours = Math.floor(value / 60);
      var minutes = Math.round(value % 60);

      if (minutes < 10) return hours + "h 0" + minutes + "m";
      return hours + "h " + minutes + "m";
    },
    pxToTimeFunction(value) {
      if (value == undefined) return "";

      var minuteInPx = this.sirinaTajmlajna / this.trajanjeIzabranogTreninga;
      var minutes = value / minuteInPx;

      var sati = Math.floor(minutes / 60);
      var minuti = Math.round(minutes % 60);
      var vreme;

      if (minuti < 10) vreme = sati + "h 0" + minuti + "m";
      else vreme = sati + "h " + minuti + "m";

      return vreme;
    },
    pxToTimeMinutes(value) {
      if (value == undefined) return 0;

      var minuteInPx = this.sirinaTajmlajna / this.trajanjeIzabranogTreninga;
      var minutes = value / minuteInPx;
      return Math.round(minutes);
    },
    timeOfDayToPx(value) {
      debugger;
      var minuteInPx = this.sirinaTajmlajna / this.trajanjeIzabranogTreninga;

      var vremeUMinutima =
        (Date.parse(value) - this.vremePocetkaTreninga) / 60000;
      var px = vremeUMinutima * minuteInPx;
      return Math.floor(px);

      //  Date.parse(item.vremePocetka); // Broj milisekundi od pocetka racunanja
    },
    timeToPx(value) {
      var minuteInPx = this.sirinaTajmlajna / this.trajanjeIzabranogTreninga;
      var px = value * minuteInPx;
      return Math.floor(px);

      //  Date.parse(item.vremePocetka); // Broj milisekundi od pocetka racunanja
    },
    dodajIgracaVeznog(element) {
      debugger;
      let self = this;
      this.sviKlonovi.forEach(function (entry, index) {
        if (entry.id == element.id) {
          entry.vezaniIgraci = [];
          self.igraciIzabraniPrivremeno.forEach(function (entry1, index) {
            entry.vezaniIgraci.push(entry1.id);
          });
        }
      });
    },
    sacuvajVezaneIgrace(element) {
      let self = this;
      var pomocna = false;
      self.sviKlonovi.forEach(function (drugi) {
        if (element.timeline != drugi.timeline) {
          if (
            (element.x >= drugi.x && element.x < drugi.x + drugi.width) ||
            (element.x + element.width > drugi.x &&
              element.x + element.width < drugi.x + drugi.width) ||
            (element.x <= drugi.x &&
              element.x + element.width >= drugi.x + drugi.width) ||
            (element.x >= drugi.x &&
              element.x + element.width <= drugi.x + drugi.width)
          ) {
            console.log(element);
            if (
              element.vezaniIgraci != undefined &&
              drugi.vezaniIgraci != undefined
            )
              element.vezaniIgraci.forEach(function (entry) {
                if (drugi.vezaniIgraci.includes(entry)) {
                  var igrac;
                  self.igraciSelekcije.forEach(function (entry1) {
                    if (entry1.id == entry) igrac = entry1;
                  });
                  self.$q.notify({
                    message:
                      self.$t("trainings.player") +
                      igrac.ime +
                      " " +
                      igrac.prezime +
                      self.$t("trainings.twoExercises") +
                      " <br><br>(1) " +
                      element.naziv +
                      ", <br>(2) " +
                      drugi.naziv,
                    color: "negative",
                    icon: "warning",
                    multiLine: true,
                    timeout: 10000,
                    html: true,
                    actions: [
                      {
                        label: "Dismiss",
                        color: "white",
                        handler: () => {
                          /* ... */
                        }
                      }
                    ]
                  });
                  pomocna = true;
                  return;
                }
              });
          }
        }
      });

      if (pomocna) return;

      if (element.balans == undefined) element.balns = null;
      if (element.stavkaTaktike == undefined) element.stavkaTaktike = [];
      if (element.stavkaTehnike == undefined) element.stavkaTehnike = [];
      if (element.fizicko == undefined) element.fizicko = null;
      if (element.mentalno == undefined) element.mentalno = null;
      if (element.teta == undefined) element.teta = null;
      if (element.ocena == undefined) element.ocena = null;
      if (element.opis == undefined) element.opis = null;
      if (element.timeline == undefined) element.timeline = null;
      if (element.ident == undefined) element.ident = null;
      if (element.identTrenazneVezbe == undefined)
        element.identTrenazneVezbe = null;
      if (element.prostor == undefined) element.prostor = "";
      if (element.vezaniIgraci == undefined) element.vezaniIgraci = [];
      if (element.width == undefined) element.width = 30;

      debugger;

      if (this.izabranBalans == null) {
        this.$q.notify({
          message: this.$t("trainings.chooseBalance"),
          color: "negative",
          icon: "warning"
        });
        return;
      } else if (this.izabranoFizickoOpterecenje == null) {
        this.$q.notify({
          message: this.$t("trainings.chooseActivity"),
          color: "negative",
          icon: "warning"
        });
        return;
      } else if (this.izabranoMentalnoOpterecenje == null) {
        this.$q.notify({
          message: this.$t("trainings.chooseMentalLoad"),
          color: "negative",
          icon: "warning"
        });
        return;
      } else if (this.izabranTeTaNivo == null) {
        this.$q.notify({
          message: this.$t("trainings.chooseTeTa"),
          color: "negative",
          icon: "warning"
        });
        return;
      } /* if(this.igraciIzabraniPrivremeno.length == 0){
          this.$q.notify({
            message: "Morate da izaberete igrače!",
            color: "negative",
            icon: "warning"
          });
          return;
        }
        else */ else {
        //  Tek ako je uneto svesto je obaveznocuvamo sve i gasimo dialog
        this.dialogZaPostavkeTrenazneVezbe = false;

        console.log(this.igraciIzabraniPrivremeno);
        console.log("SAD JE OVO BITNO");
        console.log(element);
        console.log("SAD JE OVO BITNO");
        console.log("predodavanja");
        console.log(this.sviKlonovi);

        let self = this;
        this.sviKlonovi.forEach(function (entry, index) {
          if (entry.id == element.id) {
            console.log("UNUTRA SAM");
            entry.vezaniIgraci = [];
            self.igraciIzabraniPrivremeno.forEach(function (entry1, index) {
              entry.vezaniIgraci.push(entry1.id);
            });
            entry.balans = self.izabranBalans;
            entry.stavkaTehnike = [];
            self.izabranIET.forEach(function (entry1, index) {
              entry.stavkaTehnike.push(entry1.value);
            });
            entry.stavkaTaktike = [];
            self.izabranET.forEach(function (entry1, index) {
              entry.stavkaTaktike.push(entry1.value);
            });
            entry.mentalno = self.izabranoMentalnoOpterecenje;
            entry.fizicko = self.izabranoFizickoOpterecenje;
            entry.prostor = self.izabranProstor;
            entry.teta = self.izabranTeTaNivo;
            entry.ocena = self.ocenaTrenazneVezbe;
          }
        });

        //  zasto ga vracao na null? ako bas mora onda mozda bolje pre nego sto se da nova vrednost, ili na tajmer?
        //  this.igraciIzabraniPrivremeno = null;

        console.log("Posle dodavanja");
        console.log(this.sviKlonovi);

        //sad ovo sve snimimo
        debugger;

        var pocetak = new Date(
          this.vremePocetkaTreninga +
          self.pxToTimeMinutes(element.x - self.sviTimelinovi[1].x) * 60000
        );

        console.log("OVO POKUSAVAMO DA POSALJEMO");
        console.log(
          element.balans,
          element.stavkaTaktike,
          element.stavkaTehnike,
          element.fizicko,
          element.identTrenazneVezbe,
          this.identIzabranogTreninga,
          element.vezaniIgraci,
          element.mentalno,
          element.ocena,
          element.opis,
          pocetak.toISOString(),
          element.prostor,
          element.teta,
          element.timeline,
          self.pxToTimeMinutes(element.width),
          [7, 8],
          element.prostor,
          element.ident
        );
        console.log("OVO POKUSAVAMO DA POSALJEMO");

        //  Odlucuje da li se komponenta kaci ili azurira
        var pomocna = false;
        debugger;
        this.podaciZaPrikaz.forEach(function (entry, index) {
          if (entry.ident == element.ident) pomocna = true;
        });

        if (pomocna) {
          this.azurirajBlokTreninga(
            element.balans,
            element.stavkaTaktike,
            element.stavkaTehnike,
            element.fizicko,
            element.identTrenazneVezbe,
            this.identIzabranogTreninga,
            element.vezaniIgraci,
            element.mentalno,
            element.ocena,
            element.opis,
            pocetak.toISOString(),
            element.prostor,
            element.teta,
            element.timeline,
            self.pxToTimeMinutes(element.width),
            [7, 8],
            element.prostor,
            element.ident
          );
        } else {
          this.snimiBlokTreninga(
            element.balans,
            element.stavkaTaktike,
            element.stavkaTehnike,
            element.fizicko,
            element.identTrenazneVezbe,
            this.identIzabranogTreninga,
            element.vezaniIgraci,
            element.mentalno,
            element.ocena,
            element.opis,
            pocetak.toISOString(),
            element.prostor,
            element.teta,
            element.timeline,
            self.pxToTimeMinutes(element.width),
            [7, 8],
            element.prostor
          );
        }

        if (element.ocena == 0)
          document.getElementById("klonovi" + element.id).style.border = "";
        else
          document.getElementById("klonovi" + element.id).style.border =
            "2px solid DodgerBlue";
      }
    },
    obrisiVezanog(element, e) {
      // this.sviKlonovi.forEach(function (entry, index) {
      //   if (element.id == entry.id) {
      //     entry.vezaniIgraci.forEach(function (entry1, index1) {
      //       if (entry1.id == e.id) {
      //         console.log("UNUTRA SAM");
      //         entry.vezaniIgraci.splice(index, 1);
      //       }
      //     });
      //   }
      // });
      let self = this;
      self.igraciIzabraniPrivremeno.forEach(function (entry, index) {
        if (entry.id == e.id) {
          self.igraciIzabraniPrivremeno.splice(index, 1);
        }
      });
      //  e obrisati iz this.igraciIzabraniPrivremeno
    },
    obrisiElement(element) {
      debugger;
      if (element.ident != null && this.dozvolaZaIzmenu == false)
        this.deleteKomponenta(element);
      var tmp = -1;
      this.sviKlonovi.forEach(function (entry, index) {
        if (entry.id == element.id) {
          tmp = index;
        }
      });
      console.log("OVDEOVDEOVDE");
      console.log(element);
      console.log("OVDEOVDEOVDE");
      this.sviKlonovi.splice(tmp, 1);
    },
    onMouseRight(element) {
      this.izabraniElement = Object.assign({}, element);
      this.mouseIsRight = true;
    },
    onMouseLeft(element) {
      this.izabraniElement = Object.assign({}, element);
      this.mouseIsLeft = true;
    },
    onMouseDown1(element) {
      this.izabraniElement = Object.assign({}, element);
      console.log(this.izabraniElement);
      this.mouseIsDown = true;
    },
    onMouseDown(element) {
      //  Proverimo da li je taj element vecnapravljen?
      //  Na klik misa uzmemo sve potrebne informacije o samom elementu

      console.log(this.sviKlonovi);

      //  Sacuvamo kliknuti element kao izabrani
      debugger;
      this.izabraniElement = Object.assign({}, element);

      var tmp = 0;
      this.sviKlonovi.forEach(function (entry) {
        if (entry.id > tmp) tmp = entry.id;
      });
      tmp += 1;

      this.izabraniElement.id = tmp;
      this.izabraniElement.x = 0;
      this.izabraniElement.y = 0;
      this.izabraniElement.width = 0;
      this.izabraniElement.height = 0;
      this.izabraniElement.identTrenazneVezbe = element.ident;
      this.izabraniElement.ident = null;

      //  Napravimo kopiju elementa i sacuvamo je lokalno
      this.sviKlonovi.push(this.izabraniElement);

      console.log("SADA SADA OVO OVO");
      console.log(this.sviKlonovi);
      console.log("SADA SADA OVO OVO");
      //  Postavimo misa na kliknuto
      this.mouseIsDown = true;

      let self = this;
      setTimeout(function () {
        document.getElementById(
          "klonovi" + self.izabraniElement.id
        ).style.border = "2px solid FireBrick";
      }, 300);

      // this.sviKlonovi.forEach(function (entry, index) {
      //   if(entry.stariX != undefined){
      //     entry.stariX = entry.x;
      //   }
      // });
    },
    onMouseUp() {
      this.mouseIsLeft = false;
      this.mouseIsRight = false;

      this.mousePositionX = event.clientX;
      this.mousePositionY = event.clientY;

      if (this.mouseIsDown) {
        if (
          this.mousePositionX >
          document.getElementById("brisi").getBoundingClientRect().left &&
          this.mousePositionX <
          document.getElementById("brisi").getBoundingClientRect().left +
          document.getElementById("brisi").getBoundingClientRect().width &&
          this.mousePositionY >
          document.getElementById("brisi").getBoundingClientRect().top &&
          this.mousePositionY <
          document.getElementById("brisi").getBoundingClientRect().top +
          document.getElementById("brisi").getBoundingClientRect().height
        ) {
          this.obrisiElement(this.izabraniElement);
        } else if (
          this.mousePositionX >
          document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
            .left +
          document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
            .width
        ) {
          //isto  samo je odvojeno jer je drugi uslov, i stavljenje else da ne bi dva puta brisao isto
          this.obrisiElement(this.izabraniElement);
        }
      }

      debugger;
      this.mouseIsDown = false;

      this.sviKlonovi.forEach(function (entry, index) {
        document.getElementById("leviSat" + entry.id).style.display = "none";
        document.getElementById("desniSat" + entry.id).style.display = "none";
        entry.x =
          document.getElementById("klonovi" + entry.id).getBoundingClientRect()
            .left -
          document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
            .left;
      });
      //  Zasto nam smeta da promenljiva ostane?
      //  this.izabraniElement = undefined;
    },
    onMouseMove() {
      this.sirinaTajmlajna = this.sirinaTajmlajna;
      if (this.originalnaSirinaElementa == 0)
        this.originalnaSirinaElementa = this.sirinaTajmlajna / 4;
      //  originalnaSirinaElementa se ne koristi vise, ali mozda bude korisna pa neka je


      if (this.mouseIsDown && this.izabraniElement != undefined) {
        document.getElementById(
          "leviSat" + this.izabraniElement.id
        ).style.display = "block";
        document.getElementById(
          "desniSat" + this.izabraniElement.id
        ).style.display = "block";

        var pomocna = new Date(
          this.vremePocetkaTreninga +
          this.pxToTimeMinutes(
            document
              .getElementById("klonovi" + this.izabraniElement.id)
              .getBoundingClientRect().left -
            document
              .getElementById("timelineBroj" + 1)
              .getBoundingClientRect().left
          ) *
          60000
        );

        this.trenutniSatD = this.pxToTimeFunction(
          document
            .getElementById("klonovi" + this.izabraniElement.id)
            .getBoundingClientRect().width
        );
        this.trenutniSatL = this.minutesToTimeOfDayFunction(
          pomocna.getHours() * 60 + pomocna.getMinutes()
        );

        //  Nadjemo trenutnu poziciju misa
        //  Sve pozicije gledamo u odnosu na gornji levi ugao sekcije sa timelin-ovima
        this.mousePositionX =
          event.clientX -
          document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
            .left;
        this.mousePositionY =
          event.clientY -
          document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
            .top;

        this.izabraniElement.width = document
          .getElementById("klonovi" + this.izabraniElement.id)
          .getBoundingClientRect().width;
        this.izabraniElement.height = document
          .getElementById("klonovi" + this.izabraniElement.id)
          .getBoundingClientRect().height;

        //  Postavimo poziciju elementa na trenutnu poziciju misa
        //  Pomerenu za pola visine i duzine elementa da bi mis bio na sredini elementa

        document.getElementById(
          "klonovi" + this.izabraniElement.id
        ).style.left =
          this.mousePositionX - this.izabraniElement.width / 2 + "px";
        document.getElementById("klonovi" + this.izabraniElement.id).style.top =
          this.mousePositionY - this.izabraniElement.height / 2 + "px";

        //  Azuriramo informacije o izabranom elementu
        this.izabraniElement.x =
          document
            .getElementById("klonovi" + this.izabraniElement.id)
            .getBoundingClientRect().left -
          document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
            .left;
        this.izabraniElement.y =
          document
            .getElementById("klonovi" + this.izabraniElement.id)
            .getBoundingClientRect().top -
          document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
            .top;
        this.izabraniElement.width = document
          .getElementById("klonovi" + this.izabraniElement.id)
          .getBoundingClientRect().width;

        let self = this;
        //  Proveravamo da li je blizu timeline-a i ako jeste zalepimo ga za njega radi lakseg biranja vremena

        this.sviTimelinovi.forEach(function (entry, index) {
          //  Cuvamo sve informacije radi kraceg zapisa dole i radi koriscenja kasnije
          entry.x =
            document
              .getElementById("timelineBroj" + index)
              .getBoundingClientRect().left -
            document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
              .left;
          entry.y =
            document
              .getElementById("timelineBroj" + index)
              .getBoundingClientRect().top -
            document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
              .top;
          entry.width = document
            .getElementById("timelineBroj" + index)
            .getBoundingClientRect().width;
          entry.height = document
            .getElementById("timelineBroj" + index)
            .getBoundingClientRect().height;

          //  Proveravamo vertikalno poravnjanje sa timeline-ovima
          if (
            self.mousePositionY > entry.y &&
            self.mousePositionY < entry.y + entry.height
          ) {
            document.getElementById(
              "klonovi" + self.izabraniElement.id
            ).style.top = entry.y + "px";
            self.sviKlonovi.forEach(function (entry1) {
              if (entry1.id == self.izabraniElement.id) entry1.timeline = index;
            });

            //  I tek u slucaju da je poravanato onda gledamo i horizontalno
            if (
              self.mousePositionX - self.izabraniElement.width / 2 <
              entry.x
            ) {
              document.getElementById(
                "klonovi" + self.izabraniElement.id
              ).style.left = entry.x + "px";
            }
            if (
              self.mousePositionX + self.izabraniElement.width / 2 >
              entry.x + entry.width &&
              self.mousePositionX + self.izabraniElement.width / 2 <
              entry.x + entry.width + self.izabraniElement.width / 4
            ) {
              document.getElementById(
                "klonovi" + self.izabraniElement.id
              ).style.left =
                entry.x + entry.width - self.izabraniElement.width + "px";
            }
          }
        });

        //  Azuriramo pozicije svih klonova radi kolizije

        this.sviKlonovi.forEach(function (entry, index) {
          entry.x =
            document
              .getElementById("klonovi" + entry.id)
              .getBoundingClientRect().left -
            document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
              .left;
          entry.y =
            document
              .getElementById("klonovi" + entry.id)
              .getBoundingClientRect().top -
            document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
              .top;
          entry.width = document
            .getElementById("klonovi" + entry.id)
            .getBoundingClientRect().width;
        });
        //  Proveravamo koliziju sa svih ostalih klonova

        self.sviKlonovi.forEach(function (prvi, index) {
          self.sviKlonovi.forEach(function (drugi, index) {
            switch (self.proveraKolizije(prvi, drugi)) {
              case 1:
                document.getElementById("klonovi" + prvi.id).style.left =
                  drugi.x - prvi.width + "px";
                // prvi.x = document.getElementById("klonovi" + prvi.id).getBoundingClientRect().left;
                break;
              case -1:
                document.getElementById("klonovi" + prvi.id).style.left =
                  drugi.x + drugi.width + "px";
                //prvi.x = document.getElementById("klonovi" + prvi.id).getBoundingClientRect().left;
                break;
              case 0:
                // nista
                break;
              default:
                console.log("Pogresna povratna vrednost funkcije?");
            }
          });
        });
      }
      if (this.mouseIsLeft && this.izabraniElement != undefined) {
        //  Prikazujemo vreme pocetka treninga u realnom vremenu
        document.getElementById(
          "leviSat" + this.izabraniElement.id
        ).style.display = "block";

        this.mousePositionX =
          event.clientX -
          document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
            .left;

        //  tmp = pozicija_izabranog + sirina_izabranog
        //  -> cuvamo vreme kada se izabrani element zarsava jer menjamo pocetak, a ne kraj
        //
        //  OVO BI MOGLO SAMO JEDNOMDA SE SACUVA U FUNKCIJI ZA LEVI KLIK
        var tmp =
          document
            .getElementById("klonovi" + this.izabraniElement.id)
            .getBoundingClientRect().left +
          document
            .getElementById("klonovi" + this.izabraniElement.id)
            .getBoundingClientRect().width;

        //  pozicija_izabranog = pozicija_misa - korektivni_faktor
        document.getElementById(
          "klonovi" + this.izabraniElement.id
        ).style.left = this.mousePositionX - 5 + "px";
        //  sirina_izabranog = originalna_pozicija_kraja_izabranog - pozicija_izabranog
        document.getElementById(
          "klonovi" + this.izabraniElement.id
        ).style.width =
          tmp -
          document
            .getElementById("klonovi" + this.izabraniElement.id)
            .getBoundingClientRect().left +
          "px";

        //  Provera kolizijesa levim zidom
        //
        //  Ako je pozicija_izabranog < pocetka_tajmlajna
        //      prestani_da_vuces
        //      zalepi pocetak izabranog za pocetaktajmlajna
        //      sirinu stavi na osnovu originalnog kraja
        if (
          document
            .getElementById("klonovi" + this.izabraniElement.id)
            .getBoundingClientRect().left <
          document.getElementById("timelineBroj" + 0).getBoundingClientRect()
            .left
        ) {
          this.onMouseUp();
          document.getElementById(
            "klonovi" + this.izabraniElement.id
          ).style.width =
            tmp -
            document.getElementById("timelineBroj" + 0).getBoundingClientRect()
              .left +
            "px";
          document.getElementById(
            "klonovi" + this.izabraniElement.id
          ).style.left =
            document.getElementById("timelineBroj" + 0).getBoundingClientRect()
              .left - 25 + "px"; // TODO: 25 je magican broj za gresku pri poravnjavanju
        }

        let self = this;

        // Da pokusamo samo da kopiramo koliziju od gore - radi
        //  Azuriramo pozicije svih klonova radi kolizije

        this.sviKlonovi.forEach(function (entry, index) {
          entry.x =
            document
              .getElementById("klonovi" + entry.id)
              .getBoundingClientRect().left -
            document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
              .left;
          entry.y =
            document
              .getElementById("klonovi" + entry.id)
              .getBoundingClientRect().top -
            document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
              .top;
          entry.width = document
            .getElementById("klonovi" + entry.id)
            .getBoundingClientRect().width;
        });
        //  Proveravamo koliziju sa svih ostalih klonova

        self.sviKlonovi.forEach(function (prvi, index) {
          self.sviKlonovi.forEach(function (drugi, index) {
            switch (self.proveraKolizije(prvi, drugi)) {
              case 1:
                document.getElementById("klonovi" + prvi.id).style.left =
                  drugi.x - prvi.width - 1 + "px";
                self.onMouseUp();
                // prvi.x = document.getElementById("klonovi" + prvi.id).getBoundingClientRect().left;
                break;
              case -1:
                document.getElementById("klonovi" + prvi.id).style.left =
                  drugi.x + drugi.width + 1 + "px";
                self.onMouseUp();
                //prvi.x = document.getElementById("klonovi" + prvi.id).getBoundingClientRect().left;
                break;
              case 0:
                // nista
                break;
              default:
                console.log("Pogresna povratna vrednost funkcije?");
            }
          });
        });

        //  Azuriraj pozicijui sirinu izabranog elementa u promenljivoj sviKlonovi
        this.sviKlonovi[this.izabraniElement.id].left = document
          .getElementById("klonovi" + this.izabraniElement.id)
          .getBoundingClientRect().left;
        this.sviKlonovi[
          this.izabraniElement.id
        ].width = document
          .getElementById("klonovi" + this.izabraniElement.id)
          .getBoundingClientRect().width;

        //  pomocna = vreme_pocetka_treninga + (vreme_pocetka_vezbe_u_odnosu_na_trening_u_ms - korekcija)*prevedi_u_minute
        //  ->    u sustinivreme pocetka vezbe u formi datuma
        var pomocna = new Date(
          this.vremePocetkaTreninga +
          this.pxToTimeMinutes(
            document
              .getElementById("klonovi" + this.izabraniElement.id)
              .getBoundingClientRect().left -
            document
              .getElementById("timelineBroj" + 1)
              .getBoundingClientRect().left
          ) *
          60000
        );

        //  Prikaz pocetka vezbeurealnom vremenu
        this.trenutniSatL = this.minutesToTimeOfDayFunction(
          pomocna.getHours() * 60 + pomocna.getMinutes()
        );
      }
      if (this.mouseIsRight && this.izabraniElement != undefined) {
        let self = this;

        document.getElementById(
          "desniSat" + this.izabraniElement.id
        ).style.display = "block";
        this.mousePositionX =
          event.clientX -
          document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
            .left;

        document.getElementById(
          "klonovi" + this.izabraniElement.id
        ).style.width =
          this.mousePositionX -
          document
            .getElementById("klonovi" + this.izabraniElement.id)
            .getBoundingClientRect().left +
          document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
            .left +
          5 +
          "px";
        //  sirina_elementa = (pozicija_misa - pozicija_elementa + originalna_sirina + 15)
        if (
          document
            .getElementById("klonovi" + this.izabraniElement.id)
            .getBoundingClientRect().left +
          document
            .getElementById("klonovi" + this.izabraniElement.id)
            .getBoundingClientRect().width >=
          document.getElementById("timelineBroj" + 0).getBoundingClientRect()
            .left +
          this.sirinaTajmlajna
        ) {
          this.onMouseUp();
          document.getElementById(
            "klonovi" + this.izabraniElement.id
          ).style.width =
            document.getElementById("timelineBroj" + 0).getBoundingClientRect()
              .left +
            this.sirinaTajmlajna -
            document
              .getElementById("klonovi" + this.izabraniElement.id)
              .getBoundingClientRect().left +
            document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
              .left -
            25 +
            "px";
        }

        // Da pokusamo samo da kopiramo koliziju od gore - radi
        //  Azuriramo pozicije svih klonova radi kolizije

        this.sviKlonovi.forEach(function (entry, index) {
          entry.x =
            document
              .getElementById("klonovi" + entry.id)
              .getBoundingClientRect().left -
            document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
              .left;
          entry.y =
            document
              .getElementById("klonovi" + entry.id)
              .getBoundingClientRect().top -
            document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
              .top;
          entry.width = document
            .getElementById("klonovi" + entry.id)
            .getBoundingClientRect().width;
        });
        //  Proveravamo koliziju sa svih ostalih klonova

        self.sviKlonovi.forEach(function (prvi, index) {
          self.sviKlonovi.forEach(function (drugi, index) {
            switch (self.proveraKolizije(prvi, drugi)) {
              case 1:
                document.getElementById("klonovi" + prvi.id).style.left =
                  drugi.x - prvi.width - 1 + "px";
                self.onMouseUp();
                // prvi.x = document.getElementById("klonovi" + prvi.id).getBoundingClientRect().left;
                break;
              case -1:
                document.getElementById("klonovi" + prvi.id).style.left =
                  drugi.x + drugi.width + 1 + "px";
                self.onMouseUp();
                //prvi.x = document.getElementById("klonovi" + prvi.id).getBoundingClientRect().left;
                break;
              case 0:
                // nista
                break;
              default:
                console.log("Pogresna povratna vrednost funkcije?");
            }
          });
        });

        this.sviKlonovi[this.izabraniElement.id].left = document
          .getElementById("klonovi" + this.izabraniElement.id)
          .getBoundingClientRect().left;
        this.sviKlonovi[
          this.izabraniElement.id
        ].width = document
          .getElementById("klonovi" + this.izabraniElement.id)
          .getBoundingClientRect().width;

        this.trenutniSatD = this.pxToTimeFunction(
          document
            .getElementById("klonovi" + this.izabraniElement.id)
            .getBoundingClientRect().width
        );
      }
    },
    proveraKolizije(prviKvadar, drugiKvadar) {
      if (prviKvadar.id == drugiKvadar.id) return 0;

      var prvi = {
        x: prviKvadar.x + prviKvadar.width / 2,
        y: prviKvadar.y + prviKvadar.height / 2,
        halfWidth: prviKvadar.width / 2,
        halfHeight: prviKvadar.height / 2
      };
      var drugi = {
        x: drugiKvadar.x + drugiKvadar.width / 2,
        y: drugiKvadar.y + drugiKvadar.height / 2,
        halfWidth: drugiKvadar.width / 2,
        halfHeight: drugiKvadar.height / 2
      };

      if (Math.abs(prvi.y - drugi.y) < prvi.halfHeight + drugi.halfHeight) {
        if (Math.abs(prvi.x - drugi.x) < prvi.halfWidth + drugi.halfWidth) {
          if (drugiKvadar.id == this.izabraniElement.id) return 0;
          else if (prvi.x < drugi.x) {
            if (prvi.x <= 10) return 0;
            return 1;
          } else {
            if (
              prvi.x + prvi.width >
              document
                .getElementById("klonovi" + prviKvadar.id)
                .parentElement.getBoundingClientRect().width
            )
              return 0;
            return -1;
          }
        } else return 0;
      } else return 0;
    },
    obrisiTimeline() {
      var test = false;
      let self = this;

      this.sviKlonovi.forEach(function (entry, index) {
        if (entry.timeline + 1 >= self.sviTimelinovi.length) {
          test = true;
        }
      });
      if (!test) self.sviTimelinovi.pop();
      else
        this.$q.notify({
          message: this.$t("trainings.timelineNotDeleted"),
          color: "negative",
          icon: "warning"
        });
    },
    postavkeTrenazneVezbe(element) {
      this.izabranaOpcijaOpterecenja = null;
      this.dialogZaPostavkeTrenazneVezbe = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);

      this.naslovTrenaze = element.naziv;
      this.pomocniElementZaDialog = element;

      debugger;
      this.prisutniIgraciNaTreningu.sort((a, b) => {
        if (a.primarnaPozicija.category == b.primarnaPozicija.category)
          return a.ime.localeCompare(b.ime);
        if (a.primarnaPozicija.category == "GOLMAN") return -1;
        if (
          a.primarnaPozicija.category == "BEK" &&
          b.primarnaPozicija.category != "GOLMAN"
        )
          return -1;
        if (
          a.primarnaPozicija.category == "VEZNI" &&
          b.primarnaPozicija.category != "GOLMAN" &&
          b.primarnaPozicija.category != "BEK"
        )
          return -1;
        if (
          a.primarnaPozicija.category == "KRILO" &&
          b.primarnaPozicija.category != "GOLMAN" &&
          b.primarnaPozicija.category != "BEK" &&
          b.primarnaPozicija.category != "VEZNNI"
        )
          return -1;
        if (
          a.primarnaPozicija.category == "NAPADAV" &&
          b.primarnaPozicija.category == "NAPADAC"
        )
          return -1;
        else return 1;
      });
      this.prisutniIgraciNaTreningu.forEach(function (entry) {
        if (entry.category == "BEK") entry.color = "red";
      });

      console.log("ASADAOVO");
      console.log(element);
      console.log("ASADAOVO");

      if (element.balans != undefined) this.izabranBalans = element.balans;
      else this.izabranBalans = null;

      this.izabranIET = [];
      if (element.stavkaTehnike != undefined) {
        element.stavkaTehnike.forEach(function (entry1, index) {
          self.dataStavkeTehnike.forEach(function (entry2) {
            if (entry2.value == entry1) self.izabranIET.push(entry2);
          });
        });
      }

      this.izabranET = [];
      if (element.stavkaTaktike != undefined) {
        element.stavkaTaktike.forEach(function (entry1, index) {
          self.dataStavkeTaktike.forEach(function (entry2) {
            if (entry2.value == entry1) self.izabranET.push(entry2);
          });
        });
      }
      if (element.prostor != undefined) this.izabranProstor = element.prostor;
      else this.izabranProstor = "";
      if (element.mentalno != undefined)
        this.izabranoMentalnoOpterecenje = element.mentalno;
      else this.izabranoMentalnoOpterecenje = null;
      if (element.fizicko != undefined)
        this.izabranoFizickoOpterecenje = element.fizicko;
      else this.izabranoFizickoOpterecenje = null;
      if (element.teta != undefined) this.izabranTeTaNivo = element.teta;
      else this.izabranTeTaNivo = null;
      if (element.ocena != undefined) this.ocenaTrenazneVezbe = element.ocena;
      else this.ocenaTrenazneVezbe = 0;

      debugger;
      this.igraciIzabraniPrivremeno = [];
      if (element.vezaniIgraci != undefined) {
        element.vezaniIgraci.forEach(function (entry1, index) {
          self.prisutniIgraciNaTreningu.forEach(function (entry2) {
            if (entry2.id == entry1) self.igraciIzabraniPrivremeno.push(entry2);
          });
        });
      }
    },
    seeDescription(element) {
      this.procitajOpis = true
      let self = this;

      this.naslovTrenaze = element.naziv;
      this.pomocniElementZaDialog = element;
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje tehnike
    //........................................
    getDataTehnika() {
      let linkStr = this.$apiPutanja + "/zadati-nivo-tehnike";
      let self = this;
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
          console.log("self.dataStavkeTehnike");
          console.log(response.data);
          self.dataStavkeTehnike = response.data.map(this.dajStavke);
          // self.dataStavkeTehnike = self.dataStavkeTehnike.filter((value, index, self) =>
          //   index === self.findIndex((t) => (
          //     t.identStavke === value.identStavke && t.identGrupe === value.identGrupe
          //   ))
          // )
          console.log(self.dataStavkeTehnike);
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje taktike
    //........................................
    getDataTaktika() {
      let linkStr = this.$apiPutanja + "/zadati-nivo-taktike";
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
          this.dataStavkeTaktike = response.data.map(this.dajStavke);
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    dajStavke(item) {
      debugger;
      return {
        label: item.grupa + "-" + item.naziv,
        value: item.identStavke,
        nazivGrupe: item.grupa,
        nazivStavke: item.naziv
      };
    },
    //'''''''''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o treninzima za određeni tim
    //...............................................
    getDataZaID() {
      debugger;
      let linkStr =
        this.$apiPutanja +
        "/selekcije/" +
        this.selektovaniTim.value +
        "/treninzi";
      let self = this;
      self.loadingTreninzi = true;
      debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(response => {
          debugger;
          self.data = response.data; // .map(self.dajTreninge);
          self.data.forEach((entry, index) => {
            self.data[index].vremePocetka = new Date(
              new Date(entry.vremePocetka).getTime() +
              self.getSerbiaOffset() * 60 * 60 * 1000
            ).toString();
          });
          //self.data = Object.entries(response.data) //.map(self.dajUtakmice);
          self.loadingTreninzi = false;

          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          self.loadingTreninzi = false;
          console.log("Greska: " + e);
        });
    },
    promenaTima() {
      debugger;
      // this.$refs.selektZaIgraca.blur();
      this.getDataZaID(); //idemo da uzmenmo podatke iz baze
      this.getDataEkipa(this.selektovaniTim.value);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o timovima
    //........................................
    getDataSelekcije() {
      let linkStr = this.$apiPutanja + "/selekcije/active/1";
      //debugger;
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
    dajTimove(item) {
      debugger;
      return {
        label: item.imeTima,
        value: item.ident,
        mesto: item.mesto,
        uzrast: item.uzrastTima
      };
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o ekipi
    //........................................
    getDataEkipa(brlj) {
      let self = this;
      let linkStr = this.$apiPutanja + "/selekcije/full-info/" + brlj;
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
          self.igraciSelekcije = response.data.igraci;
          self.igraciPrivremeno = response.data.igraci; //todo - izbaciti privremenu listu
          console.log("Igraci");
          console.log(self.igraciSelekcije);

          self.igraciSelekcijeKopija = [];
          // self.igraciSelekcije.forEach(function (entry) {
          //   let b = Object.create(entry);
          //   self.igraciSelekcijeKopija.push(b);
          //     let a = {};
          //     a.id = entry.id;

          //     self.elementiZaPracenje.forEach(function (entry) {

          //       a[entry.identElementa] = {plus:0, minus:0};
          //     });
          //     self.dataZaIgraceZaTokUtakmice.push(a);
          //   });

          debugger;

          //self.igraciNaTerenu = this.starteri
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka za trenazne vezbe
    //........................................
    getData1() {
      let linkStr = this.$apiPutanja + "/trenazna-vezba";
      var self = this;
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
          self.dataVezbe = response.data;
          self.kopijaDataVezbe = response.data;
          debugger;
          console.log(self.dataVezbe);
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje novog zapisa
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/trening";
      var self = this;
      let datetime = this.getDateTime(new Date());
      let datetime1 = this.getDateTime(new Date());
      console.log("post");
      console.log(this.editedItem.vremePocetka);
      console.log(
        date.extractDate(this.editedItem.vremePocetka, "DD/MM/YYYY - HH:mm")
      );

      var tmpDate = date.extractDate(
        this.editedItem.vremePocetka,
        "DD/MM/YYYY - HH:mm"
      );

      var vremePocetka = new Date(tmpDate);
      console.log(vremePocetka);
      console.log(vremePocetka.toISOString());

      var listaIdentIgraca = [];

      this.prisutniIgraciNaTreningu.forEach(function (entry) {
        listaIdentIgraca.push(entry.id);
      });
      var dataString = {
        datum: datetime,
        identIgraciList: listaIdentIgraca,
        identSelekcija: this.selektovaniTim.value,
        identStrucniStab: window.$userID,
        lokacija: this.editedItem.lokacija,
        opisnaOcenaTreninga: this.editedItem.opisnaOcenaTreninga,
        opisniCiljTreningaUPripremi: this.editedItem
          .opisniCiljTreningaUPripremi,
        podloga: this.editedItem.podloga,
        temperatura: this.editedItem.temperatura,
        tipTreninga: this.editedItem.tipTreninga,
        uslovi: this.editedItem.uslovi,
        vremePocetka: vremePocetka.toISOString(),
        vremeTrajanjaTreninga: this.editedItem.vremeTrajanja
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
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("trainings.msgPositive"),
            color: "green"
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //  alert(response);
          self.$q.notify({
            message: self.$t("trainings.msgNeg"),
            color: "negative",
            icon: "warning"
          });
        });
    },
    //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    // simanje jednog bloka treninga, svaki blok se posebno snima
    //........................................''''''''''''''''''''''''''
    snimiBlokTreninga(
      _balansUVezbi,
      _bazaTaktikeSifrarnikStavke,
      _bazaTehnikeSifrarnikStavke,
      _fizickoOpterecenje,
      _identTrenaznaVezba,
      _identTrening,
      _listaIdentIgraca,
      _mentalnoOpterecenje,
      _ocena,
      _opisVezbe,
      _pocetak,
      _prostorNaKomeSeVezbaOdvija,
      _tetaNivo,
      _timeline,
      _trajanje,
      _uzrastVezbe,
      _zaKojiSegmentTreninga
    ) {
      debugger;
      let linkStr = this.$apiPutanja + "/trening-vezba-blok";
      var self = this;

      var dataString = {
        balansUVezbi: _balansUVezbi,
        bazaTaktikeSifrarnikStavke: _bazaTaktikeSifrarnikStavke,
        bazaTehnikeSifrarnikStavke: _bazaTehnikeSifrarnikStavke,
        fizickoOpterecenje: _fizickoOpterecenje,
        identTrening: _identTrening,
        identTreningVezbaOpis: _identTrenaznaVezba,
        listaIdentIgraca: _listaIdentIgraca,
        mentalnoOpterecenje: _mentalnoOpterecenje,
        ocena: _ocena,
        opisVezbe: _opisVezbe,
        pocetak: _pocetak,
        prostorNaKomeSeVezbaOdvija: _prostorNaKomeSeVezbaOdvija,
        tetaNivo: _tetaNivo,
        timeline: _timeline,
        trajanje: _trajanje,
        //"uzrastVezbe": _uzrastVezbe,
        zaKojiSegmentTreninga: _zaKojiSegmentTreninga
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
          //self.getDataZaID()  //proveriti da li ovo treba?
          self.$q.notify({
            message: self.$t("trainings.savedSucc"),
            color: "green"
          });
          self.daLiCuvamoSamoJedanBlok = true;
          self.getBlokTreninga(self.identIzabranogTreninga);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //  alert(response);
          self.$q.notify({
            message: self.$t("trainings.notSaved"),
            color: "negative",
            icon: "warning"
          });
        });
    },
    //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    // menjanje jednog bloka treninga, svaki blok se posebno snima
    //........................................''''''''''''''''''''''''''
    azurirajBlokTreninga(
      _balansUVezbi,
      _bazaTaktikeSifrarnikStavke,
      _bazaTehnikeSifrarnikStavke,
      _fizickoOpterecenje,
      _identTrenaznaVezba,
      _identTrening,
      _listaIdentIgraca,
      _mentalnoOpterecenje,
      _ocena,
      _opisVezbe,
      _pocetak,
      _prostorNaKomeSeVezbaOdvija,
      _tetaNivo,
      _timeline,
      _trajanje,
      _uzrastVezbe,
      _zaKojiSegmentTreninga,
      _ident
    ) {
      debugger;
      let linkStr = this.$apiPutanja + "/trening-vezba-blok/" + _ident;
      var self = this;

      var dataString = {
        balansUVezbi: _balansUVezbi,
        bazaTaktikeSifrarnikStavke: _bazaTaktikeSifrarnikStavke,
        bazaTehnikeSifrarnikStavke: _bazaTehnikeSifrarnikStavke,
        fizickoOpterecenje: _fizickoOpterecenje,
        identTrening: _identTrening,
        identTreningVezbaOpis: _identTrenaznaVezba,
        listaIdentIgraca: _listaIdentIgraca,
        mentalnoOpterecenje: _mentalnoOpterecenje,
        ocena: _ocena,
        opisVezbe: _opisVezbe,
        pocetak: _pocetak,
        prostorNaKomeSeVezbaOdvija: _prostorNaKomeSeVezbaOdvija,
        tetaNivo: _tetaNivo,
        timeline: _timeline,
        trajanje: _trajanje,
        //"uzrastVezbe": _uzrastVezbe,
        zaKojiSegmentTreninga: _zaKojiSegmentTreninga
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
          //self.getDataZaID()  //proveriti da li ovo treba?
          self.$q.notify({
            message: self.$t("trainings.savedSucc"),
            color: "green"
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //  alert(response);
          self.$q.notify({
            message: self.$t("trainings.notUpdate"),
            color: "negative",
            icon: "warning"
          });
        });
    },
    //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    // simanje jednog bloka treninga, svaki blok se posebno snima
    //........................................''''''''''''''''''''''''''
    getBlokTreninga(_identTrening) {
      this.zabraniKlik = true;
      debugger;
      //let linkStr = this.$apiPutanja +  '​/trening-vezba-blok​/findby-trening​/' +  _identTrening
      let linkStr =
        this.$apiPutanja +
        "/trening-vezba-blok/findby-trening/" +
        _identTrening;
      var self = this;

      debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function (response) {
          if (self.daLiCuvamoSamoJedanBlok) {
            self.sviKlonovi.forEach(function (entry) {
              if (entry.ident == null) {
                response.data.forEach(function (entry1) {
                  if (
                    entry.opis == entry1.treningVezbaOpis.opis &&
                    entry.timeline == entry1.timeline
                  )
                    entry.ident = entry1.ident;
                });
              }
            });
            return;
          } else {
            debugger;
            console.log(response.data);

            self.brojTimelinova = 3;
            while (self.sviTimelinovi.length > self.brojTimelinova)
              self.sviTimelinovi.pop();
            self.podaciZaPrikaz = response.data;

            //self.data = Object.e
            self.podaciZaPrikaz.forEach(function (entry, index) {
              self.podaciZaPrikaz[index].pocetak = new Date(
                new Date(entry.pocetak).getTime() +
                self.getSerbiaOffset() * 60 * 60 * 1000
              ).toString(); // + 1 ili + 2 zavisi kako je pomereno vreme letnje zimsko
              debugger;
              if (entry.timeline + 1 > self.brojTimelinova)
                self.brojTimelinova = entry.timeline + 1;
            });
            while (self.sviTimelinovi.length < self.brojTimelinova)
              self.sviTimelinovi.push({ x: 0, y: 0, width: 0, height: 0 });
          }
        })
        .then(response => {
          if (!self.daLiCuvamoSamoJedanBlok) {
            setTimeout(function () {
              self.sirinaTajmlajna = document
                .getElementById("timelineBroj" + 0)
                .getBoundingClientRect().width;
              self.ucitajElemente(self.podaciZaPrikaz);
            }, 1000);
          }
        })
        .then(response => {
          if (!self.daLiCuvamoSamoJedanBlok) {
            setTimeout(function () {
              self.poredjajElemente();
            }, 2000);
          } else {
            self.daLiCuvamoSamoJedanBlok = false;
            self.zabraniKlik = false;
          }
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //  alert(response);
        });
    },
    // Funckija za proveru da li smo trenutno +2 ili +1 (zimsko letnje tacunanje vremena)
    getSerbiaOffset() {
      // Serbia is in the CET/CEST timezone
      const serbiaTimeZone = "Europe/Belgrade";

      // Get the current date and time in the specified timezone
      const serbiaDate = new Date().toLocaleString("en-US", {
        timeZone: serbiaTimeZone
      });

      // Create a new Date object from the localized string
      const currentSerbiaDate = new Date(serbiaDate);

      // Get the UTC offset in minutes
      const offsetMinutes = currentSerbiaDate.getTimezoneOffset();

      // Convert the offset to hours and reverse the sign
      const offsetHours = -offsetMinutes / 60;

      return offsetHours;
    },

    ucitajElemente(procitanjeTrenazneVezbe) {
      let self = this;
      debugger;
      var tmp = {};
      self.sviKlonovi = [];
      console.log("OVO GLEDAS");
      console.log(procitanjeTrenazneVezbe);
      console.log("OVO GLEDAS");
      procitanjeTrenazneVezbe.forEach(function (entry, index) {
        tmp = {};

        tmp.balans = entry.balansUVezbi;
        tmp.fizicko = entry.fizickoOpterecenje;
        tmp.height = 50;
        tmp.id = index; //  ?
        tmp.ident = entry.ident;
        tmp.identTrenazneVezbe = entry.treningVezbaOpis.ident;
        tmp.naziv = entry.treningVezbaOpis.naziv;
        tmp.opis = entry.treningVezbaOpis.opis;
        tmp.kategorija = entry.treningVezbaOpis.kategorija;
        tmp.mentalno = entry.mentalnoOpterecenje;
        tmp.ocena = entry.ocena;
        tmp.prostor = entry.prostorNaKomeSeVezbaOdvija;
        tmp.timeline = entry.timeline;

        tmp.stavkaTehnike = [...entry.bazaTehnikeSifrarnikStavke];
        tmp.stavkaTaktike = [...entry.bazaTaktikeSifrarnikStavke];
        tmp.vezaniIgraci = [...entry.listaIdentIgraca];

        tmp.teta = entry.tetaNivo;
        tmp.width = self.timeToPx(entry.trajanje); //  nesto od entry.trajanje
        tmp.x = self.timeOfDayToPx(entry.pocetak); // nesto od entry.pocetak
        tmp.pomocPocetak = entry.pocetak;
        tmp.y =
          document
            .getElementById("timelineBroj" + tmp.timeline)
            .getBoundingClientRect().top -
          document.getElementById("ovdeUbaciKlonove").getBoundingClientRect()
            .top; // nesto od entry.timeline

        self.sviKlonovi.push(tmp);
      });
    },
    poredjajElemente() {
      let self = this;

      self.sviKlonovi.forEach(function (entry) {
        if (entry.ocena != 0)
          document.getElementById("klonovi" + entry.id).style.border =
            "2px solid DodgerBlue";
        document.getElementById("klonovi" + entry.id).style.width =
          entry.width + "px";
        document.getElementById("klonovi" + entry.id).style.top =
          entry.y + "px";
        document.getElementById("klonovi" + entry.id).style.left =
          entry.x + 15 + "px";
      });
      console.log(self.sviKlonovi);
      console.log("OVO GLEDAS");
      this.zabraniKlik = false;
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena tima
    //........................................
    putData() {
      debugger;
      let linkStr = this.$apiPutanja + "/trening/" + this.editedItem.ident;
      var self = this;
      let datetime = this.getDateTime(new Date());
      let datetime1 = this.getDateTime(new Date());

      var listaIdentIgraca = [];
      console.log("put");
      console.log(this.editedItem.vremePocetka);
      var tmpDate = new Date();
      tmpDate.setFullYear(
        this.editedItem.vremePocetka.split("/")[2].split(" ")[0]
      );
      tmpDate.setMonth(
        parseInt(this.editedItem.vremePocetka.split("/")[1].split("/")[0]) - 1
      );
      tmpDate.setDate(this.editedItem.vremePocetka.split("/")[0]);
      tmpDate.setHours(
        this.editedItem.vremePocetka.split(" - ")[1].split(":")[0]
      );
      tmpDate.setMinutes(
        this.editedItem.vremePocetka.split(" - ")[1].split(":")[1]
      );
      console.log("put tmpdate");
      console.log(tmpDate);

      var vremePocetka = new Date(tmpDate);

      this.prisutniIgraciNaTreningu.forEach(function (entry) {
        listaIdentIgraca.push(entry.id);
      });

      var dataString = {
        datum: this.editedItem.datum,
        identIgraciList: listaIdentIgraca,
        identSelekcija: this.selektovaniTim.value,
        identStrucniStab: window.$userID,
        lokacija: this.editedItem.lokacija,
        opisnaOcenaTreninga: this.editedItem.opisnaOcenaTreninga,
        opisniCiljTreningaUPripremi: this.editedItem
          .opisniCiljTreningaUPripremi,
        podloga: this.editedItem.podloga,
        temperatura: this.editedItem.temperatura,
        tipTreninga: this.editedItem.tipTreninga,
        uslovi: this.editedItem.uslovi,
        vremePocetka: vremePocetka.toISOString(),
        vremeTrajanjaTreninga: this.editedItem.vremeTrajanja
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
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("trainings.dataSucc"),
            color: "green"
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //  alert(response);
          self.$q.notify({
            message: self.$t("trainings.dataNotSucc"),
            color: "negative",
            icon: "warning"
          });
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje/deaktiviranje tima
    //........................................
    deleteData(item) {
      debugger;
      let linkStr = this.$apiPutanja + "/trening/" + item.ident;
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
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("trainings.delSucc"),
            color: "green"
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //  alert(response);
          self.$q.notify({
            message: self.$t("trainings.delNotSucc"),
            color: "negative",
            icon: "warning"
          });
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanjekomponente
    //........................................
    deleteKomponenta(item) {
      debugger;
      let linkStr = this.$apiPutanja + "/trening-vezba-blok/" + item.ident;
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
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("trainings.delSucc"),
            color: "green"
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //alert(response);
          self.$q.notify({
            message: self.$t("trainings.delNotSucc"),
            color: "negative",
            icon: "warning"
          });
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // pomocna f-ja za formatiranje datuma
    //........................................
    getDateTime(a) {
      if (isNaN(a))
        var timeStamp = new Date(
          a.split("/")[2],
          parseInt(a.split("/")[1]) - 1,
          a.split("/")[0],
          3,
          0,
          0
        );
      else var timeStamp = new Date(a);
      const vrati = timeStamp.toISOString();
      return vrati;
    },
    addRow() {
      debugger;
      let sveOK = true;

      if (this.editedItem.lokacija == null || this.editedItem.lokacija == "")
        sveOK = false;
      if (
        this.editedItem.tipTreninga == null ||
        this.editedItem.tipTreninga == ""
      )
        sveOK = false;
      if (
        this.editedItem.vremePocetka == null ||
        this.editedItem.vremePocetka == ""
      )
        sveOK = false;
      if (
        this.editedItem.vremeTrajanja == null ||
        this.editedItem.vremeTrajanja == "" ||
        this.editedItem.vremeTrajanja == 0
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
      let obj = {
        title: this.$t("administration.user.war"),
        message: this.$t("administration.user.msgDelConf"),
        customCloseBtnText: this.$t("administration.user.txtNo"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: this.$t("administration.user.txtYes"),
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
    tokTreninga(item) {
      debugger;

      this.zabraniKlik = true;
      this.pretraga = "";

      let self = this;
      self.prisutniIgraciNaTreningu = [];
      this.identIzabranogTreninga = item.ident;

      self.data.forEach(function (entry1) {
        if (self.identIzabranogTreninga == entry1.ident)
          self.igraciSelekcije.forEach(function (entry) {
            entry1.listaIdentIgraca.forEach(function (entry2) {
              if (entry.id == entry2) self.prisutniIgraciNaTreningu.push(entry);
            });
          });
      });

      this.allColors.sort(() => Math.random() - 0.5);

      this.trajanjeIzabranogTreninga = item.vremeTrajanjaTreninga;
      this.kraceTrajanjeIzabranogTreninga = Math.round(
        this.trajanjeIzabranogTreninga / 5
      );
      this.ocenaTrenazneVezbe = 0;
      this.brojTimelinova = 3;
      debugger;
      console.log(item);
      this.izabraniTrening = Object.assign({}, item);
      this.izabraniTrening.vremePocetka = new Date(
        this.izabraniTrening.vremePocetka
      ).toLocaleString("en-GB");
      this.izabraniTrening.vremePocetka =
        this.izabraniTrening.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0] +
        "/" +
        this.izabraniTrening.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.izabraniTrening.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        " - " +
        this.izabraniTrening.vremePocetka.split(", ")[1].split(":")[0] +
        ":" +
        this.izabraniTrening.vremePocetka
          .split(", ")[1]
          .split(":")[1]
          .split(":")[0];
      // vreme
      console.log("item.vremePocetka");
      console.log(item.vremePocetka);
      console.log(item);

      this.vremePocetkaTreninga = Date.parse(
        item.vremePocetka.replace(" - ", " ")
      ); // Broj milisekundi od pocetka racunanja
      var pomocna = new Date(item.vremePocetka.replace(" - ", " "));
      debugger;
      this.vremePocetkaTreningaUMinutima =
        pomocna.getHours() * 60 + pomocna.getMinutes(); // Vise mi znaci u minutima da bih dobro prikazao (Od pocetka tog dana)
      this.dialogZaTokTreninga = true;

      var today = Date.now();

      debugger;
      // if(today > this.vremePocetkaTreninga + (this.trajanjeIzabranogTreninga + this.brojMinutaNakonZabraneIzmene)*60000 && this.editedItem.opisnaOcenaTreninga.trim() != '')
      if (
        this.vremePocetkaTreninga + this.trajanjeIzabranogTreninga * 60000 <=
        Date.now() &&
        item.opisnaOcenaTreninga.trim() != ""
      )
        this.dozvolaZaIzmenu = true;
      else this.dozvolaZaIzmenu = false;

      console.log("this.dozvolaZaIzmenu");
      console.log(this.dozvolaZaIzmenu);
      console.log(item.opisnaOcenaTreninga);

      //  setTimeout(function(){
      if (self.$q.fullscreen.isActive) self.smanji();
      else self.povecaj();
      self.getData1();
      self.getBlokTreninga(item.ident);
      //  }, 2000);
    },
    otvordeDialog() {
      this.editedItem.vremePocetka = this.getDateTime(Date.now());
      this.editedItem.vremePocetka = new Date(
        this.editedItem.vremePocetka
      ).toLocaleString("en-GB");
      this.editedItem.vremePocetka =
        this.editedItem.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0] +
        "/" +
        this.editedItem.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        " - " +
        this.editedItem.vremePocetka.split(", ")[1].split(":")[0] +
        ":" +
        this.editedItem.vremePocetka
          .split(", ")[1]
          .split(":")[1]
          .split(":")[0];
      this.new_customer = true;
      this.prisutniIgraciNaTreningu = [];
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    editItem(item) {
      debugger;
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.vremePocetka = new Date(
        this.editedItem.vremePocetka
      ).toLocaleString("en-GB");
      this.editedItem.vremePocetka =
        this.editedItem.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0] +
        "/" +
        this.editedItem.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        " - " +
        this.editedItem.vremePocetka.split(", ")[1].split(":")[0] +
        ":" +
        this.editedItem.vremePocetka
          .split(", ")[1]
          .split(":")[1]
          .split(":")[0];
      this.new_customer = true;
      this.readonly = false;
      console.log("edit");
      console.log(this.editedItem.vremePocetka);

      let self = this;
      self.prisutniIgraciNaTreningu = [];
      this.identIzabranogTreninga = item.ident;
      this.izabraniTrening = Object.assign({}, item);
      this.izabraniTrening.vremePocetka = new Date(
        this.izabraniTrening.vremePocetka
      ).toLocaleString("en-GB");
      this.izabraniTrening.vremePocetka =
        this.izabraniTrening.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0] +
        "/" +
        this.izabraniTrening.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.izabraniTrening.vremePocetka
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        " - " +
        this.izabraniTrening.vremePocetka.split(", ")[1].split(":")[0] +
        ":" +
        this.izabraniTrening.vremePocetka
          .split(", ")[1]
          .split(":")[1]
          .split(":")[0];

      self.data.forEach(function (entry1) {
        if (self.identIzabranogTreninga == entry1.ident)
          self.igraciSelekcije.forEach(function (entry) {
            entry1.listaIdentIgraca.forEach(function (entry2) {
              if (entry.id == entry2) self.prisutniIgraciNaTreningu.push(entry);
            });
          });
      });

      this.editedItem.vremeTrajanja = parseInt(
        this.izabraniTrening.vremeTrajanjaTreninga
      );
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
        console.log("sviInputi");
        console.log(sviInputi);
        console.log("Span-IP" + i);
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
      while (!(i > 3 && sviSelektovi == null)) {
        console.log("sviSelektovi");
        console.log(sviSelektovi);
        console.log("Span-SL" + i);
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

      const status = exportFile("trening.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: this.$t("administration.user.msgPrtSc"),
          color: "negative",
          icon: "warning"
        });
      }
    },
    dodajGrupu() {
      let self = this;

      var tmpIgraci = [];

      self.igraciPrivremeno.forEach(function (entry) {
        if (entry.izabran) {
          if (self.grupe.length > 0) {
            var postoji = false;
            self.grupe.forEach(function (entry1) {
              entry1.igraci.forEach(function (entry2) {
                if (entry.ime == entry2) postoji = true;
              });
            });
            if (!postoji) {
              tmpIgraci.push(entry.ime);
            } else {
              postoji = false;
            }
          } else {
            tmpIgraci.push(entry.ime);
          }
        }
      });

      var tmp = {
        id: self.grupe.length + 1,
        igraci: tmpIgraci
      };
      self.grupe.push(tmp);

      console.log(self.grupe);
    }
  }
};
</script>
<style scoped>
.trenazne-vezbe {
  background-color: #f0f0f0;
}

.trenazne-vezbe:hover {
  background-color: #f0f0f0af;
  cursor: grab;
}

.trenazne-vezbe:active {
  cursor: grabbing;
}

.q-if-control {
  color: white !important;
}

.strelice:hover {
  background-color: #f0f0f0;
  cursor: col-resize;
}

.dugmeNewNesto1 {
  width: 140px;
  height: 40px;
  margin: 0px 5px;
  background-color: white;
  color: #ff4b00;
  font-weight: 800;
  border: 1px solid #ff4b00;
  border-radius: 5px;
  box-shadow: 0px;
}

.dugmeNewNesto2 {
  font-weight: 500;
  background-color: white;
  color: #ff4b00;
  width: 200px;
  height: 40px;
  border: 1px solid #ff4b00;
  border-radius: 5px;
  box-shadow: 0px;
}

.vanTabele {
  padding: 10px 0px;
  display: flex;
}

.uTabeli {
  display: table-cell;
  width: 33.33%;
}

#ovdeUbaciKlonove {
  overflow: auto;
}

.dugmeSearch1 {
  width: 85%;
  height: 40px;
  margin: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 #bdcedc;
  background-color: #fff;
}

tbody tr:hover td #dugmeModifaj {
  background-color: #30cc83 !important;
  color: #ffffff !important;
}

tbody tr:hover td #dugmeOdrzanTrening {
  background-color: #34b233 !important;
  color: #ffffff !important;
}

tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}

.naslovcic {
  /* color: red; */
  font-weight: 600;
}

.sakriDugmice {
  display: none;
}
</style>
