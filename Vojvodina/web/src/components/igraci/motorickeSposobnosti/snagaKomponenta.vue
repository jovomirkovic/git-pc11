<template>
  <q-page class="q-pa-sm">
    <!-- <div class="row"
          style="
            position: absolute;
            top: -90px;
            z-index: 5000;
            margin: 0 30%;"
            >
            <h5> {{$t('players.motorSkills.power.selectedPlayer')}}: {{this.igrac}}</h5>
            <q-btn style="padding:22px;margin:10px;color:red" flat round icon="people" @click="izborIgraca()" >
              <q-tooltip>{{$t('players.motorSkills.power.browsePlayers')}}</q-tooltip>
            </q-btn>
        </div> -->
    <q-table
      :title="$t('players.motorSkills.power.power')"
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
        v-if="igr != $t('players.motorSkills.power.selectPlayer') + ' ->'"
        v-slot:top-right="props"
      >
        <q-btn
          v-if="Object.keys(selektovaniIgrac).length != 0"
          @click="otvordeDialog()"
          :label="$t('players.motorSkills.power.newMesurement')"
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
              >{{props.inFullscreen ? $t('players.motorSkills.power.exitFullscreen') : $t('players.motorSkills.power.enterFullscreen')}}</q-tooltip>
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
              ? $t("players.motorSkills.power.list")
              : $t("players.motorSkills.power.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('players.motorSkills.power.exportCSV')"
          no-caps
          @click="exportTable"
        />
      </template>

      <template v-slot:header-cell-action="props">
        <q-th style="color: #ffffff00; min-width: 110px; width: 110px">
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
                $t("players.motorSkills.power.delete")
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
                $t("players.motorSkills.power.changeData")
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
            {{ $t("players.motorSkills.power.measurements") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular ponisti" style="width: 40%;">
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
                    $t("players.motorSkills.power.date")
                  }}</span>
                </label>
              </q-item>

              <q-item style="width: 60%; display: inline-block;">
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
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
                      $t("players.motorSkills.power.whoDidTheTesting")
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.vsbd"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="spustiPlaceholder('Span-IP2', editedItem.vsbd)"
                    />
                    <span id="Span-IP2" class="placeholder"
                      >{{ $t("players.motorSkills.power.vsbd") }} [cm]</span
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.vsbl"
                      @focus="popniPlaceholder('Span-IP3')"
                      @input="popniPlaceholder('Span-IP3')"
                      @blur="spustiPlaceholder('Span-IP3', editedItem.vsbl)"
                    />
                    <span id="Span-IP3" class="placeholder"
                      >{{ $t("players.motorSkills.power.vsbl") }} [cm]</span
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.vsbr"
                      @focus="popniPlaceholder('Span-IP4')"
                      @input="popniPlaceholder('Span-IP4')"
                      @blur="spustiPlaceholder('Span-IP4', editedItem.vsbr)"
                    />
                    <span id="Span-IP4" class="placeholder"
                      >{{ $t("players.motorSkills.power.vsbr") }} [cm]</span
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.vsp"
                      @focus="popniPlaceholder('Span-IP5')"
                      @input="popniPlaceholder('Span-IP5')"
                      @blur="spustiPlaceholder('Span-IP5', editedItem.vsp)"
                    />
                    <span id="Span-IP5" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.verticalJumpVsp")
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item
                style="margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #cccccccc;"
              >
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      type="number"
                      placeholder=" "
                      v-model="editedItem.vszr"
                      @focus="popniPlaceholder('Span-IP6')"
                      @input="popniPlaceholder('Span-IP6')"
                      @blur="spustiPlaceholder('Span-IP6', editedItem.vszr)"
                    />
                    <span id="Span-IP6" class="placeholder"
                      >{{ $t("players.motorSkills.power.vsrz") }} [cm]</span
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7Visina"
                      @focus="popniPlaceholder('Span-IP7')"
                      @input="popniPlaceholder('Span-IP7')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP7',
                          editedItem.uzastopniSkokoviX7Visina
                        )
                      "
                    />
                    <span id="Span-IP7" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.firstJumpHeight")
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
                      type="number"
                      placeholder=" "
                      @focus="popniPlaceholder('Span-IP8')"
                      @input="popniPlaceholder('Span-IP8')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP8',
                          editedItem.uzastopniSkokoviX7VremeKonatkta
                        )
                      "
                    />
                    <span id="Span-IP8" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.firstJumpContactTime")
                      }}
                      [ms]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item
                style="margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #cccccccc;"
              >
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta"
                      @focus="popniPlaceholder('Span-IP9')"
                      @input="popniPlaceholder('Span-IP9')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP9',
                          editedItem.uzastopniSkokoviX7VremeLeta
                        )
                      "
                    />
                    <span id="Span-IP9" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.firstJumpFlightTime")
                      }}
                      [ms]</span
                    >
                    <!--TODO : tako i za ostale skokove ispod-->
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7Visina_2"
                      @focus="popniPlaceholder('Span-IP10')"
                      @input="popniPlaceholder('Span-IP10')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP10',
                          editedItem.uzastopniSkokoviX7Visina_2
                        )
                      "
                    />
                    <span id="Span-IP10" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.secondJumpHeight")
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_2"
                      @focus="popniPlaceholder('Span-IP11')"
                      @input="popniPlaceholder('Span-IP11')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP11',
                          editedItem.uzastopniSkokoviX7VremeKonatkta_2
                        )
                      "
                    />
                    <span id="Span-IP11" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.secondJumpContactTime")
                      }}
                      [ms]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item
                style="margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #cccccccc;"
              >
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_2"
                      @focus="popniPlaceholder('Span-IP12')"
                      @input="popniPlaceholder('Span-IP12')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP12',
                          editedItem.uzastopniSkokoviX7VremeLeta_2
                        )
                      "
                    />
                    <span id="Span-IP12" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.secondJumpFlightTime")
                      }}
                      [ms]</span
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7Visina_3"
                      @focus="popniPlaceholder('Span-IP13')"
                      @input="popniPlaceholder('Span-IP13')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP13',
                          editedItem.uzastopniSkokoviX7Visina_3
                        )
                      "
                    />
                    <span id="Span-IP13" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.thirdJumpHeight")
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_3"
                      @focus="popniPlaceholder('Span-IP14')"
                      @input="popniPlaceholder('Span-IP14')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP14',
                          editedItem.uzastopniSkokoviX7VremeKonatkta_3
                        )
                      "
                    />
                    <span id="Span-IP14" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.thirdJumpContactTime")
                      }}
                      [ms]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item
                style="margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #cccccccc;"
              >
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_3"
                      @focus="popniPlaceholder('Span-IP15')"
                      @input="popniPlaceholder('Span-IP15')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP15',
                          editedItem.uzastopniSkokoviX7VremeLeta_3
                        )
                      "
                    />
                    <span id="Span-IP15" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.thirdJumpFlightTime")
                      }}
                      [ms]</span
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7Visina_4"
                      @focus="popniPlaceholder('Span-IP16')"
                      @input="popniPlaceholder('Span-IP16')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP16',
                          editedItem.uzastopniSkokoviX7Visina_4
                        )
                      "
                    />
                    <span id="Span-IP16" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.fourthJumpHeight")
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_4"
                      @focus="popniPlaceholder('Span-IP17')"
                      @input="popniPlaceholder('Span-IP17')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP17',
                          editedItem.uzastopniSkokoviX7VremeKonatkta_4
                        )
                      "
                    />
                    <span id="Span-IP17" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.fourthJumpContactTime")
                      }}
                      [ms]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item
                style="margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #cccccccc;"
              >
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_4"
                      @focus="popniPlaceholder('Span-IP18')"
                      @input="popniPlaceholder('Span-IP18')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP18',
                          editedItem.uzastopniSkokoviX7VremeLeta_4
                        )
                      "
                    />
                    <span id="Span-IP18" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.fourthJumpFlightTime")
                      }}
                      [ms]</span
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7Visina_5"
                      @focus="popniPlaceholder('Span-IP19')"
                      @input="popniPlaceholder('Span-IP19')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP19',
                          editedItem.uzastopniSkokoviX7Visina_5
                        )
                      "
                    />
                    <span id="Span-IP19" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.fifthJumpHeight")
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_5"
                      @focus="popniPlaceholder('Span-IP20')"
                      @input="popniPlaceholder('Span-IP20')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP20',
                          editedItem.uzastopniSkokoviX7VremeKonatkta_5
                        )
                      "
                    />
                    <span id="Span-IP20" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.fifthJumpContactTime")
                      }}
                      [ms]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item
                style="margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #cccccccc;"
              >
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_5"
                      @focus="popniPlaceholder('Span-IP21')"
                      @input="popniPlaceholder('Span-IP21')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP21',
                          editedItem.uzastopniSkokoviX7VremeLeta_5
                        )
                      "
                    />
                    <span id="Span-IP21" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.fifthJumpFlightTime")
                      }}
                      [ms]</span
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7Visina_6"
                      @focus="popniPlaceholder('Span-IP22')"
                      @input="popniPlaceholder('Span-IP22')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP22',
                          editedItem.uzastopniSkokoviX7Visina_6
                        )
                      "
                    />
                    <span id="Span-IP22" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.sixthJumpHeight")
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_6"
                      @focus="popniPlaceholder('Span-IP23')"
                      @input="popniPlaceholder('Span-IP23')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP23',
                          editedItem.uzastopniSkokoviX7VremeKonatkta_6
                        )
                      "
                    />
                    <span id="Span-IP23" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.sixthJumpContactTime")
                      }}
                      [ms]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item
                style="margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #cccccccc;"
              >
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_6"
                      @focus="popniPlaceholder('Span-IP24')"
                      @input="popniPlaceholder('Span-IP24')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP24',
                          editedItem.uzastopniSkokoviX7VremeLeta_6
                        )
                      "
                    />
                    <span id="Span-IP24" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.sixthJumpFlightTime")
                      }}
                      [ms]</span
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7Visina_7"
                      @focus="popniPlaceholder('Span-IP25')"
                      @input="popniPlaceholder('Span-IP25')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP25',
                          editedItem.uzastopniSkokoviX7Visina_7
                        )
                      "
                    />
                    <span id="Span-IP25" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.seventhJumpHeight")
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_7"
                      @focus="popniPlaceholder('Span-IP26')"
                      @input="popniPlaceholder('Span-IP26')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP26',
                          editedItem.uzastopniSkokoviX7VremeKonatkta_7
                        )
                      "
                    />
                    <span id="Span-IP26" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.seventhJumpContactTime")
                      }}
                      [ms]</span
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
                      type="number"
                      placeholder=" "
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_7"
                      @focus="popniPlaceholder('Span-IP27')"
                      @input="popniPlaceholder('Span-IP27')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP27',
                          editedItem.uzastopniSkokoviX7VremeLeta_7
                        )
                      "
                    />
                    <span id="Span-IP27" class="placeholder"
                      >{{
                        $t("players.motorSkills.power.seventhJumpFlightTime")
                      }}
                      [ms]</span
                    >
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
            style="float: right;"
            v-close-popup
          ></q-btn>
          <div class="text-h6" style="text-align: center;">
            {{ $t("players.motorSkills.power.measurements") }}
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
                  :label="$t('players.motorSkills.power.date')"
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
                      :label="$t('players.motorSkills.power.whoDidTheTesting')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.whoDidTheTesting")
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
                      v-model="editedItem.vsbd"
                      :label="$t('players.motorSkills.power.vsbd')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.vsbd")
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
                      v-model="editedItem.vsbl"
                      :label="$t('players.motorSkills.power.vsbl')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.vsbl")
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
                      v-model="editedItem.vsbr"
                      :label="$t('players.motorSkills.power.vsbr')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.vsbr")
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
                      v-model="editedItem.vsp"
                      :label="$t('players.motorSkills.power.verticalJumpVsp')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.verticalJumpVsp")
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
                      v-model="editedItem.vszr"
                      :label="$t('players.motorSkills.power.vsrz')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.vsrz")
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
                      v-model="editedItem.uzastopniSkokoviX7Visina"
                      :label="$t('players.motorSkills.power.firstJumpHeight')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.firstJumpHeight")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta"
                      :label="
                        $t('players.motorSkills.power.firstJumpContactTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.firstJumpContactTime")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta"
                      :label="
                        $t('players.motorSkills.power.firstJumpFlightTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.firstJumpFlightTime")
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
                      v-model="editedItem.uzastopniSkokoviX7Visina_2"
                      :label="$t('players.motorSkills.power.secondJumpHeight')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.secondJumpHeight")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_2"
                      :label="
                        $t('players.motorSkills.power.secondJumpContactTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.secondJumpContactTime")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_2"
                      :label="
                        $t('players.motorSkills.power.secondJumpFlightTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.secondJumpFlightTime")
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
                      v-model="editedItem.uzastopniSkokoviX7Visina_3"
                      :label="$t('players.motorSkills.power.thirdJumpHeight')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.thirdJumpHeight")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_3"
                      :label="
                        $t('players.motorSkills.power.thirdJumpContactTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.thirdJumpContactTime")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_3"
                      :label="
                        $t('players.motorSkills.power.thirdJumpFlightTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.thirdJumpFlightTime")
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
                      v-model="editedItem.uzastopniSkokoviX7Visina_4"
                      :label="$t('players.motorSkills.power.fourthJumpHeight')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.fourthJumpHeight")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_4"
                      :label="
                        $t('players.motorSkills.power.fourthJumpContactTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.fourthJumpContactTime")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_4"
                      :label="
                        $t('players.motorSkills.power.fourthJumpFlightTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.fourthJumpFlightTime")
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
                      v-model="editedItem.uzastopniSkokoviX7Visina_5"
                      :label="$t('players.motorSkills.power.fifthJumpHeight')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.fifthJumpHeight")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_5"
                      :label="
                        $t('players.motorSkills.power.fifthJumpContactTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.fifthJumpContactTime")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_5"
                      :label="
                        $t('players.motorSkills.power.fifthJumpFlightTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.fifthJumpFlightTime")
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
                      v-model="editedItem.uzastopniSkokoviX7Visina_6"
                      :label="$t('players.motorSkills.power.sixthJumpHeight')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.sixthJumpHeight")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_6"
                      :label="
                        $t('players.motorSkills.power.sixthJumpContactTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.sixthJumpContactTime")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_6"
                      :label="
                        $t('players.motorSkills.power.sixthJumpFlightTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.sixthJumpFlightTime")
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
                      v-model="editedItem.uzastopniSkokoviX7Visina_7"
                      :label="$t('players.motorSkills.power.seventhJumpHeight')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.seventhJumpHeight")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeKonatkta_7"
                      :label="
                        $t('players.motorSkills.power.seventhJumpContactTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.seventhJumpContactTime")
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
                      v-model="editedItem.uzastopniSkokoviX7VremeLeta_7"
                      :label="
                        $t('players.motorSkills.power.seventhJumpFlightTime')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.power.seventhJumpFlightTime")
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
import promenaIgraca from "../../../components/promenaIgracaKomponenta";

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
      readonly: false,
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      editedItem: {
        datumVreme: "",
        ident: "",
        identKorisnik: "",
        korisnikImePrezime: "",
        identUser: this.igrID,
        uzastopniSkokoviX7Visina: "",
        uzastopniSkokoviX7Visina_2: "",
        uzastopniSkokoviX7Visina_3: "",
        uzastopniSkokoviX7Visina_4: "",
        uzastopniSkokoviX7Visina_5: "",
        uzastopniSkokoviX7Visina_6: "",
        uzastopniSkokoviX7Visina_7: "",
        uzastopniSkokoviX7VremeKonatkta: "",
        uzastopniSkokoviX7VremeKonatkta_2: "",
        uzastopniSkokoviX7VremeKonatkta_3: "",
        uzastopniSkokoviX7VremeKonatkta_4: "",
        uzastopniSkokoviX7VremeKonatkta_5: "",
        uzastopniSkokoviX7VremeKonatkta_6: "",
        uzastopniSkokoviX7VremeKonatkta_7: "",
        uzastopniSkokoviX7VremeLeta: "",
        uzastopniSkokoviX7VremeLeta_2: "",
        uzastopniSkokoviX7VremeLeta_3: "",
        uzastopniSkokoviX7VremeLeta_4: "",
        uzastopniSkokoviX7VremeLeta_5: "",
        uzastopniSkokoviX7VremeLeta_6: "",
        uzastopniSkokoviX7VremeLeta_7: "",
        vsbd: "",
        vsbl: "",
        vsbr: "",
        vsp: "",
        vszr: ""
      },
      defaultItem: {
        datumVreme: "",
        ident: "",
        identKorisnik: "",
        korisnikImePrezime: "",
        identUser: this.igrID,
        uzastopniSkokoviX7Visina: "",
        uzastopniSkokoviX7Visina_2: "",
        uzastopniSkokoviX7Visina_3: "",
        uzastopniSkokoviX7Visina_4: "",
        uzastopniSkokoviX7Visina_5: "",
        uzastopniSkokoviX7Visina_6: "",
        uzastopniSkokoviX7Visina_7: "",
        uzastopniSkokoviX7VremeKonatkta: "",
        uzastopniSkokoviX7VremeKonatkta_2: "",
        uzastopniSkokoviX7VremeKonatkta_3: "",
        uzastopniSkokoviX7VremeKonatkta_4: "",
        uzastopniSkokoviX7VremeKonatkta_5: "",
        uzastopniSkokoviX7VremeKonatkta_6: "",
        uzastopniSkokoviX7VremeKonatkta_7: "",
        uzastopniSkokoviX7VremeLeta: "",
        uzastopniSkokoviX7VremeLeta_2: "",
        uzastopniSkokoviX7VremeLeta_3: "",
        uzastopniSkokoviX7VremeLeta_4: "",
        uzastopniSkokoviX7VremeLeta_5: "",
        uzastopniSkokoviX7VremeLeta_6: "",
        uzastopniSkokoviX7VremeLeta_7: "",
        vsbd: "",
        vsbl: "",
        vsbr: "",
        vsp: "",
        vszr: ""
      },
      mode: "list",
      columns: [
        {
          name: "datumVreme",
          required: true,
          label: this.$t("players.motorSkills.power.date"),
          align: "left",
          field: "datumVreme",
          sortable: true,
          format: val => date.formatDate(val, "DD/MM/YYYY")
        },
        {
          name: "vsp",
          align: "left",
          label: this.$t("players.motorSkills.power.vsp"),
          field: "vsp",
          sortable: true
        },
        {
          name: "vsbd",
          align: "left",
          label: this.$t("players.motorSkills.power.vsbd"),
          field: "vsbd",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t("players.motorSkills.power.action"),
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
    this.editedItem.korisnikImePrezime = window.$userFullName;

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
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.datumVreme =
        item.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[2] +
        "/" +
        item.datumVreme
          .slice(0, 10)
          .replace(/-/g, "/")
          .split("/")[1] +
        "/" +
        item.datumVreme
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
      let linkStr = this.$apiPutanja + "/snaga/igrac/" + this.igrID;
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
      let linkStr = this.$apiPutanja + "/snaga";
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
        identUser: this.igrID,
        uzastopniSkokoviX7Visina: this.editedItem.uzastopniSkokoviX7Visina,
        uzastopniSkokoviX7VremeKonatkta: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta,
        uzastopniSkokoviX7VremeLeta: this.editedItem
          .uzastopniSkokoviX7VremeLeta,
        uzastopniSkokoviX7Visina: this.editedItem.uzastopniSkokoviX7Visina,
        uzastopniSkokoviX7Visina_2: this.editedItem.uzastopniSkokoviX7Visina_2,
        uzastopniSkokoviX7Visina_3: this.editedItem.uzastopniSkokoviX7Visina_3,
        uzastopniSkokoviX7Visina_4: this.editedItem.uzastopniSkokoviX7Visina_4,
        uzastopniSkokoviX7Visina_5: this.editedItem.uzastopniSkokoviX7Visina_5,
        uzastopniSkokoviX7Visina_6: this.editedItem.uzastopniSkokoviX7Visina_6,
        uzastopniSkokoviX7Visina_7: this.editedItem.uzastopniSkokoviX7Visina_7,
        uzastopniSkokoviX7VremeKonatkta: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta,
        uzastopniSkokoviX7VremeKonatkta_2: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_2,
        uzastopniSkokoviX7VremeKonatkta_3: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_3,
        uzastopniSkokoviX7VremeKonatkta_4: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_4,
        uzastopniSkokoviX7VremeKonatkta_5: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_5,
        uzastopniSkokoviX7VremeKonatkta_6: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_6,
        uzastopniSkokoviX7VremeKonatkta_7: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_7,
        uzastopniSkokoviX7VremeLeta: this.editedItem
          .uzastopniSkokoviX7VremeLeta,
        uzastopniSkokoviX7VremeLeta_2: this.editedItem
          .uzastopniSkokoviX7VremeLeta_2,
        uzastopniSkokoviX7VremeLeta_3: this.editedItem
          .uzastopniSkokoviX7VremeLeta_3,
        uzastopniSkokoviX7VremeLeta_4: this.editedItem
          .uzastopniSkokoviX7VremeLeta_4,
        uzastopniSkokoviX7VremeLeta_5: this.editedItem
          .uzastopniSkokoviX7VremeLeta_5,
        uzastopniSkokoviX7VremeLeta_6: this.editedItem
          .uzastopniSkokoviX7VremeLeta_6,
        uzastopniSkokoviX7VremeLeta_7: this.editedItem
          .uzastopniSkokoviX7VremeLeta_7,
        vsbd: this.editedItem.vsbd,
        vsbl: this.editedItem.vsbl,
        vsbr: this.editedItem.vsbr,
        vsp: this.editedItem.vsp,
        vszr: this.editedItem.vszr
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
            message: self.$t(
              "players.motorSkills.newMeasurementSuccessfullyAdded"
            ),
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
    // izmena merenja
    //........................................
    putData() {
      debugger;
      let linkStr = this.$apiPutanja + "/snaga/" + this.editedItem.ident;
      let self = this;
      var datumVreme1;
      try {
        datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      } catch (error) {}

      var dataString = {
        datumVreme: datumVreme1,
        ident: 0,
        identKorisnik: 0, // ide ulogovani korisnik, iz bekenda! za sad... this.editedItem.identKorisnik,
        korisnikImePrezime: "", // this.editedItem.korisnikImePrezime,
        identUser: this.igrID,
        uzastopniSkokoviX7Visina: this.editedItem.uzastopniSkokoviX7Visina,
        uzastopniSkokoviX7VremeKonatkta: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta,
        uzastopniSkokoviX7VremeLeta: this.editedItem
          .uzastopniSkokoviX7VremeLeta,
        uzastopniSkokoviX7Visina: this.editedItem.uzastopniSkokoviX7Visina,
        uzastopniSkokoviX7Visina_2: this.editedItem.uzastopniSkokoviX7Visina_2,
        uzastopniSkokoviX7Visina_3: this.editedItem.uzastopniSkokoviX7Visina_3,
        uzastopniSkokoviX7Visina_4: this.editedItem.uzastopniSkokoviX7Visina_4,
        uzastopniSkokoviX7Visina_5: this.editedItem.uzastopniSkokoviX7Visina_5,
        uzastopniSkokoviX7Visina_6: this.editedItem.uzastopniSkokoviX7Visina_6,
        uzastopniSkokoviX7Visina_7: this.editedItem.uzastopniSkokoviX7Visina_7,
        uzastopniSkokoviX7VremeKonatkta: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta,
        uzastopniSkokoviX7VremeKonatkta_2: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_2,
        uzastopniSkokoviX7VremeKonatkta_3: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_3,
        uzastopniSkokoviX7VremeKonatkta_4: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_4,
        uzastopniSkokoviX7VremeKonatkta_5: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_5,
        uzastopniSkokoviX7VremeKonatkta_6: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_6,
        uzastopniSkokoviX7VremeKonatkta_7: this.editedItem
          .uzastopniSkokoviX7VremeKonatkta_7,
        uzastopniSkokoviX7VremeLeta: this.editedItem
          .uzastopniSkokoviX7VremeLeta,
        uzastopniSkokoviX7VremeLeta_2: this.editedItem
          .uzastopniSkokoviX7VremeLeta_2,
        uzastopniSkokoviX7VremeLeta_3: this.editedItem
          .uzastopniSkokoviX7VremeLeta_3,
        uzastopniSkokoviX7VremeLeta_4: this.editedItem
          .uzastopniSkokoviX7VremeLeta_4,
        uzastopniSkokoviX7VremeLeta_5: this.editedItem
          .uzastopniSkokoviX7VremeLeta_5,
        uzastopniSkokoviX7VremeLeta_6: this.editedItem
          .uzastopniSkokoviX7VremeLeta_6,
        uzastopniSkokoviX7VremeLeta_7: this.editedItem
          .uzastopniSkokoviX7VremeLeta_7,
        vsbd: this.editedItem.vsbd,
        vsbl: this.editedItem.vsbl,
        vsbr: this.editedItem.vsbr,
        vsp: this.editedItem.vsp,
        vszr: this.editedItem.vszr
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
              "players.motorSkills.power.measurementDataChangedSuccessfully"
            ),
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
      let linkStr = this.$apiPutanja + "/snaga/" + item.ident;
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
              "players.motorSkills.power.measurementDataDeletedSuccessfully"
            ),
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
        title: self.$t("players.motorSkills.power.warning"),
        message: self.$t("players.motorSkills.power.areYouSureDelete"),
        customCloseBtnText: self.$t("players.motorSkills.power.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("players.motorSkills.power.yes"),
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
      this.editedItem.korisnikImePrezime = window.$userFullName;
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

      const status = exportFile("snaga.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: self.$t("players.motorSkills.power.browserForbids"),
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
