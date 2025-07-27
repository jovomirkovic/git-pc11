<template>
  <q-page class="q-pa-sm">
    <!-- <div class="row"
          style="
            position: absolute;
            top: -90px;
            z-index: 5000;
            margin: 0 30%;"
            >
            <h5> {{$t('players.morphologicalCharacteristics.selectedPlayer')}}: {{igrac}}</h5>
            <q-btn style="padding:22px;margin:10px;color:red" flat round icon="people" @click="izborIgraca()" >
              <q-tooltip>{{$t('players.morphologicalCharacteristics.browsePlayers')}}</q-tooltip>
            </q-btn>
        </div> -->
    <q-table
      :title="$t('players.morphologicalCharacteristics.mkNaslov')"
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
      style="background-color: unset; box-shadow: unset"
      table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10"
    >
      <template v-if="this.igrID != ''" v-slot:top-right="props">
        <q-btn
          v-if="Object.keys(selektovaniIgrac).length != 0"
          @click="novoMerenje()"
          :label="$t('players.morphologicalCharacteristics.newMesurement')"
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
              >{{props.inFullscreen ? $t('players.morphologicalCharacteristics.exitFullscreen') : $t('players.morphologicalCharacteristics.enterFullscreen')}}</q-tooltip>
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
              ? $t("players.morphologicalCharacteristics.list")
              : $t("players.morphologicalCharacteristics.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('players.morphologicalCharacteristics.exportCSV')"
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
              <q-tooltip>{{
                $t("players.morphologicalCharacteristics.delete")
              }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="editItem(props.row)"
              id="dugmeEdit"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="edit"
            >
              <q-tooltip>{{
                $t("players.morphologicalCharacteristics.changeData")
              }}</q-tooltip>
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
            <!-- TODO: pvde isto datum vreme ne oboji u crveno -->
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
            style="float: right"
            v-close-popup
          ></q-btn>
          <div class="text-h6" style="text-align: center">
            {{ $t("players.morphologicalCharacteristics.measurements") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <!--<q-item>
                     <q-item-section>
                      <q-input dense outlined v-model="editedItem.ident" label="ID"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.igracIdent" label="ID igrača"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.korisnikImePrezime" label="Ko je radio testiranje"></q-input>
                    </q-item-section>
                  </q-item>-->
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
                    :rules="[(val) => valiDate(val) || 'DD/MM/YYYY']"
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
                    $t("players.morphologicalCharacteristics.date")
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
                      v-model="editedItem.telesnaVisina"
                      type="number"
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')"
                      @blur="
                        spustiPlaceholder('Span-IP1', editedItem.telesnaVisina)
                      "
                    />
                    <span id="Span-IP1" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.bodyHeight")
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.procenaKonacneTelesneVisine"
                      type="number"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP2',
                          editedItem.procenaKonacneTelesneVisine
                        )
                      "
                    />
                    <span id="Span-IP2" class="placeholder"
                      >{{
                        $t(
                          "players.morphologicalCharacteristics.finalBodyHeight"
                        )
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.rasponRuku"
                      type="number"
                      @focus="popniPlaceholder('Span-IP3')"
                      @input="popniPlaceholder('Span-IP3')"
                      @blur="
                        spustiPlaceholder('Span-IP3', editedItem.rasponRuku)
                      "
                    />
                    <span id="Span-IP3" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.armSpan")
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.dohvatnaVisina"
                      type="number"
                      @focus="popniPlaceholder('Span-IP4')"
                      @input="popniPlaceholder('Span-IP4')"
                      @blur="
                        spustiPlaceholder('Span-IP4', editedItem.dohvatnaVisina)
                      "
                    />
                    <span id="Span-IP4" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.reachHeight")
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.duzinaStopala"
                      type="number"
                      @focus="popniPlaceholder('Span-IP5')"
                      @input="popniPlaceholder('Span-IP5')"
                      @blur="
                        spustiPlaceholder('Span-IP5', editedItem.duzinaStopala)
                      "
                    />
                    <span id="Span-IP5" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.footLength")
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.telesnaMasa"
                      type="number"
                      @focus="popniPlaceholder('Span-IP6')"
                      @input="popniPlaceholder('Span-IP6')"
                      @blur="
                        spustiPlaceholder('Span-IP6', editedItem.telesnaMasa)
                      "
                    />
                    <span id="Span-IP6" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.bodyMass")
                      }}
                      [kg]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.bmi"
                      type="number"
                      @focus="popniPlaceholder('Span-IP7')"
                      @input="popniPlaceholder('Span-IP7')"
                      @blur="spustiPlaceholder('Span-IP7', editedItem.bmi)"
                    />
                    <span id="Span-IP7" class="placeholder">{{
                      $t("players.morphologicalCharacteristics.bmi")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.masaMisica"
                      type="number"
                      @focus="popniPlaceholder('Span-IP8')"
                      @input="popniPlaceholder('Span-IP8')"
                      @blur="
                        spustiPlaceholder('Span-IP8', editedItem.masaMisica)
                      "
                    />
                    <span id="Span-IP8" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.muscleMassKg")
                      }}
                      [kg]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.muscleMassPercentage"
                      type="number"
                      @focus="popniPlaceholder('Span-IP81')"
                      @input="popniPlaceholder('Span-IP81')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP81',
                          editedItem.muscleMassPercentage
                        )
                      "
                    />
                    <span id="Span-IP81" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.muscleMassKg")
                      }}
                      [%]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.masaTelesneMasti"
                      type="number"
                      @focus="popniPlaceholder('Span-IP913')"
                      @input="popniPlaceholder('Span-IP913')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP913',
                          editedItem.masaTelesneMasti
                        )
                      "
                    />
                    <span id="Span-IP913" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.kgBodyMass")
                      }}
                      [KG]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.procenatTelesneMasti"
                      type="number"
                      @focus="popniPlaceholder('Span-IP942')"
                      @input="popniPlaceholder('Span-IP942')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP942',
                          editedItem.procenatTelesneMasti
                        )
                      "
                    />
                    <span id="Span-IP942" class="placeholder"
                      >{{
                        $t(
                          "players.morphologicalCharacteristics.percentageBodyMass"
                        )
                      }}
                      [%]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.procenatVodeUTelu"
                      type="number"
                      @focus="popniPlaceholder('Span-IP10')"
                      @input="popniPlaceholder('Span-IP10')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP10',
                          editedItem.procenatVodeUTelu
                        )
                      "
                    />
                    <span id="Span-IP10" class="placeholder"
                      >{{
                        $t(
                          "players.morphologicalCharacteristics.percentageWaterBody"
                        )
                      }}
                      [%]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <div style="margin: 0px 10px; padding-bottom: 15px">
                      {{
                        $t(
                          "players.morphologicalCharacteristics.visceralOintment"
                        )
                      }}
                      <q-slider
                        :readonly="readonly"
                        dense
                        class="slajderKlasa"
                        v-model="editedItem.viscelarnaMast"
                        label-always
                        markers
                        :marker-labels="[
                          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                          16, 17, 18, 19, 20,
                        ]"
                        :min="0"
                        :max="20"
                        :step="1"
                      />
                    </div>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.duzinaPotkolenice"
                      type="number"
                      @focus="popniPlaceholder('Span-IP11')"
                      @input="popniPlaceholder('Span-IP11')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP11',
                          editedItem.duzinaPotkolenice
                        )
                      "
                    />
                    <span id="Span-IP11" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.shankLength")
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.duzinaNadkolenice"
                      type="number"
                      @focus="popniPlaceholder('Span-IP12')"
                      @input="popniPlaceholder('Span-IP12')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP12',
                          editedItem.duzinaNadkolenice
                        )
                      "
                    />
                    <span id="Span-IP12" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.thighLength")
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.forearmLength"
                      type="number"
                      @focus="popniPlaceholder('Span-IP121')"
                      @input="popniPlaceholder('Span-IP121')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP121',
                          editedItem.forearmLength
                        )
                      "
                    />
                    <span id="Span-IP121" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.forearmLength")
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.upperArmLength"
                      type="number"
                      @focus="popniPlaceholder('Span-IP122')"
                      @input="popniPlaceholder('Span-IP122')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP122',
                          editedItem.upperArmLength
                        )
                      "
                    />
                    <span id="Span-IP122" class="placeholder"
                      >{{
                        $t(
                          "players.morphologicalCharacteristics.upperArmLength"
                        )
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.handSize"
                      type="number"
                      @focus="popniPlaceholder('Span-IP123')"
                      @input="popniPlaceholder('Span-IP123')"
                      @blur="
                        spustiPlaceholder('Span-IP123', editedItem.handSize)
                      "
                    />
                    <span id="Span-IP123" class="placeholder"
                      >{{
                        $t("players.morphologicalCharacteristics.handSize")
                      }}
                      [cm]</span
                    >
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
                    :options="kojaNoga"
                    v-model="editedItem.dominantnaRuka"
                    emit-value
                    map-options
                    ref="select1"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="
                      spustiPlaceholder('Span-SL1', editedItem.dominantnaRuka)
                    "
                  />
                  <span
                    @click="$refs.select1.showPopup()"
                    id="Span-SL1"
                    class="placeholder placeholder1"
                    >{{
                      $t("players.morphologicalCharacteristics.dominantHand")
                    }}</span
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
                    :options="kojaNoga"
                    v-model="editedItem.dominantnaNoga"
                    emit-value
                    map-options
                    ref="select2"
                    @focus="popniPlaceholder('Span-SL2')"
                    @input="popniPlaceholder('Span-SL2')"
                    @blur="
                      spustiPlaceholder('Span-SL2', editedItem.dominantnaNoga)
                    "
                  />
                  <span
                    @click="$refs.select2.showPopup()"
                    id="Span-SL2"
                    class="placeholder placeholder1"
                    >{{
                      $t("players.morphologicalCharacteristics.dominantLeg")
                    }}</span
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
                    :options="kojaNoga"
                    v-model="editedItem.odskocnaNoga"
                    emit-value
                    map-options
                    ref="select3"
                    @focus="popniPlaceholder('Span-SL3')"
                    @input="popniPlaceholder('Span-SL3')"
                    @blur="
                      spustiPlaceholder('Span-SL3', editedItem.odskocnaNoga)
                    "
                  />
                  <span
                    @click="$refs.select3.showPopup()"
                    id="Span-SL3"
                    class="placeholder placeholder1"
                    >{{
                      $t("players.morphologicalCharacteristics.bounceLeg")
                    }}</span
                  >
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
            v-close-popup
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
            style="float: right"
            v-close-popup
          ></q-btn>
          <div class="text-h6" style="text-align: center">
            {{ $t("players.morphologicalCharacteristics.measurements") }}
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
                  :label="$t('players.morphologicalCharacteristics.date')"
                  class="datumInputReadOnly"
                  mask="##/##/####"
                />
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.telesnaVisina"
                      :label="
                        $t('players.morphologicalCharacteristics.bodyHeight')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.bodyHeight")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.procenaKonacneTelesneVisine"
                      :label="
                        $t(
                          'players.morphologicalCharacteristics.finalBodyHeight'
                        )
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.finalBodyHeight")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.rasponRuku"
                      :label="
                        $t('players.morphologicalCharacteristics.armSpan')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.armSpan")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.dohvatnaVisina"
                      :label="
                        $t('players.morphologicalCharacteristics.reachHeight')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.reachHeight")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.duzinaStopala"
                      :label="
                        $t('players.morphologicalCharacteristics.footLength')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.footLength")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.telesnaMasa"
                      :label="
                        $t('players.morphologicalCharacteristics.bodyMass')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.bodyMass")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.bmi"
                      :label="$t('players.morphologicalCharacteristics.bmi')"
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.bmi")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.masaMisica"
                      :label="
                        $t('players.morphologicalCharacteristics.muscleMassKg')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.muscleMassKg")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.masaTelesneMasti"
                      :label="
                        $t('players.morphologicalCharacteristics.kgBodyMass')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.kgBodyMass")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.procenatTelesneMasti"
                      :label="
                        $t(
                          'players.morphologicalCharacteristics.percentageBodyMass'
                        )
                      "
                    />
                    <span class="placeholder">{{
                      $t(
                        "players.morphologicalCharacteristics.percentageBodyMass"
                      )
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.procenatVodeUTelu"
                      :label="
                        $t(
                          'players.morphologicalCharacteristics.percentageWaterBody'
                        )
                      "
                    />
                    <span class="placeholder">{{
                      $t(
                        "players.morphologicalCharacteristics.percentageWaterBody"
                      )
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.viscelarnaMast"
                      :label="
                        $t(
                          'players.morphologicalCharacteristics.visceralOintment'
                        )
                      "
                    />
                    <span class="placeholder">{{
                      $t(
                        "players.morphologicalCharacteristics.visceralOintment"
                      )
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      dense
                      outlined
                      v-model="editedItem.duzinaPotkolenice"
                      :label="
                        $t('players.morphologicalCharacteristics.shankLength')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.shankLength")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      v-model="editedItem.duzinaNadkolenice"
                      :label="
                        $t('players.morphologicalCharacteristics.thighLength')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.thighLength")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      v-model="editedItem.forearmLength"
                      :label="
                        $t('players.morphologicalCharacteristics.forearmLength')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.forearmLength")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      v-model="editedItem.upperArmLength"
                      :label="
                        $t(
                          'players.morphologicalCharacteristics.upperArmLength'
                        )
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.upperArmLength")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      v-model="editedItem.handSize"
                      :label="
                        $t('players.morphologicalCharacteristics.handSize')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.morphologicalCharacteristics.handSize")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    readonly
                    borderless
                    style="
                      background: #f5f8fb;
                      color: #323b62;
                      height: 45px;
                      border-radius: 5px;
                      margin-top: 10px;
                      padding-left: 14px !important;
                    "
                    :label="
                      $t('players.morphologicalCharacteristics.dominantHand')
                    "
                    :options="kojaNoga"
                    v-model="editedItem.dominantnaRuka"
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
                    style="
                      background: #f5f8fb;
                      color: #323b62;
                      height: 45px;
                      border-radius: 5px;
                      margin-top: 10px;
                      padding-left: 14px !important;
                    "
                    :label="
                      $t('players.morphologicalCharacteristics.dominantLeg')
                    "
                    :options="kojaNoga"
                    v-model="editedItem.dominantnaNoga"
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
                    style="
                      background: #f5f8fb;
                      color: #323b62;
                      height: 45px;
                      border-radius: 5px;
                      margin-top: 10px;
                      padding-left: 14px !important;
                    "
                    :label="
                      $t('players.morphologicalCharacteristics.bounceLeg')
                    "
                    :options="kojaNoga"
                    v-model="editedItem.odskocnaNoga"
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
import { date } from "quasar";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

// var element = document.getElementsByClassName("q-field--filled q-field__control");
// element.setAttribute("style", "background: rgba(0, 0, 0, 0);");
// element.classList.remove("q-field__control");

export default {
  components: {},
  props: ["selektovaniIgrac"],
  data() {
    return {
      readonly: false,
      loadingUtakmice: false,
      date: "",
      filter: "",
      customer: {},
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      kojaNoga: [
        this.$t("players.morphologicalCharacteristics.left"),
        this.$t("players.morphologicalCharacteristics.right"),
      ],
      editedItem: {
        bmi: "",
        datumVreme: "",
        dohvatnaVisina: "",
        dominantnaNoga: "",
        dominantnaRuka: "",
        duzinaNadkolenice: "",
        forearmLength: "",
        upperArmLength: "",
        handSize: "",
        duzinaPotkolenice: "",
        duzinaStopala: "",
        ident: "",
        identKorisnik: "",
        korisnikImePrezime: "",
        masaMisica: "",
        muscleMassPercentage: "",
        odskocnaNoga: "",
        procenaKonacneTelesneVisine: "",
        masaTelesneMasti: "",
        procenatTelesneMasti: "",
        procenatVodeUTelu: "",
        rasponRuku: "",
        telesnaMasa: "",
        telesnaVisina: "",
        userIdent: this.igrID,
        viscelarnaMast: 0,
      },
      defaultItem: {
        bmi: "",
        datumVreme: "",
        dohvatnaVisina: "",
        dominantnaNoga: "",
        dominantnaRuka: "",
        duzinaNadkolenice: "",
        forearmLength: "",
        upperArmLength: "",
        handSize: "",
        duzinaPotkolenice: "",
        duzinaStopala: "",
        ident: "",
        identKorisnik: "",
        korisnikImePrezime: "",
        masaMisica: "",
        muscleMassPercentage: "",
        odskocnaNoga: "",
        procenaKonacneTelesneVisine: "",
        masaTelesneMasti: "",
        procenatTelesneMasti: "",
        procenatVodeUTelu: "",
        rasponRuku: "",
        telesnaMasa: "",
        telesnaVisina: "",
        userIdent: this.igrID,
        viscelarnaMast: 0,
      },
      mode: "list",
      columns: [
        {
          name: "datumVreme",
          required: true,
          label: this.$t("players.morphologicalCharacteristics.date"),
          align: "left",
          field: "datumVreme",
          sortable: true,
          format: (val) => date.formatDate(val, "DD/MM/YYYY"),
        },
        {
          name: "telesnaMasa",
          align: "left",
          label: this.$t("players.morphologicalCharacteristics.bodyMass"),
          field: "telesnaMasa",
          sortable: true,
        },
        {
          name: "telesnaVisina",
          align: "left",
          label: this.$t("players.morphologicalCharacteristics.bodyHeight"),
          field: "telesnaVisina",
          sortable: true,
        },
        {
          name: "action",
          align: "left",
          label: this.$t("players.morphologicalCharacteristics.action"),
          field: "action",
          sortable: true,
        },
      ],
      data: [],
      igr: "",
      igrID: "",
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  watch: {
    selektovaniIgrac: function (val) {
      this.igr = val.igrac;
      this.igrID = val.igracID;

      this.getDataZaID();
    },
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
        item.datumVreme.slice(0, 10).replace(/-/g, "/").split("/")[2] +
        "/" +
        item.datumVreme.slice(0, 10).replace(/-/g, "/").split("/")[1] +
        "/" +
        item.datumVreme.slice(0, 10).replace(/-/g, "/").split("/")[0];
      this.readonly = true;
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje igraca za id igraca
    //........................................
    getDataZaID() {
      let linkStr = this.$apiPutanja + "/morfologije/igrac/" + this.igrID;
      this.loadingUtakmice = true;
      //debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then((response) => {
          debugger;
          this.data = response.data;
          this.loadingUtakmice = false;
          debugger;
        })
        .catch((e) => {
          //this.errors.push(e);
          this.loadingUtakmice = false;
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavanje novog merenja
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/morfologije";
      var self = this;
      var datumVreme1;
      try {
        datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      } catch (error) {}

      var dataString = {
        bmi: this.editedItem.bmi,
        datumVreme: datumVreme1,
        dohvatnaVisina: this.editedItem.dohvatnaVisina,
        dominantnaNoga: this.editedItem.dominantnaNoga,
        dominantnaRuka: this.editedItem.dominantnaRuka,
        duzinaNadkolenice: this.editedItem.duzinaNadkolenice,
        forearmLength: this.editedItem.forearmLength,
        upperArmLength: this.editedItem.upperArmLength,
        handSize: this.editedItem.handSize,
        duzinaPotkolenice: this.editedItem.duzinaPotkolenice,
        duzinaStopala: this.editedItem.duzinaStopala,
        ident: 0,
        identKorisnik: this.editedItem.identKorisnik,
        korisnikImePrezime: this.editedItem.korisnikImePrezime,
        masaMisica: this.editedItem.masaMisica,
        muscleMassPercentage: this.editedItem.muscleMassPercentage,
        odskocnaNoga: this.editedItem.odskocnaNoga,
        procenaKonacneTelesneVisine:
          this.editedItem.procenaKonacneTelesneVisine,
        masaTelesneMasti: this.editedItem.masaTelesneMasti,
        procenatTelesneMasti: this.editedItem.procenatTelesneMasti,
        procenatVodeUTelu: this.editedItem.procenatVodeUTelu,
        rasponRuku: this.editedItem.rasponRuku,
        telesnaMasa: this.editedItem.telesnaMasa,
        telesnaVisina: this.editedItem.telesnaVisina,
        userIdent: this.igrID,
        viscelarnaMast: this.editedItem.viscelarnaMast,
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
          self.getDataZaID();
          self.$q.notify({
            message: "Novo merenje je uspešno dodato!",
            color: "green",
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena merenja
    //........................................
    putData() {
      debugger;
      let linkStr = this.$apiPutanja + "/morfologije/" + this.editedItem.ident;
      var self = this;
      var datumVreme1;
      try {
        datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      } catch (error) {}

      var dataString = {
        bmi: this.editedItem.bmi,
        datumVreme: datumVreme1,
        dohvatnaVisina: this.editedItem.dohvatnaVisina,
        dominantnaNoga: this.editedItem.dominantnaNoga,
        dominantnaRuka: this.editedItem.dominantnaRuka,
        duzinaNadkolenice: this.editedItem.duzinaNadkolenice,
        forearmLength: this.editedItem.forearmLength,
        upperArmLength: this.editedItem.upperArmLength,
        handSize: this.editedItem.handSize,
        duzinaPotkolenice: this.editedItem.duzinaPotkolenice,
        duzinaStopala: this.editedItem.duzinaStopala,
        ident: this.editedItem.ident,
        identKorisnik: this.editedItem.identKorisnik,
        korisnikImePrezime: this.editedItem.korisnikImePrezime,
        masaMisica: this.editedItem.masaMisica,
        muscleMassPercentage: this.editedItem.muscleMassPercentage,
        odskocnaNoga: this.editedItem.odskocnaNoga,
        procenaKonacneTelesneVisine:
          this.editedItem.procenaKonacneTelesneVisine,
        masaTelesneMasti: this.editedItem.masaTelesneMasti,
        procenatTelesneMasti: this.editedItem.procenatTelesneMasti,
        procenatVodeUTelu: this.editedItem.procenatVodeUTelu,
        rasponRuku: this.editedItem.rasponRuku,
        telesnaMasa: this.editedItem.telesnaMasa,
        telesnaVisina: this.editedItem.telesnaVisina,
        userIdent: this.igrID,
        viscelarnaMast: this.editedItem.viscelarnaMast,
      };

      let data1 = JSON.stringify(dataString);

      debugger;
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
          self.getDataZaID();
          self.$q.notify({
            message: self.$t(
              "players.morphologicalCharacteristics.newMeasurementSuccessfullyAdded"
            ),
            color: "green",
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje/deaktiviranje igraca
    //........................................
    deleteData(item) {
      let linkStr = this.$apiPutanja + "/morfologije/" + item.ident;
      var self = this;
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
          self.getDataZaID();
          self.$q.notify({
            message: self.$t(
              "players.morphologicalCharacteristics.measurementDataDeletedSuccessfully"
            ),
            color: "green",
          });
        })
        .catch(function (response) {
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
      if (this.editedItem.bmi == "") this.editedItem.bmi = 0;
      if (this.editedItem.dohvatnaVisina == "")
        this.editedItem.dohvatnaVisina = 0;
      if (this.editedItem.duzinaNadkolenice == "")
        this.editedItem.duzinaNadkolenice = 0;
      if (this.editedItem.forearmLength == "")
        this.editedItem.forearmLength = 0;
      if (this.editedItem.upperArmLength == "")
        this.editedItem.upperArmLength = 0;
      if (this.editedItem.handSize == "") this.editedItem.handSize = 0;
      if (this.editedItem.duzinaPotkolenice == "")
        this.editedItem.duzinaPotkolenice = 0;
      if (this.editedItem.duzinaStopala == "")
        this.editedItem.duzinaStopala = 0;
      if (this.editedItem.masaMisica == "") this.editedItem.masaMisica = 0;
      if (this.editedItem.muscleMassPercentage == "")
        this.editedItem.muscleMassPercentage = 0;
      if (this.editedItem.procenaKonacneTelesneVisine == "")
        this.editedItem.procenaKonacneTelesneVisine = 0;
      if (this.editedItem.masaTelesneMasti == "")
        this.editedItem.masaTelesneMasti = 0;
      if (this.editedItem.procenatTelesneMasti == "")
        this.editedItem.procenatTelesneMasti = 0;
      if (this.editedItem.procenatVodeUTelu == "")
        this.editedItem.procenatVodeUTelu = 0;
      if (this.editedItem.rasponRuku == "") this.editedItem.rasponRuku = 0;
      if (this.editedItem.telesnaMasa == "") this.editedItem.telesnaMasa = 0;
      if (this.editedItem.telesnaVisina == "")
        this.editedItem.telesnaVisina = 0;

      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem);
        this.putData();
      } else {
        this.postData();
      }
      this.close();
    },
    deleteItem(item) {
      let self = this;
      const index = this.data.indexOf(item);
      let obj = {
        title: self.$t("players.morphologicalCharacteristics.warning"),
        message: self.$t(
          "players.morphologicalCharacteristics.areYouSureDelete"
        ),
        customCloseBtnText: self.$t("players.morphologicalCharacteristics.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t(
          "players.morphologicalCharacteristics.yes"
        ),
        onConfirm: onConfirmWrapper,
        type: "warning",
        showXclose: true,
      };
      this.$Simplert.open(obj);
      function onConfirmWrapper() {
        self.data.splice(index, 1);
        debugger;
        self.deleteData(item);
      }
    },
    novoMerenje() {
      // this.editedItem = this.defaultItem
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

      const status = exportFile("morfologija.csv", content, "text/csv");
      let self = this;
      if (status !== true) {
        this.$q.notify({
          message: self.$t(
            "players.morphologicalCharacteristics.browserForbids"
          ),
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
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
.slajderKlasa {
  width: 100%;
  color: #ff4b00;
  margin-top: 17px;
  margin-right: 10px;
  margin-left: 5px;
  margin-bottom: 3px;
}
.sakriDugmice {
  display: none;
}
</style>
