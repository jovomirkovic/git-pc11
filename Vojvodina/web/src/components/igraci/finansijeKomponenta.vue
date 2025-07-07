<template>
  <q-page class="q-pa-sm">
    <!-- <div class="row"
          style="
            position: absolute;
            top: -90px;
            z-index: 5000;
            margin: 0 30%;"
            >
            <h5> {{$t('players.finance.selectedPlayer')}}: {{this.igrac}}</h5>
            <q-btn style="padding:22px;margin:10px;color:red" flat round icon="people" @click="izborIgraca()" >
              <q-tooltip>{{$t('players.finance.browsePlayers')}}</q-tooltip>
            </q-btn>
        </div> -->
    <q-table
      :title="$t('players.finance.dataOnFinancialInvestmentsInPlayers')"
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
      class="mojaTabela my-sticky-header-table"
      :loading="loadingUtakmice"
      style="
            background-color: unset;
            box-shadow: unset;
          "
      table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10"
    >
      <template v-if="igrID != ''" v-slot:top-right="props">
        <q-btn
          v-if="Object.keys(selektovaniIgrac).length != 0"
          @click="otvordeDialog()"
          :label="$t('players.finance.newMesurement')"
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
              >{{props.inFullscreen ? $t('players.finance.exitFullscreen') : $t('players.finance.enterFullscreen')}}</q-tooltip>
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
              ? $t("players.finance.list")
              : $t("players.finance.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('players.finance.exportCSV')"
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
              <q-tooltip>{{ $t("players.finance.delete") }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="editItem(props.row)"
              id="dugmeEdit"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="edit"
            >
              <q-tooltip>{{ $t("players.finance.changeData") }}</q-tooltip>
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
            {{ $t("players.finance.mesurement") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular ponisti" style="">
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
                    $t("players.finance.date")
                  }}</span>
                </label>
              </q-item>

              <q-item style="margin-top: 20px;">
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="daNe"
                    v-model="editedItem.obestecenjePlacenoZaIgraca"
                    emit-value
                    map-options
                    ref="select1"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="
                      spustiPlaceholder(
                        'Span-SL1',
                        editedItem.obestecenjePlacenoZaIgraca
                      )
                    "
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        $t('administration.principlesOfTheGame.requiredField')
                    ]"
                  />
                  <span
                    @click="$refs.select1.showPopup()"
                    id="Span-SL1"
                    class="placeholder placeholder1"
                    >{{
                      $t("players.finance.compensationPaidForThePlayer")
                    }}</span
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.naknadaZaPotpis" :label="$t('players.finance.signatureFee')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      type="number"
                      :readonly="readonly"
                      v-model="editedItem.naknadaZaPotpis"
                      :label="$t('players.finance.signatureFee')"
                    />
                    <span class="placeholder"
                      >{{ $t("players.finance.signatureFee") }} (€)</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <!-- <q-item>
                    <q-item-section> -->
              <!-- <q-input type="number" dense outlined v-model="editedItem.procenatKluba" :label="$t('players.finance.theClubsPercentageInThePlayersLegalBusiness')"></q-input> -->
              <!-- <label class="custom-field one">
                        <input type="text" placeholder=" "
                        v-model="editedItem.procenatKluba"
                        :label="$t('players.finance.theClubsPercentageInThePlayersLegalBusiness')"
                        />
                        <span class="placeholder">{{$t('players.finance.theClubsPercentageInThePlayersLegalBusiness')}} [%]</span>
                      </label>
                    </q-item-section>
                  </q-item> -->

              <q-item>
                <q-item-section>
                  <div
                    style="margin: 5px 5px 20px 5px; font-size: 12pt; text-align: center;"
                  >
                    {{
                      $t(
                        "players.finance.theClubsPercentageInThePlayersLegalBusiness"
                      )
                    }}
                  </div>
                  <div class="row">
                    <div class="col">
                      <q-btn
                        round
                        icon="remove"
                        style="font-size: 10pt; color: black; float: left"
                        @click="
                          editedItem.procenatKluba > 0
                            ? (editedItem.procenatKluba =
                                editedItem.procenatKluba - 1)
                            : ''
                        "
                      />
                    </div>
                    <div class="col-9">
                      <q-slider
                        :readonly="readonly"
                        class="slajderKlasa"
                        style="width: 100%"
                        v-model="editedItem.procenatKluba"
                        label-always
                        markers
                        :min="0"
                        :max="100"
                        :step="1"
                      />
                    </div>
                    <div class="col">
                      <q-btn
                        round
                        icon="add"
                        style="font-size: 10pt; color: black; float: right"
                        @click="
                          editedItem.procenatKluba < 100
                            ? (editedItem.procenatKluba =
                                editedItem.procenatKluba + 1)
                            : ''
                        "
                      />
                    </div>
                  </div>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.putniTroskoviMesecni" :label="$t('players.finance.travelExpensesMonthly')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      :readonly="readonly"
                      type="number"
                      v-model="editedItem.putniTroskoviMesecni"
                      :label="$t('players.finance.travelExpensesMonthly')"
                    />
                    <span class="placeholder">{{
                      $t("players.finance.travelExpensesMonthly")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.stipendijskiUgovorMesecni" :label="$t('players.finance.scholarshipAgreementMonthly')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      :readonly="readonly"
                      type="number"
                      v-model="editedItem.stipendijskiUgovorMesecni"
                      :label="$t('players.finance.scholarshipAgreementMonthly')"
                    />
                    <span class="placeholder">{{
                      $t("players.finance.scholarshipAgreementMonthly")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.ishrana" :label="$t('players.finance.nutrition')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      :readonly="readonly"
                      type="number"
                      v-model="editedItem.ishrana"
                      :label="$t('players.finance.nutrition')"
                    />
                    <span class="placeholder">{{
                      $t("players.finance.nutrition")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.smestajMesecniTroskovi" :label="$t('players.finance.accommodationCostMonthly')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      :readonly="readonly"
                      type="number"
                      v-model="editedItem.smestajMesecniTroskovi"
                      :label="$t('players.finance.accommodationCostMonthly')"
                    />
                    <span class="placeholder">{{
                      $t("players.finance.accommodationCostMonthly")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.profesionalniUgovorMesecniIznos" :label="$t('players.finance.proffesionalContractMonthly')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      :readonly="readonly"
                      type="number"
                      v-model="editedItem.profesionalniUgovorMesecniIznos"
                      :label="$t('players.finance.proffesionalContractMonthly')"
                    />
                    <span class="placeholder">{{
                      $t("players.finance.proffesionalContractMonthly")
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
            {{ $t("players.finance.mesurement") }}
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
                  :label="$t('players.finance.date')"
                  class="datumInputReadOnly"
                  mask="##/##/####"
                />
              </q-item>

              <q-item>
                <q-item-section>
                  <q-select
                    readonly
                    borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    :label="$t('players.finance.compensationPaidForThePlayer')"
                    :options="daNe"
                    v-model="editedItem.obestecenjePlacenoZaIgraca"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.naknadaZaPotpis" :label="$t('players.finance.signatureFee')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      v-model="editedItem.naknadaZaPotpis"
                      :label="$t('players.finance.signatureFee')"
                    />
                    <span class="placeholder">{{
                      $t("players.finance.signatureFee")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.procenatKluba" :label="$t('players.finance.theClubsPercentageInThePlayersLegalBusiness')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.procenatKluba"
                      :label="
                        $t(
                          'players.finance.theClubsPercentageInThePlayersLegalBusiness'
                        )
                      "
                    />
                    <span class="placeholder">{{
                      $t(
                        "players.finance.theClubsPercentageInThePlayersLegalBusiness"
                      )
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.putniTroskoviMesecni" :label="$t('players.finance.travelExpensesMonthly')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.putniTroskoviMesecni"
                      :label="$t('players.finance.travelExpensesMonthly')"
                    />
                    <span class="placeholder">{{
                      $t("players.finance.travelExpensesMonthly")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.stipendijskiUgovorMesecni" :label="$t('players.finance.scholarshipAgreementMonthly')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.stipendijskiUgovorMesecni"
                      :label="$t('players.finance.scholarshipAgreementMonthly')"
                    />
                    <span class="placeholder">{{
                      $t("players.finance.scholarshipAgreementMonthly")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.ishrana" :label="$t('players.finance.nutrition')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.ishrana"
                      :label="$t('players.finance.nutrition')"
                    />
                    <span class="placeholder">{{
                      $t("players.finance.nutrition")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.smestajMesecniTroskovi" :label="$t('players.finance.accommodationCostMonthly')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.smestajMesecniTroskovi"
                      :label="$t('players.finance.accommodationCostMonthly')"
                    />
                    <span class="placeholder">{{
                      $t("players.finance.accommodationCostMonthly")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input type="number" dense outlined v-model="editedItem.profesionalniUgovorMesecniIznos" :label="$t('players.finance.proffesionalContractMonthly')"></q-input> -->
                  <label class="custom-field one">
                    <input
                      readonly
                      type="text"
                      placeholder=" "
                      v-model="editedItem.profesionalniUgovorMesecniIznos"
                      :label="$t('players.finance.proffesionalContractMonthly')"
                    />
                    <span class="placeholder">{{
                      $t("players.finance.proffesionalContractMonthly")
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
      loadingUtakmice: false,
      date: "",
      filter: "",
      customer: {},
      new_customer: false,
      readonly: false,
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
        userIdent: this.igrID,
        ishrana: 0,
        naknadaZaPotpis: 0,
        obestecenjePlacenoZaIgraca: "",
        procenatKluba: 0,
        profesionalniUgovorMesecniIznos: 0,
        putniTroskoviMesecni: 0,
        smestajMesecniTroskovi: 0,
        stipendijskiUgovorMesecni: 0
      },
      defaultItem: {
        datumVreme: "",
        ident: "",
        identKorisnik: "",
        korisnikImePrezime: "",
        userIdent: this.igrID,
        ishrana: 0,
        naknadaZaPotpis: 0,
        obestecenjePlacenoZaIgraca: "",
        procenatKluba: 0,
        profesionalniUgovorMesecniIznos: 0,
        putniTroskoviMesecni: 0,
        smestajMesecniTroskovi: 0,
        stipendijskiUgovorMesecni: 0
      },
      mode: "list",
      columns: [
        {
          name: "datumVreme",
          required: true,
          label: this.$t("players.finance.date"),
          align: "left",
          field: "datumVreme",
          sortable: true,
          format: val => date.formatDate(val, "DD/MM/YYYY")
        },
        {
          name: "obestecenjePlacenoZaIgraca",
          align: "left",
          label: this.$t("players.finance.compensationPaidForThePlayer"),
          field: "obestecenjePlacenoZaIgraca",
          sortable: true,
          format: val =>
            val == 1
              ? this.$t("players.finance.yes")
              : this.$t("players.finance.no")
        },
        {
          name: "putniTroskoviMesecni",
          align: "left",
          label: this.$t("players.finance.fullCostMonthly"),
          field: "putniTroskoviMesecni",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t("players.finance.action"),
          field: "action",
          sortable: true
        }
      ],
      data: [],
      igr: "",
      igrID: "",
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  watch: {
    selektovaniIgrac: function(val) {
      this.igr = val.igrac;
      this.igrID = val.igracID;

      this.getDataZaID();
    }
  },
  mounted() {
    if (this.selektovaniIgrac.igracID != undefined) {
      this.igr = this.selektovaniIgrac.igrac;
      this.igrID = this.selektovaniIgrac.igracID;

      this.getDataZaID();
    }

    this.editedItem.datumVreme = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");
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
      console.log(item);
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
        this.$apiPutanja + "/igrac-finansijska-ulaganja/igrac/" + this.igrID;
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
    // dodavsanje novog igraca
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/igrac-finansijska-ulaganja";
      var self = this;
      var datumVreme1;
      try {
        datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      } catch (error) {}

      var dataString = {
        datumVreme: datumVreme1,
        ident: 0,
        identKorisnik: 0, // ide ulogovani korisnik, iz bekenda! za sad... this.editedItem.identKorisnik,
        korisnikImePrezime: "", // this.editedItem.korisnikImePrezime,
        userIdent: this.igrID,
        ishrana: this.editedItem.ishrana,
        naknadaZaPotpis: this.editedItem.naknadaZaPotpis,
        obestecenjePlacenoZaIgraca: this.editedItem.obestecenjePlacenoZaIgraca,
        procenatKluba: this.editedItem.procenatKluba,
        profesionalniUgovorMesecniIznos: this.editedItem
          .profesionalniUgovorMesecniIznos,
        putniTroskoviMesecni: this.editedItem.putniTroskoviMesecni,
        smestajMesecniTroskovi: this.editedItem.smestajMesecniTroskovi,
        stipendijskiUgovorMesecni: this.editedItem.stipendijskiUgovorMesecni
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
            message: self.$t("players.finance.newMeasurementSuccessfullyAdded"),
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
                  self.otvordeDialog();
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
        this.$apiPutanja +
        "/igrac-finansijska-ulaganja/" +
        this.editedItem.ident;
      var self = this;
      var datumVreme1;
      try {
        datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      } catch (error) {}

      var dataString = {
        datumVreme: datumVreme1,
        ident: 0,
        identKorisnik: 0, // ide ulogovani korisnik, iz bekenda! za sad... this.editedItem.identKorisnik,
        korisnikImePrezime: "", // this.editedItem.korisnikImePrezime,
        userIdent: this.igrID,
        ishrana: this.editedItem.ishrana,
        naknadaZaPotpis: this.editedItem.naknadaZaPotpis,
        obestecenjePlacenoZaIgraca: this.editedItem.obestecenjePlacenoZaIgraca,
        procenatKluba: this.editedItem.procenatKluba,
        profesionalniUgovorMesecniIznos: this.editedItem
          .profesionalniUgovorMesecniIznos,
        putniTroskoviMesecni: this.editedItem.putniTroskoviMesecni,
        smestajMesecniTroskovi: this.editedItem.smestajMesecniTroskovi,
        stipendijskiUgovorMesecni: this.editedItem.stipendijskiUgovorMesecni
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
            message: self.$t(
              "players.finance.measurementDataChangedSuccessfully"
            ),
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
                  self.otvordeDialog();
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
      let linkStr =
        this.$apiPutanja + "/igrac-finansijska-ulaganja/" + item.ident;
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
            message: self.$t(
              "players.finance.measurementDataDeletedSuccessfully"
            ),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          self.$q.notify({
            message: "Podaci o finansijama NISU uspešno obrisani!",
            color: "red"
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
      let self = this;
      if (this.editedItem.obestecenjePlacenoZaIgraca === "") {
        this.$refs.select1.validate();

        this.$q.notify({
          message: self.$t("administration.principlesOfTheGame.requiredField"),
          color: "negative",
          icon: "warning"
        });
        return;
      }

      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem);
        this.putData();
      } else {
        this.postData();
      }
      this.close();
    },
    deleteItem(item) {
      var self = this;
      const index = this.data.indexOf(item);
      let obj = {
        title: self.$t("players.finance.warning"),
        message: self.$t("players.finance.areYouSureDelete"),
        customCloseBtnText: self.$t("players.finance.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("players.finance.yes"),
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
    otvordeDialog() {
      this.editedItem.datumVreme = this.getDateTime(Date.now());
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

      const status = exportFile("finansije.csv", content, "text/csv");
      let self = this;
      if (status !== true) {
        this.$q.notify({
          message: self.$t("players.finance.browserForbids"),
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
