<template>
  <q-page class="q-pa-sm">
    <q-table
      :title="$t('matches.matches')"
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
      table-header-style="font-weight: bold; background: #e5edf4; color: #323b62;  color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10"
    >
      <template v-slot:top-right="props">
        <q-btn
          v-if="selektovaniTim != undefined"
          @click="otvordeDialog()"
          :label="$t('matches.newMatch')"
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

        <!-- <q-btn flat round dense class="plavaKlasaTekst" :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen" v-if="mode === 'list'">
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>
            {{props.inFullscreen ? $t('matches.exitFullscreen') : $t('matches.enterFullscreen')}}</q-tooltip>
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
            mode === "grid" ? $t("matches.list") : $t("matches.grid")
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
        <q-th style="color: #ffffff00; width: 170px">
          {{ props.col.label }}
        </q-th>
      </template>

      <template v-slot:body-cell="props">
        <q-td :props="props" v-if="props.value == props.row.action">
          <div class="q-gutter-sm" style="width: 170px">
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
            <q-btn
              @click="tokUtakmice(props.row)"
              id="dugmeModifaj"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="details"
            >
              <q-tooltip>{{ $t("matches.theCourseOfTheMatch") }}</q-tooltip>
            </q-btn>
            <q-btn
              id="dugmeOdrzanTrening"
              v-if="
                Date.parse(props.row.datum) <= Date.now() &&
                  props.row.rezultatNaKraju.trim() != ''
              "
              readonly
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="check_circle"
            >
              <q-tooltip>{{ $t("matches.matchWasHeld") }}</q-tooltip>
            </q-btn>
            <q-btn
              v-else
              readonly
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="radio_button_unchecked"
            >
              <q-tooltip>{{ $t("matches.matchWasNotHeld") }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>

        <q-td
          :props="props"
          v-else-if="props.value == props.row.datum"
          @click="otvoriPreviewDialog(props.row)"
        >
          <div class="" id="username">
            {{ props.row.datum }}
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
            {{ this.naslov }}
            <!-- <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn> -->
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section class="custom-field one datumInput">
                  <q-input
                    :readonly="readonly"
                    borderless
                    dense
                    placeholder=" "
                    v-model="editedItem.datum"
                    @focus="popniPlaceholder('Span-IP0')"
                    @input="popniPlaceholder('Span-IP0')"
                    @blur="spustiPlaceholder('Span-IP0', editedItem.datum)"
                    ref="input1"
                    mask="##/##/#### ##:##"
                    :rules="[val => valiDate(val) || 'DD/MM/YYYY HH:mm']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            :readonly="readonly"
                            v-model="editedItem.datum"
                            mask="DD/MM/YYYY HH:mm"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>

                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            :readonly="readonly"
                            v-model="editedItem.datum"
                            mask="DD/MM/YYYY HH:mm"
                            format24h
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <span id="Span-IP0" style="left: 40px" class="placeholder">{{
                    $t("matches.dateAndTimeOfTheMatch")
                  }}</span>
                </q-item-section>
                <!-- <q-item class="formular ponisti" style="">
                <q-input dense outlined v-model="editedItem.datum" placeholder="Datum odigravanja utakmice" mask="date"
                  :rules="['date']" class="datumKlasa">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="editedItem.datum" @input="() => $refs.qDateProxy.hide()"></q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item> -->

                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="listaTipovaUtkmice"
                    v-model="editedItem.tipUtakmice"
                    emit-value
                    map-options
                    ref="select1"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="
                      spustiPlaceholder('Span-SL1', editedItem.tipUtakmice)
                    "
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        $t('matches.enterMatchType')
                    ]"
                  />
                  <span
                    @click="$refs.select1.showPopup()"
                    id="Span-SL1"
                    class="placeholder placeholder1"
                    >{{ $t("matches.matchType") }}</span
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.lokacija" :label="$t('matches.location')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.lokacija"
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')"
                      @blur="spustiPlaceholder('Span-IP1', editedItem.lokacija)"
                      ref="input2"
                      :rules="[
                        val =>
                          (val !== null && val !== '') ||
                          $t('matches.enterMatchLocation')
                      ]"
                    />
                    <span id="Span-IP1" class="placeholder">{{
                      $t("matches.location")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.temperatura" mask="##" :label="$t('matches.temperature')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.temperatura"
                      ref="input3"
                      type="number"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="
                        spustiPlaceholder('Span-IP2', editedItem.temperatura)
                      "
                      :rules="[
                        val =>
                          (val !== null && val !== '') ||
                          $t('matches.enterTemperature')
                      ]"
                    />
                    <span id="Span-IP2" class="placeholder">{{
                      $t("matches.temperature")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    hide-bottom-space
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="listaUslova"
                    v-model="editedItem.usloviUtakmice"
                    emit-value
                    map-options
                    ref="select2"
                    @focus="popniPlaceholder('Span-SL2')"
                    @input="popniPlaceholder('Span-SL2')"
                    @blur="
                      spustiPlaceholder('Span-SL2', editedItem.usloviUtakmice)
                    "
                  />
                  <span
                    @click="$refs.select2.showPopup()"
                    id="Span-SL2"
                    class="placeholder placeholder1"
                    >{{ $t("matches.conditions") }}</span
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    hide-bottom-space
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="listaPodloga"
                    v-model="editedItem.podlogaUtakmice"
                    emit-value
                    map-options
                    ref="select3"
                    @focus="popniPlaceholder('Span-SL3')"
                    @input="popniPlaceholder('Span-SL3')"
                    @blur="
                      spustiPlaceholder('Span-SL3', editedItem.podlogaUtakmice)
                    "
                  />
                  <span
                    @click="$refs.select3.showPopup()"
                    id="Span-SL3"
                    class="placeholder placeholder1"
                    >{{ $t("matches.substrate") }}</span
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.protivnik" :label="$t('matches.opponent')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.protivnik"
                      @focus="popniPlaceholder('Span-IP3')"
                      @input="popniPlaceholder('Span-IP3')"
                      @blur="
                        spustiPlaceholder('Span-IP3', editedItem.protivnik)
                      "
                      ref="input4"
                      :rules="[
                        val =>
                          (val !== null && val !== '') ||
                          $t('matches.enterMatchOpponent')
                      ]"
                    />
                    <span id="Span-IP3" class="placeholder">{{
                      $t("matches.opponent")
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
                    :options="listaNivoaPremaProtivniku"
                    v-model="editedItem.nivoPremaProtivniku"
                    emit-value
                    map-options
                    ref="select4"
                    @focus="popniPlaceholder('Span-SL4')"
                    @input="popniPlaceholder('Span-SL4')"
                    @blur="
                      spustiPlaceholder(
                        'Span-SL4',
                        editedItem.nivoPremaProtivniku
                      )
                    "
                  />
                  <span
                    @click="$refs.select4.showPopup()"
                    id="Span-SL4"
                    class="placeholder placeholder1"
                    >{{ $t("matches.levelAgainstTheOpponent") }}</span
                  >
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
                      v-model="editedItem.rezultatNaPoluvremenu"
                      ref="input5"
                      @focus="popniPlaceholder('Span-IP4')"
                      @input="popniPlaceholder('Span-IP4')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP4',
                          editedItem.rezultatNaPoluvremenu
                        )
                      "
                    />
                    <span id="Span-IP4" class="placeholder">{{
                      $t("matches.halfTimeResult")
                    }}</span>
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
                      v-model="editedItem.rezultatNaKraju"
                      ref="input6"
                      @focus="popniPlaceholder('Span-IP5')"
                      @input="popniPlaceholder('Span-IP5')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP5',
                          editedItem.rezultatNaKraju
                        )
                      "
                    />
                    <span id="Span-IP5" class="placeholder">{{
                      $t("matches.theEndResult")
                    }}</span>
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
                      v-model="editedItem.zahteviUtakmice"
                      ref="input7"
                      @focus="popniPlaceholder('Span-IP6')"
                      @input="popniPlaceholder('Span-IP6')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP6',
                          editedItem.zahteviUtakmice
                        )
                      "
                    />
                    <span id="Span-IP6" class="placeholder">{{
                      $t("matches.matchRequirements")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <div class="row">
                <q-item style="width:100%">
                  <q-item-section class="custom-field one">
                    <!-- <q-select dense outlined :label="$t('matches.formation')" option-label="label" option-value="ident"
                      :options="listaFormacija" v-model="selektovnaFormacija" map-options
                      @input="otvoriDialogZaFormacije()" /> -->
                    <q-select
                      :readonly="readonly"
                      borderless
                      class="selektKlass"
                      option-value="value"
                      option-label="label"
                      :options="listaFormacija"
                      v-model="selektovnaFormacija"
                      ref="select5"
                      @focus="popniPlaceholder('Span-SL5')"
                      @input="
                        popniPlaceholder('Span-SL5');
                        otvoriDialogZaFormacije();
                      "
                      @blur="spustiPlaceholder('Span-SL5', selektovnaFormacija)"
                      map-options
                      :rules="[
                        val =>
                          (val !== null && val !== '' && val.length != 0) ||
                          $t('matches.pleaseSelectFormation')
                      ]"
                    />
                    <span
                      @click="$refs.select5.showPopup()"
                      id="Span-SL5"
                      class="placeholder placeholder1"
                      >{{ $t("matches.formation") }}</span
                    >
                  </q-item-section>
                </q-item>
                <!-- <q-btn flat round dense icon="more_vert"  @click="otvoriDialogZaFormacije()" /> -->
              </div>
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
            {{ this.naslov }}
            <!-- <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn> -->
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-input
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    v-model="editedItem.datum"
                    :label="$t('matches.dateAndTimeOfTheMatch')"
                  >
                  </q-input>
                </q-item-section>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    :label="$t('matches.matchType')"
                    :options="listaTipovaUtkmice"
                    v-model="editedItem.tipUtakmice"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.lokacija"
                      :label="$t('matches.location')"
                    />
                    <span class="placeholder">{{
                      $t("matches.location")
                    }}</span>
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
                      v-model="editedItem.temperatura"
                      :label="$t('matches.temperature')"
                    />
                    <span class="placeholder">{{
                      $t("matches.temperature")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                    :label="$t('matches.conditions')"
                    :options="listaUslova"
                    v-model="editedItem.usloviUtakmice"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                    :label="$t('matches.substrate')"
                    :options="listaPodloga"
                    v-model="editedItem.podlogaUtakmice"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.protivnik"
                      :label="$t('matches.opponent')"
                    />
                    <span class="placeholder">{{
                      $t("matches.opponent")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                    :label="$t('matches.levelAgainstTheOpponent')"
                    option-value="value"
                    option-label="label"
                    :options="listaNivoaPremaProtivniku"
                    v-model="editedItem.nivoPremaProtivniku"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.rezultatNaPoluvremenu"
                      :label="$t('matches.halfTimeResult')"
                    />
                    <span class="placeholder">{{
                      $t("matches.halfTimeResult")
                    }}</span>
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
                      v-model="editedItem.rezultatNaKraju"
                      :label="$t('matches.theEndResult')"
                    />
                    <span class="placeholder">{{
                      $t("matches.theEndResult")
                    }}</span>
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
                      v-model="editedItem.zahteviUtakmice"
                      :label="$t('matches.matchRequirements')"
                    />
                    <span class="placeholder">{{
                      $t("matches.matchRequirements")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <div class="row">
                <q-item style="width:100%">
                  <q-item-section>
                    <q-select
                      borderless
                      readonly
                      style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 14px !important;"
                      :label="$t('matches.formation')"
                      :options="listaFormacija"
                      v-model="selektovnaFormacija"
                      @input="otvoriDialogZaFormacije()"
                      map-options
                    />
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- dialog za formacije -->
    <q-dialog full-width full-height v-model="dialogZaFormacije" persistent>
      <q-card
        style="width: 1400px; max-width: 100vw; height:100%; overflow: hidden;"
      >
        <div class="sve">
          <q-btn
            icon="close"
            flat
            round
            dense
            style="
                position: absolute;
                right: 15px;
                top: 15px;
                color: white;
                font-size: 12px;
              "
            v-close-popup
          ></q-btn>

          <div class="levaStrana">
            <div class="selektFormacija">
              <div class="selektFormacijaStomak">
                {{ $t("matches.selectFormation") }}
                <span class="spanSelektFormacije">
                  {{ this.kojaFormacija }}
                </span>
                <span>
                  <q-select
                    class="selektFormacijaSelekt"
                    :options="listaFormacija"
                    v-model="selektovnaFormacija"
                    @input="otvoriDialogZaFormacije()"
                    hide-selected
                    style="color: red;"
                  />
                </span>
              </div>
            </div>
            <div class="arrow-down"></div>
            <!-- <div id="strelica">gfsdv</div> -->
            <div class="srednjiDeo">
              <div class="srednjiDeoStomak">
                <p
                  style="color:#323b62; font-family: PoppinsThin !important; font-weight: 600;"
                >
                  {{ $t("matches.players") }}:
                </p>
                <draggable
                  class="list-group"
                  :list="igraciSelekcije"
                  :move="checkMove"
                  group="people"
                  @change="log"
                  style="max-height: 580px; overflow-y: auto;"
                >
                  <div
                    class="list-group-item listicaPlejersa"
                    style="cursor: pointer"
                    v-for="element in igraciSelekcije"
                    :key="element.ident"
                  >
                    <span style="position: relative; left: 20px; top: 20%;">{{
                      element.ime +
                        " " +
                        element.prezime +
                        " [" +
                        element.primarnaPozicija.code +
                        "]"
                    }}</span>
                  </div>
                </draggable>
              </div>
            </div>
            <div class="dugmiciOkrugli">
              <div class="dugmiciOkrugliStomak">
                <q-btn
                  round
                  style="margin:5px; color: #323b62; background: #d0d9e7;"
                  @click="dialogZaFormacije = false"
                  type="submit"
                  size="20px"
                  v-close-popup
                >
                  <i
                    aria-hidden="true"
                    role="presentation"
                    style="font-weight:900;"
                    class="material-icons q-icon notranslate"
                    >close</i
                  >
                </q-btn>
                <q-btn
                  round
                  style="margin:5px; color: white; background: #ff4b00;"
                  @click="izabraneSuPozicijeUformaciji()"
                  type="submit"
                  icon="save"
                  size="20px"
                  :disable="dozvolaZaIzmenu"
                />
                <q-btn
                  round
                  style="margin:5px; color: white; background: #ff4b00;"
                  @click="resetujTeren()"
                  type="submit"
                  size="20px"
                  :disable="dozvolaZaIzmenu"
                >
                  <i class="fa fa-rotate-left" style="font-size:24px"></i>
                </q-btn>
              </div>
            </div>
          </div>

          <div class="desnaStrana">
            <div class="naslovTerena">
              {{ $t("matches.selectionOfPlayersInFormations") }}
            </div>
            <div class="formacijaTekst">
              {{ this.kojaFormacija }}
            </div>
            <div class="terenPozadina">
              <div class="terence">
                <div
                  class="col-3 divIgraca tranzicijaIgracTest"
                  v-for="(element1, index) in formacijaSifra"
                  :key="element1.code + '' + index"
                  :style="{ top: pos[index] + 'px', left: poss[index] + 'px' }"
                >
                  <div>
                    <div class="crniPravougaonik">
                      <p
                        v-if="
                          allTheLists[index].length == 0 ||
                            allTheLists[index][0].fotografija == ''
                        "
                        class="crniPravougaonikTekst"
                      >
                        {{ element1.code }}
                      </p>
                    </div>

                    <img
                      class="slikaDresa"
                      style="height: 64px; border-radius: 5px;"
                      :style="{
                        boxShadow: [
                          allTheLists[index].length == 0 ||
                          allTheLists[index][0].fotografija == ''
                            ? 'rgba(0, 0, 0, 0.35) 0px 5px 15px;'
                            : ''
                        ]
                      }"
                      :src="
                        allTheLists[index].length == 0 ||
                        allTheLists[index][0].fotografija == ''
                          ? 'https://img.icons8.com/external-photo3ideastudio-lineal-photo3ideastudio/64/000000/external-shirt-travel-checklist-photo3ideastudio-lineal-photo3ideastudio.png'
                          : allTheLists[index][0].fotografija
                      "
                    />
                  </div>
                  <draggable
                    class="list-group"
                    style="cursor: pointer; height: 85px; width: 170px; position: relative; left: -25px;"
                    :list="allTheLists[index]"
                    :move="checkMove"
                    group="people"
                    @change="log"
                  >
                    <div
                      class="list-group-item divDraggable"
                      v-for="element in allTheLists[index]"
                      :key="element.ident"
                    >
                      <!-- <img class="slikaIgraca" v-bind:src="element.fotografija" width="30px"
                         /> -->
                      <div
                        style="width: calc(100% - 50px);position: relative; top: -15px; text-align: center; display: inline-block"
                        v-bind:class="{ pozSpan: true }"
                      >
                        {{ element.ime.split("")[0] + ". " + element.prezime }}
                      </div>
                    </div>
                  </draggable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <!-- kraj dioaloga za foramcije -->

    <!-- dialog za utakmice -->
    <q-dialog v-model="dialogZaTokUtakmice" persistent>
      <q-card
        style="width: 1400px; max-width: 100vw; height:100%; overflow: hidden;"
      >
        <q-card-section style="height: 15%;">
          <div class="text-h6 row">
            <table style="width:100%">
              <tr>
                <div class="q-pa-md">
                  <div class="row">
                    <div class="col q-ma-xs">
                      <q-btn
                        class="dugmeNewNesto"
                        v-if="
                          !testPocetkaUtakmice &&
                            statusUtakmice == 'NIJE_POCELA'
                        "
                        :label="$t('matches.startOfTheMatch')"
                        icon="play_circle_outline"
                        @click="pocetakUtakmice()"
                        type="submit"
                        style="width:250px;"
                      >
                      </q-btn>
                      <q-btn
                        class="dugmeNewNesto"
                        v-else
                        disable
                        :label="$t('matches.startOfTheMatch')"
                        icon="play_circle_outline"
                        @click="pocetakUtakmice()"
                        type="submit"
                        style="width:250px;"
                      ></q-btn>
                    </div>
                    <div class="col q-ma-xs">
                      <q-btn
                        v-if="
                          statusUtakmice == 'TRAJE' &&
                            !statusPerioda &&
                            !cekaSePeriod
                        "
                        :label="$t('matches.startOfThePeriod')"
                        icon="play_circle_filled"
                        @click="pocetakPerioda()"
                        type="submit"
                        style="width:250px; background: #e5edf4; color: #3b5d99; "
                      />
                      <q-btn
                        v-else
                        disable
                        :label="$t('matches.startOfThePeriod')"
                        icon="play_circle_filled"
                        @click="pocetakPerioda()"
                        type="submit"
                        style="width:250px; background: #e5edf4; color: #3b5d99; "
                      />
                    </div>
                    <div class="col q-ma-xs">
                      <q-btn
                        v-if="
                          statusUtakmice == 'TRAJE' &&
                            statusPerioda &&
                            !cekaSePeriod
                        "
                        icon="pause_circle_filled"
                        :label="$t('matches.endOfThePeriod')"
                        @click="krajPerioda(0)"
                        type="submit"
                        style="width:250px; background: #e5edf4; color: #3b5d99; "
                      />
                      <q-btn
                        v-else
                        disable
                        icon="pause_circle_filled"
                        :label="$t('matches.endOfThePeriod')"
                        @click="krajPerioda(0)"
                        type="submit"
                        style="width:250px; background: #e5edf4; color: #3b5d99; "
                      />
                    </div>
                    <div class="col q-ma-xs">
                      <q-btn
                        v-if="
                          statusUtakmice == 'TRAJE' &&
                            statusPerioda &&
                            !cekaSePeriod
                        "
                        :label="$t('matches.endOfTheMatch')"
                        icon="stop"
                        @click="krajUtakmice()"
                        type="submit"
                        style="width:250px; background: #e5edf4; color: #3b5d99;  height: 100%;"
                      />
                      <q-btn
                        v-else
                        disable
                        :label="$t('matches.endOfTheMatch')"
                        icon="stop"
                        @click="krajUtakmice()"
                        type="submit"
                        style="width:250px; background: #e5edf4; color: #3b5d99;  height: 100%;"
                      />
                    </div>
                    <q-btn
                      icon="close"
                      flat
                      round
                      dense
                      style="float: right;"
                      @click="close1()"
                    ></q-btn>
                  </div>

                  <div class="row">
                    <div class="col q-ma-xs">
                      <p style="font-size: small; text-align:center;">
                        {{ this.vremePocetkaUtakmice }}
                      </p>
                    </div>
                    <div class="col q-ma-xs">
                      <p style="font-size: small; text-align:center;">
                        {{ this.vremeKrajaPrvogPoluvremena }}
                      </p>
                    </div>
                    <div class="col q-ma-xs">
                      <stopwatch ref="stopwatchRef"></stopwatch>
                    </div>
                    <div
                      class="col q-ma-xs"
                      style="display: flex; flex-direction: row;  align-items: center;"
                    >
                      <span style="font-size: 14pt">
                        {{ "period: " + brojPerioda }}
                      </span>
                    </div>
                    <div class="col q-ma-xs">
                      <p style="font-size: small; text-align:center;">
                        {{ this.vremePocetkaDrugogPoluvremena }}
                      </p>
                    </div>
                    <div class="col q-ma-xs">
                      <p style="font-size: small; text-align:center;">
                        {{ this.vremeKrajaUtakmice }}
                      </p>
                    </div>
                  </div>
                </div>
              </tr>
            </table>
          </div>
        </q-card-section>
        <q-separator style="background: #f5f8fb !important;"></q-separator>

        <q-card-section class="q-pt-none" style="height: 84%; padding: 0px;">
          <div class="row" style="height: 100%;">
            <div
              class=""
              style="background: #f5f8fb; padding: 10px; height: 100%; overflow: hidden auto;"
            >
              <div
                style="
                  height:35px;
                  margin: 15px auto;
                  background: rgba(0,0,0,0);
                  color: #ff4b00;
                  font-size: 15pt;
                  text-align:center;
                  border: 1px solid #ff4b00 !important;
                  border-radius: 5px;
                  "
              >
                <p>{{ $t("matches.players") }}</p>
                <div
                  class="list-group-item plavaKlasaTekst"
                  style="overflow: hidden; background: #e5edf4; height:35px; cursor: pointer; width: 200px; font-size: 13pt; font-weight: 600; margin-bottom: 7px; border-radius: 5px;"
                  v-for="element in igraciNaTerenu"
                  :key="element.ident"
                  @click="izaberiIgracaZaTokUtakmice(element)"
                  :style="[
                    selektovaniIgracZaTokUtakmice.id == element.id
                      ? {
                          height: visinaIzabranogIgraca + 10 + 'px',
                          width: sirinaIzabranogIgraca + 0 + 'px',
                          border: '1px solid #ff4b00',
                          fontSize: '14pt'
                        }
                      : {
                          height: visinaIzabranogIgraca + 'px',
                          width: sirinaIzabranogIgraca + 'px',
                          backgroundColor: '#e5edf4',
                          fontSize: '13pt'
                        }
                  ]"
                >
                  <img
                    v-bind:src="element.fotografija"
                    width="30px"
                    height="100%"
                    style="object-fit: cover; display: inline-block; float: left;"
                  />
                  <div
                    class="flex justify-left items-center"
                    style="font-size: 12pt; height: 100%; padding-left: 5px;"
                  >
                    <span
                      style="color:#000000; width: 40px; text-align: right; margin-right: 5px;"
                    >
                      {{ element.startniBroj }} -
                    </span>
                    <span class="center"
                      >{{ element.ime + " " + element.prezime }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="" style="width: 55%; height: 100%; overflow: auto;">
              <div id="elmentiZaPracenje">
                <template>
                  <div class="q-pa-md row items-start q-gutter-md">
                    <div
                      v-for="n in elementiZaPracenje"
                      :key="n.id"
                      class="col-xs-5 col-sm-3 col-md-2"
                      style="padding-right: 10px; width: 100%"
                    >
                      <q-card
                        class="full-height"
                        :style="{ backgroundColor: vratiBoju(n) }"
                      >
                        <div class="row">
                          <div class="col">
                            <q-btn
                              style="height: 100%; width:100%; background-color:green; font-weight: bold; font-size: 12pt;"
                              :key="azuriraj"
                              @click="dodajPlus(n)"
                            >
                              + {{ vratiBrojPluseva(n) }}
                            </q-btn>
                          </div>
                          <div class="col-10">
                            <div class="row full-height items-center">
                              <div
                                class="col-2"
                                v-if="n.tipElementa == 'PRINCIP_IGRE'"
                                style="font-size: large; font-weight: bold; padding: 7px;"
                              >
                                {{ $t("matches.principleOfTheGameScore") }}
                              </div>
                              <div
                                class="col-2"
                                v-else-if="n.tipElementa == 'TEHNIKA'"
                                style="font-size: large; font-weight: bold; padding: 7px;"
                              >
                                {{ $t("matches.techniqueScore") }}
                              </div>
                              <div
                                class="col-2"
                                v-else-if="n.tipElementa == 'TAKTIKA'"
                                style="font-size: large; font-weight: bold; padding: 7px;"
                              >
                                {{ $t("matches.tacticsScore") }}
                              </div>
                              <q-btn
                                round
                                icon="close"
                                style="background-color: white; color: black; width: 50px; height: 50px;"
                              >
                                <q-menu
                                  transition-show="rotate"
                                  transition-hide="rotate"
                                >
                                  <q-list style="min-width: 100px">
                                    <q-item
                                      clickable
                                      @click="izbaciElemetZaPracenje(n)"
                                      v-close-popup
                                    >
                                      <q-item-section>{{
                                        $t("matches.removeTheTrackingElement")
                                      }}</q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-menu>
                              </q-btn>
                              <div
                                class="col"
                                style="font-weight: bold; font-style: italic; padding: 10px;"
                              >
                                {{ n.nazivGrupe }}
                              </div>
                              <div class="col" style=" padding: 10px;">
                                <p style=" display:inline">
                                  {{ n.nazivStavke }}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="col">
                            <q-btn
                              style="height: 100%; width:100%; background-color:red; font-weight: bold; font-size: 12pt;"
                              @click="dodajMinus(n)"
                            >
                              - {{ vratiBrojMinusa(n) }}
                            </q-btn>
                          </div>
                        </div>
                      </q-card>
                    </div>
                  </div>
                </template>
              </div>
              <div
                style="
                    width: 55%;
                    max-height: 150px;
                    position: absolute;
                    bottom: 0px;
                    margin: 0px 5px;
                    box-shadow: rgb(0, 0, 0) 0px 7px 20px 1px inset;
                  "
                @click="dialogZaLogUtakmice = true"
              >
                <q-scroll-area style="height: 150px; max-width: 1000px; ">
                  <p
                    v-for="(log, index) in logData"
                    :key="'$' + index"
                    style="
                      text-align: center;
                      margin-bottom: 0px;
                    "
                    :style="{
                      fontSize: [10 + 'pt'],
                      // opacity: [(1 - index/10)],
                      padding: '2px',
                      margin: '5px 20px',
                      marginTop: [index == 0 ? '50px' : '5px']
                    }"
                  >
                    {{
                      formatThisDate(log.vremeUnosa, "DD/MM/YYYY HH:mm:ss") +
                        " - " +
                        (log.type || "") +
                        " - " +
                        (log.igrac || "") +
                        " - " +
                        (log.oCemSeRadi || "") +
                        ": " +
                        (log.ocenaIzvodjenja || "")
                    }}
                  </p>
                </q-scroll-area>
              </div>
            </div>
            <div
              style="background: #f5f8fb; width:20%; height: 100%; margin: 0 auto; margin-right: 0px; overflow: auto;"
            >
              <!-- background-color: #336699; -->
              <div
                style=" width: 200px; font-size: 13pt margin-bottom: 5px; border-radius: 5px; margin: 10px auto;"
              >
                <div class="list-group-item row">
                  <img
                    class="col"
                    v-bind:src="selektovaniIgracZaTokUtakmice.fotografija"
                    width="75px"
                    height="100px"
                    style="object-fit: cover; display: inline-block; float: left; padding-left: 5px; padding-top: 5px;"
                  />
                  <span
                    class="col"
                    style="
                              display: inline-block;
                              text-align: right;
                              vertical-align: 50%;
                              font-size: 13pt;
                              font-weight: bold;
                              color: #323b62;
                              padding: 7px;
                            "
                  >
                    {{
                      selektovaniIgracZaTokUtakmice.ime +
                        "\n" +
                        selektovaniIgracZaTokUtakmice.prezime +
                        "\n" +
                        selektovaniIgracZaTokUtakmice.nadimak
                    }}
                  </span>
                </div>
                <q-separator
                  style="background: #323b62 !important; margin: 10px auto;"
                ></q-separator>
                <!-- <div class="list-group-item row">
                          <span style="color: rgba(255, 255, 255, 0.6); font-size: 10pt">Trenutna Pozicija:</span>
                          <span style="color: white; font-size: 20pt; font-weight: bold">{{selektovaniIgracZaTokUtakmice.primarnaPozicija.name}}</span>
                        </div> -->
                <div class="row">
                  <div class="col-2 q-ma-xs">
                    <q-btn
                      :label="$t('matches.substitution')"
                      @click="dialogZaIzmenu = true"
                      style="background: #e5edf4; color: #323b62;  margin: 0px 2px; width: 200px;"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-2 q-ma-xs">
                    <q-btn
                      :label="$t('matches.goal')"
                      @click="padeGo()"
                      style="background: #e5edf4; color: #323b62;  margin: 0px 2px; width: 200px;"
                    />
                    <!-- dajBrojeve -->
                  </div>
                </div>
                <div class="row">
                  <div class="col-2 q-ma-xs">
                    <q-btn
                      :label="$t('matches.log')"
                      @click="dialogZaLogUtakmice = true"
                      style="background: #e5edf4; color: #323b62;  width: 200px;"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-2 q-ma-xs">
                    <q-btn
                      :label="$t('matches.assigningNumbersToPlayers')"
                      @click="otvoridialogZaBrojeve()"
                      style="background: #e5edf4; color: #323b62;  margin: 0px 2px; width: 200px;"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-2 q-ma-xs">
                    <q-btn
                      :label="$t('matches.addATrackingItem')"
                      @click="zaAddFja()"
                      style="background: #e5edf4; color: #323b62;  margin: 0px 2px; width: 200px;"
                    />
                  </div>
                </div>
                <!-- <div class="row" style="position:absolute; bottom: 10px;">
                    <div class="col-2 q-ma-xs">
                      <q-btn :label="$t('matches.close')" @click="zatvoriDialogZaUtakmice" type="submit" style="background: #e5edf4; color: #323b62;  margin: 0px 2px; width: 200px;" />
                    </div>
                  </div> -->
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- kraj dialoga za utakmice -->

    <!-- dialog za goooool -->
    <q-dialog v-model="dialogZaGoooool" persistent>
      <q-card style="width: 1000px; max-width: 90vw; overflow: hidden">
        <q-card-section style="padding-top: 0px;">
          <q-btn
            round
            dense
            flat
            icon="close"
            @click="zatvoriDialogZaGol"
            v-close-popup
            style="float: right"
          />
        </q-card-section>
        <q-separator style="background: #f5f8fb !important;"></q-separator>

        <q-card-section class="q-pt-none" style="margin-bottom: 20px">
          <div class="row justify-around" style="margin-top: 20px">
            <div class="col-3.5" style="overflow: visible; max-height:210px;">
              <div
                style="
                  background: rgba(0,0,0,0);
                  color: #ff4b00;
                  font-size: 15pt;
                  text-align:center;
                  "
              >
                <p
                  style="
                  padding: 2px 0px;
                  border: 1px solid #ff4b00 !important;
                  border-radius: 5px;
                "
                >
                  {{ $t("matches.players") }}
                </p>
                <div
                  style="
                  max-height:530px;
                  overflow-x: hidden;
                  overflow-y: auto;"
                >
                  <div
                    class="list-group-item plavaKlasaTekst"
                    style="background: #e5edf4; height:35px; width: 240px; font-size: 13pt; font-weight: 600; margin-bottom: 7px; border-radius: 5px;"
                    v-for="element in igraciNaTerenu"
                    :key="element.ident"
                    @click="izaberiIgracaZaGol(element)"
                    :style="[
                      selektovaniIgracZaGol.id == element.id
                        ? {
                            height: visinaIzabranogIgraca + 10 + 'px',
                            width: sirinaIzabranogIgraca + 'px',
                            border: '1px solid #ff4b00',
                            fontSize: '14pt'
                          }
                        : {
                            height: visinaIzabranogIgraca + 'px',
                            width: sirinaIzabranogIgraca + 'px',
                            backgroundColor: '#e5edf4',
                            fontSize: '13pt'
                          }
                    ]"
                  >
                    <img
                      v-bind:src="element.fotografija"
                      width="30px"
                      height="100%"
                      style="object-fit: cover; display: inline-block; float: left;"
                    />
                    <div
                      class="flex justify-left items-center"
                      style="font-size: 12pt; height: 100%; padding-left: 5px;"
                    >
                      <span
                        style="color:#000000; width: 40px; text-align: right; margin-right: 5px;"
                      >
                        {{ element.startniBroj }} -
                      </span>
                      <span class="center"
                        >{{ element.ime + " " + element.prezime }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-8">
              <div id="ajdi">
                <template>
                  <q-card-section class="q-pt-none">
                    <q-form class="q-gutter-md">
                      <q-list>
                        <!-- <q-item class="formular ponisti" style="">
                          <q-input dense outlined v-model="editedItem.datum" placeholder="Datum odigravanja utakmice" mask="date"
                            :rules="['date']" class="datumKlasa">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy8" transition-show="scale" transition-hide="scale">
                                  <q-date v-model="editedItem.datum" @input="() => $refs.qDateProxy8.hide()"></q-date>
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input>
                        </q-item> -->

                        <q-item style="padding:0px;">
                          <q-item-section class="custom-field one">
                            <q-select
                              borderless
                              class="selektKlass"
                              option-value="value"
                              option-label="label"
                              :options="listaTipovaGola"
                              v-model="gol.tipGola"
                              emit-value
                              map-options
                              ref="select6"
                              @focus="popniPlaceholder('Span-SL6')"
                              @input="
                                popniPlaceholder('Span-SL6');
                                izaberiIgracaZaGol('bla');
                              "
                              @blur="spustiPlaceholder('Span-SL6', gol.tipGola)"
                            />
                            <span
                              @click="$refs.select6.showPopup()"
                              id="Span-SL6"
                              class="placeholder placeholder1"
                              >{{ $t("matches.typeOfGoal") }}</span
                            >
                          </q-item-section>
                        </q-item>

                        <q-item style="padding:0px;">
                          <q-item-section class="custom-field one">
                            <q-select
                              borderless
                              class="selektKlass"
                              option-value="value"
                              option-label="label"
                              :options="listaKategorijaSituacijaKodGola"
                              v-model="gol.kategorijaSituacijeKodGola"
                              emit-value
                              map-options
                              ref="select7"
                              @focus="popniPlaceholder('Span-SL7')"
                              @input="popniPlaceholder('Span-SL7')"
                              @blur="
                                spustiPlaceholder(
                                  'Span-SL7',
                                  gol.kategorijaSituacijeKodGola
                                )
                              "
                            />
                            <span
                              @click="$refs.select7.showPopup()"
                              id="Span-SL7"
                              class="placeholder placeholder1"
                              >{{ $t("matches.goalSituationCategorty") }}</span
                            >
                          </q-item-section>
                        </q-item>

                        <q-item style="padding:0px;">
                          <q-item-section class="custom-field one">
                            <q-select
                              borderless
                              class="selektKlass"
                              option-value="value"
                              option-label="label"
                              :options="listaCimeJeDatGol"
                              v-model="gol.cimeJeDatGol"
                              emit-value
                              map-options
                              ref="select8"
                              @focus="popniPlaceholder('Span-SL8')"
                              @input="popniPlaceholder('Span-SL8')"
                              @blur="
                                spustiPlaceholder('Span-SL8', gol.cimeJeDatGol)
                              "
                            />
                            <span
                              @click="$refs.select8.showPopup()"
                              id="Span-SL8"
                              class="placeholder placeholder1"
                              >{{ $t("matches.theGoalIsGivenWith") }}</span
                            >
                          </q-item-section>
                        </q-item>

                        <q-item style="padding:0px">
                          <q-item-section>
                            <label class="custom-field one">
                              <q-input
                                hide-bottom-space
                                borderless
                                dense
                                placeholder=" "
                                v-model="gol.pozicijaSaKojeJePostignutGol"
                                @focus="popniPlaceholder('Span-IP7')"
                                @input="popniPlaceholder('Span-IP7')"
                                @blur="
                                  spustiPlaceholder(
                                    'Span-IP7',
                                    gol.pozicijaSaKojeJePostignutGol
                                  )
                                "
                              />
                              <span id="Span-IP7" class="placeholder">{{
                                $t(
                                  "matches.thePositionFromWhichTheGoalWasScored"
                                )
                              }}</span>
                            </label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-form>
                  </q-card-section>
                </template>
              </div>
            </div>
          </div>

          <div
            class="row"
            style="width:500px; position: relative; left: 400px; height: 320px; overflow: hidden"
          >
            <img src="../statics/images/teren1.jpg" style="width:495px;" />

            <div
              @click="kliknutJeTeren('a1')"
              id="a1-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('a2')"
              id="a2-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('a3')"
              id="a3-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('a4')"
              id="a4-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('a5')"
              id="a5-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('a6')"
              id="a6-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('a7')"
              id="a7-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('a8')"
              id="a8-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('a9')"
              id="a9-area"
              class="areaTerena"
            ></div>

            <div
              @click="kliknutJeTeren('b1')"
              id="b1-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('b2')"
              id="b2-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('b3')"
              id="b3-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('b4')"
              id="b4-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('b5')"
              id="b5-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('b6')"
              id="b6-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('b7')"
              id="b7-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('b8')"
              id="b8-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('b9')"
              id="b9-area"
              class="areaTerena"
            ></div>

            <div
              @click="kliknutJeTeren('c1')"
              id="c1-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('c2')"
              id="c2-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('c3')"
              id="c3-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('c4')"
              id="c4-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('c5')"
              id="c5-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('c6')"
              id="c6-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('c7')"
              id="c7-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('c8')"
              id="c8-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('c9')"
              id="c9-area"
              class="areaTerena"
            ></div>

            <div
              @click="kliknutJeTeren('d1')"
              id="d1-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('d2')"
              id="d2-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('d3')"
              id="d3-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('d4')"
              id="d4-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('d5')"
              id="d5-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('d6')"
              id="d6-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('d7')"
              id="d7-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('d8')"
              id="d8-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('d9')"
              id="d9-area"
              class="areaTerena"
            ></div>

            <div
              @click="kliknutJeTeren('e1')"
              id="e1-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('e2')"
              id="e2-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('e3')"
              id="e3-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('e4')"
              id="e4-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('e5')"
              id="e5-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('e6')"
              id="e6-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('e7')"
              id="e7-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('e8')"
              id="e8-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('e9')"
              id="e9-area"
              class="areaTerena"
            ></div>

            <div
              @click="kliknutJeTeren('f1')"
              id="f1-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('f2')"
              id="f2-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('f3')"
              id="f3-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('f4')"
              id="f4-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('f5')"
              id="f5-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('f6')"
              id="f6-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('f7')"
              id="f7-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('f8')"
              id="f8-area"
              class="areaTerena"
            ></div>
            <div
              @click="kliknutJeTeren('f9')"
              id="f9-area"
              class="areaTerena"
            ></div>
          </div>
          <div class="arrow">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </q-card-section>

        <q-card-section>
          <q-btn
            :label="$t('matches.cancel')"
            @click="zatvoriDialogZaGol"
            v-close-popup
            style="background-color: #f5f8fb; color: #323b62; width: 30%; margin-left: 10px;"
          />
          <q-btn
            :label="$t('matches.save')"
            @click="postDataDatGol"
            type="submit"
            v-close-popup
            style="background-color: #ff4b00; color: white; width: 30%; position: absolute; right: 10px;  margin-right: 10px;"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- kraj dialoga za goooooo -->

    <!-- dialog za izmenu -->
    <q-dialog v-model="dialogZaIzmenu" persistent>
      <q-card style="width: 700px; max-width: 90vw; height:600px">
        <q-card-section>
          <div class="row">
            <div class="col">
              <p
                style="
                width: 165px;
                padding: 5px;
                background: rgba(0,0,0,0);
                color: #ff4b00;
                font-size: 15pt;
                border: 1px solid #ff4b00 !important;
                border-radius: 5px;
                margin: 0px auto;
                text-align: center
              "
              >
                {{ $t("matches.inTheGame") }}
              </p>
            </div>

            <div class="col">
              <p
                style="
                width: 165px;
                padding: 5px;
                background: rgba(0,0,0,0);
                color: #ff4b00;
                font-size: 15pt;
                border: 1px solid #ff4b00 !important;
                border-radius: 5px;
                margin: 0px auto;
                text-align: center
              "
              >
                {{ $t("matches.onTheBench") }}
              </p>
            </div>
            <div class="col-1">
              <q-btn
                flat
                round
                dense
                @click="zatvoriDialogZaIzmenu"
                type="submit"
                icon="close"
                style="float: right"
                v-close-popup
              ></q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div
            class="row"
            style="width: 100%; height: 430px; overflow-y: scroll;"
          >
            <div class="col">
              <div
                class="list-group-item plavaKlasaTekst"
                style="
                  overflow: hidden;
                  background: #e5edf4;
                  height:50px;
                  width: 130px;
                  font-size: 13pt;
                  font-weight: 600;
                  border-radius: 5px;
                  margin: 15px auto;
                  text-align: center;
                  cursor:pointer;
                "
                v-for="element in igraciNaTerenu"
                :key="element.ident"
                @click="izaberiIgracaZaIzlaz(element)"
                :style="[
                  selektovaniIgracZaIzlaz.id == element.id
                    ? {
                        height: visinaIzabranogIgraca + 10 + 'px',
                        width: sirinaIzabranogIgraca + 'px',
                        border: '1px solid #ff4b00',
                        fontSize: '14pt'
                      }
                    : {
                        height: visinaIzabranogIgraca + 'px',
                        width: sirinaIzabranogIgraca + 'px',
                        backgroundColor: '#e5edf4',
                        fontSize: '13pt'
                      }
                ]"
              >
                <img
                  v-bind:src="element.fotografija"
                  width="30px"
                  height="100%"
                  style="object-fit: cover; display: inline-block; float: left;"
                />
                <div
                  class="flex justify-left items-center"
                  style="font-size: 12pt; height: 100%; padding-left: 5px;"
                >
                  <span
                    style="color:#000000; width: 40px; text-align: right; margin-right: 5px;"
                  >
                    {{ element.startniBroj }} -
                  </span>
                  <span class="center"
                    >{{ element.ime + " " + element.prezime }}
                  </span>
                </div>
              </div>
            </div>

            <div class="col">
              <div
                class="list-group-item plavaKlasaTekst"
                style="
                  background: #e5edf4;
                  height:50px;
                  width: 130px;
                  font-size: 13pt;
                  font-weight: 600;
                  border-radius: 5px;
                  margin: 15px auto;
                  text-align: center;
                  cursor:pointer;
                "
                v-for="element in igraciNaKlupi"
                :key="element.ident"
                @click="izaberiIgracaZaUlaz(element)"
                :style="[
                  selektovaniIgracZaUlaz.id == element.id
                    ? {
                        height: visinaIzabranogIgraca + 10 + 'px',
                        width: sirinaIzabranogIgraca + 15 + 'px',
                        border: '1px solid #ff4b00',
                        fontSize: '14pt'
                      }
                    : {
                        height: visinaIzabranogIgraca + 'px',
                        width: sirinaIzabranogIgraca + 'px',
                        backgroundColor: '#e5edf4',
                        fontSize: '13pt'
                      }
                ]"
              >
                <img
                  v-bind:src="element.fotografija"
                  width="30px"
                  height="100%"
                  style="object-fit: cover; display: inline-block; float: left;"
                />
                <div
                  class="flex justify-left items-center"
                  style="font-size: 12pt; height: 100%; padding-left: 5px;"
                >
                  <span
                    style="color:#000000; width: 40px; text-align: right; margin-right: 5px;"
                  >
                    {{ element.startniBroj }} -
                  </span>
                  <span class="center"
                    >{{ element.ime + " " + element.prezime }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6 row">
            <table style="width:100%">
              <tr>
                <div class="row">
                  <div style="width: 100%">
                    <!-- <q-btn :label="$t('matches.cancel')" @click="zatvoriDialogZaIzmenu"  color="primary"
                      v-close-popup style="margin: 0px 2px;" />
                    <q-btn :label="$t('matches.substitute')" @click="postZemenaIgraca" type="submit" color="primary"
                      v-close-popup style="margin: 0px 2px; float: right;" :disable="!izabraneSuIzmene"/> -->
                    <q-btn
                      :label="$t('matches.cancel')"
                      @click="zatvoriDialogZaIzmenu"
                      type="submit"
                      style="background-color: #f5f8fb; color: #323b62; width: 30%; margin-left: 10px;"
                      v-close-popup
                    ></q-btn>
                    <q-btn
                      :label="$t('matches.substitute')"
                      @click="postZemenaIgraca"
                      type="submit"
                      :disable="!izabraneSuIzmene"
                      style="background-color: #ff4b00; color: white; width: 30%; position: absolute; right: 10px;  margin-right: 10px;"
                      v-close-popup
                    ></q-btn>
                  </div>
                </div>
              </tr>
            </table>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- kraj dialoga za izmenu -->

    <!-- dialog za dodeljivanje brojeva na utakmici -->
    <q-dialog v-model="dialogZaBrojeve" persistent>
      <q-card style="width: 6000px; max-width: 50vw; height:100%">
        <q-card-section>
          <!-- tabela igraca      -->

          <q-table
            ref="table"
            :title="$t('matches.players')"
            :data="igraciNaTekmi"
            :hide-header="mode === 'grid'"
            :columns="columnsIgraci"
            row-key="id"
            :grid="mode == 'grid'"
            :filter="filterIgraci"
            :pagination.sync="pagination1"
            :rows-per-page-label="$t('table.rowsPerPage')"
            :no-data-label="$t('table.noData')"
            :loading-label="$t('table.loadingLabel')"
            :no-results-label="$t('table.noResultLabel')"
            class="mojaTabela mojaTabela2 my-sticky-header-table"
            style="
            background-color: unset;
            box-shadow: unset;
          "
            table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
            color="blue-10"
          >
            <template v-slot:top-right="props">
              <!-- <q-input outlined dense debounce="300" v-model="filterIgraci" :placeholder="$t('matches.search')">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input> -->
              <q-input
                outlined
                class="dugmeSearch"
                dense
                debounce="300"
                style="width: 220px !important"
                v-model="filterIgraci"
              >
                <!--  :placeholder="$t('table.search')" -->
                <template v-slot:append>
                  <q-icon name="search" color="blue-10" />
                </template>
              </q-input>

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
                  mode === "grid" ? $t("matches.list") : $t("matches.grid")
                }}</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                id="dugmeBrisi"
                icon="save"
                @click="dodeliBroj1"
                v-close-popup
                style="margin-left: 25px; "
              />
              <q-btn
                flat
                round
                dense
                id="dugmeBrisi"
                icon="close"
                @click="dialogZaBrojeve = false"
                v-close-popup
                style="margin-left: 25px; "
              />
            </template>
            <template v-slot:body-cell-id="props1">
              <q-td :props="props1">
                <div class="q-gutter-sm">
                  <q-input
                    type="text"
                    outlined
                    :key="props1.value"
                    :ref="'pomocniInputRefZaBrojeve' + props1.value"
                    dense
                    debounce="300"
                    v-model="dodeljenBroj[props1.value + '']"
                    :model-value="props1.value + ''"
                    @input="testiccc(props1.value)"
                    placeholder=""
                    :rules="[
                      val =>
                        val == '' ||
                        Object.values(dodeljenBroj).filter(e => e == val)
                          .length <= 1 ||
                        $t('matches.playersNeedToHaveDifferentNumbers')
                    ]"
                  >
                  </q-input>
                </div>
              </q-td>
            </template>

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

            <template v-slot:body-cell-playerPlayingStatus="props">
              <q-td :props="props">
                <q-badge
                  style="margin-left: 10px; padding: 10px"
                  color="purple"
                  v-if="props.row.uigri"
                >
                  {{ $t("matches.field") }}
                </q-badge>
                <q-badge
                  style="margin-left: 10px; padding: 10px"
                  color="red"
                  v-else
                >
                  {{ $t("matches.bench") }}
                </q-badge>

                <q-badge
                  style="margin-left: 10px; padding: 10px"
                  color="blue-9"
                  v-if="props.row.pozicija == 'PRIMARNA'"
                >
                  PRI
                </q-badge>

                <q-badge
                  style="margin-left: 10px; padding: 10px"
                  color="blue-5"
                  v-if="props.row.pozicija == 'ALTERNATIVNA'"
                >
                  ALT
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- kraj dialog-a za dodeljivanje brojeva na utakmici -->

    <!-- dialog za log utakmice -->
    <q-dialog persistent v-model="dialogZaLogUtakmice">
      <!-- <q-card style="width: 1300px; max-width: 90vw; height:600px"> -->
      <q-card
        style="
          width: 1400px;
          max-width: 90vw;
          border-radius: 5px;
          box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7);
          color: #323b62;"
      >
        <q-card-section style="padding: 0px;">
          <q-btn
            icon="close"
            flat
            round
            dense
            style="float: right; z-index: 10000; margin: 25px 25px 0px 0px"
            v-close-popup
          ></q-btn>
          <div class="text-h6 row" style="text-align: center;"></div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->

        <q-card-section class="q-pt-none q-pb-none">
          <logUtakmice
            v-bind:ajdiTekme="ajDiUtakmice"
            v-bind:igraciSelekcije="igraciSelekcije"
          ></logUtakmice>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- kraj dialoga za log utakmice -->

    <!-- dialog za dodavanje stavko koje se prate -->
    <q-dialog v-model="dialogZaDodavanjeStavki" persistent>
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
            flat
            round
            dense
            style="float: right;"
            v-close-popup
          ></q-btn>
          <div class="text-h6" style="text-align: center;">
            {{ $t("matches.selectItemsYouWantToTrack") }}
            <!-- <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn> -->
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="listaTipova"
                    v-model="editedItemZaStavke.type"
                    emit-value
                    map-options
                    ref="select8"
                    @focus="popniPlaceholder('Span-SL8')"
                    @input="
                      popniPlaceholder('Span-SL8');
                      promenaTipa();
                    "
                    @blur="
                      spustiPlaceholder('Span-SL8', editedItemZaStavke.type)
                    "
                  />
                  <span
                    @click="$refs.select8.showPopup()"
                    id="Span-SL8"
                    class="placeholder placeholder1"
                    >{{ $t("matches.typeOfEvent") }}</span
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    borderless
                    :readonly="editedItemZaStavke.type == undefined"
                    :disabled="editedItemZaStavke.type == undefined"
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="dataStavke"
                    v-model="editedItemZaStavke.oCemSeRadi"
                    map-options
                    ref="select9"
                    @focus="popniPlaceholder('Span-SL9')"
                    @input="popniPlaceholder('Span-SL9')"
                    @blur="
                      spustiPlaceholder(
                        'Span-SL9',
                        editedItemZaStavke.oCemSeRadi
                      )
                    "
                  />
                  <span
                    @click="$refs.select9.showPopup()"
                    id="Span-SL9"
                    class="placeholder placeholder1"
                    >{{ $t("matches.item") }}</span
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn
            :label="$t('administration.user.cancel')"
            @click="
              dialogZaDodavanjeStavki = false;
              editedItemZaStavke = {};
            "
            type="submit"
            style="background-color: #f5f8fb; color: #323b62; width: 20%; margin: 10px;"
            v-close-popup
          ></q-btn>
          <q-btn
            :label="$t('matches.addATrackingItem')"
            @click="
              dodajElementZaPracenje();
              editedItemZaStavke = {};
            "
            type="submit"
            style="background-color: #ff4b00; color: white; width: 20%; margin: 10px;"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- kraj dialoga za dodavanje stavko koje se prate -->
  </q-page>
</template>

<script>
import logUtakmice from "../components/logUtakmiceKomponenta";
import stopwatch from "../components/stopwatch";
import draggable from "vuedraggable";
import { date } from "quasar";

import { exportFile } from "quasar";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  display: "Two Lists",
  order: 1,
  components: {
    draggable,
    logUtakmice,
    stopwatch
  },
  props: ["selektovaniIgrac"],
  data() {
    return {
      readonly: false,
      brojPerioda: 0,
      loadingUtakmice: false,
      dodeljenBroj: {},
      ajDiUtakmice: null, // Ident truntne utakmice
      izabraneSuIzmene: 0,
      azuriraj: 0,
      vremePocetkaUtakmice: "",
      vremeKrajaUtakmice: "",
      vremeKrajaPrvogPoluvremena: "",
      vremePocetkaDrugogPoluvremena: "",
      visinaIzabranogIgraca: 30,
      sirinaIzabranogIgraca: 300, //123,
      brojPluseva: 0,
      brojMinusa: 0,
      datum: "",
      vreme: "",
      editedIndexZaStavke: 0,
      editedItemZaStavke: {},
      statusUtakmice: "", //enum: NIJE_POCELA, TRAJE, ZAVRSENA
      statusPerioda: false,
      cekaSePeriod: false,

      // igraci
      selected: [],
      filterIgraci: "",
      columnsIgraci: [
        {
          name: "playerPlayingStatus",
          required: true,
          label: this.$t("matches.playerPlayingStatus"),
          align: "left",
          field: "playerPlayingStatus",
          sortable: true
        },
        {
          name: "Ime",
          required: true,
          label: this.$t("matches.firstName"),
          align: "left",
          field: "ime",
          sortable: true
        },
        {
          name: "prezime",
          align: "left",
          label: this.$t("matches.lastName"),
          field: "prezime",
          sortable: true
        },
        // {
        //   name: "broj",
        //   align: "left",
        //   label: this.$t('matches.number'),
        //   field: "broj",
        //   sortable: true
        // },
        {
          name: "id",
          align: "left",
          label: this.$t("matches.positions"),
          field: "id",
          sortable: true
        }
      ],

      // data za teren

      selektovnaFormacija: null,

      listaIgracaUformaciji: [],
      pos: [
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200"
      ],
      poss: [
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200"
      ],
      formacijaSifra: [],
      formacija212posTop: [
        "100",
        "260",
        "260",
        "420",
        "580",
        "580",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200"
      ],
      formacija212posLeft: [
        "498",
        "648",
        "348",
        "498",
        "698",
        "298",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200"
      ],
      formacija131posTop: [
        "100",
        "260",
        "420",
        "420",
        "420",
        "580",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200"
      ],
      formacija131posLeft: [
        "498",
        "498",
        "498",
        "248",
        "748",
        "498",
        "-200",
        "-200",
        "-200",
        "-200",
        "-200"
      ],
      formacija312posTop: [
        "100",
        "260",
        "260",
        "260",
        "420",
        "580",
        "580",
        "-200",
        "-200",
        "-200",
        "-200"
      ],
      formacija312posLeft: [
        "498",
        "498",
        "248",
        "748",
        "498",
        "648",
        "348",
        "-200",
        "-200",
        "-200",
        "-200"
      ],
      formacija213posTop: [
        "100",
        "260",
        "260",
        "420",
        "540",
        "540",
        "580",
        "-200",
        "-200",
        "-200",
        "-200"
      ],
      formacija213posLeft: [
        "498",
        "618",
        "368",
        "498",
        "248",
        "748",
        "498",
        "-200",
        "-200",
        "-200",
        "-200"
      ],
      formacija313posTop: [
        "100",
        "260",
        "260",
        "260",
        "420",
        "540",
        "540",
        "580",
        "-200",
        "-200",
        "-200"
      ],
      formacija313posLeft: [
        "498",
        "498",
        "298",
        "698",
        "498",
        "248",
        "748",
        "498",
        "-200",
        "-200",
        "-200"
      ],
      formacija323posTop: [
        "100",
        "260",
        "260",
        "260",
        "420",
        "420",
        "540",
        "540",
        "580",
        "-200",
        "-200"
      ],
      formacija323posLeft: [
        "498",
        "498",
        "298",
        "698",
        "368",
        "628",
        "248",
        "748",
        "498",
        "-200",
        "-200"
      ],
      formacija332posTop: [
        "100",
        "260",
        "260",
        "260",
        "420",
        "420",
        "420",
        "580",
        "580",
        "-200",
        "-200"
      ],
      formacija332posLeft: [
        "498",
        "498",
        "298",
        "698",
        "498",
        "248",
        "748",
        "618",
        "378",
        "-200",
        "-200"
      ],
      formacija352posTop: [
        "100",
        "260",
        "260",
        "260",
        "420",
        "420",
        "420",
        "420",
        "450",
        "580",
        "580"
      ],
      formacija352posLeft: [
        "498",
        "498",
        "698",
        "298",
        "858",
        "138",
        "678",
        "318",
        "498",
        "698",
        "298"
      ],
      formacija4231posTop: [
        "100",
        "200",
        "200",
        "200",
        "200",
        "360",
        "360",
        "460",
        "460",
        "460",
        "620"
      ],
      formacija4231posLeft: [
        "498",
        "618",
        "378",
        "188",
        "808",
        "618",
        "378",
        "498",
        "748",
        "248",
        "498"
      ],
      formacija433posTop: [
        "100",
        "230",
        "230",
        "230",
        "230",
        "360",
        "400",
        "400",
        "560",
        "560",
        "600"
      ],
      formacija433posLeft: [
        "498",
        "618",
        "378",
        "188",
        "808",
        "498",
        "298",
        "698",
        "298",
        "698",
        "498"
      ],
      formacija442rPosTop: [
        "100",
        "200",
        "200",
        "200",
        "200",
        "320",
        "400",
        "400",
        "480",
        "580",
        "580"
      ],
      formacija442rPosLeft: [
        "498",
        "618",
        "378",
        "188",
        "808",
        "498",
        "308",
        "688",
        "498",
        "768",
        "228"
      ],
      formacija442posTop: [
        "100",
        "260",
        "260",
        "260",
        "260",
        "420",
        "420",
        "420",
        "420",
        "580",
        "580"
      ],
      formacija442posLeft: [
        "498",
        "594",
        "402",
        "212",
        "784",
        "378",
        "618",
        "168",
        "828",
        "722",
        "274"
      ],
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      list8: [],
      list9: [],
      list10: [],
      list11: [],
      allTheLists: [],
      // kraj data za teren
      selektovaniIgracZaTokUtakmice: {
        ime: this.$t("matches.selectPlayer"),
        prezime: "",
        primarnaPozicija: { name: "" },
        nadimak: ""
      },
      dataZaIgraceZaTokUtakmice: [],
      dialogZaFormacije: false,
      dialogZaTokUtakmice: false,
      dialogZaGoooool: false,
      dialogZaIzmenu: false,
      dialogZaLogUtakmice: false,
      dialogZaBrojeve: false,
      fotkaZaBroj: "",
      igracZaBroj: "",
      idIgracaZaBroj: null,
      brojZaIgraca: "",
      dialogZaDodavanjeStavki: false,
      igraciSelekcije: [],
      igraciSelekcijeKopija: [],
      igraciNaTerenu: [{ id: -1 }],
      igraciNaKlupi: [],
      igraciNaTekmi: [],
      selektovaniIgracZaIzlaz: { id: -1 },
      selektovaniIgracZaUlaz: { id: -1 },
      selektovaniIgracZaGol: { id: null },
      selektovaniTim: null,
      splitterModel: 20,
      filter: "",
      naslov: "Utakmica",
      dozvolaZaIzmenu: false,
      listaTipovaUtkmice: [
        {
          label: this.$t("matches.preparationFriendly"),
          value: "PRIPREMNA_PRIJATELJSKA"
        },
        {
          label: this.$t("matches.championship"),
          value: "PRVENSTVENA"
        },
        {
          label: this.$t("matches.cup"),
          value: "KUP"
        },
        {
          label: this.$t("matches.tournament"),
          value: "TURNIR"
        },
        {
          label: this.$t("matches.international"),
          value: "MEDJUNARODNA"
        }
      ],
      listaNivoaPremaProtivniku: [
        {
          label: this.$t("matches.dominant"),
          value: "DOMINANTAN"
        },
        {
          label: this.$t("matches.equal"),
          value: "IZJEDNACEN"
        }
      ],
      listaUslova: [
        {
          label: this.$t("matches.indoors"),
          value: "U_ZATVORENOM_PROSTORU"
        },
        {
          label: this.$t("matches.dry"),
          value: "SUVO"
        },
        {
          label: this.$t("matches.rain"),
          value: "KISA"
        },
        {
          label: this.$t("matches.snow"),
          value: "SNEG"
        }
      ],
      listaPodloga: [
        {
          label: this.$t("matches.grass"),
          value: "TRAVA"
        },
        {
          label: this.$t("matches.artificialGrass"),
          value: "VESTACKA_TRAVA"
        },
        {
          label: this.$t("matches.parquet"),
          value: "PARKET"
        }
      ],
      listaFormacija1: [
        {
          label: "2-1-2",
          value: "2-1-2"
        },
        {
          label: "1-3-1",
          value: "1-3-1"
        },
        {
          label: "3-1-2",
          value: "3-1-2"
        },
        {
          label: "2-1-3",
          value: "2-1-3"
        },
        {
          label: "3-1-3",
          value: "3-1-3"
        },
        {
          label: "3-2-3",
          value: "3-2-3"
        },
        {
          label: "3-3-2",
          value: "3-3-2"
        },
        {
          label: "3-5-2",
          value: "3-5-2"
        },
        {
          label: "4-2-3-1",
          value: "4-2-3-1"
        },
        {
          label: "4-3-3",
          value: "4-3-3"
        },
        {
          label: this.$t("matches.romb"),
          value: "4-4-2 diamond"
        },
        {
          label: "4-4-2",
          value: "4-4-2"
        }
      ],
      listaKategorijaSituacijaKodGola: [
        {
          label: this.$t("matches.break"),
          value: "PREKID"
        },
        {
          label: this.$t("matches.penalty"),
          value: "PENAL"
        },
        {
          label: this.$t("matches.counterAttack"),
          value: "KONTRANAPAD"
        },
        {
          label: this.$t("matches.continuousAttack"),
          value: "KONTINUIRANI_NAPAD"
        },
        {
          label: this.$t("matches.individualAction"),
          value: "INDIVIDUALNA_AKCIJA"
        },
        {
          label: this.$t("matches.opponentsMistake"),
          value: "GRESKA_PROTIVNIKA"
        },
        {
          label: this.$t("matches.penalty"),
          value: "PENAL"
        }
      ],
      listaTipova: [
        {
          label: this.$t("matches.techniqueScore"),
          value: "TEHNIKA"
        },
        {
          label: this.$t("matches.tacticsScore"),
          value: "TAKTIKA"
        },
        {
          label: this.$t("matches.principleOfTheGameScore"),
          value: "PRINCIP_IGRE"
        }
      ],
      dataStavke: [],
      gol: {
        cimeJeDatGol: "",
        datum: "",
        identIgraca: 0,
        identUtakmice: 0,
        kategorijaSituacijeKodGola: "",
        pozicijaSaKojeJePostignutGol: "",
        tipGola: ""
      },
      listaCimeJeDatGol: [
        {
          label: this.$t("matches.head"),
          value: "Glava"
        },
        {
          label: this.$t("matches.foot"),
          value: "Noga"
        },
        {
          label: this.$t("matches.other"),
          value: "Ostalo"
        }
      ],
      listaTipovaGola: [
        {
          label: this.$t("matches.recived"),
          value: "Primljen"
        },
        {
          label: this.$t("matches.achived"),
          value: "Postignut"
        },
        {
          label: this.$t("matches.autoGoal"),
          value: "Autogol"
        }
      ],
      listaFormacija: [],
      customer: {},
      new_customer: false,
      editedIndex: -1,
      editedItem: {
        datum: "",
        formacija: [],
        identSelekcija: 0,
        identStrucniStab: 0,
        lokacija: "",
        nivoPremaProtivniku: "",
        podlogaUtakmice: "",
        pozicijaUFormacijiUtakmiceList: [],
        protivnik: "",
        rezultatNaKraju: "",
        rezultatNaPoluvremenu: "",
        temperatura: 0,
        tipUtakmice: "",
        usloviUtakmice: "",
        zahteviUtakmice: ""
      },
      defaultItem: {
        datum: "",
        formacija: [],
        identSelekcija: 0,
        identStrucniStab: 0,
        lokacija: "",
        nivoPremaProtivniku: "",
        podlogaUtakmice: "",
        pozicijaUFormacijiUtakmiceList: [],
        protivnik: "",
        rezultatNaKraju: "",
        rezultatNaPoluvremenu: "",
        temperatura: 0,
        tipUtakmice: "",
        usloviUtakmice: "",
        zahteviUtakmice: ""
      },
      mode: "list",
      menu: [
        {
          label: this.$t("matches.technique"),
          meni1: {
            label: this.$t("matches.group1"),
            meni2: {
              label: this.$t("matches.item1"),
              id: 1
            }
          }
        },
        {
          label: this.$t("matches.tactics"),
          to: "/dashboard",
          iconName: "drafts"
        },
        {
          label: this.$t("matches.principlesOfTheGame"),
          to: "/administracija",
          iconName: "star"
        }
      ],
      elementiZaPracenje: [],
      elementiZaPracenje1: [
        {
          id: 1,
          tipElementa: "Tehnika",
          identElementa: "16",
          nazivGrupe: "Kontrola lopte",
          nazivStavke: "Povlačenje đonom 90°"
        },
        {
          id: 2,
          tipElementa: "Tehnika",
          identElementa: "216",
          nazivGrupe: "Vođenje",
          nazivStavke: "Sredinom stopala"
        },
        {
          id: 3,
          tipElementa: "Taktika",
          identElementa: "189",
          nazivGrupe: "Sredstva taktike napada - induvidualna",
          nazivStavke: "Driblanje"
        },
        {
          id: 4,
          tipElementa: "Princip igre",
          identElementa: "25",
          nazivGrupe: "",
          nazivStavke: "Princip Gavrilo"
        }
      ],
      columns: [
        {
          name: "datum",
          required: true,
          label: this.$t("matches.dateOfTheGame"),
          align: "left",
          field: "datum",
          sortable: true,
          format: val => date.formatDate(val, "DD/MM/YYYY - HH:mm")
        },
        {
          name: "formacija",
          align: "left",
          label: this.$t("matches.formation"),
          field: "formacijaName",
          sortable: true
        },
        {
          name: "protivnik",
          align: "left",
          label: this.$t("matches.opponent"),
          field: "protivnik",
          sortable: true
        },
        {
          name: "rezultatNaKraju",
          align: "left",
          label: this.$t("matches.theEndResult"),
          field: "rezultatNaKraju",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t("matches.action"),
          field: "action",
          sortable: true
        }
      ],
      data: [],
      kojaFormacija: "",
      dataPreview: false,
      pagination: {
        rowsPerPage: 10
      },
      pagination1: {
        sortBy: "playerPlayingStatus",
        descending: true,
        rowsPerPage: 10000
      },
      logData: [],
      testPocetkaUtakmice: false
    };
  },
  watch: {
    selektovaniIgrac: function(val) {
      this.selektovaniTim = val.selektovaniTim;
      this.promenaTima();
      console.log(this.selektovaniTim);
    },
    dialogZaLogUtakmice: function(val) {
      if (!val) this.getLogData();
    }
  },
  mounted() {
    if (
      this.selektovaniIgrac != undefined &&
      this.selektovaniIgrac.selektovaniTim != undefined
    ) {
      this.selektovaniTim = this.selektovaniIgrac.selektovaniTim;
      this.promenaTima();
    }
    //this.editedItem.datum = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    this.getDataPozicije(); //pozicije
    this.getDataFormacije(); //formacije

    // change table height
    var temp = document.querySelectorAll(".q-table__middle");
    for (var i = 0; i < temp.length; i++)
      temp[i].style.setProperty("max-height", "calc(100vh - 200px)");
  },
  methods: {
    formatThisDate(a, b) {
      console.log("ASDGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
      console.log(a);
      console.log(b);
      console.log(date.formatDate(a, b));
      console.log(
        date.formatDate(
          new Date(new Date(a).getTime() + 2 * 60 * 60 * 1000).toString(),
          b
        )
      );
      return date.formatDate(
        new Date(new Date(a).getTime() + 2 * 60 * 60 * 1000).toString(),
        b
      );
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o elementim (log)
    //........................................
    getLogData() {
      if (this.ajDiUtakmice == null) return;
      console.log("POZVAO SAM LOG DATA");
      console.log("POZVAO SAM LOG DATA");
      console.log("POZVAO SAM LOG DATA");
      let linkStr =
        this.$apiPutanja + "/element-sa-utakmice/utakmica/" + this.ajDiUtakmice;
      this.loadingLog = true;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(response => {
          this.logData = response.data.map(this.dajLog);

          console.log(this.logData.sort().reverse());
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
          this.loadingLog = false;
        });
    },
    dajLog(item) {
      debugger;

      let _bazaTehnikeSifrarnikStavke =
        item.bazaTehnikeSifrarnikStavke == null
          ? ""
          : item.bazaTehnikeSifrarnikStavke.bazaTehnikeSifrarnikGrupe.grupa +
            "-" +
            item.bazaTehnikeSifrarnikStavke.naziv;
      let _bazaTaktikeSifrarnikStavke =
        item.bazaTaktikeSifrarnikStavke == null
          ? ""
          : item.bazaTaktikeSifrarnikStavke.bazaTaktikeSifrarnikGrupe.grupa +
            "-" +
            item.bazaTaktikeSifrarnikStavke.naziv;
      let _principIgre = item.principIgre == null ? "" : item.principIgre.naziv;

      let _bazaTehnikeSifrarnikStavkeID =
        item.bazaTehnikeSifrarnikStavke == null
          ? ""
          : item.bazaTehnikeSifrarnikStavke.ident;
      let _bazaTaktikeSifrarnikStavkeID =
        item.bazaTaktikeSifrarnikStavke == null
          ? ""
          : item.bazaTaktikeSifrarnikStavke.ident;
      let _principIgreID =
        item.principIgre == null ? "" : item.principIgre.ident;

      let _igrac =
        item.igrac == null ? "" : item.igrac.ime + " " + item.igrac.prezime;
      let _igracID = item.igrac == null ? "" : item.igrac.id;

      let nekoIme = item.strucniStab.ime == null ? "" : item.strucniStab.ime;
      let nekoPrezime =
        item.strucniStab.prezime == null ? "" : item.strucniStab.prezime;
      let neko = nekoIme + " " + nekoPrezime;

      let stavkaKojaSeOcenjuje = null;
      if (_bazaTehnikeSifrarnikStavke != "")
        stavkaKojaSeOcenjuje = _bazaTehnikeSifrarnikStavke;
      if (_bazaTaktikeSifrarnikStavke != "")
        stavkaKojaSeOcenjuje = _bazaTaktikeSifrarnikStavke;
      if (_principIgre != "") stavkaKojaSeOcenjuje = _principIgre;

      return {
        ident: item.ident,
        vremeUnosa: item.vremeUnosa,
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
        ocenaIzvodjenja: item.ocenaIzvodjenja
      };
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
    otvoriPreviewDialog(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem.datum);
      this.editedItem.datum =
        this.editedItem.datum
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.datum
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.datum
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0] +
        " " +
        this.editedItem.datum.split("T")[1].split(":")[0] +
        ":" +
        this.editedItem.datum.split("T")[1].split(":")[1];
      this.readonly = true;
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    checkMove(evt) {
      console.log("evt");
      console.log("evt");
      console.log("evt");
      console.log(evt);
      console.log("evt");
      if (evt.relatedContext.list != this.igraciSelekcije)
        if (evt.relatedContext.list.length > 1) return false;
      // debugger
    },
    kliknutJeTeren(pos) {
      switch (pos) {
        case "a1":
          this.gol.pozicijaSaKojeJePostignutGol = "a1";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("a1-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "a2":
          this.gol.pozicijaSaKojeJePostignutGol = "a2";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("a2-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "a3":
          this.gol.pozicijaSaKojeJePostignutGol = "a3";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("a3-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "a4":
          this.gol.pozicijaSaKojeJePostignutGol = "a4";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("a4-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "a5":
          this.gol.pozicijaSaKojeJePostignutGol = "a5";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("a5-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "a6":
          this.gol.pozicijaSaKojeJePostignutGol = "a6";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("a6-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "a7":
          this.gol.pozicijaSaKojeJePostignutGol = "a7";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("a7-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "a8":
          this.gol.pozicijaSaKojeJePostignutGol = "a8";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("a8-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "a9":
          this.gol.pozicijaSaKojeJePostignutGol = "a9";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("a9-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "b1":
          this.gol.pozicijaSaKojeJePostignutGol = "b1";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("b1-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "b2":
          this.gol.pozicijaSaKojeJePostignutGol = "b2";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("b2-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "b3":
          this.gol.pozicijaSaKojeJePostignutGol = "b3";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("b3-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "b4":
          this.gol.pozicijaSaKojeJePostignutGol = "b4";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("b4-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "b5":
          this.gol.pozicijaSaKojeJePostignutGol = "b5";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("b5-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "b6":
          this.gol.pozicijaSaKojeJePostignutGol = "b6";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("b6-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "b7":
          this.gol.pozicijaSaKojeJePostignutGol = "b7";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("b7-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "b8":
          this.gol.pozicijaSaKojeJePostignutGol = "b8";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("b8-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "b9":
          this.gol.pozicijaSaKojeJePostignutGol = "b9";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("b9-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "c1":
          this.gol.pozicijaSaKojeJePostignutGol = "c1";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("c1-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "c2":
          this.gol.pozicijaSaKojeJePostignutGol = "c2";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("c2-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "c3":
          this.gol.pozicijaSaKojeJePostignutGol = "c3";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("c3-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "c4":
          this.gol.pozicijaSaKojeJePostignutGol = "c4";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("c4-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "c5":
          this.gol.pozicijaSaKojeJePostignutGol = "c5";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("c5-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "c6":
          this.gol.pozicijaSaKojeJePostignutGol = "c6";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("c6-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "c7":
          this.gol.pozicijaSaKojeJePostignutGol = "c7";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("c7-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "c8":
          this.gol.pozicijaSaKojeJePostignutGol = "c8";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("c8-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "c9":
          this.gol.pozicijaSaKojeJePostignutGol = "c9";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("c9-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "d1":
          this.gol.pozicijaSaKojeJePostignutGol = "d1";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("d1-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "d2":
          this.gol.pozicijaSaKojeJePostignutGol = "d2";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("d2-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "d3":
          this.gol.pozicijaSaKojeJePostignutGol = "d3";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("d3-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "d4":
          this.gol.pozicijaSaKojeJePostignutGol = "d4";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("d4-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "d5":
          this.gol.pozicijaSaKojeJePostignutGol = "d5";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("d5-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "d6":
          this.gol.pozicijaSaKojeJePostignutGol = "d6";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("d6-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "d7":
          this.gol.pozicijaSaKojeJePostignutGol = "d7";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("d7-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "d8":
          this.gol.pozicijaSaKojeJePostignutGol = "d8";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("d8-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "d9":
          this.gol.pozicijaSaKojeJePostignutGol = "d9";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("d9-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "e1":
          this.gol.pozicijaSaKojeJePostignutGol = "e1";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("e1-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "e2":
          this.gol.pozicijaSaKojeJePostignutGol = "e2";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("e2-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "e3":
          this.gol.pozicijaSaKojeJePostignutGol = "e3";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("e3-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "e4":
          this.gol.pozicijaSaKojeJePostignutGol = "e4";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("e4-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "e5":
          this.gol.pozicijaSaKojeJePostignutGol = "e5";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("e5-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "e6":
          this.gol.pozicijaSaKojeJePostignutGol = "e6";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("e6-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "e7":
          this.gol.pozicijaSaKojeJePostignutGol = "e7";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("e7-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "e8":
          this.gol.pozicijaSaKojeJePostignutGol = "e8";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("e8-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "e9":
          this.gol.pozicijaSaKojeJePostignutGol = "e9";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("e9-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "f1":
          this.gol.pozicijaSaKojeJePostignutGol = "f1";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("f1-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "f2":
          this.gol.pozicijaSaKojeJePostignutGol = "f2";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("f2-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "f3":
          this.gol.pozicijaSaKojeJePostignutGol = "f3";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("f3-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "f4":
          this.gol.pozicijaSaKojeJePostignutGol = "f4";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("f4-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "f5":
          this.gol.pozicijaSaKojeJePostignutGol = "f5";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("f5-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "f6":
          this.gol.pozicijaSaKojeJePostignutGol = "f6";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("f6-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "f7":
          this.gol.pozicijaSaKojeJePostignutGol = "f7";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("f7-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "f8":
          this.gol.pozicijaSaKojeJePostignutGol = "f8";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("f8-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
        case "f9":
          this.gol.pozicijaSaKojeJePostignutGol = "f9";
          var all = document.getElementsByClassName("areaTerena");
          for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = "";
          }
          document.getElementById("f9-area").style.backgroundColor =
            "rgba(255, 0, 0, 0.5)";
          break;
      }

      this.popniPlaceholder("Span-IP7");
    },
    promenaTipa() {
      debugger;

      switch (this.editedItemZaStavke.type) {
        case "TEHNIKA":
          //this.dataStavke = [];
          //this.editedItemZaStavke.oCemSeRadi.nazivStavke = ''
          this.getDataTehnika();
          break;
        case "TAKTIKA":
          //this.editedItemZaStavke.oCemSeRadi.nazivStavke = 'Izaberite stavku'
          this.getDataTaktika();
          break;
        case "PRINCIP_IGRE":
          this.getDataPrincipIgre();
          break;

        default:
          break;
      }
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
            Authorization: "Bearer " + window.$token
          }
        })
        .then(response => {
          debugger;
          self.dataStavke = response.data.map(self.dajStavke);
          self.getLogData();
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
          self.dataStavke = response.data.map(self.dajStavke);
          self.getLogData();
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
    //''''''''''''''''''''''''''''''''''''''''
    // citanje principa igre
    //........................................
    getDataPrincipIgre() {
      let linkStr = this.$apiPutanja + "/princip-igre";
      let self = this;
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
          //this.data = response.data;
          self.dataStavke = response.data.map(self.dajStavkeZaPrincip);
          self.getLogData();
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    dajStavkeZaPrincip(item) {
      debugger;
      return {
        label: item.naziv + "-" + item.opis,
        value: item.ident,
        nazivGrupe: item.naziv,
        nazivStavke: item.opis
      };
    },

    dodajElementZaPracenje() {
      debugger;
      let self = this;
      let el = {
        tipElementa: this.editedItemZaStavke.type,
        identElementa: this.editedItemZaStavke.oCemSeRadi.value,
        nazivGrupe: this.editedItemZaStavke.oCemSeRadi.nazivGrupe,
        nazivStavke: this.editedItemZaStavke.oCemSeRadi.nazivStavke
      };
      var tmp = 0;
      this.elementiZaPracenje.forEach(function(entry) {
        if (entry.identElementa == el.identElementa) tmp++;
      });
      if (tmp == 0) {
        this.elementiZaPracenje.push(el);

        this.dataZaIgraceZaTokUtakmice.forEach(function(entry) {
          if (entry[el.identElementa] == undefined)
            entry[el.identElementa] = { plus: 0, minus: 0 };
        });
      } else
        self.$q.notify({
          icon: "done",
          message: self.$t("matches.youAreAllredyTrackingThisElement"),
          color: "red"
        });
    },
    izbaciElemetZaPracenje(n) {
      debugger;
      let self = this;
      let el = {
        tipElementa: n.tipElementa,
        identElementa: n.identElementa,
        nazivGrupe: n.nazivGrupe,
        nazivStavke: n.nazivStavke
      };
      var tmp = 0;
      let pomocniVektor = [];
      this.elementiZaPracenje.forEach(function(entry) {
        if (entry.identElementa != el.identElementa) {
          debugger;
          pomocniVektor.push(entry);
        }
        tmp++;
      });
      if (tmp == 0) {
        // this.dataZaIgraceZaTokUtakmice.forEach(function (entry) {
        //   if(entry[el.identElementa] == undefined)
        //     entry[el.identElementa] = {plus: 0, minus: 0};
        // });
      } else this.elementiZaPracenje = pomocniVektor;
      self.$q.notify({
        icon: "done",
        message: self.$t("matches.elementIsNoLongerBeingTrecked"),
        color: "red"
      });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // zamena igraca
    //........................................
    postZemenaIgraca() {
      debugger;
      let linkStr = this.$apiPutanja + "/utakmica/substitute-player";
      var self = this;

      if (
        self.selektovaniIgracZaIzlaz.id == self.selektovaniIgracZaTokUtakmice.id
      )
        self.selektovaniIgracZaTokUtakmice = {
          ime: self.$t("matches.selectPlayer"),
          prezime: "",
          primarnaPozicija: { name: "" }
        };

      var dataString = {
        identIgracEnteringTheGame: self.selektovaniIgracZaUlaz.id,
        identIgracExitingTheGame: self.selektovaniIgracZaIzlaz.id,
        identUtakmica: self.editedItem.ident
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
          // sad ucitamo igrace u igri
          self.getDataIgraciUIUigri(self.editedItem.ident);
          self.getLogData();

          console.log(response);
          self.$q.notify({
            icon: "done",
            message: self.$t("matches.playerSubstitutionSaved"),
            color: "positive"
          });
          self.izabraneSuIzmene = 0;
          self.dodajLogUtakmice(
            null,
            null,
            self.selektovaniIgracZaIzlaz.id,
            null,
            self.editedItem.ident,
            0,
            "OUT"
          );
          self.dodajLogUtakmice(
            null,
            null,
            self.selektovaniIgracZaUlaz.id,
            null,
            self.editedItem.ident,
            0,
            "IN"
          );
          // dodajLogUtakmice(, identBazaTehnikeSifrarnikStavke, identIgrac, identPrincipIgre, identUtakmica, ocenaIzvodjenja, tip)
          self.selektovaniIgracZaIzlaz = { id: -1 };
          self.selektovaniIgracZaUlaz = { id: -1 };
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          self.$q.notify({
            icon: "warning",
            message: self.$t("matches.playerSubstitutionFailed"),
            color: "negative"
          });
        });
    },
    vratiBoju(n) {
      if (n.tipElementa == "TEHNIKA") return "#aabbcca0";
      else if (n.tipElementa == "PRINCIP_IGRE") return "#ccbbaaa0";
      else return "#bbccaaa0";
    },
    pocetakUtakmice() {
      console.log(this.$refs.stopwatchRef);
      this.testPocetkaUtakmice = true;
      debugger;
      this.promeniStatusUtakmice("TRAJE");
      this.pocetakPerioda();
      //this.vremePocetkaUtakmice = this.formatDate(this.getDateTime(Date.now()));
      this.dodajLogUtakmice(
        null,
        null,
        null,
        null,
        this.editedItem.ident,
        0,
        "START OF GAME"
      );
    },
    //''''''''''''''''''''''''''''''''''''''''
    // snimanje pocetka perioda
    //........................................
    pocetakPerioda() {
      var kad = this.getDateTime(Date.now());
      debugger;
      let linkStr =
        this.$apiPutanja + "/utakmica/" + this.editedItem.ident + "/play";
      var self = this;
      this.promeniStatusUtakmice("TRAJE");
      var dataString = {
        startTimeFrontend: kad
      };
      self.statusPerioda = true;
      self.cekaSePeriod = true;
      debugger;
      let data1 = JSON.stringify(dataString);
      this.$axios
        .put(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(function(response) {
          debugger;
          if (response.data.level == "NOK") {
            self.$q.notify({
              message: self.$t("matches.periodHasAlreadyBegun"),
              color: "red"
            });
          } else {
            self.$refs.stopwatchRef.reset();
            self.$refs.stopwatchRef.start();
            self.brojPerioda = self.brojPerioda + 1;

            debugger;
            console.log(response);
            self.$q.notify({
              message: self.$t("matches.periodStartDataSavedSuccessfully"),
              color: "green"
            });
          }
          self.dodajLogUtakmice(
            null,
            null,
            null,
            null,
            self.editedItem.ident,
            0,
            "START OF PERIOD"
          );
          self.getLogData();
          self.cekaSePeriod = false;
        })
        .catch(function(response) {
          self.testPocetkaUtakmice = false;
          self.statusPerioda = false;
          self.cekaSePeriod = false;
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena statusa utakmice
    //........................................
    promeniStatusUtakmice(s) {
      debugger;
      let linkStr =
        this.$apiPutanja + "/utakmica/" + this.editedItem.ident + "/" + s;
      var self = this;
      self.cekaSePeriod = true;
      var dataString = {};
      debugger;
      let data1 = JSON.stringify(dataString);
      this.$axios
        .put(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(function(response) {
          self.statusUtakmice = response.data.status;
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("matches.statusDataChangedSuccessfully"),
            color: "green"
          });
          self.getLogData();
          self.cekaSePeriod = false;
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          self.cekaSePeriod = false;
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // snimanje pocetka perioda
    //........................................
    krajPerioda(ende) {
      var kad = this.getDateTime(Date.now());
      debugger;
      let linkStr =
        this.$apiPutanja + "/utakmica/" + this.editedItem.ident + "/stop";
      var self = this;
      self.statusPerioda = false;
      self.cekaSePeriod = true;
      var dataString = {
        endTimeFrontend: kad
      };
      debugger;
      let data1 = JSON.stringify(dataString);
      this.$axios
        .put(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(function(response) {
          debugger;
          if (response.data.level == "NOK") {
            self.$q.notify({
              message: self.$t("matches.thereIsNoPeriodToStop"),
              color: "red"
            });
          } else {
            self.$refs.stopwatchRef.stop();
            debugger;
            console.log(response);
            self.$q.notify({
              message: self.$t("matches.periodEndtDataSavedSuccessfully"),
              color: "green"
            });
            if (ende == 1) {
              self.promeniStatusUtakmice("ZAVRSENA");
            }
          }
          self.dodajLogUtakmice(
            null,
            null,
            null,
            null,
            self.editedItem.ident,
            0,
            "END OF PERIOD"
          );
          self.getLogData();
          self.cekaSePeriod = false;
        })
        .catch(function(response) {
          //handle error
          self.statusPerioda = true;
          self.cekaSePeriod = false;
          console.log(response);
          //alert(response);
        });
    },
    krajUtakmice() {
      this.krajPerioda(1); //ako saljemo 1 onda je to i kraj utakmice! 0 ako nije kraj utakmice
      this.dodajLogUtakmice(
        null,
        null,
        null,
        null,
        this.editedItem.ident,
        0,
        "END OF GAME"
      );
      //this.vremeKrajaUtakmice = this.formatDate(this.getDateTime(Date.now()));
      //this.dodajLogUtakmice(null, null, null, null, this.editedItem.ident, 0, 'END')
    },
    vratiBrojPluseva(n) {
      if (this.dataZaIgraceZaTokUtakmice.length != 0)
        if (
          this.dataZaIgraceZaTokUtakmice.find(
            element => element.id == this.selektovaniIgracZaTokUtakmice.id
          ) != undefined
        )
          return this.dataZaIgraceZaTokUtakmice.find(
            element => element.id == this.selektovaniIgracZaTokUtakmice.id
          )[n.identElementa].plus;
        else return 0;
    },
    vratiBrojMinusa(n) {
      if (this.dataZaIgraceZaTokUtakmice.length != 0)
        if (
          this.dataZaIgraceZaTokUtakmice.find(
            element => element.id == this.selektovaniIgracZaTokUtakmice.id
          ) != undefined
        )
          return this.dataZaIgraceZaTokUtakmice.find(
            element => element.id == this.selektovaniIgracZaTokUtakmice.id
          )[n.identElementa].minus;
        else return 0;
    },
    dodajPlus(n) {
      console.log("plus");
      console.log(this.dataZaIgraceZaTokUtakmice);
      console.log(this.selektovaniIgracZaTokUtakmice);
      console.log(this.selektovaniIgracZaTokUtakmice.id);
      console.log(n);
      debugger;
      this.azuriraj++;
      if (this.dataZaIgraceZaTokUtakmice.length != 0)
        if (
          this.dataZaIgraceZaTokUtakmice.find(
            element => element.id == this.selektovaniIgracZaTokUtakmice.id
          ) != undefined
        ) {
          this.dataZaIgraceZaTokUtakmice.find(
            element => element.id == this.selektovaniIgracZaTokUtakmice.id
          )[n.identElementa].plus += 1;
          switch (n.tipElementa) {
            case "TEHNIKA":
              this.dodajLogUtakmice(
                null,
                n.identElementa,
                this.selektovaniIgracZaTokUtakmice.id,
                null,
                this.editedItem.ident,
                1,
                "TEHNIKA"
              );
              break;
            case "TAKTIKA":
              this.dodajLogUtakmice(
                n.identElementa,
                null,
                this.selektovaniIgracZaTokUtakmice.id,
                null,
                this.editedItem.ident,
                1,
                "TAKTIKA"
              );
              break;
            case "PRINCIP_IGRE":
              this.dodajLogUtakmice(
                null,
                null,
                this.selektovaniIgracZaTokUtakmice.id,
                n.identElementa,
                this.editedItem.ident,
                1,
                "PRINCIP_IGRE"
              );
              break;
            default:
              break;
          }
        }
    },
    dodajMinus(n) {
      this.azuriraj++;
      console.log("minus");
      console.log(this.dataZaIgraceZaTokUtakmice);
      console.log(this.selektovaniIgracZaTokUtakmice.id);
      console.log(n);
      if (this.dataZaIgraceZaTokUtakmice.length != 0)
        if (
          this.dataZaIgraceZaTokUtakmice.find(
            element => element.id == this.selektovaniIgracZaTokUtakmice.id
          ) != undefined
        ) {
          this.dataZaIgraceZaTokUtakmice.find(
            element => element.id == this.selektovaniIgracZaTokUtakmice.id
          )[n.identElementa].minus += 1;
          switch (n.tipElementa) {
            case "TEHNIKA":
              this.dodajLogUtakmice(
                null,
                n.identElementa,
                this.selektovaniIgracZaTokUtakmice.id,
                null,
                this.editedItem.ident,
                -1,
                "TEHNIKA"
              );
              break;
            case "TAKTIKA":
              this.dodajLogUtakmice(
                n.identElementa,
                null,
                this.selektovaniIgracZaTokUtakmice.id,
                null,
                this.editedItem.ident,
                -1,
                "TAKTIKA"
              );
              break;
            case "PRINCIP_IGRE":
              this.dodajLogUtakmice(
                null,
                null,
                this.selektovaniIgracZaTokUtakmice.id,
                n.identElementa,
                this.editedItem.ident,
                -1,
                "PRINCIP_IGRE"
              );
              break;
            default:
              break;
          }
        }
    },
    izaberiIgracaZaGol(element) {
      if (this.gol.tipGola != "Primljen") {
        if (element != "bla") {
          this.selektovaniIgracZaGol = Object.create(element);
        } else {
          return;
        }
      } else {
        this.selektovaniIgracZaGol = { id: null };
      }
    },
    izaberiIgracaZaIzlaz(element) {
      if (this.selektovaniIgracZaIzlaz?.id == element.id) {
        this.izabraneSuIzmene = 0;
        this.selektovaniIgracZaIzlaz = { id: -1 };
        return;
      }
      console.log(element);
      console.log(this.selektovaniIgracZaIzlaz);
      self = this;

      self.selektovaniIgracZaIzlaz = Object.create(element);

      if (self.selektovaniIgracZaUlaz.id != -1) self.izabraneSuIzmene = 1;
    },
    izaberiIgracaZaUlaz(element) {
      if (this.selektovaniIgracZaUlaz?.id == element.id) {
        this.izabraneSuIzmene = 0;
        this.selektovaniIgracZaUlaz = { id: -1 };
        return;
      }
      self = this;

      self.selektovaniIgracZaUlaz = Object.create(element);
      if (self.selektovaniIgracZaIzlaz.id != -1) self.izabraneSuIzmene = 1;
    },
    izaberiIgracaZaTokUtakmice(igrac) {
      this.selektovaniIgracZaTokUtakmice = Object.create(igrac);
    },
    promenaTima() {
      // this.$refs.selektZaIgraca.blur();
      this.getDataZaID(); //idemo da uzmenmo podatke iz baze
      //this.ekipa.id = this.selektovaniTim.value
      //this.ekipa.imeTima = this.selektovaniTim.label
      //this.ekipa.mesto = this.selektovaniTim.mesto
      //this.ekipa.uzrast = this.selektovaniTim.uzrast
      this.getDataEkipa(this.selektovaniTim.value);
    },
    //'''''''''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o utakmicama za određeni tim
    //...............................................
    getDataZaID() {
      let linkStr =
        this.$apiPutanja +
        "/selekcije/" +
        this.selektovaniTim.value +
        "/utakmice";
      let self = this;
      self.loadingUtakmice = true;
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
          self.data = response.data.map(self.dajUtakmice);
          console.log(response.data);
          //self.data = Object.entries(response.data) //.map(self.dajUtakmice);
          self.loadingUtakmice = false;
          debugger;
          self.getLogData();
        })
        .catch(e => {
          //this.errors.push(e);
          self.loadingUtakmice = false;
          console.log("Greska: " + e);
        });
    },
    dajUtakmice(item) {
      debugger;

      return {
        ident: item.ident,
        datum: new Date(
          new Date(item.datum).getTime() + 2 * 60 * 60 * 1000
        ).toString(),
        formacijaIdent: item.formacija.ident,
        formacijaName: item.formacija.name,
        lokacija: item.lokacija,
        nivoPremaProtivniku: item.nivoPremaProtivniku,
        podlogaUtakmice: item.podlogaUtakmice,
        protivnik: item.protivnik,
        rezultatNaKraju: item.rezultatNaKraju,
        rezultatNaPoluvremenu: item.rezultatNaPoluvremenu,
        selekcija: item.selekcija.imeTima,
        tipUtakmice: item.tipUtakmice,
        temperatura: item.temperatura,
        tipUtakmice: item.tipUtakmice,
        usloviUtakmice: item.usloviUtakmice,
        zahteviUtakmice: item.zahteviUtakmice,
        facaIzStrucnogStaba:
          item.strucniStab.ime + " " + item.strucniStab.prezime,
        status: item.status,
        pozicijaUFormacijiUtakmiceList: item.pozicijaUFormacijiUtakmiceList
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
            Authorization: "Bearer " + window.$token
          }
        })
        .then(response => {
          self.igraciSelekcije = response.data.igraci;

          self.igraciSelekcijeKopija = [];
          self.igraciSelekcije.forEach(function(entry) {
            let b = Object.create(entry);
            self.igraciSelekcijeKopija.push(b);
            let a = {};
            a.id = entry.id;

            self.elementiZaPracenje.forEach(function(entry) {
              a[entry.identElementa] = { plus: 0, minus: 0 };
            });
            self.dataZaIgraceZaTokUtakmice.push(a);
          });

          debugger;
          self.getLogData();
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    zatvoriDialogZaUtakmice() {
      let self = this;
      debugger;
      this.dialogZaTokUtakmice = false;
      setTimeout(() => {
        debugger;
        //reseujemo na nulte vrednosti
        self.vremePocetkaUtakmice = "";
        self.vremeKrajaUtakmice = "";
        self.vremeKrajaPrvogPoluvremena = "";
        self.vremePocetkaDrugogPoluvremena = "";
        self.dataZaIgraceZaTokUtakmice = [];
        self.elementiZaPracenje = [];
        self.selektovaniIgracZaTokUtakmice = {
          ime: this.$t("matches.selectPlayer"),
          prezime: "",
          primarnaPozicija: { name: "" }
        };
        (self.editedItem = {}), // Object.assign({}, this.defaultItem);
          (self.editedIndex = -1);
      }, 300);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // upis gola u bazu
    //........................................
    postDataDatGol() {
      debugger;

      let linkStr = this.$apiPutanja + "/gol";
      var self = this;
      let datetime = this.getDateTime(Date.now());

      var dataString = {
        cimeJeDatGol: this.gol.cimeJeDatGol,
        //datum: datetime,
        identIgraca: this.selektovaniIgracZaGol.id,
        identStrucniStab: window.$userID,
        identUtakmice: this.editedItem.ident,
        kategorijaSituacijeKodGola: this.gol.kategorijaSituacijeKodGola,
        period: "PERIODx",
        pozicijaSaKojeJePostignutGol: this.gol.pozicijaSaKojeJePostignutGol,
        tipGola: this.gol.tipGola,
        vremeUnosa: datetime
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
          self.getDataZaID();
          self.$q.notify({
            icon: "done",
            message: self.$t("matches.goalSuccessfulyLogged"),
            color: "positive"
          });
          self.getLogData();
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    zatvoriDialogZaGol() {
      let self = this;
      this.dialogZaGoooool = false;
      setTimeout(() => {
        self.gol.identIgraca = 0;
        self.gol.identUtakmice = 0;
        self.gol.datum = "";
        self.gol.kategorijaSituacijeKodGola = "";
        self.gol.pozicijaSaKojeJePostignutGol = "";
        self.gol.tipGola = "";
        self.gol.cimeJeDatGol = "";
        self.selektovaniIgracZaGol = { id: -1 };
      }, 300);
    },
    zatvoriDialogZaIzmenu() {
      this.dialogZaIzmenu = false;

      setTimeout(() => {
        debugger;
        //reseujemo na nulte vrednosti
        self.selektovaniIgracZaIzlaz = { id: -1 };
        self.selektovaniIgracZaUlaz = { id: -1 };
      }, 300);
    },
    otvoridialogZaBrojeve() {
      debugger;
      let self = this;
      setTimeout(() => {
        self.dialogZaBrojeve = true;
      }, 300);

      self.igraciNaKlupi.forEach(function(entry1, index) {
        if (entry1.startniBroj == undefined || entry1.startniBroj == null)
          self.$set(self.dodeljenBroj, entry1.id + "", "");
        else
          self.$set(self.dodeljenBroj, entry1.id + "", entry1.startniBroj + "");
      });
      self.igraciNaTerenu.forEach(function(entry1, index) {
        if (entry1.startniBroj == undefined || entry1.startniBroj == null)
          self.$set(self.dodeljenBroj, entry1.id + "", "");
        else
          self.$set(self.dodeljenBroj, entry1.id + "", entry1.startniBroj + "");
        console.log(self.dodeljenBroj);
      });
    },
    //citanje startnih brojeve igraca za odedjenu utakmicu
    dajBrojeve() {
      let linkStr =
        this.$apiPutanja +
        "/utakmica/" +
        this.ajDiUtakmice +
        "/startni-brojevi";
      let self = this;
      //self.loadingUtakmice = true
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
          self.getLogData();
          //self.data = response.data.map(self.dajUtakmice);
          //self.data = Object.entries(response.data) //.map(self.dajUtakmice);
          //self.loadingUtakmice = false
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          //self.loadingUtakmice = false
          console.log("Greska: " + e);
        });
    },
    testiccc(e) {
      console.log("this.dodeljenBroj");
      console.log(this.dodeljenBroj);
      console.log("this.dodeljenBroj");
      console.log(e);
      console.log(this.$refs["pomocniInputRefZaBrojeve" + e]);
      console.log(this.$refs["pomocniInputRefZaBrojeve" + e].$vnode.data.key);
      // this.$refs['pomocniInputRefZaBrojeve' + e].$vnode.data.key = ''
      // this.$refs['pomocniInputRefZaBrojeve' + e].$vnode.data.key = e+1
      // console.log(this.$refs['pomocniInputRefZaBrojeve' + e].$vnode.data.key)
      // this.$refs['pomocniInputRefZaBrojeve' + e].$el.value = this.dodeljenBroj[e+'']
      debugger;
    },
    dodeliBroj1() {
      console.log(this.dodeljenBroj);
      debugger;

      let self = this;
      var a = 0;

      Object.keys(self.dodeljenBroj).forEach(entry => {
        if (self.igraciNaTerenu.filter(e => e.id == entry).length > 0)
          var igrac = self.igraciNaTerenu.filter(e => e.id == entry)[0];
        else if (self.igraciNaKlupi.filter(e => e.id == entry).length > 0)
          var igrac = self.igraciNaKlupi.filter(e => e.id == entry)[0];
        else if (self.igraciSelekcije.filter(e => e.id == entry).length > 0)
          var igrac = self.igraciSelekcije.filter(e => e.id == entry)[0];
        else var igrac = null;

        console.log("pocetak");
        console.log(igrac.startniBroj);
        console.log(self.dodeljenBroj[entry + ""]);
        console.log("kraj");
        if (
          igrac != null &&
          igrac.startniBroj == undefined &&
          self.dodeljenBroj[entry + ""] == ""
        )
          console.log("De nada");
        else if (igrac != null) {
          if (igrac.startniBroj != self.dodeljenBroj[entry + ""])
            self.dodeliBroj(
              parseInt(entry),
              self.ajDiUtakmice,
              parseInt(self.dodeljenBroj[entry + ""])
            );
        }
      });

      console.log(a);
    },
    dodeliBroj(a, b, c) {
      let linkStr = this.$apiPutanja + "/utakmica/startni-broj";
      var self = this;
      debugger;
      var dataString = {
        identIgrac: a,
        identUtakmica: b,
        newStartniBroj: c
      };
      debugger;
      let data1 = JSON.stringify(dataString);
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
          //self.getDataZaID();
          self.getDataIgraciUIUigri(self.ajDiUtakmice); // lista igraca u igri
          self.$q.notify({
            message: self.$t("matches.numberSuccessfullyAdded"),
            color: "green"
          });
          self.getLogData();
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          self.$q.notify({
            icon: "warning",
            message: self.$t("matches.numberUnSuccessfullyAdded"),
            color: "red"
          });
        });
    },
    otvoriDialogZaFormacije() {
      console.log("this.kojaFormacija");
      console.log(this.kojaFormacija);
      console.log(this.selektovnaFormacija);
      console.log(this.editedIndex);
      this.allTheLists.push(this.list1);
      this.allTheLists.push(this.list2);
      this.allTheLists.push(this.list3);
      this.allTheLists.push(this.list4);
      this.allTheLists.push(this.list5);
      this.allTheLists.push(this.list6);
      this.allTheLists.push(this.list7);
      this.allTheLists.push(this.list8);
      this.allTheLists.push(this.list9);
      this.allTheLists.push(this.list10);
      this.allTheLists.push(this.list11);
      this.razbacajFormacije(this.selektovnaFormacija.label);
      this.dialogZaFormacije = true;
      if (this.kojaFormacija == "") this.resetujTeren();
      this.kojaFormacija = this.selektovnaFormacija.label;
    },
    razbacajFormacije(aa) {
      debugger;
      console.log("RAZBACAJ FORMACIJE");
      console.log(aa);

      switch (aa) {
        case "2-1-2":
          this.formacijaSifra = this.listaSifraFormacije[0];
          this.pos = this.formacija212posTop;
          this.poss = this.formacija212posLeft;
          break;
        case "1-3-1":
          this.formacijaSifra = this.listaSifraFormacije[1];
          this.pos = this.formacija131posTop;
          this.poss = this.formacija131posLeft;
          break;
        case "3-1-2":
          this.formacijaSifra = this.listaSifraFormacije[2];
          this.pos = this.formacija312posTop;
          this.poss = this.formacija312posLeft;
          break;
        case "2-1-3":
          this.formacijaSifra = this.listaSifraFormacije[3];
          this.pos = this.formacija213posTop;
          this.poss = this.formacija213posLeft;
          break;
        case "3-1-3":
          this.formacijaSifra = this.listaSifraFormacije[4];
          this.pos = this.formacija313posTop;
          this.poss = this.formacija313posLeft;
          break;
        case "3-2-3":
          this.formacijaSifra = this.listaSifraFormacije[5];
          this.pos = this.formacija323posTop;
          this.poss = this.formacija323posLeft;
          break;
        case "3-3-2":
          this.formacijaSifra = this.listaSifraFormacije[6];
          this.pos = this.formacija332posTop;
          this.poss = this.formacija332posLeft;
          break;
        case "3-5-2":
          this.formacijaSifra = this.listaSifraFormacije[7];
          this.pos = this.formacija352posTop;
          this.poss = this.formacija352posLeft;
          break;
        case "4-2-3-1":
          this.formacijaSifra = this.listaSifraFormacije[8];
          this.pos = this.formacija4231posTop;
          this.poss = this.formacija4231posLeft;
          break;
        case "4-3-3":
          this.formacijaSifra = this.listaSifraFormacije[9];
          this.pos = this.formacija433posTop;
          this.poss = this.formacija433posLeft;
          break;
        case "4-4-2 diamond":
          this.formacijaSifra = this.listaSifraFormacije[10];
          this.pos = this.formacija442rPosTop;
          this.poss = this.formacija442rPosLeft;
          break;
        case "4-4-2":
          this.formacijaSifra = this.listaSifraFormacije[11];
          this.pos = this.formacija442posTop;
          this.poss = this.formacija442posLeft;
          break;
        default:
        //alert("Nesto ne radi");
      }

      console.log("this.listaSifraFormacije");
      console.log(this.listaSifraFormacije);
      console.log(this.formacijaSifra);
      if (this.editedIndex != -1) {
        this.popuniFormacije();
      }
    },
    resetujTeren() {
      console.log("resetovanje terena");
      this.igraciSelekcije = [];
      self = this;

      this.igraciSelekcijeKopija.forEach(function(entry) {
        let b = Object.create(entry);
        self.igraciSelekcije.push(b);
      });

      this.list1.length = 0;
      this.list2.length = 0;
      this.list3.length = 0;
      this.list4.length = 0;
      this.list5.length = 0;
      this.list6.length = 0;
      this.list7.length = 0;
      this.list8.length = 0;
      this.list9.length = 0;
      this.list10.length = 0;
      this.list11.length = 0;

      this.allTheLists.length = 0;

      this.allTheLists.push(this.list1);
      this.allTheLists.push(this.list2);
      this.allTheLists.push(this.list3);
      this.allTheLists.push(this.list4);
      this.allTheLists.push(this.list5);
      this.allTheLists.push(this.list6);
      this.allTheLists.push(this.list7);
      this.allTheLists.push(this.list8);
      this.allTheLists.push(this.list9);
      this.allTheLists.push(this.list10);
      this.allTheLists.push(this.list11);
    },
    popuniFormacije() {
      debugger;

      let self = this;
      this.allTheLists = [];
      var ind;
      console.log("POPUNJAVANJE FORMACIJA");
      console.log("POPUNJAVANJE FORMACIJA");
      console.log("POPUNJAVANJE FORMACIJA");
      console.log("POPUNJAVANJE FORMACIJA");
      console.log(this.editedItem);
      console.log(this.formacijaSifra);

      var tmp2 = [];
      var tmpTest = false;
      //formacijeSifra
      self.formacijaSifra.forEach(function(entry, index) {
        self.editedItem.pozicijaUFormacijiUtakmiceList.forEach(function(
          entry1,
          index
        ) {
          debugger;
          if (entry.ident == entry1.pozicija.ident) {
            tmp2.push(entry1.igrac);
            ind = self.igraciSelekcije.findIndex(x => x.id == entry1.igrac.id);
            self.igraciSelekcije.splice(ind, 1);
            tmpTest = true;
          }
        });
        if (tmpTest) {
          self.allTheLists.push(tmp2);
          tmpTest = false;
          tmp2 = [];
        } else {
          self.allTheLists.push([]);
        }
      });

      /*
        this.editedItem.pozicijaUFormacijiUtakmiceList.forEach(function (entry, index) {
          //console.log(entry);
          if(entry.type == "PRIMARNA" && (index - korekcija) % 2 == 0 && entry.pozicija.code != "K"){
            tmp.push(entry.igrac);
            ind = self.igraciSelekcije.findIndex(x => x.id == entry.igrac.id);
            self.igraciSelekcije.splice(ind, 1);
          } else if(entry.type == "ALTERNATIVNA" && (index - korekcija) % 2 == 1 && entry.pozicija.code != "K"){
            tmp.push(entry.igrac);
            ind = self.igraciSelekcije.findIndex(x => x.id == entry.igrac.id);
            self.igraciSelekcije.splice(ind, 1);
            self.allTheLists.push(tmp);
            tmp = [];
          } else if(entry.type == "PRIMARNA" && (index - korekcija) % 2 == 1 && entry.pozicija.code != "K"){
            self.allTheLists.push(tmp);
            tmp = [];
            tmp.push(entry.igrac);
            ind = self.igraciSelekcije.findIndex(x => x.id == entry.igrac.id);
            self.igraciSelekcije.splice(ind, 1);
            korekcija++;
          } else if(entry.type == "ALTERNATIVNA" && (index - korekcija) % 2 == 0 && entry.pozicija.code != "K"){
            self.allTheLists.push(tmp);
            tmp = [];
          } else if(entry.pozicija.code == "K" && (index - korekcija) % 2 == 0){
            self.allTheLists.push([]);
          }

        });
        self.allTheLists.push(tmp); */
      while (self.allTheLists.length < 11) {
        self.allTheLists.push([]);
      }
    },
    izabraneSuPozicijeUformaciji() {
      debugger;
      var tmp;
      var listaIgracaPrivremeno = [];
      this.listaIgracaUformaciji = [];

      this.list1 = [];
      this.list1.push(this.allTheLists[0][0]);
      this.list1.push(this.allTheLists[0][1]);
      this.list2 = [];
      this.list2.push(this.allTheLists[1][0]);
      this.list2.push(this.allTheLists[1][1]);
      this.list3 = [];
      this.list3.push(this.allTheLists[2][0]);
      this.list3.push(this.allTheLists[2][1]);
      this.list4 = [];
      this.list4.push(this.allTheLists[3][0]);
      this.list4.push(this.allTheLists[3][1]);
      this.list5 = [];
      this.list5.push(this.allTheLists[4][0]);
      this.list5.push(this.allTheLists[4][1]);
      this.list6 = [];
      this.list6.push(this.allTheLists[5][0]);
      this.list6.push(this.allTheLists[5][1]);
      this.list7 = [];
      this.list7.push(this.allTheLists[6][0]);
      this.list7.push(this.allTheLists[6][1]);
      this.list8 = [];
      this.list8.push(this.allTheLists[7][0]);
      this.list8.push(this.allTheLists[7][1]);
      this.list9 = [];
      this.list9.push(this.allTheLists[8][0]);
      this.list9.push(this.allTheLists[8][1]);
      this.list10 = [];
      this.list10.push(this.allTheLists[9][0]);
      this.list10.push(this.allTheLists[9][1]);
      this.list11 = [];
      this.list11.push(this.allTheLists[10][0]);
      this.list11.push(this.allTheLists[10][1]);

      listaIgracaPrivremeno.push(this.list1);
      listaIgracaPrivremeno.push(this.list2);
      listaIgracaPrivremeno.push(this.list3);
      listaIgracaPrivremeno.push(this.list4);
      listaIgracaPrivremeno.push(this.list5);
      listaIgracaPrivremeno.push(this.list6);
      listaIgracaPrivremeno.push(this.list7);
      listaIgracaPrivremeno.push(this.list8);
      listaIgracaPrivremeno.push(this.list9);
      listaIgracaPrivremeno.push(this.list10);
      listaIgracaPrivremeno.push(this.list11);

      // For treba da ide do 11, ali ne radi ako nije sve popunjeno
      var alt;
      var prim;
      console.log("PRIVREMENO");
      console.log("PRIVREMENO");
      console.log("PRIVREMENO");
      let self = this;
      console.log(listaIgracaPrivremeno);
      console.log(this.list1);
      console.log("PRIVREMENO");
      console.log("PRIVREMENO");
      console.log("PRIVREMENO");
      for (var i = 0; i < 11; i++) {
        debugger;
        if (
          listaIgracaPrivremeno[i] == undefined ||
          this.formacijaSifra[i] == undefined
        )
          break;
        if (
          listaIgracaPrivremeno[i][0] != undefined &&
          listaIgracaPrivremeno[i][1] != undefined
        ) {
          tmp = {
            identPozicija: this.formacijaSifra[i].ident,

            identPrimarniIgrac: listaIgracaPrivremeno[i][0].id,
            identAlternativniIgrac: listaIgracaPrivremeno[i][1].id,
            startniBroj: null
          };
          self.listaIgracaUformaciji.push(tmp);
        } else if (listaIgracaPrivremeno[i][0] != undefined) {
          tmp = {
            identPozicija: this.formacijaSifra[i].ident,

            identPrimarniIgrac: listaIgracaPrivremeno[i][0].id,
            identAlternativniIgrac: null,
            startniBroj: null
          };
          self.listaIgracaUformaciji.push(tmp);
        }
      }

      console.log("ONO STO SE SALJE ZA FORMACIJE");
      console.log("ONO STO SE SALJE ZA FORMACIJE");
      console.log("ONO STO SE SALJE ZA FORMACIJE");
      console.log("ONO STO SE SALJE ZA FORMACIJE");
      console.log(this.listaIgracaUformaciji);

      self.$q.notify({
        icon: "done",
        message: self.$t("matches.formationSuccessfullyAdded"),
        color: "positive"
      });

      //this.editedItem.identSekundarnogElementaTehnike = this.selektovanaStavkaSekundarneTehnike
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
            Authorization: "Bearer " + window.$token
          }
        })
        .then(response => {
          debugger;
          this.listaPozicija = response.data.map(this.dajPozicije);
          debugger;
          self.getLogData();
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    dajPozicije(item) {
      return {
        label: item.name,
        value: item.ident,
        naziv: item.category
      };
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje sifrarnika formacija
    //........................................
    getDataFormacije() {
      let linkStr = this.$apiPutanja + "/formacija";
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(response => {
          debugger;
          this.listaFormacija = response.data.map(this.dajFormacije);
          this.listaSifraFormacije = response.data.map(this.dajSifreFormacije);
          debugger;
          self.getLogData();
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    dajSifreFormacije(item) {
      return item.pozicije;
    },
    dajFormacije(item) {
      return {
        label: item.name,
        value: item.name,
        ident: item.ident,
        description: item.description
      }; //value: item.ident
    },
    zaAddFja() {
      this.dialogZaDodavanjeStavki = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    getDataIgraciUIUigri(brlj) {
      let self = this;
      self.igraciNaTerenu = { id: -1 };
      let linkStr = this.$apiPutanja + "/utakmica/" + brlj + "/igraci-u-igri";
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
          let a = 0;
          // self.igraciNaTerenu = response.data;
          self.igraciNaTerenu = [];
          self.igraciNaKlupi = [];
          self.igraciNaTekmi = [];

          response.data.forEach(entry => {
            self.igraciNaTekmi.push(entry);
            if (entry.uigri) self.igraciNaTerenu.push(entry);
            else self.igraciNaKlupi.push(entry);
          });
          // self.igraciNaTerenu.forEach(entry1 => {
          //   self.igraciSelekcije.forEach(entry => {
          //     if (entry.id == entry1.id) {
          //       entry.playerPlayingStatus = 1;
          //     } else if (entry.playerPlayingStatus != 1)
          //       entry.playerPlayingStatus = 0;
          //   });
          // });

          // self.igraciSelekcije.forEach(entry1 => {
          //   self.igraciNaTerenu.forEach(entry => {
          //     debugger
          //     if (entry.id == entry1.id)
          //       a++;
          //   });

          //   if (a == 0) {
          //     debugger
          //     let b = Object.create(entry1);
          //     self.igraciNaKlupi.push(b);
          //   } else
          //     a = 0;
          // });

          self.getLogData();
          debugger;
          console.log(self.$refs);
          console.log(self.$refs.table);
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje nove utakmice
    //........................................
    postData() {
      debugger;

      let linkStr = this.$apiPutanja + "/utakmica";
      var self = this;
      let datetime = this.getDateTime(this.editedItem.datum);

      var dataString = {
        datum: datetime,
        identFormacija: this.selektovnaFormacija.ident,
        identSelekcija: this.selektovaniTim.value,
        identStrucniStab: window.$userID,
        lokacija: this.editedItem.lokacija,
        nivoPremaProtivniku: this.editedItem.nivoPremaProtivniku,
        podlogaUtakmice: this.editedItem.podlogaUtakmice,
        pozicijaUFormacijiUtakmiceList: this.listaIgracaUformaciji,
        protivnik: this.editedItem.protivnik,
        rezultatNaKraju: this.editedItem.rezultatNaKraju,
        rezultatNaPoluvremenu: this.editedItem.rezultatNaPoluvremenu,
        temperatura: this.editedItem.temperatura,
        tipUtakmice: this.editedItem.tipUtakmice,
        usloviUtakmice: this.editedItem.usloviUtakmice,
        zahteviUtakmice: this.editedItem.zahteviUtakmice,
        status: "NIJE_POCELA"
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
          self.getDataZaID();
          self.$q.notify({
            icon: "done",
            message: self.$t("matches.newMatchSuccessfullyAdded"),
            color: "positive"
          });
          self.getLogData();
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavanje loga - toka utakmice
    //........................................
    dodajLogUtakmice(
      identBazaTaktikeSifrarnikStavke,
      identBazaTehnikeSifrarnikStavke,
      identIgrac,
      identPrincipIgre,
      identUtakmica,
      ocenaIzvodjenja,
      tip
    ) {
      debugger;

      //let linkStr = this.$apiPutanja + "/podaci-o-elementu-tokom-utakmice";
      let linkStr = this.$apiPutanja + "/element-sa-utakmice";

      var self = this;

      // var dataString = {
      //   identElementa: identEl,
      //   identIgraca: identIg,
      //   identUtakmice: identUt,
      //   ocenaElementa: ocena,
      //   tipElementa: tip
      // };

      var dataString = {
        identBazaTaktikeSifrarnikStavke: identBazaTaktikeSifrarnikStavke,
        identBazaTehnikeSifrarnikStavke: identBazaTehnikeSifrarnikStavke,
        identIgrac: identIgrac,
        identPrincipIgre: identPrincipIgre,
        identStrucniStab: window.$userID,
        identUtakmica: identUtakmica,
        ocenaIzvodjenja: ocenaIzvodjenja,
        type: tip,
        vremeUnosa: this.getDateTime(Date.now())
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
          self.$q.notify({
            icon: "done",
            message: self.$t("matches.eventSuccessfullyAdded"), // TODO ovo se ne prikazuje kako valjaneki self.postMessage
            color: "positive"
          });
          self.getLogData();
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena utakmice
    //........................................
    putData() {
      debugger;
      let linkStr = this.$apiPutanja + "/utakmica/" + this.editedItem.ident;
      var self = this;
      let datetime = this.getDateTime(this.editedItem.datum);
      console.log(this.selektovnaFormacija);

      if (this.selektovnaFormacija == null) {
        this.selektovnaFormacija = { ident: null };
      }

      var dataString = {
        datum: datetime,
        identFormacija: this.selektovnaFormacija.ident,
        identSelekcija: this.selektovaniTim.value,
        identStrucniStab: window.$userID,
        lokacija: this.editedItem.lokacija,
        nivoPremaProtivniku: this.editedItem.nivoPremaProtivniku,
        podlogaUtakmice: this.editedItem.podlogaUtakmice,
        pozicijaUFormacijiUtakmiceList: this.listaIgracaUformaciji,
        protivnik: this.editedItem.protivnik,
        rezultatNaKraju: this.editedItem.rezultatNaKraju,
        rezultatNaPoluvremenu: this.editedItem.rezultatNaPoluvremenu,
        temperatura: this.editedItem.temperatura,
        tipUtakmice: this.editedItem.tipUtakmice,
        usloviUtakmice: this.editedItem.usloviUtakmice,
        zahteviUtakmice: this.editedItem.zahteviUtakmice,
        status: this.editedItem.status
      };
      debugger;
      let data1 = JSON.stringify(dataString);
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
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("matches.matchDataChangedSuccessfully"),
            color: "green"
          });
          self.getLogData();
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
    getDateTime(a) {
      if (isNaN(a))
        var timeStamp = new Date(
          a.split("/")[2].split(" ")[0],
          parseInt(a.split("/")[1].split("/")[0]) - 1,
          a.split("/")[0],
          a.split(" ")[1].split(":")[0],
          a.split(":")[1].split(":")[0],
          0
        );
      else var timeStamp = new Date(a);

      console.log(a);
      console.log(timeStamp);
      console.log(timeStamp.toISOString());
      const vrati = timeStamp.toISOString();
      return vrati;
    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje/deaktiviranje korisnika
    //........................................
    deleteData(item) {
      debugger;
      // /korisnici/izbaci-iz-korisnka/{ident}
      let linkStr = this.$apiPutanja + "/utakmica/" + item.ident;
      var self = this;
      var dataString = {};
      let data1 = JSON.stringify(dataString);
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
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("matches.dataDeletedSuccessfully"),
            color: "green"
          });
          self.getLogData();
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    addRow() {
      debugger;
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

      debugger;
      let sveOK = true;

      if (this.editedItem.lokacija == null || this.editedItem.lokacija == "")
        sveOK = false;
      if (this.editedItem.protivnik == null || this.editedItem.protivnik == "")
        sveOK = false;
      if (
        this.editedItem.tipUtakmice == null ||
        this.editedItem.tipUtakmice == ""
      )
        sveOK = false;
      if (
        this.selektovnaFormacija == null ||
        this.selektovnaFormacija.ident == undefined
      )
        sveOK = false;

      if (sveOK == false) {
        this.$q.notify({
          message: this.$t("administration.user.notSaved"),
          color: "red"
        });
        this.zacrveniPrazne();
      } else {
        if (this.editedIndex > -1) {
          debugger;
          Object.assign(this.data[this.editedIndex], this.editedItem);
          console.log(this.data);
          this.naslov = this.$t("matches.changeData");
          this.putData();
        } else {
          this.naslov = this.$t("matches.definingANewMatch");
          //this.data.push(this.editedItem);
          this.postData();
        }
        this.close();
      }
    },
    zacrveniPrazne() {
      debugger;
      let self = this;
      var i = 0;
      var sviInputi = document.getElementById("Span-IP" + i);

      while (!(i > 1 && sviInputi == null)) {
        if (sviInputi != null && this.$refs["input" + i] != undefined) {
          this.$refs["input" + i].validate();
        }

        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0;
      var sviSelektovi = document.getElementById("Span-SL" + i);
      while (!(i > 1 && sviSelektovi == null)) {
        debugger;
        if (sviSelektovi != null && this.$refs["select" + i] != undefined) {
          this.$refs["select" + i].validate();
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    deleteItem(item) {
      const index = this.data.indexOf(item);
      var self = this;
      let obj = {
        title: self.$t("matches.warning"),
        message: self.$t("matches.areYouSureDelete"),
        customCloseBtnText: self.$t("matches.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("matches.yes"),
        onConfirm: onConfirmWrapper,
        type: "warning",
        showXclose: true
      };
      this.$Simplert.open(obj);

      function onConfirmWrapper() {
        self.data.splice(index, 1);
        self.deleteData(item);
      }
    },
    otvordeDialog() {
      this.resetujTeren();
      this.editedItem.datum = this.getDateTime(Date.now());
      this.editedItem.datum = new Date(this.editedItem.datum).toLocaleString(
        "en-GB"
      );
      this.editedItem.datum =
        this.editedItem.datum
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0] +
        "/" +
        this.editedItem.datum
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.datum
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        " - " +
        this.editedItem.datum.split(", ")[1].split(":")[0] +
        ":" +
        this.editedItem.datum
          .split(", ")[1]
          .split(":")[1]
          .split(":")[0];
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    editItem(item) {
      debugger;
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.selektovnaFormacija = this.listaFormacija.filter(
        e => e.label == item.formacijaName
      )[0];
      this.kojaFormacija = item.formacijaName;
      this.editedItem.datum = new Date(this.editedItem.datum).toLocaleString(
        "en-GB"
      );
      this.editedItem.datum =
        this.editedItem.datum
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0] +
        "/" +
        this.editedItem.datum
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.datum
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        " - " +
        this.editedItem.datum.split(", ")[1].split(":")[0] +
        ":" +
        this.editedItem.datum
          .split(", ")[1]
          .split(":")[1]
          .split(":")[0];
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
      while (!(i > 7 && sviSelektovi == null)) {
        if (sviSelektovi != null) {
          var val = sviSelektovi.parentElement.children[0].innerText.split("\n")
            .length;

          if (val > 1) this.popniPlaceholder("Span-SL" + i);
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    tokUtakmice(item) {
      let self = this;
      debugger;
      this.statusUtakmice = item.status;
      this.editedIndex = this.data.indexOf(item);
      this.ajDiUtakmice = item.ident;
      this.editedItem = Object.assign({}, item); // ???
      this.dialogZaTokUtakmice = true; // prikayemo dialog za tok utakmice

      this.getDataIgraciUIUigri(item.ident); // lista igraca u igri

      console.log("this.igraciSelekcije");
      console.log(this.igraciSelekcije);
      this.igraciSelekcije.forEach(function(entry) {
        let a = {};
        a.id = entry.id;

        self.elementiZaPracenje.forEach(function(entry) {
          a[entry.identElementa] = { plus: 0, minus: 0 };
        });
        self.dataZaIgraceZaTokUtakmice.push(a);
      });
    },
    padeGo() {
      this.dialogZaGoooool = true;
      this.gol = {
        cimeJeDatGol: "",
        datum: "",
        identIgraca: 0,
        identUtakmice: 0,
        kategorijaSituacijeKodGola: "",
        pozicijaSaKojeJePostignutGol: "",
        tipGola: ""
      };
    },
    close() {
      this.new_customer = false;
      this.readonly = false;
      this.selektovnaFormacija = null;
      this.kojaFormacija = "";
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    close1() {
      if (this.statusPerioda) {
        this.$q.notify({
          message: this.$t("matches.matchOngoing"),
          color: "negative",
          icon: "warning"
        });
        return;
      }

      this.dialogZaTokUtakmice = false;
      this.new_customer = false;
      this.readonly = false;
      this.selektovnaFormacija = null;
      this.kojaFormacija = "";
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    log: function(evt) {
      debugger;
      window.console.log("log");
      window.console.log(evt);
      window.console.log("log");
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

      const status = exportFile("utakmice.csv", content, "text/csv");
      let self = this;
      if (status !== true) {
        this.$q.notify({
          message: self.$t("matches.browserForbids"),
          color: "negative",
          icon: "warning"
        });
      }
    }
  }
};
</script>
<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
</style>

<style scoped>
@font-face {
  font-family: Poppins;
  src: url("../assets/pro-coach11 assets/font/Poppins/Poppins-Medium.ttf");
}

@font-face {
  font-family: PoppinsThin;
  src: url("../assets/pro-coach11 assets/font/Poppins/Poppins-Thin.ttf");
}

div {
  font-family: Poppins;
}
#teren {
  background-image: url("../statics/images/teren.png");
  background-repeat: no-repeat;
  background-size: 1000px;
  margin: 0px;
  background-position: center;
  height: 550px;
  width: 830px;

  position: relative;
  left: 135px;
}

/* .row { */
/* padding-bottom: 1rem;
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem */
/* }  */

.q-card-section {
  line-height: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}

.text {
  letter-spacing: 0.1em;
  font-size: 12px;
  padding: 20px 0 0;
}
.areaTerena {
  display: inline-block;
  position: relative;
  top: -293px;
  left: 25px;
  height: 45px;
  width: 49.2px;
}

#a1-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#a2-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#a3-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#a4-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#a5-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#a6-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#a7-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#a8-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#a9-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#b1-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#b2-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#b3-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#b4-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#b5-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#b6-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#b7-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#b8-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#b9-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#c1-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#c2-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#c3-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#c4-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#c5-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#c6-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#c7-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#c8-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#c9-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#d1-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#d2-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#d3-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#d4-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#d5-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#d6-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#d7-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#d8-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#d9-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#e1-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#e2-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#e3-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#e4-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#e5-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#e6-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#e7-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#e8-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#e9-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#f1-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#f2-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#f3-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#f4-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#f5-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#f6-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#f7-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#f8-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}
#f9-area:hover {
  background-color: rgba(255, 0, 0, 0.3);
}

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

.poluLabela {
  display: table-row;
}

.ajtemJedan {
  display: table-cell;
  width: 50%;
}

.ajtemDva {
  display: table-cell;
  width: 50%;
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
.narandzastaKlasaPozadina {
  background-color: #ff4b00 !important;
}

tbody tr:hover td #dugmeModifaj {
  background-color: #30cc83 !important;
  color: #ffffff !important;
}
tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}

.q-field__control {
  color: unset !important;
}

.q-field--outlined .q-field__control:hover:before {
  border-color: unset !important;
}

.sve {
  height: 100%;
  background: red;
  display: flex;
  background-image: url("../assets/pro-coach11 assets/foto/web/modal-stadion1x.jpg");
  background-size: cover;
}

.levaStrana {
  width: 20%;
  height: 100%;
  background: #f5f8fb;
  display: table-row;
  font-family: PoppinsThin !important;
}
.desnaStrana {
  width: 75%;
  height: 100%;
  /* float: right; */
  /* background: tomato; */
  display: table-row;
}
.selektFormacija {
  width: 100%;
  height: 15%;
  display: flex;
  background: white;
  font-family: PoppinsThin !important;
  font-weight: 600;
  box-shadow: 0px 5px 90px -25px rgb(94 98 108 / 89%);
}
.selektFormacijaStomak {
  width: 80%;
  margin: 10% auto;
  border: none !important;
  background: #f5f8fb !important;
  color: #323b62 !important;
  border-radius: 5px;
  padding: 10px 15px;
  font-family: "PoppinsThin";
}
.spanSelektFormacije {
  height: 90%;
  width: 10%;
  background: #d0d9e7a1;
  color: #3b5d99d9;
  padding: 3px 10px;
  border-radius: 5px;
  font-family: "Poppins";
  margin-left: 20px;
}
.selektFormacijaSelekt {
  width: 0px;
  height: 0px;
  border: unset;
  /* float: right;
  position: relative;
  top: -3px;
  right: 7px; */
}
.srednjiDeo {
  width: 100%;
  font-family: PoppinsThin !important;
  font-weight: 600;
}
.srednjiDeoStomak {
  width: 80%;
  margin: 15px auto;
  font-size: 15px;
}
.listicaPlejersa {
  background-color: #3b5d99;
  color: #ffffff;
  height: 40px;
  width: 100%;
  font-size: 13px;
  margin-bottom: 5px;
  border: none;
  border-radius: 5px;
  font-family: PoppinsThin !important;
  font-weight: 600;
  letter-spacing: 1px;
}
.dugmiciOkrugli {
  width: 25%;
  position: absolute;
  bottom: 0px;
}
.dugmiciOkrugliStomak {
  width: 70%;
  margin: 10% auto;
  padding: 10px;
}
.naslovTerena {
  width: 100%;
  /* background: gray; */
  text-align: center;
  padding: 20px 0px 0px 0px;
  color: #f2f3f5;
  font-size: 20px;
}
.formacijaTekst {
  width: 100%;
  /* background: green; */
  text-align: center;
  padding: 30px;
  color: white;
  font-size: 30px;
  font-weight: 600;
  font-style: italic;
}
.terenPozadina {
  width: 100%;
  height: 80%;
  /* background: blue; */
  text-align: center;
  background-image: url("../assets/pro-coach11 assets/foto/web/samo-teren1x.png");
  background-repeat: no-repeat;
  background-position-x: center;
  background-size: 80%;
  position: relative;
}
.terence {
  position: relative;
  left: 10%;
  top: -65px;
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 170px solid transparent;
  border-right: 170px solid transparent;

  border-top: 20px solid #fff;
}
.divIgraca {
  width: 120px;
  height: 100px;
  /* background-color: rgba(0,0,0,0.55);  */
  color: white;
  text-align: center;
  border-radius: 5px;
  position: absolute;
}

.crniPravougaonik {
  width: 170px;
  height: 85px;
  background-color: rgba(0, 0, 0, 0.55);
  border-radius: 5px;
  position: absolute;
  bottom: -56px;
  left: -25px;
}

.crniPravougaonikTekst {
  margin: 0px;
  position: relative;
  top: -55px;
}

.slikaDresa {
  /* position: relative;  */
  /* top: -80px; */
}

.pozSpan {
  position: relative;
  top: 8px !important;
  left: 15px;
}

.slikaIgraca {
  /* object-fit: cover; display: inline-block; float: left; */
  border-radius: 4px;
  width: 35px;
  margin: 2px;
}

.divDraggable {
  width: 170px;
  height: 40px;
  text-align: left;
  margin-bottom: 5px;
  border-radius: 5px;
  font-size: 11pt;
  position: relative;
  background-color: rgba(0, 0, 0, 0.55);
  /* top: -80px; */
}

@media screen and (max-width: 1400px) {
  .terence {
    position: relative;
    left: 9%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 160px solid transparent;
    border-right: 160px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 1350px) {
  .terence {
    position: relative;
    left: 4.7%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 150px solid transparent;
    border-right: 150px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 1250px) {
  .terence {
    position: relative;
    left: 2.7%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 140px solid transparent;
    border-right: 140px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 1150px) {
  .terence {
    position: relative;
    left: 0%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 125px solid transparent;
    border-right: 125px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 1100px) {
  .terence {
    position: relative;
    left: -5%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 120px solid transparent;
    border-right: 120px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 1050px) {
  .terence {
    position: relative;
    left: -7%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 115px solid transparent;
    border-right: 115px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 1000px) {
  .terence {
    position: relative;
    left: -14%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 110px solid transparent;
    border-right: 110px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 950px) {
  .terence {
    position: relative;
    left: -17%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 105px solid transparent;
    border-right: 105px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 900px) {
  .terence {
    position: relative;
    left: -19%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 100px solid transparent;
    border-right: 100px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 850px) {
  .terence {
    position: relative;
    left: -22%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 95px solid transparent;
    border-right: 95px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 800px) {
  .terence {
    position: relative;
    left: -28%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 90px solid transparent;
    border-right: 90px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 750px) {
  .terence {
    position: relative;
    left: -35%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 85px solid transparent;
    border-right: 85px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 700px) {
  .terence {
    position: relative;
    left: -40%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 80px solid transparent;
    border-right: 80px solid transparent;

    border-top: 20px solid #fff;
  }
}
@media screen and (max-width: 650px) {
  .terence {
    position: relative;
    left: -47%;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 70px solid transparent;
    border-right: 70px solid transparent;

    border-top: 20px solid #fff;
  }
  .selektFormacija {
    height: 20%;
  }
  .selektFormacijaStomak {
    text-align: center;
  }
  .spanSelektFormacije {
    margin: 10px;
  }
}

#strelica {
  width: 93%;
  height: 40px;
  position: relative;
  background: #e5edf4;
}
#strelica:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 0;
  /* border-left: 20px solid white;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent; */

  border-right: 150px solid white;
  border-bottom: 26px solid transparent;
}
#strelica:before {
  content: "";
  position: absolute;
  right: -20px;
  bottom: 0;
  width: 0;
  height: 0;
  /* border-left: 20px solid #e5edf4;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent; */

  border-left: 150px solid white;
  border-bottom: 26px solid transparent;
}

.tranzicijaIgracTest {
  /* transition: 0.5s;
  mozda dodati jednom */
}

.sakriDugmice {
  display: none;
}

.arrow {
  position: absolute;
  bottom: -20px;
  left: 64%;
  transform: translate(-50%, -50%);
  transform: rotate(-90deg);
  cursor: pointer;
}

.arrow span {
  display: block;
  width: 20px;
  height: 20px;
  border-bottom: 5px solid black;
  border-right: 5px solid black;
  transform: rotate(45deg);
  margin: -10px;
  animation: animate 2s infinite;
}

.arrow span:nth-child(2) {
  animation-delay: -0.2s;
}

.arrow span:nth-child(3) {
  animation-delay: -0.4s;
}

@keyframes animate {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(-20px, -20px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(20px, 20px);
  }
}
</style>

// Sobzirom da je sve fiksne visine iznad tabele izravunao sam da ej to magican
broj 280
<style lang="sass">
.q-select
  .q-field--float
    background: white !important
    border: 1px solid #3b5d99 !important

  .q-field--focused
    position: relative
    right: -14px
.selektFormacijaSelekt
  .q-field__marginal
    position: relative
    top: -10px
    right: -210px
    color: #3b5d99 !important

.q-menu--square
  position: relative
  left: 350px !important

@media screen and (max-width: 1400px)
  .selektFormacijaSelekt
    .q-field__marginal
      position: relative
      top: -10px
      left: 190px
      color: #3b5d99 !important

  .q-menu--square
    position: relative
    left: 150px !important
@media screen and (max-width: 1200px)
  .selektFormacijaSelekt
    .q-field__marginal
      position: relative
      top: -10px
      left: 175px
      color: #3b5d99 !important

  .q-menu--square
    position: relative
    left: 150px !important

@media screen and (max-width: 1000px)
  .selektFormacijaSelekt
    .q-field__marginal
      position: relative
      top: -10px
      left: 70px
      color: #3b5d99 !important

  .q-menu--square
    position: relative
    left: 150px !important

@media screen and (max-width: 800px)
  .selektFormacijaSelekt
    .q-field__marginal
      position: relative
      top: -30px
      left: 105px
      color: #3b5d99 !important

  .q-menu--square
    position: relative
    left: 150px !important


@media screen and (max-width: 650px)
  .selektFormacijaSelekt
    .q-field__marginal
      position: relative
      top: -10px
      left: 60px
      color: #3b5d99 !important

  .q-menu--square
    position: relative
    left: 150px !important
.selektFormacijaSelekt
  .q-field--float
    position: relative
    right: -200px
</style>
