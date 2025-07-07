<template>
  <q-page class="q-pa-sm">
    <q-table
      :title="$t('playerInjuries.playerInjuries')"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="ident"
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
      <template
        v-if="igrac != $t('playerInjuries.selectPlayer') + ' ->'"
        v-slot:top-right="props"
      >
        <q-btn
          v-if="Object.keys(selektovaniIgrac).length != 0"
          @click="otvordeDialog()"
          :label="$t('playerInjuries.newMeasurement')"
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
              >{{props.inFullscreen ? $t('playerInjuries.exitFullscreen') : $t('playerInjuries.enterFullscreen')}}</q-tooltip>
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
            mode === "grid"
              ? $t("playerInjuries.list")
              : $t("playerInjuries.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('playerInjuries.exportCSV')"
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
              <q-tooltip>{{ $t("playerInjuries.delete") }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="editItem(props.row)"
              id="dugmeEdit"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="edit"
            >
              <q-tooltip>{{ $t("playerInjuries.changeData") }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>

        <q-td
          :props="props"
          v-else-if="props.value == props.row.datumVreme"
          @click="otvoriPreviewDialog(props.row)"
        >
          <div class="" id="username">
            {{ props.row.datumVreme }}asdd
            <!-- TODO: Ne ulazi u ovaj if -->
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
            {{ $t("playerInjuries.mesurement") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular ponisti" style="padding-top: 20px">
                <label class="custom-field one datumInput">
                  <q-input
                    :readonly="readonly"
                    borderless
                    dense
                    placeholder=" "
                    v-model="editedItem.datumVreme"
                    @focus="popniPlaceholder('Span-IP0')"
                    @input="popniPlaceholder('Span-IP0')"
                    @blur="spustiPlaceholder('Span-IP0', editedItem.datumVreme)"
                    ref="input4"
                    mask="##/##/####"
                    :rules="[val => valiDate(val) || 'DD/MM/YYYY']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            :readonly="readonly"
                            v-model="editedItem.datumVreme"
                            @input="() => $refs.qDateProxy.hide()"
                            mask="DD/MM/YYYY"
                          ></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <span id="Span-IP0" class="placeholder">{{
                    $t("playerInjuries.date")
                  }}</span>
                </label>
              </q-item>

              <q-item class="formular ponisti" style="width: 64%">
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.korisnikImePrezime" :label="$t('playerInjuries.whoDidTheTesting')"></q-input> -->
                  <label class="custom-field one" style="margin-top: 20px;">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      disable
                      v-model="editedItem.korisnikImePrezime"
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP1',
                          editedItem.korisnikImePrezime
                        )
                      "
                    />
                    <span id="Span-IP1" class="placeholder">{{
                      $t("playerInjuries.whoDidTheTesting")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item style="margin-top: 20px">
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.prognozaVremeOporavka" :label="$t('playerInjuries.predictedRecoveryTimeInDays')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      type="number"
                      v-model="editedItem.prognozaVremeOporavka"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP2',
                          editedItem.prognozaVremeOporavka
                        )
                      "
                    />
                    <span id="Span-IP2" class="placeholder">{{
                      $t("playerInjuries.predictedRecoveryTimeInDays")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item
                class="formular ponisti"
                style="padding-right: 16px; width: 100%; padding-top: 0px;"
              >
                <label class="custom-field one datumInput" style="width: 98%">
                  <q-input
                    :readonly="readonly"
                    borderless
                    dense
                    placeholder=" "
                    style="width: 100%"
                    v-model="editedItem.uvodniRadSmanjenIntenzitet"
                    @focus="popniPlaceholder('Span-IP3')"
                    @input="popniPlaceholder('Span-IP3')"
                    @blur="
                      spustiPlaceholder(
                        'Span-IP3',
                        editedItem.uvodniRadSmanjenIntenzitet
                      )
                    "
                    ref="input4"
                    mask="##/##/####"
                    :rules="[val => valiDate(val) || 'DD/MM/YYYY']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy1"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            :readonly="readonly"
                            v-model="editedItem.uvodniRadSmanjenIntenzitet"
                            @input="() => $refs.qDateProxy1.hide()"
                            mask="DD/MM/YYYY"
                          ></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <span id="Span-IP3" class="placeholder">{{
                    $t(
                      "playerInjuries.introductoryPaperWithReducedIntensityStartDate"
                    )
                  }}</span>
                </label>
              </q-item>

              <q-item
                class="formular ponisti"
                style="padding-right: 16px; width: 100%"
              >
                <label class="custom-field one datumInput" style="width: 98%">
                  <q-input
                    :readonly="readonly"
                    borderless
                    dense
                    placeholder=" "
                    style="width: 100%"
                    v-model="editedItem.punRad"
                    @focus="popniPlaceholder('Span-IP4')"
                    @input="popniPlaceholder('Span-IP4')"
                    @blur="spustiPlaceholder('Span-IP4', editedItem.punRad)"
                    ref="input4"
                    mask="##/##/####"
                    :rules="[val => valiDate(val) || 'DD/MM/YYYY']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy2"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            :readonly="readonly"
                            v-model="editedItem.punRad"
                            @input="() => $refs.qDateProxy2.hide()"
                            mask="DD/MM/YYYY"
                          ></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <span id="Span-IP4" class="placeholder">{{
                    $t("playerInjuries.fullTimeStartDate")
                  }}</span>
                </label>
              </q-item>
              <q-item>
                <q-item-section style="margin-top: 20px">
                  <!-- <q-input dense outlined v-model="kpNiz" :label="$t('playerInjuries.injuryClassificationAccordingToXLSClassification')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="kpNiz"
                      @focus="popniPlaceholder('Span-IP5')"
                      @input="popniPlaceholder('Span-IP5')"
                      @blur="spustiPlaceholder('Span-IP5', kpNiz)"
                    />
                    <span id="Span-IP5" class="placeholder">{{
                      $t(
                        "playerInjuries.injuryClassificationAccordingToXLSClassification"
                      )
                    }}</span>
                  </label>
                </q-item-section>
                <q-btn
                  flat
                  dense
                  round
                  icon="more_vert"
                  style="height: 40px; width: 40px; margin-left: 0px; margin-top: 20px;"
                  @click="otvoriDialogZaDodavanjeKlasifikacije()"
                >
                  <q-tooltip>
                    Izaberite tip povrede
                  </q-tooltip>
                </q-btn>
              </q-item>
              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="listaTretmana"
                    v-model="editedItem.vrstaTretmana"
                    emit-value
                    map-options
                    ref="select0"
                    @focus="popniPlaceholder('Span-SL0')"
                    @input="popniPlaceholder('Span-SL0')"
                    @blur="
                      spustiPlaceholder('Span-SL0', editedItem.vrstaTretmana)
                    "
                  />
                  <span
                    @click="$refs.select0.showPopup()"
                    id="Span-SL0"
                    class="placeholder placeholder1"
                    >{{ $t("playerInjuries.typeOfTreatment") }}</span
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.rukovodilacTretmana" :label="$t('playerInjuries.treatmentManager')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.rukovodilacTretmana"
                      @focus="popniPlaceholder('Span-IP6')"
                      @input="popniPlaceholder('Span-IP6')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP6',
                          editedItem.rukovodilacTretmana
                        )
                      "
                    />
                    <span id="Span-IP6" class="placeholder">{{
                      $t("playerInjuries.treatmentManager")
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
            {{ $t("playerInjuries.mesurement") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular ponisti" style="">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="editedItem.datumVreme"
                  :label="$t('playerInjuries.date')"
                  class="datumInputReadOnly"
                  mask="##/##/####"
                />
              </q-item>

              <q-item v-if="this.editedIndex > -1">
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.korisnikImePrezime"
                      :label="$t('playerInjuries.whoDidTheTesting')"
                    />
                    <span class="placeholder">{{
                      $t("playerInjuries.whoDidTheTesting")
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
                      v-model="editedItem.prognozaVremeOporavka"
                      :label="$t('playerInjuries.predictedRecoveryTimeInDays')"
                    />
                    <span class="placeholder">{{
                      $t("playerInjuries.predictedRecoveryTimeInDays")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item class="formular ponisti" style="">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="editedItem.uvodniRadSmanjenIntenzitet"
                  :label="
                    $t(
                      'playerInjuries.introductoryPaperWithReducedIntensityStartDate'
                    )
                  "
                  class="datumInputReadOnly"
                  mask="##/##/####"
                />
              </q-item>

              <q-item class="formular ponisti">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="editedItem.punRad"
                  :label="$t('playerInjuries.fullTimeStartDate')"
                  class="datumInputReadOnly"
                  mask="##/##/####"
                />
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="kpNiz"
                      :label="
                        $t(
                          'playerInjuries.injuryClassificationAccordingToXLSClassification'
                        )
                      "
                    />
                    <span class="placeholder">{{
                      $t(
                        "playerInjuries.injuryClassificationAccordingToXLSClassification"
                      )
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    readonly
                    borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    :label="$t('playerInjuries.typeOfTreatment')"
                    :options="listaTretmana"
                    v-model="editedItem.vrstaTretmana"
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
                      v-model="editedItem.rukovodilacTretmana"
                      :label="$t('playerInjuries.treatmentManager')"
                    />
                    <span class="placeholder">{{
                      $t("playerInjuries.treatmentManager")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- dialog za dodavanje klasifikacija povreda -->
    <q-dialog v-model="dialogZaDodavanjeKlasifikacija" persistent>
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
            {{ $t("playerInjuries.classificationOfInjuries") }}
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
                    option-label="label"
                    :options="listaPredeoPovrede"
                    v-on:input="izabranPredeoPovrede"
                    v-model="izabranPredeo"
                    emit-value
                    map-options
                    ref="select1"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="spustiPlaceholder('Span-SL1', izabranPredeo)"
                  />
                  <span
                    @click="$refs.select1.showPopup()"
                    id="Span-SL1"
                    class="placeholder placeholder1"
                    >{{ $t("playerInjuries.injuryArea") }}</span
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    borderless
                    class="selektKlass"
                    option-label="label"
                    :options="listaOpstaDijagnoza"
                    v-on:input="izabranaOpstaDijagnoza"
                    v-model="izabranaOpsta"
                    map-options
                    ref="select2"
                    @focus="popniPlaceholder('Span-SL2')"
                    @input="popniPlaceholder('Span-SL2')"
                    @blur="spustiPlaceholder('Span-SL2', izabranaOpsta)"
                  />
                  <span
                    @click="$refs.select2.showPopup()"
                    id="Span-SL2"
                    class="placeholder placeholder1"
                    >{{ $t("playerInjuries.generalDiagnosis") }}</span
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    borderless
                    class="selektKlass"
                    option-label="label"
                    :options="listaSpecificnaDijagnoza"
                    v-on:input="izabranaSpecificnaDijagnoza"
                    v-model="izabranaSpecificna"
                    map-options
                    ref="select3"
                    @focus="popniPlaceholder('Span-SL3')"
                    @input="popniPlaceholder('Span-SL3')"
                    @blur="spustiPlaceholder('Span-SL3', izabranaSpecificna)"
                  />
                  <span
                    @click="$refs.select3.showPopup()"
                    id="Span-SL3"
                    class="placeholder placeholder1"
                    >{{ $t("playerInjuries.specificDiagnosis") }}</span
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    borderless
                    class="selektKlass"
                    option-label="label"
                    :options="listaDetaljiPovrede"
                    v-on:input="izaberiDetaljePovrede"
                    v-model="izabraniDetalji"
                    map-options
                    ref="selec4"
                    @focus="popniPlaceholder('Span-SL4')"
                    @input="popniPlaceholder('Span-SL4')"
                    @blur="spustiPlaceholder('Span-SL4', izabraniDetalji)"
                  />
                  <span
                    @click="$refs.select4.showPopup()"
                    id="Span-SL4"
                    class="placeholder placeholder1"
                    >{{ $t("playerInjuries.injuryDetails") }}</span
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    borderless
                    class="selektKlass"
                    option-label="label"
                    :options="listaStraneTela"
                    v-model="klasifikacija.stranaTela"
                    emit-value
                    map-options
                    ref="select5"
                    @focus="popniPlaceholder('Span-SL5')"
                    @input="popniPlaceholder('Span-SL5')"
                    @blur="
                      spustiPlaceholder('Span-SL5', klasifikacija.stranaTela)
                    "
                  />
                  <span
                    @click="$refs.select5.showPopup()"
                    id="Span-SL5"
                    class="placeholder placeholder1"
                    >{{ $t("playerInjuries.bodySideRL") }}</span
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn
            :label="$t('administration.user.cancel')"
            @click="dialogZaDodavanjeKlasifikacija = false"
            type="submit"
            style="background-color: #f5f8fb; color: #323b62; width: 20%; margin: 10px;"
            v-close-popup
          ></q-btn>
          <q-btn
            :label="$t('administration.user.save')"
            @click="dodajSifru()"
            type="submit"
            style="background-color: #ff4b00; color: white; width: 20%; margin: 10px;"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- kraj dialoga za dodavanje klasifikacija povreda -->
  </q-page>
</template>

<script>
import { exportFile } from "quasar";
import { date } from "quasar";

let timeStamp = Date.now();

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  components: {},
  props: ["selektovaniIgrac"],
  data() {
    return {
      readonly: false,
      loadingUtakmice: false,
      igrac: "",
      date: "",
      filter: "",
      customer: {},
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      listaTretmana: [
        { label: this.$t("playerInjuries.rest"), value: "1" },
        { label: this.$t("playerInjuries.massage"), value: "2" },
        { label: this.$t("playerInjuries.trainingTherapy"), value: "3" },
        { label: this.$t("playerInjuries.physicalTherapy"), value: "4" },
        { label: this.$t("playerInjuries.surgery"), value: "5" }
      ],
      editedItem: {
        datumVreme: "",
        ident: 0,
        identKorisnik: 0,
        korisnikImePrezime: "",
        identUser: this.igracID1,
        datumPovrede: "",
        klasifikacijaPovrede: "",
        prognozaVremeOporavka: 0,
        punRad: "",
        rukovodilacTretmana: "",
        uvodniRadSmanjenIntenzitet: "",
        vrstaTretmana: ""
      },
      defaultItem: {
        datumVreme: "",
        ident: 0,
        identKorisnik: 0,
        korisnikImePrezime: "",
        identUser: this.igracID1,
        datumPovrede: "",
        klasifikacijaPovrede: "",
        prognozaVremeOporavka: 0,
        punRad: "",
        rukovodilacTretmana: "",
        uvodniRadSmanjenIntenzitet: "",
        vrstaTretmana: ""
      },
      mode: "list",
      columns: [
        {
          name: "datumVreme",
          required: true,
          label: this.$t("playerInjuries.dateOfInjury"),
          align: "left",
          field: "datumVreme",
          sortable: true,
          format: val => date.formatDate(val, "DD/MM/YYYY")
        },
        {
          name: "klasifikacijaPovrede",
          align: "left",
          label: this.$t("playerInjuries.classificationOfInjuries"),
          field: "klasifikacijaPovrede",
          sortable: true
        },
        {
          name: "prognozaVremeOporavka",
          align: "left",
          label: this.$t("playerInjuries.recoveryTimeForecast"),
          field: "prognozaVremeOporavka",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t("playerInjuries.action"),
          field: "action",
          sortable: true
        }
      ],
      data: [],
      dataSifrarnik: [],
      pagination: {
        rowsPerPage: 10
      },
      dialogZaDodavanjeKlasifikacija: false,
      izabranPredeo: "",
      izabranaOpsta: "",
      izabranaSpecificna: "",
      izabraniDetalji: "",
      listaPredeoPovrede: [],
      listaOpstaDijagnoza: [],
      listaSpecificnaDijagnoza: [],
      listaDetaljiPovrede: [],
      kpString: "",
      kpNiz: [],
      listaStraneTela: [
        {
          label: this.$t("playerInjuries.leftSide"),
          value: "LEVA"
        },
        {
          label: this.$t("playerInjuries.rightSide"),
          value: "DESNA"
        },
        {
          label: this.$t("playerInjuries.leftAndRightSide"),
          value: "LEVA_DESNA"
        },
        {
          label: "NA",
          value: "NA"
        }
      ],
      klasifikacija: {
        predeoPovrede: "",
        opstaDijagnoza: "",
        specificnaDijagnoza: "",
        detaljiPovrede: "",
        stranaTela: ""
      }
    };
  },
  watch: {
    selektovaniIgrac: function(val) {
      this.igrac = val.igrac;
      this.igracID1 = val.igracID;

      this.getDataZaID();
    }
  },
  mounted() {
    if (
      this.selektovaniIgrac != undefined &&
      this.selektovaniIgrac.igracID != undefined
    ) {
      this.igrac = this.selektovaniIgrac.igrac;
      this.igracID1 = this.selektovaniIgrac.igracID;

      this.getDataZaID();
    }
    this.editedItem.korisnikImePrezime = window.$userFullName;

    this.editedItem.datumVreme = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");
    this.editedItem.uvodniRadSmanjenIntenzitet = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");
    this.editedItem.punRad = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");

    // change table height
    var temp = document.querySelectorAll(".q-table__middle");
    for (var i = 0; i < temp.length; i++)
      temp[i].style.setProperty("max-height", "calc(100vh - 200px)");
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

      if (val === "" || val.length == 0) {
        izabraniPlaceholder.style.top = "22px";
        izabraniPlaceholder.style.backgroundColor = "unset";
        izabraniPlaceholder.style.fontSize = "unset";
        izabraniPlaceholder.style.padding = "3px";
        izabraniPlaceholder.style.color = "#aaa";
      }
    },
    compare(a, b) {
      return a == date.formatDate(b, "DD-MM-YYYY");
    },
    valiDate(date) {
      let dateformat = /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])/;

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
      this.editedItem.datumVreme =
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.editedItem.uvodniRadSmanjenIntenzitet =
        this.editedItem.uvodniRadSmanjenIntenzitet
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.uvodniRadSmanjenIntenzitet
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.uvodniRadSmanjenIntenzitet
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.editedItem.punRad =
        this.editedItem.punRad
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.punRad
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.punRad
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.kpNiz = item.klasifikacijaPovrede.split(", ");
      this.readonly = true;
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // metode za klasifikacije povrede
    //........................................
    izabranPredeoPovrede() {
      let self = this;
      self.listaOpstaDijagnoza = [];
      debugger;
      self.dataSifrarnik.forEach(function(entry) {
        if (self.izabranPredeo == entry.predeoPovrede)
          if (!self.listaOpstaDijagnoza.includes(entry.specificnaDijagnoza))
            self.listaOpstaDijagnoza.push(entry.specificnaDijagnoza);
      });
      console.log(self.listaOpstaDijagnoza);
    },
    izabranaOpstaDijagnoza() {
      let self = this;
      self.listaSpecificnaDijagnoza = [];
      debugger;
      self.dataSifrarnik.forEach(function(entry) {
        if (self.izabranPredeo == entry.predeoPovrede)
          if (self.izabranaOpsta == entry.specificnaDijagnoza)
            if (!self.listaSpecificnaDijagnoza.includes(entry.opstaDijagnoza))
              self.listaSpecificnaDijagnoza.push(entry.opstaDijagnoza);
      });
      console.log(self.listaSpecificnaDijagnoza);
    },
    izabranaSpecificnaDijagnoza() {
      let self = this;
      self.listaDetaljiPovrede = [];
      debugger;
      self.dataSifrarnik.forEach(function(entry) {
        if (self.izabranPredeo == entry.predeoPovrede)
          if (self.izabranaOpsta == entry.specificnaDijagnoza)
            if (self.izabranaSpecificna == entry.opstaDijagnoza)
              if (!self.listaDetaljiPovrede.includes(entry.detaljiPovrede))
                //zamenio sam redosled entry.specificnaDijagnoza sa entry.opstaDijagnoza
                //nije najsjajnije resenje al za sad radi..
                self.listaDetaljiPovrede.push(entry.detaljiPovrede);
      });
      console.log(self.listaDetaljiPovrede);
    },
    // dodajElementZaPracenje() {
    //   debugger
    //   let self = this;
    //   let el = {
    //     tipElementa: this.editedItemZaStavke.type,
    //     identElementa: this.editedItemZaStavke.oCemSeRadi.value,
    //     nazivGrupe: this.editedItemZaStavke.oCemSeRadi.nazivGrupe,
    //     nazivStavke: this.editedItemZaStavke.oCemSeRadi.nazivStavke,
    //   }
    //   var tmp = 0;
    //   this.elementiZaPracenje.forEach(function (entry) {
    //     if(entry.identElementa == el.identElementa)
    //       tmp++;
    //   });
    //   if(tmp == 0){
    //     this.elementiZaPracenje.push(el)
    //   } else
    //     self.$q.notify({
    //         icon: 'done',
    //         message: "Vec je dodata informacija za ovu povredu!",
    //         color: "red"
    //       });
    // },
    // izbaciElemetZaPracenje(n) {
    //   debugger
    //   let self = this;
    //   let el = {
    //     tipElementa: n.tipElementa,
    //     identElementa: n.identElementa,
    //     nazivGrupe: n.nazivGrupe,
    //     nazivStavke: n.nazivStavke,
    //   }
    //   var tmp = 0;
    //   let pomocniVektor = []
    //   this.elementiZaPracenje.forEach(function (entry) {
    //     if(entry.identElementa != el.identElementa) {
    //       debugger
    //       pomocniVektor.push(entry)
    //     }
    //     tmp++
    //   });
    //   if(tmp == 0){

    //     // this.dataZaIgraceZaTokUtakmice.forEach(function (entry) {
    //     //   if(entry[el.identElementa] == undefined)
    //     //     entry[el.identElementa] = {plus: 0, minus: 0};
    //     // });
    //   } else
    //   this.elementiZaPracenje = pomocniVektor
    //     self.$q.notify({
    //         icon: 'done',
    //         message: "Element se više ne prati!",
    //         color: "red"
    //       });
    // },
    izaberiDetaljePovrede() {
      let self = this;
      self.listaDetaljiPovrede = [];
      debugger;
      self.dataSifrarnik.forEach(function(entry) {
        if (self.izabranPredeo == entry.predeoPovrede)
          if (self.izabranaOpsta == entry.specificnaDijagnoza)
            if (self.izabranaSpecificna == entry.opstaDijagnoza)
              if (self.izabraniDetalji == entry.detaljiPovrede)
                //zamenio sam redosled entry.specificnaDijagnoza sa entry.opstaDijagnoza
                //nije najsjajnije resenje al za sad radi..
                self.kpString = entry.osicsCode;
      });
      console.log(self.listaDetaljiPovrede);
    },
    dodajSifru() {
      console.log(this.klasifikacija.stranaTela);
      switch (this.klasifikacija.stranaTela) {
        case "LEVA":
          this.kpString = this.kpString + "-L";
          break;
        case "DESNA":
          this.kpString = this.kpString + "-R";
          break;
        case "LEVA_DESNA":
          this.kpString = this.kpString + "-LR";
          break;
        case "NA":
          this.kpString = this.kpString + "-NA";
          break;

        default:
          break;
      }

      this.popniPlaceholder("Span-IP5");
      console.log("this.kpNiz");
      console.log(this.kpNiz);

      if (this.kpNiz == "") this.kpNiz = [];
      this.kpNiz.push(this.kpString);
      console.log(this.kpNiz);
      console.log(this.kpString);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje igraca
    //........................................
    getDataZaID() {
      let linkStr = this.$apiPutanja + "/povrede-igraca/igrac/" + this.igracID1;
      this.loadingUtakmice = true;
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
          this.data = response.data;
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
    // citanje povreda
    //........................................
    getSifrarnik() {
      let self = this;
      let linkStr = this.$apiPutanja + "/povreda-sifrarnik";
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
          self.dataSifrarnik = response.data;
          debugger;
          console.log(self.dataSifrarnik);
          debugger;
          self.popuniPredeoPovrede();
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
      let linkStr = this.$apiPutanja + "/povrede-igraca";
      var self = this;
      let datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      let datumVreme2 = this.getDateTime(
        this.editedItem.uvodniRadSmanjenIntenzitet
      );
      let datumVreme3 = this.getDateTime(this.editedItem.punRad);

      var dataString = {
        datumVreme: datumVreme1,
        ident: 0,
        identKorisnik: 0, // ide ulogovani korisnik, iz bekenda! za sad... this.editedItem.identKorisnik,
        korisnikImePrezime: "", // this.editedItem.korisnikImePrezime,
        identUser: this.igracID1,
        datumPovrede: datumVreme1,
        klasifikacijaPovrede: this.kpNiz.join(", "),
        prognozaVremeOporavka: this.editedItem.prognozaVremeOporavka,
        punRad: datumVreme3,
        rukovodilacTretmana: this.editedItem.rukovodilacTretmana,
        uvodniRadSmanjenIntenzitet: datumVreme2,
        vrstaTretmana: this.editedItem.vrstaTretmana
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
        .then(function(response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("playerInjuries.newInjurySuccessfullyAdded"),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    predeoTelaFiltrirano(value, index, self) {
      return self.indexOf(value) === index;
    },
    otvoriDialogZaDodavanjeKlasifikacije(item) {
      this.dialogZaDodavanjeKlasifikacija = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
      this.getSifrarnik();

      debugger;
    },
    popuniPredeoPovrede() {
      let self = this;
      self.listaPredeoPovrede = [];
      debugger;
      self.dataSifrarnik.forEach(function(entry) {
        if (!self.listaPredeoPovrede.includes(entry.predeoPovrede))
          self.listaPredeoPovrede.push(entry.predeoPovrede);
      });
      console.log(self.listaPredeoPovrede);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena merenja
    //........................................
    putData() {
      debugger;
      let linkStr =
        this.$apiPutanja + "/povrede-igraca/" + this.editedItem.ident;
      var self = this;
      let datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      let datumVreme2 = this.getDateTime(
        this.editedItem.uvodniRadSmanjenIntenzitet
      );
      let datumVreme3 = this.getDateTime(this.editedItem.punRad);

      var dataString = {
        datumVreme: datumVreme1,
        ident: 0,
        identKorisnik: 0, // ide ulogovani korisnik, iz bekenda! za sad... this.editedItem.identKorisnik,
        korisnikImePrezime: "", // this.editedItem.korisnikImePrezime,
        identUser: this.igracID1,
        datumPovrede: datumVreme1,
        klasifikacijaPovrede: this.kpNiz.join(", "),
        prognozaVremeOporavka: this.editedItem.prognozaVremeOporavka,
        punRad: datumVreme3,
        rukovodilacTretmana: this.editedItem.rukovodilacTretmana,
        uvodniRadSmanjenIntenzitet: datumVreme2,
        vrstaTretmana: this.editedItem.vrstaTretmana
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
        .then(function(response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("playerInjuries.injuryDataChangedSuccessfully"),
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
      let linkStr = this.$apiPutanja + "/povrede-igraca/" + item.ident;
      var self = this;
      this.$axios
        .delete(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function(response) {
          debugger;
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t("playerInjuries.injuryDataDeletedSuccessfully"),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    prenesiOvde(jen, dva) {
      debugger;
      this.igrac = jen;
      this.igracID1 = dva;
      debugger;
      this.getDataZaID(); //idemo da uzmenmo podatke iz baze
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
      let sveOK = true;

      if (sveOK == false) {
        this.$q.notify({
          message: this.$t("administration.teams.notSaved"),
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
          var val = sviInputi.parentElement.children[0].getElementsByTagName(
            "input"
          )[0].value;
          debugger;
          if (val == "" && val == null) this.$refs["input" + i].validate();
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
          var val = sviSelektovi.parentElement.children[0].innerText.split("\n")
            .length;

          if (val <= 1) this.$refs["select" + i].validate();
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    deleteItem(item) {
      var self = this;
      const index = this.data.indexOf(item);
      let obj = {
        title: self.$t("playerInjuries.warning"),
        message: self.$t("playerInjuries.areYouSureDelete"),
        customCloseBtnText: self.$t("playerInjuries.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("playerInjuries.yes"),
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
    //''''''''''''''''''''''''''''''''''''''''
    // citanje povrede glave
    //........................................
    getDataPredeoPovrede() {
      let linkStr = this.$apiPutanja + "/zadati-nivo-tehnike";
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
          this.dataStavke = response.data.map(this.dajStavke);
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje opste dijagnoze
    //........................................
    getDataOpstaDijagnoza() {
      let linkStr = this.$apiPutanja + "/zadati-nivo-tehnike";
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
          this.dataStavke = response.data.map(this.dajStavke);
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje specificne dijagnoze
    //........................................
    getDataSpecificnaDijagnoza() {
      let linkStr = this.$apiPutanja + "/zadati-nivo-tehnike";
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
          this.dataStavke = response.data.map(this.dajStavke);
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje detalja o povredi
    //........................................
    getDataDetaljiPovrede() {
      let linkStr = this.$apiPutanja + "/zadati-nivo-tehnike";
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
          this.dataStavke = response.data.map(this.dajStavke);
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    otvordeDialog() {
      this.editedItem.korisnikImePrezime = window.$userFullName;
      this.editedItem.datumVreme = this.getDateTime(Date.now());
      this.editedItem.uvodniRadSmanjenIntenzitet = this.getDateTime(Date.now());
      this.editedItem.punRad = this.getDateTime(Date.now());
      this.editedItem.datumVreme =
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.editedItem.uvodniRadSmanjenIntenzitet =
        this.editedItem.uvodniRadSmanjenIntenzitet
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.uvodniRadSmanjenIntenzitet
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.uvodniRadSmanjenIntenzitet
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.editedItem.punRad =
        this.editedItem.punRad
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.punRad
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.punRad
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.datumVreme =
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.editedItem.uvodniRadSmanjenIntenzitet =
        this.editedItem.uvodniRadSmanjenIntenzitet
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.uvodniRadSmanjenIntenzitet
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.uvodniRadSmanjenIntenzitet
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.editedItem.punRad =
        this.editedItem.punRad
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.punRad
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.punRad
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.kpNiz = item.klasifikacijaPovrede.split(", ");
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

      const status = exportFile("povredeIgraca.csv", content, "text/csv");
      let self = this;
      if (status !== true) {
        this.$q.notify({
          message: self.$t("playerInjuries.browserForbids"),
          color: "negative",
          icon: "warning"
        });
      }
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
  color: #3b5d99;
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

*,
*::before,
*::after {
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
  /* appearance: none; */
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
  transition: top 0.3s ease, color 0.3s ease, font-size 0.3s ease;
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
  width: auto;
}

/* TWO */
.custom-field.two input {
  border-radius: 0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background: linear-gradient(90deg, #222, #222) center bottom/0 0.15em
      no-repeat,
    linear-gradient(90deg, #ccc, #ccc) left bottom/100% 0.15em no-repeat,
    linear-gradient(90deg, #fafafa, #fafafa) left bottom/100% no-repeat;
  transition: background-size 0.3s ease;
}

.custom-field.two input.dirty,
.custom-field.two input:not(:placeholder-shown),
.custom-field.two input:focus {
  background-size: 100% 0.15em, 100% 0.1em, 100%;
}
.sakriDugmice {
  display: none;
}
</style>

// Sobzirom da je sve fiksne visine iznad tabele izravunao sam da ej to magican
broj 280
<style lang="sass">
.selektKlass
  .q-field__label
    font-size: 14px
    color: #aaaaaa

  .q-field--float
    background: white !important
    border: 1px solid #3b5d99 !important

  .q-field--float .q-field__label
    transform: translateY(-100%) scale(0.75)
    left: -5px
    background: white
    width: fit-content
    padding: 0 5px
    color: black
    font-size: 16px
  .q-field--auto-height.q-field--labeled .q-field__control-container
    padding-top: 12px;

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
