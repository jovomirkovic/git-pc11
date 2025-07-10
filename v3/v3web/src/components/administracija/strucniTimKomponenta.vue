<template>
  <q-page class="q-pa-sm">
    <q-table
      :title="$t('administration.professionalStaff.profTeam')"
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
      style="background-color: unset; box-shadow: unset"
      table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10"
    >
      <template v-slot:top-right="props">
        <q-btn
          @click="otvordeDialog()"
          class="q-mr-xs dugmeNewNesto"
          :label="$t('administration.professionalStaff.newMember')"
        />

        <q-input
          outlined
          dense
          class="dugmeSearch"
          debounce="300"
          v-model="filter"
        >
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
          @click="
            mode = mode === 'grid' ? 'list' : 'grid';
            separator = mode === 'grid' ? 'none' : 'horizontal';
          "
          v-if="!props.inFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            mode === "grid" ? $t("table.list") : $t("table.grid")
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
        <q-th style="color: #ffffff00; min-width: 110px">
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

        <q-td
          :props="props"
          v-else-if="props.value == props.row.ime"
          @click="otvoriPreviewDialog(props.row)"
        >
          <div class="" id="username">
            {{ props.row.ime }}
          </div>
        </q-td>

        <q-td
          :props="props"
          v-else-if="props.value == props.row.roles"
          @click="otvoriPreviewDialog(props.row)"
        >
          <div>
            {{ props.row.roles.join(", ") }}
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
      <q-card style="width: 600px; max-width: 60vw">
        <q-card-section>
          <q-btn
            icon="close"
            @click="close"
            flat
            round
            dense
            style="float: right"
            v-close-popup
          ></q-btn>
          <div class="text-h6" style="text-align: center">
            {{ $t("administration.professionalStaff.profTeam") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.ime" :label="$t('administration.professionalStaff.name')"
                      :rules="[val => val !== null && val !== '' || $t('administration.professionalStaff.enterName')]"
                      ></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.ime"
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')"
                      @blur="spustiPlaceholder('Span-IP1', editedItem.ime)"
                      ref="input1"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          $t('administration.professionalStaff.enterName'),
                      ]"
                    />
                    <span id="Span-IP1" class="placeholder">{{
                      $t("administration.professionalStaff.name")
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
                      v-model="editedItem.prezime"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="spustiPlaceholder('Span-IP2', editedItem.prezime)"
                      ref="input2"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          $t('administration.professionalStaff.enterSurname'),
                      ]"
                    />
                    <span id="Span-IP2" class="placeholder">{{
                      $t("administration.professionalStaff.surname")
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
                    multiple
                    :use-chips="!readonly"
                    :options="listOptions"
                    v-model="editedItem.roles"
                    emit-value
                    map-options
                    ref="select1"
                    :style="{
                      height: [editedItem.roles.length > 3 ? '80px' : '40px'],
                    }"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="spustiPlaceholder('Span-SL1', editedItem.roles)"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '' && val.length != 0) ||
                        $t('administration.professionalStaff.enterRole'),
                    ]"
                  />
                  <span
                    @click="$refs.select1.showPopup()"
                    id="Span-SL1"
                    class="placeholder placeholder1"
                    >{{ $t("administration.professionalStaff.role") }}</span
                  >

                  <!-- @click="close" -->
                  <!-- v-close-popup -->
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
                    :options="opcijeLicenca"
                    v-model="editedItem.licenca"
                    emit-value
                    map-options
                    ref="select2"
                    @focus="popniPlaceholder('Span-SL2')"
                    @input="popniPlaceholder('Span-SL2')"
                    @blur="spustiPlaceholder('Span-SL2', editedItem.licenca)"
                  />
                  <span
                    @click="$refs.select2.showPopup()"
                    id="Span-SL2"
                    class="placeholder placeholder1"
                    >{{ $t("administration.professionalStaff.license") }}</span
                  >
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
                    :options="opcijeObrazovanje"
                    v-model="editedItem.obrazovanje"
                    emit-value
                    map-options
                    ref="select3"
                    @focus="popniPlaceholder('Span-SL3')"
                    @input="popniPlaceholder('Span-SL3')"
                    @blur="
                      spustiPlaceholder('Span-SL3', editedItem.obrazovanje)
                    "
                  />
                  <span
                    @click="$refs.select3.showPopup()"
                    id="Span-SL3"
                    class="placeholder placeholder1"
                    >{{
                      $t("administration.professionalStaff.education")
                    }}</span
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
                      v-model="editedItem.obrazovnaInstitucija"
                      ref="input3"
                      @focus="popniPlaceholder('Span-IP3')"
                      @input="popniPlaceholder('Span-IP3')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP3',
                          editedItem.obrazovnaInstitucija
                        )
                      "
                    />
                    <span id="Span-IP3" class="placeholder">{{
                      $t("administration.professionalStaff.educationInst")
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
                      v-model="editedItem.stazUsportu"
                      type="number"
                      ref="input4"
                      @focus="popniPlaceholder('Span-IP4')"
                      @input="popniPlaceholder('Span-IP4')"
                      @blur="
                        spustiPlaceholder('Span-IP4', editedItem.stazUsportu)
                      "
                    />
                    <span id="Span-IP4" class="placeholder">{{
                      $t("administration.professionalStaff.sportInter")
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
                      v-model="editedItem.stazUklubu"
                      type="number"
                      ref="input5"
                      @focus="popniPlaceholder('Span-IP5')"
                      @input="popniPlaceholder('Span-IP5')"
                      @blur="
                        spustiPlaceholder('Span-IP5', editedItem.stazUklubu)
                      "
                    />
                    <span id="Span-IP5" class="placeholder">{{
                      $t("administration.professionalStaff.clubInter")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item class="formular rasiri">
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      v-model="editedItem.datumVazenjaUgovora"
                      @focus="popniPlaceholder('Span-IP6')"
                      @input="popniPlaceholder('Span-IP6')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP6',
                          editedItem.datumVazenjaUgovora
                        )
                      "
                      ref="input6"
                      mask="##/##/####"
                      :rules="[(val) => valiDate(val) || 'DD/MM/YYYY']"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy1"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="editedItem.datumVazenjaUgovora"
                              @input="() => $refs.qDateProxy1.hide()"
                              mask="DD/MM/YYYY"
                            ></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <span id="Span-IP6" class="placeholder">{{
                      $t("administration.professionalStaff.contractExpiration")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item class="formular rasiri">
                <q-item-section>
                  <!-- <q-input dense outlined v-model="editedItem.ugovorenaZarada" :label="$t('administration.professionalStaff.earnings')"></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.ugovorenaZarada"
                      ref="input7"
                      @focus="popniPlaceholder('Span-IP7')"
                      @input="popniPlaceholder('Span-IP7')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP7',
                          editedItem.ugovorenaZarada
                        )
                      "
                    />
                    <span id="Span-IP7" class="placeholder">{{
                      $t("administration.professionalStaff.earnings")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item class="formular rasiri">
                <q-item-section>
                  <label class="custom-field one datumInput">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      v-model="editedItem.vaznostPasosa"
                      mask="##/##/####"
                      @focus="popniPlaceholder('Span-IP8')"
                      @input="popniPlaceholder('Span-IP8')"
                      @blur="
                        spustiPlaceholder('Span-IP8', editedItem.vaznostPasosa)
                      "
                      ref="input8"
                      :rules="[(val) => valiDate(val) || 'DD/MM/YYYY']"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy1"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="editedItem.vaznostPasosa"
                              @input="() => $refs.qDateProxy1.hide()"
                              mask="DD/MM/YYYY"
                            ></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <span id="Span-IP8" class="placeholder">{{
                      $t("administration.professionalStaff.passportImportance")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item class="formular rasiri">
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.brojPasosa"
                      ref="input9"
                      @focus="popniPlaceholder('Span-IP9')"
                      @input="popniPlaceholder('Span-IP9')"
                      @blur="
                        spustiPlaceholder('Span-IP9', editedItem.brojPasosa)
                      "
                    />
                    <span id="Span-IP9" class="placeholder">{{
                      $t("administration.professionalStaff.passportNum")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item class="formular rasiri">
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.email"
                      ref="input9"
                      @focus="popniPlaceholder('Span-IP9')"
                      @input="popniPlaceholder('Span-IP9')"
                      @blur="spustiPlaceholder('Span-IP9', editedItem.email)"
                    />
                    <span id="Span-IP9" class="placeholder">{{
                      $t("administration.professionalStaff.email")
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
            style="
              background-color: #f5f8fb;
              color: #323b62;
              width: 20%;
              margin: 10px;
            "
            v-close-popup
          ></q-btn>
          <q-btn
            :label="$t('administration.user.save')"
            @click="addRow"
            type="submit"
            style="
              background-color: #ff4b00;
              color: white;
              width: 20%;
              margin: 10px;
            "
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dataPreview">
      <q-card style="width: 600px; max-width: 60vw">
        <q-card-section>
          <q-btn
            icon="close"
            @click="close"
            flat
            round
            dense
            style="float: right"
            v-close-popup
          ></q-btn>
          <div class="text-h6" style="text-align: center">
            {{ $t("administration.professionalStaff.profTeam") }}
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      v-model="editedItem.ime"
                      readonly
                      :label="$t('administration.professionalStaff.name')"
                    />
                    <span class="placeholder">{{
                      $t("administration.professionalStaff.name")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      readonly
                      v-model="editedItem.prezime"
                      :label="$t('administration.professionalStaff.surname')"
                    />
                    <span class="placeholder">{{
                      $t("administration.professionalStaff.surname")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    borderless
                    style="
                      background: #f5f8fb;
                      color: #323b62;
                      height: 45px;
                      border-radius: 5px;
                      padding-left: 14px !important;
                    "
                    :label="$t('administration.professionalStaff.role')"
                    multiple
                    readonly
                    :options="listOptions"
                    v-model="editedItem.roles"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    borderless
                    style="
                      background: #f5f8fb;
                      color: #323b62;
                      height: 45px;
                      border-radius: 5px;
                      padding-left: 14px !important;
                    "
                    :label="$t('administration.professionalStaff.license')"
                    readonly
                    :options="opcijeLicenca"
                    v-model="editedItem.licenca"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-select
                    borderless
                    style="
                      background: #f5f8fb;
                      color: #323b62;
                      height: 45px;
                      border-radius: 5px;
                      padding-left: 14px !important;
                    "
                    :label="$t('administration.professionalStaff.education')"
                    :options="opcijeObrazovanje"
                    readonly
                    v-model="editedItem.obrazovanje"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      readonly
                      v-model="editedItem.obrazovnaInstitucija"
                      :label="
                        $t('administration.professionalStaff.educationInst')
                      "
                    />
                    <span class="placeholder">{{
                      $t("administration.professionalStaff.educationInst")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      readonly
                      v-model="editedItem.stazUsportu"
                      :label="$t('administration.professionalStaff.sportInter')"
                    />
                    <span class="placeholder">{{
                      $t("administration.professionalStaff.sportInter")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      readonly
                      v-model="editedItem.stazUklubu"
                      :label="$t('administration.professionalStaff.clubInter')"
                    />
                    <span class="placeholder">{{
                      $t("administration.professionalStaff.clubInter")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item-section class="formular ponisti" style="">
                <label class="custom-field one">
                  <input
                    type="text"
                    placeholder=" "
                    readonly
                    v-model="editedItem.datumVazenjaUgovora"
                    :label="
                      $t('administration.professionalStaff.contractExpiration')
                    "
                  />
                  <span class="placeholder">{{
                    $t("administration.professionalStaff.contractExpiration")
                  }}</span>
                </label>
              </q-item-section>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      readonly
                      v-model="editedItem.ugovorenaZarada"
                      :label="$t('administration.professionalStaff.earnings')"
                    />
                    <span class="placeholder">{{
                      $t("administration.professionalStaff.earnings")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item-section class="formular ponisti" style="">
                <label class="custom-field one">
                  <input
                    type="text"
                    placeholder=" "
                    readonly
                    v-model="editedItem.vaznostPasosa"
                    :label="
                      $t('administration.professionalStaff.passportImportance')
                    "
                  />
                  <span class="placeholder">{{
                    $t("administration.professionalStaff.passportImportance")
                  }}</span>
                </label>
              </q-item-section>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      readonly
                      v-model="editedItem.brojPasosa"
                      :label="
                        $t('administration.professionalStaff.passportNum')
                      "
                    />
                    <span class="placeholder">{{
                      $t("administration.professionalStaff.passportNum")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      email=" "
                      readonly
                      v-model="editedItem.email"
                      :label="$t('administration.professionalStaff.email')"
                    />
                    <span class="placeholder">{{
                      $t("administration.professionalStaff.email")
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
      readonly: false,
      loadingUtakmice: false,
      filter: "",
      listOptions: [],
      listOptions1: [
        { label: "Fudbalski trener", value: "Fudbalski trener" },
        { label: "Skaut", value: "Skaut" },
        { label: "Analitičar", value: "Analitičar" },
        { label: "Kondicioni trener", value: "Kondicioni trener" },
        { label: "Trener golmana", value: "Trener golmana" },
        { label: "Lekar", value: "Lekar" },
      ],
      opcijeObrazovanje: [
        {
          label: this.$t("administration.professionalStaff.obrazovanjeOsnovno"),
          value: "Osnovno obrazovanje",
        },
        {
          label: this.$t("administration.professionalStaff.obrazovanjeSrednje"),
          value: "Srednje stručno obrazovanje",
        },
        {
          label: this.$t("administration.professionalStaff.obrazovanjeVisa"),
          value: "Viša školska ustanova",
        },
        {
          label: this.$t("administration.professionalStaff.obrazovanjeVisoka"),
          value: "Visoka školska ustanova",
        },
        {
          label: this.$t("administration.professionalStaff.obrazovanjeMaster"),
          value: "Master studije",
        },
        {
          label: this.$t(
            "administration.professionalStaff.obrazovanjeDoktorske"
          ),
          value: "Doktorske studije",
        },
      ],
      opcijeLicenca: [
        {
          label: this.$t("administration.professionalStaff.profiLicenca"),
          value: "PROFI licenca",
        },
        {
          label: this.$t("administration.professionalStaff.eliteLicenca"),
          value: "ELITE youth licenca",
        },
        {
          label: this.$t("administration.professionalStaff.licencaA"),
          value: "A licenca",
        },
        {
          label: this.$t("administration.professionalStaff.licencaB"),
          value: "B licenca",
        },
        {
          label: this.$t("administration.professionalStaff.licencaC"),
          value: "C licenca",
        },
        {
          label: this.$t("administration.professionalStaff.licencaD"),
          value: "D licenca",
        },
      ],
      customer: {},
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      editedItem: {
        id: 0,
        ime: "",
        prezime: "",
        roles: [],
        obrazovanje: "",
        obrazovnaInstitucija: "",
        ugovorenaZarada: "",
        licenca: "",
        stazUsportu: "0",
        stazUklubu: "0",
        datumVazenjaUgovora: "",
        brojPasosa: "",
        vaznostPasosa: "",
        email: "",
        userName: "",
        password: "",
        active: true,
      },
      defaultItem: {
        id: 0,
        ime: "",
        prezime: "",
        roles: [],
        obrazovanje: "",
        obrazovnaInstitucija: "",
        ugovorenaZarada: "",
        licenca: "",
        stazUsportu: "0",
        stazUklubu: "0",
        datumVazenjaUgovora: "",
        brojPasosa: "",
        vaznostPasosa: "",
        email: "",
        userName: "",
        password: "",
        active: true,
      },
      mode: "list",
      columns: [
        {
          name: "ime",
          required: true,
          label: this.$t("administration.professionalStaff.name"),
          align: "left",
          field: "ime",
          sortable: true,
        },
        {
          name: "prezime",
          align: "left",
          label: this.$t("administration.professionalStaff.surname"),
          field: "prezime",
          sortable: true,
        },
        {
          name: "rolesOpisno",
          align: "left",
          label: this.$t("administration.professionalStaff.tipe"),
          field: "rolesOpisno",
          sortable: true,
          format: (val) =>
            val.filter((e) => !e.includes("Professional staff")).join(", "),
        },
        {
          name: "obrazovanje",
          align: "left",
          label: this.$t("administration.professionalStaff.education"),
          field: "obrazovanje",
          sortable: true,
        },
        {
          name: "stazUsportu",
          align: "left",
          label: this.$t("administration.professionalStaff.sportInter"),
          field: "stazUsportu",
          sortable: true,
        },
        {
          name: "stazUklubu",
          align: "left",
          label: this.$t("administration.professionalStaff.clubInter"),
          field: "stazUklubu",
          sortable: true,
        },
        {
          name: "datumVazenjaUgovora",
          align: "left",
          label: this.$t("administration.professionalStaff.contractExpiration"),
          field: "datumVazenjaUgovora",
          sortable: true,
          format: (val) => date.formatDate(val, "DD/MM/YYYY"),
        },
        {
          name: "vaznostPasosa",
          align: "left",
          label: this.$t("administration.professionalStaff.passportImportance"),
          field: "vaznostPasosa",
          sortable: true,
          format: (val) => date.formatDate(val, "DD/MM/YYYY"),
        },
        {
          name: "action",
          align: "left",
          label: this.$t("table.action"),
          field: "action",
          sortable: true,
        },
      ],
      data: [],
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  mounted() {
    this.editedItem.datumVazenjaUgovora = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");
    this.editedItem.vaznostPasosa = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");
    //this.getData() //idemo da uzmenmo podatke iz baze
    this.getDataRoles();
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
      this.editedItem.datumVazenjaUgovora =
        this.editedItem.datumVazenjaUgovora
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.datumVazenjaUgovora
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.datumVazenjaUgovora
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.editedItem.vaznostPasosa =
        this.editedItem.vaznostPasosa
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.vaznostPasosa
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.vaznostPasosa
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
    // citanje podataka o timu
    //........................................
    getDataRoles() {
      let linkStr = this.$apiPutanja + "/roles";
      this.loadingUtakmice = true;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then((response) => {
          this.listOptions = response.data.map(this.dajRole);
          this.loadingUtakmice = false;
          debugger;
          this.getData();
        })
        .catch((e) => {
          //this.errors.push(e);
          this.loadingUtakmice = false;
          console.log("Greska: " + e);
        });
    },
    dajRole(item) {
      return { label: item.naziv_uloge, value: item.uloga };
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o timu
    //........................................
    getData() {
      debugger;
      let self = this;
      let linkStr = this.$apiPutanja + "/strucni-stab";
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then((response) => {
          self.data = response.data;
          console.log("this.data");
          console.log(self.data);
          self.data.forEach((entry, index) => {
            self.data[index].rolesOpisno = entry.rolesOpisno.filter(
              (e) => !e.includes("Professional staff")
            );
            self.data[index].roles = entry.roles.filter(
              (e) => !e.includes("ROLE_STRUCNI_STAB")
            );
          });
          console.log("this.data");
          console.log(self.data);
          debugger;
        })
        .catch((e) => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje novog korisnika
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/strucni-stab";
      var self = this;
      let datetime = this.getDateTime(this.editedItem.datumVazenjaUgovora);
      let datetime1 = this.getDateTime(this.editedItem.vaznostPasosa);

      var dataString = {
        active: 1,
        brojPasosa: this.editedItem.brojPasosa,
        datumVazenjaUgovora: datetime,
        licenca: this.editedItem.licenca,
        obrazovanje: this.editedItem.obrazovanje,
        obrazovnaInstitucija: this.editedItem.obrazovnaInstitucija,
        ugovorenaZarada: this.editedItem.ugovorenaZarada,
        stazUklubu: this.editedItem.stazUklubu,
        stazUsportu: this.editedItem.stazUsportu,
        vaznostPasosa: datetime1,
        id: this.editedItem.id,
        ime: this.editedItem.ime,
        prezime: this.editedItem.prezime,
        roles: this.editedItem.roles,
        email: this.editedItem.email,
        userName: this.editedItem.email,
        password: "test",
      };

      let data1 = JSON.stringify(dataString);

      debugger;
      this.$axios
        .post(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then(function (response) {
          debugger;
          console.log(response);
          self.$q.notify({
            message: self.$t("administration.professionalStaff.msgPositive"),
            color: "green",
          });
          self.getData();
        })
        .catch(function (error) {
          console.log(error); // The whole error object
          if (error.response) {
            // The server responded with a status code out of 2xx
            console.log(error.response.data); // your JSON error object
            console.log(error.response.data.message); // the message string you want
          } else if (error.request) {
            // The request was made but no response received
            console.log(error.request);
          } else {
            // Something else happened
            console.log("Error", error.message);
          }
          self.$q.notify({
            message: error.response.data.message,
            color: "red",
          });
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena strucnog staba
    //........................................
    putData() {
      debugger;
      let linkStr = this.$apiPutanja + "/strucni-stab/" + this.editedItem.id;
      var self = this;
      let datetime = this.getDateTime(this.editedItem.datumVazenjaUgovora);
      let datetime1 = this.getDateTime(this.editedItem.vaznostPasosa);

      var dataString = {
        active: 1,
        brojPasosa: this.editedItem.brojPasosa,
        datumVazenjaUgovora: datetime,
        licenca: this.editedItem.licenca,
        obrazovanje: this.editedItem.obrazovanje,
        obrazovnaInstitucija: this.editedItem.obrazovnaInstitucija,
        ugovorenaZarada: this.editedItem.ugovorenaZarada,
        stazUklubu: this.editedItem.stazUklubu,
        stazUsportu: this.editedItem.stazUsportu,
        vaznostPasosa: datetime1,
        id: this.editedItem.id,
        ime: this.editedItem.ime,
        prezime: this.editedItem.prezime,
        roles: this.editedItem.roles,
        email: this.editedItem.email,
      };
      debugger;
      let data1 = JSON.stringify(dataString);
      this.$axios
        .put(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then(function (response) {
          debugger;
          console.log(response);
          self.getData();
          self.$q.notify({
            message: self.$t("administration.professionalStaff.msgChange"),
            color: "green",
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);

          self.$q.notify({
            message: response.data.message,
            color: "red",
          });
          //alert(response);
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
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje/deaktiviranje role
    //........................................
    deleteData(item) {
      debugger;
      let linkStr = this.$apiPutanja + "/strucni-stab/" + item.id;
      var self = this;
      debugger;
      this.$axios
        .delete(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then(function (response) {
          debugger;
          console.log(response);
          self.getData();
          self.$q.notify({
            message: self.$t("administration.professionalStaff.msgDel"),
            color: "green",
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    addRow() {
      let sveOK = true;

      if (this.editedItem.ime == null || this.editedItem.ime == "")
        sveOK = false;
      if (this.editedItem.prezime == null || this.editedItem.prezime == "")
        sveOK = false;
      if (this.editedItem.roles == null || this.editedItem.roles == "")
        sveOK = false;
      if (this.editedItem.email == null || this.editedItem.email == "")
        sveOK = false;

      if (sveOK == false) {
        this.$q.notify({
          message: this.$t("administration.professionalStaff.notSaved"),
          color: "red",
        });
        this.zacrveniPrazne();
      } else {
        if (this.editedIndex > -1) {
          debugger;
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
      const index = this.data.indexOf(item);
      let obj = {
        title: this.$t("administration.professionalStaff.war"),
        message: this.$t("administration.professionalStaff.msgDelConf"),
        customCloseBtnText: this.$t("administration.professionalStaff.txtNo"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: this.$t(
          "administration.professionalStaff.txtYes"
        ),
        onConfirm: onConfirmWrapper,
        type: "warning",
        showXclose: true,
      };
      this.$Simplert.open(obj);
      var self = this;
      function onConfirmWrapper() {
        self.data.splice(index, 1);
        self.deleteData(item);
      }
    },
    otvordeDialog() {
      this.editedItem.datumVazenjaUgovora = this.getDateTime(Date.now());
      this.editedItem.vaznostPasosa = this.getDateTime(Date.now());
      this.editedItem.datumVazenjaUgovora =
        this.editedItem.datumVazenjaUgovora
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.datumVazenjaUgovora
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.datumVazenjaUgovora
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.editedItem.vaznostPasosa =
        this.editedItem.vaznostPasosa
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.vaznostPasosa
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.vaznostPasosa
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
      this.editedItem.datumVazenjaUgovora =
        this.editedItem.datumVazenjaUgovora
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.datumVazenjaUgovora
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.datumVazenjaUgovora
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[0];
      this.editedItem.vaznostPasosa =
        this.editedItem.vaznostPasosa
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        this.editedItem.vaznostPasosa
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        this.editedItem.vaznostPasosa
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
    podigniPopunjenePlaceholdere() {
      var i = 0;
      var sviInputi = document.getElementById("Span-IP" + i);
      while (!(i > 1 && sviInputi == null)) {
        if (sviInputi != null) {
          var val =
            sviInputi.parentElement.children[0].getElementsByTagName("input")[0]
              .value;

          if (val != "" && val != null) this.popniPlaceholder("Span-IP" + i);
        }

        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0;
      var sviSelektovi = document.getElementById("Span-SL" + i);
      while (!(i > 1 && sviSelektovi == null)) {
        if (sviSelektovi != null) {
          var val =
            sviSelektovi.parentElement.children[0].innerText.split("\n").length;

          if (val > 1) this.popniPlaceholder("Span-SL" + i);
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    close() {
      this.new_customer = false;
      this.readonly = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.data.map((row) =>
            this.columns
              .map((col) =>
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

      const status = exportFile("strucni_tim.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: this.$t("administration.professionalStaff.msgPrtSc"),
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
};
</script>

<style scoped>
tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}

.q-table__title {
  color: red !important;
  background: green;
}

.sakriDugmice {
  display: none;
}
.rasiri {
  width: 50%;
}
</style>
<style lang="sass">
.q-table__grid-item-card
    height: 100% !important
.q-table__grid-item:first-child
    margin: 4px 0px
</style>
