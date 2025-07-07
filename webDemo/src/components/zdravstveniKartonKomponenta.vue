<template>
  <q-page class="q-pa-sm">
    <q-table
      :title="$t('medicalRecord.stateOfHealth')"
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
      <template v-if="igracID1 != ''" v-slot:top-right="props">
        <q-btn
          @click="novoMerenje()"
          :label="$t('medicalRecord.newRecord')"
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
              >{{props.inFullscreen ? $t('medicalRecord.exitFullscreen') : $t('medicalRecord.enterFullscreen')}}</q-tooltip>
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
              ? $t("medicalRecord.list")
              : $t("medicalRecord.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('medicalRecord.exportCSV')"
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
              <q-tooltip>{{ $t("medicalRecord.delete") }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="editItem(props.row)"
              id="dugmeEdit"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="edit"
            >
              <q-tooltip>{{ $t("medicalRecord.changeData") }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>

        <q-td
          :props="props"
          v-else-if="compare(props.value, props.row.datumVreme)"
          @click="otvoriPreviewDialog(props.row)"
        >
          <div class="" id="username">
            {{ props.value }}
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
            {{ $t("medicalRecord.mesurement") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular ponisti" style="width: 50%">
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
                    ref="input0"
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
                    $t("medicalRecord.date")
                  }}</span>
                </label>
              </q-item>
              <q-item class="formular ponisti" style="width: 50%">
                <label class="custom-field one datumInput">
                  <q-input
                    :readonly="readonly"
                    borderless
                    dense
                    placeholder=" "
                    v-model="editedItem.rokVaznosti"
                    @focus="popniPlaceholder('Span-IP1')"
                    @input="popniPlaceholder('Span-IP1')"
                    @blur="
                      spustiPlaceholder('Span-IP1', editedItem.rokVaznosti)
                    "
                    ref="input1"
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
                            v-model="editedItem.rokVaznosti"
                            @input="() => $refs.qDateProxy1.hide()"
                            mask="DD/MM/YYYY"
                          ></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <span id="Span-IP1" class="placeholder">{{
                    $t("medicalRecord.expirationDate")
                  }}</span>
                </label>
              </q-item>

              <q-item style="margin-top: 20px">
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      disable
                      v-model="editedItem.korisnikImePrezime"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP2',
                          editedItem.korisnikImePrezime
                        )
                      "
                    />
                    <span id="Span-IP2" class="placeholder">{{
                      $t("medicalRecord.whoDidTheTesting")
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
                    :options="daNe"
                    v-model="editedItem.sposobanZaBavljenjeSportom"
                    emit-value
                    map-options
                    ref="select1"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="
                      spustiPlaceholder(
                        'Span-SL1',
                        editedItem.sposobanZaBavljenjeSportom
                      )
                    "
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        $t('medicalRecord.enterAbilityToPlaySports')
                    ]"
                  />
                  <span
                    @click="$refs.select1.showPopup()"
                    id="Span-SL1"
                    class="placeholder placeholder1"
                    >{{ $t("medicalRecord.abilityToPlaySports") }}</span
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.pulsUMiru" :label="$t('medicalRecord.pulseAtRest')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      type="number"
                      placeholder=" "
                      v-model="editedItem.pulsUMiru"
                      @focus="popniPlaceholder('Span-IP3')"
                      @input="popniPlaceholder('Span-IP3')"
                      @blur="
                        spustiPlaceholder('Span-IP3', editedItem.pulsUMiru)
                      "
                    />
                    <span id="Span-IP3" class="placeholder">{{
                      $t("medicalRecord.pulseAtRest")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.arterijskiPritisakUMiruSistolni" :label="$t('medicalRecord.restingArterialPressureSystones')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      type="number"
                      placeholder=" "
                      v-model="editedItem.arterijskiPritisakUMiruSistolni"
                      @focus="popniPlaceholder('Span-IP4')"
                      @input="popniPlaceholder('Span-IP4')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP4',
                          editedItem.arterijskiPritisakUMiruSistolni
                        )
                      "
                    />
                    <span id="Span-IP4" class="placeholder">{{
                      $t("medicalRecord.restingArterialPressureSystones")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.arterijskiPritisakUMiruDijastolni" :label="$t('medicalRecord.restingArterialPressureDistin')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      type="number"
                      placeholder=" "
                      v-model="editedItem.arterijskiPritisakUMiruDijastolni"
                      @focus="popniPlaceholder('Span-IP5')"
                      @input="popniPlaceholder('Span-IP5')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP5',
                          editedItem.arterijskiPritisakUMiruDijastolni
                        )
                      "
                    />
                    <span id="Span-IP5" class="placeholder">{{
                      $t("medicalRecord.restingArterialPressureDistin")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.frekvencijaDisanjaUMiru" :label="$t('medicalRecord.respiratoryRateAtRest')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      type="number"
                      placeholder=" "
                      v-model="editedItem.frekvencijaDisanjaUMiru"
                      @focus="popniPlaceholder('Span-IP6')"
                      @input="popniPlaceholder('Span-IP6')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP6',
                          editedItem.frekvencijaDisanjaUMiru
                        )
                      "
                    />
                    <span id="Span-IP6" class="placeholder">{{
                      $t("medicalRecord.respiratoryRateAtRest")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="custom-field one">
                  <!-- <q-input type="number" dense outlined v-model="editedItem.ekgPregled" :label="$t('medicalRecord.ecgReview')"></q-input> -->
                  <!-- <label class="custom-field one">
                        <input type="text" placeholder=" "
                        v-model="editedItem.ekgPregled"
                        :label="$t('medicalRecord.ecgReview')"
                         />
                        <span class="placeholder">{{$t('medicalRecord.ecgReview')}}</span> -->
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="daNe"
                    v-model="editedItem.ekgPregled"
                    emit-value
                    map-options
                    ref="select2"
                    @focus="popniPlaceholder('Span-SL2')"
                    @input="popniPlaceholder('Span-SL2')"
                    @blur="spustiPlaceholder('Span-SL2', editedItem.ekgPregled)"
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        $t('medicalRecord.enterEcgReview')
                    ]"
                  />
                  <span
                    @click="$refs.select2.showPopup()"
                    id="Span-SL2"
                    class="placeholder placeholder1"
                    >{{ $t("medicalRecord.ecgReview") }}</span
                  >
                  <!-- </label> -->
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="custom-field one">
                  <!-- <q-input type="number" dense outlined v-model="editedItem.krvnaSlika" :label="$t('medicalRecord.bloodTestResults')"></q-input> -->
                  <!-- <label class="custom-field one">
                        <input type="text" placeholder=" "
                        v-model="editedItem.krvnaSlika"
                        :label="$t('medicalRecord.bloodTestResults')"
                         />
                        <span class="placeholder">{{$t('medicalRecord.bloodTestResults')}}</span>
                      </label> -->
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="daNe"
                    v-model="editedItem.krvnaSlika"
                    emit-value
                    map-options
                    ref="select3"
                    @focus="popniPlaceholder('Span-SL3')"
                    @input="popniPlaceholder('Span-SL3')"
                    @blur="spustiPlaceholder('Span-SL3', editedItem.krvnaSlika)"
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        $t('medicalRecord.enterBloodTestResults')
                    ]"
                  />
                  <span
                    @click="$refs.select3.showPopup()"
                    id="Span-SL3"
                    class="placeholder placeholder1"
                    >{{ $t("medicalRecord.bloodTestResults") }}</span
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.institucija" :label="$t('medicalRecord.institution')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.institucija"
                      @focus="popniPlaceholder('Span-IP7')"
                      @input="popniPlaceholder('Span-IP7')"
                      @blur="
                        spustiPlaceholder('Span-IP7', editedItem.institucija)
                      "
                    />
                    <span id="Span-IP7" class="placeholder">{{
                      $t("medicalRecord.institution")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.lekar" :label="$t('medicalRecord.doctor')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.lekar"
                      @focus="popniPlaceholder('Span-IP8')"
                      @input="popniPlaceholder('Span-IP8')"
                      @blur="spustiPlaceholder('Span-IP8', editedItem.lekar)"
                    />
                    <span id="Span-IP8" class="placeholder">{{
                      $t("medicalRecord.doctor")
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
            style="background-color: #f5f8fb; color: #323b62; width: 20%; margin: 0 10px 10px 10px;"
            v-close-popup
          ></q-btn>
          <q-btn
            :label="$t('administration.user.save')"
            @click="addRow"
            type="submit"
            style="background-color: #ff4b00; color: white; width: 20%; margin: 0 10px 10px 10px;"
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
            {{ $t("medicalRecord.mesurement") }}
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
                  :label="$t('medicalRecord.date')"
                  class="datumInputReadOnly"
                  mask="##/##/####"
                />
              </q-item>
              <q-item class="formular ponisti" style="">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="editedItem.rokVaznosti"
                  :label="$t('medicalRecord.expirationDate')"
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
                      :label="$t('medicalRecord.whoDidTheTesting')"
                    />
                    <span class="placeholder">{{
                      $t("medicalRecord.whoDidTheTesting")
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
                    :label="$t('medicalRecord.abilityToPlaySports')"
                    :options="daNe"
                    v-model="editedItem.sposobanZaBavljenjeSportom"
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
                      v-model="editedItem.pulsUMiru"
                      :label="$t('medicalRecord.pulseAtRest')"
                    />
                    <span class="placeholder">{{
                      $t("medicalRecord.pulseAtRest")
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
                      v-model="editedItem.arterijskiPritisakUMiruSistolni"
                      :label="
                        $t('medicalRecord.restingArterialPressureSystones')
                      "
                    />
                    <span class="placeholder">{{
                      $t("medicalRecord.restingArterialPressureSystones")
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
                      v-model="editedItem.arterijskiPritisakUMiruDijastolni"
                      :label="$t('medicalRecord.restingArterialPressureDistin')"
                    />
                    <span class="placeholder">{{
                      $t("medicalRecord.restingArterialPressureDistin")
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
                      v-model="editedItem.frekvencijaDisanjaUMiru"
                      :label="$t('medicalRecord.respiratoryRateAtRest')"
                    />
                    <span class="placeholder">{{
                      $t("medicalRecord.respiratoryRateAtRest")
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
                      v-model="editedItem.ekgPregled"
                      :label="$t('medicalRecord.ecgReview')"
                    />
                    <span class="placeholder">{{
                      $t("medicalRecord.ecgReview")
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
                      v-model="editedItem.krvnaSlika"
                      :label="$t('medicalRecord.bloodTestResults')"
                    />
                    <span class="placeholder">{{
                      $t("medicalRecord.bloodTestResults")
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
                      v-model="editedItem.institucija"
                      :label="$t('medicalRecord.institution')"
                    />
                    <span class="placeholder">{{
                      $t("medicalRecord.institution")
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
                      v-model="editedItem.lekar"
                      :label="$t('medicalRecord.doctor')"
                    />
                    <span class="placeholder">{{
                      $t("medicalRecord.doctor")
                    }}</span>
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
      daNe: [
        { label: this.$t("medicalRecord.yes"), value: 1 },
        { label: this.$t("medicalRecord.no"), value: 0 }
      ],
      editedItem: {
        datumVreme: "",
        ident: "",
        identKorisnik: "",
        korisnikImePrezime: "",
        identUser: this.igracID1,
        arterijskiPritisakUMiruDijastolni: 0,
        arterijskiPritisakUMiruSistolni: 0,
        ekgPregled: null,
        frekvencijaDisanjaUMiru: 0,
        institucija: "",
        korisnikImePrezime: "",
        krvnaSlika: null,
        lekar: "",
        pulsUMiru: 0,
        rokVaznosti: "",
        sposobanZaBavljenjeSportom: null
      },
      defaultItem: {
        datumVreme: "",
        ident: "",
        identKorisnik: "",
        korisnikImePrezime: "",
        identUser: this.igracID1,
        arterijskiPritisakUMiruDijastolni: 0,
        arterijskiPritisakUMiruSistolni: 0,
        ekgPregled: null,
        frekvencijaDisanjaUMiru: 0,
        institucija: "",
        korisnikImePrezime: "",
        krvnaSlika: null,
        lekar: "",
        pulsUMiru: 0,
        rokVaznosti: "",
        sposobanZaBavljenjeSportom: null
      },
      mode: "list",
      columns: [
        {
          name: "datumVreme",
          required: true,
          label: this.$t("medicalRecord.date"),
          align: "left",
          field: "datumVreme",
          sortable: true,
          format: val => date.formatDate(val, "DD/MM/YYYY")
        },
        {
          name: "sposobanZaBavljenjeSportom",
          align: "left",
          label: this.$t("medicalRecord.abilityToPlaySports"),
          field: "sposobanZaBavljenjeSportom",
          sortable: true
        },
        {
          name: "pulsUMiru",
          align: "left",
          label: this.$t("medicalRecord.pulseAtRest"),
          field: "pulsUMiru",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t("medicalRecord.action"),
          field: "action",
          sortable: true
        }
      ],
      data: [],
      igracID1: "",
      pagination: {
        rowsPerPage: 10
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
    this.editedItem.rokVaznosti = new Date()
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

      if (val === "" || val == null || val.length == 0) {
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
      this.editedItem.rokVaznosti =
        this.editedItem.rokVaznosti
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.rokVaznosti
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.rokVaznosti
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.readonly = true;
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje igraca
    //........................................
    getDataZaID() {
      let linkStr =
        this.$apiPutanja + "/zdravstveni-status/igrac/" + this.igracID1;
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
          this.data = response.data.map(this.dajPodatke);
          this.loadingUtakmice = false;
          debugger;
        })
        .catch(e => {
          //this.errors.push(e);
          this.loadingUtakmice = false;
          console.log("Greska: " + e);
        });
    },
    dajPodatke(item) {
      let self = this;
      //debugger
      return {
        arterijskiPritisakUMiruDijastolni:
          item.arterijskiPritisakUMiruDijastolni,
        arterijskiPritisakUMiruSistolni: item.arterijskiPritisakUMiruSistolni,
        datumTestiranja: item.datumTestiranja,
        datumVreme: item.datumVreme,
        ekgPregled: item.ekgPregled,
        frekvencijaDisanjaUMiru: item.frekvencijaDisanjaUMiru,
        ident: item.ident,
        identKorisnik: item.identKorisnik,
        identUser: item.identUser,
        institucija: item.institucija,
        korisnikImePrezime: item.korisnikImePrezime,
        krvnaSlika: item.krvnaSlika,
        lekar: item.lekar,
        pulsUMiru: item.pulsUMiru,
        rokVaznosti: item.rokVaznosti,
        sposobanZaBavljenjeSportom: dajJesOrNou(item.sposobanZaBavljenjeSportom)
      };
      function dajJesOrNou(a) {
        let odg = "";
        if (a == 1) {
          odg = "Da";
        } else {
          odg = "Ne";
        }
        return odg;
      }
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje novog igraca
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/zdravstveni-status";
      var self = this;
      let datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      let datumVreme2 = this.getDateTime(this.editedItem.rokVaznosti);

      var dataString = {
        datumVreme: datumVreme1,
        ident: 0,
        identKorisnik: 0, // ide ulogovani korisnik, iz bekenda! za sad... this.editedItem.identKorisnik,
        korisnikImePrezime: this.editedItem.korisnikImePrezime,
        identUser: this.igracID1,
        institucija: this.editedItem.institucija,
        arterijskiPritisakUMiruDijastolni: parseInt(
          this.editedItem.arterijskiPritisakUMiruDijastolni
        ),
        arterijskiPritisakUMiruSistolni: parseInt(
          this.editedItem.arterijskiPritisakUMiruSistolni
        ),
        datumTestiranja: datumVreme1,
        ekgPregled: this.editedItem.ekgPregled,
        frekvencijaDisanjaUMiru: parseInt(
          this.editedItem.frekvencijaDisanjaUMiru
        ),
        krvnaSlika: this.editedItem.krvnaSlika,
        lekar: this.editedItem.lekar,
        pulsUMiru: parseInt(this.editedItem.pulsUMiru),
        rokVaznosti: datumVreme2,
        sposobanZaBavljenjeSportom: this.editedItem.sposobanZaBavljenjeSportom
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
            message: self.$t("medicalRecord.newRecordSuccessfullyAdded"),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          self.$q.notify({
            message: "Novi zapis NIJE uspešno dodat!",
            color: "red",
            actions: [
              {
                label: "Ponovo",
                color: "yellow",
                handler: () => {
                  self.novoMerenje();
                }
              },
              {
                label: "Odustani",
                color: "white",
                handler: () => {
                  /* ... */
                }
              }
            ]
          });
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena merenja
    //........................................
    putData() {
      debugger;
      let linkStr =
        this.$apiPutanja + "/zdravstveni-status/" + this.editedItem.ident;
      var self = this;
      let datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      let datumVreme2 = this.getDateTime(this.editedItem.rokVaznosti);

      var dataString = {
        datumVreme: datumVreme1,
        ident: 0,
        identKorisnik: 0, // ide ulogovani korisnik, iz bekenda! za sad... this.editedItem.identKorisnik,
        korisnikImePrezime: "", // this.editedItem.korisnikImePrezime,
        identUser: this.igracID1,
        institucija: this.editedItem.institucija,
        arterijskiPritisakUMiruDijastolni: this.editedItem
          .arterijskiPritisakUMiruDijastolni,
        arterijskiPritisakUMiruSistolni: this.editedItem
          .arterijskiPritisakUMiruSistolni,
        datumTestiranja: datumVreme1,
        ekgPregled: this.editedItem.ekgPregled,
        frekvencijaDisanjaUMiru: this.editedItem.frekvencijaDisanjaUMiru,
        krvnaSlika: this.editedItem.krvnaSlika,
        lekar: this.editedItem.lekar,
        pulsUMiru: this.editedItem.pulsUMiru,
        rokVaznosti: datumVreme2,
        sposobanZaBavljenjeSportom: this.editedItem.sposobanZaBavljenjeSportom
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
            message: self.$t("medicalRecord.recordDataChangedSuccessfully"),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          self.$q.notify({
            message: "Novi zapis NIJE uspešno dodat!",
            color: "red",
            actions: [
              {
                label: "Ponovo",
                color: "yellow",
                handler: () => {
                  self.novoMerenje();
                }
              },
              {
                label: "Odustani",
                color: "white",
                handler: () => {
                  /* ... */
                }
              }
            ]
          });
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje/deaktiviranje igraca
    //........................................
    deleteData(item) {
      let linkStr = this.$apiPutanja + "/zdravstveni-status/" + item.ident;
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
            message: self.$t("medicalRecord.recordDataDeletedSuccessfully"),
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
    novoMerenje() {
      this.editedItem.korisnikImePrezime = window.$userFullName;
      this.editedItem.datumVreme = this.getDateTime(Date.now());
      this.editedItem.rokVaznosti = this.getDateTime(Date.now());
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
      this.editedItem.rokVaznosti =
        this.editedItem.rokVaznosti
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.rokVaznosti
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.rokVaznosti
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
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

      if (
        this.editedItem.sposobanZaBavljenjeSportom === null ||
        this.editedItem.sposobanZaBavljenjeSportom === ""
      )
        sveOK = false;
      if (
        this.editedItem.ekgPregled === null ||
        this.editedItem.ekgPregled === ""
      )
        sveOK = false;
      if (
        this.editedItem.krvnaSlika === null ||
        this.editedItem.krvnaSlika === ""
      )
        sveOK = false;

      console.log("sveOK");
      console.log(sveOK);
      console.log("sveOK");

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
      var self = this;
      const index = this.data.indexOf(item);
      let obj = {
        title: self.$t("medicalRecord.warning"),
        message: self.$t("medicalRecord.areYouSureDelete"),
        customCloseBtnText: self.$t("medicalRecord.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("medicalRecord.yes"),
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
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      if (item.sposobanZaBavljenjeSportom == "Da") {
        this.editedItem.sposobanZaBavljenjeSportom = 1;
      } else {
        this.editedItem.sposobanZaBavljenjeSportom = 0;
      }
      this.editedItem.sposobanZaBavljenjeSportom;
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
      this.editedItem.rokVaznosti =
        this.editedItem.rokVaznosti
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.rokVaznosti
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.rokVaznosti
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
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

      const status = exportFile("zdravstveniKarton.csv", content, "text/csv");
      let self = this;
      if (status !== true) {
        this.$q.notify({
          message: self.$t("medicalRecord.browserForbids"),
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
tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}
.sakriDugmice {
  display: none;
}
</style>
