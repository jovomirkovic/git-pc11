<template>
  <q-page class="q-pa-sm">
    <q-table
      :title="$t('administration.players.players')"
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
      <!--           selection="single"
          :selected.sync="selected" -->

      <template v-slot:top-right="props">
        <q-btn
          @click="otvordeDialog()"
          :label="$t('administration.players.newPlayer')"
          class="q-mr-xs dugmeNewNesto"
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
        <q-th style="color: #ffffff00; min-width: 150px">
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
            <q-btn
              @click="igracKorisnkSistema(props.row)"
              id="dugmeModifaj"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="person"
            >
              <q-tooltip>
                {{ $t("administration.players.sysUsers") }}</q-tooltip
              >
            </q-btn>
            <!-- <q-btn @click="igracKorisnkSistema(props.row)" dense color="red" icon="person">
                  <q-tooltip>
                    {{$t('administration.players.sysUsers')}}
                  </q-tooltip>
                </q-btn>               -->
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
          width: 700px;
          max-width: 70vw;
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
          />

          <div class="text-h6" style="text-align: center">
            {{ $t("administration.players.players") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <div class="levaStranaSlike">
                <q-item class="formular1">
                  <q-item-section>
                    <label class="custom-field one">
                      <q-input
                        :readonly="readonly"
                        style="margin-bottom: 10px"
                        borderless
                        dense
                        placeholder=" "
                        v-model="editedItem.ime"
                        @focus="popniPlaceholder('Span-IP0')"
                        @input="popniPlaceholder('Span-IP0')"
                        @blur="spustiPlaceholder('Span-IP0', editedItem.ime)"
                        ref="input1"
                        :rules="[
                          (val) =>
                            (val !== null && val !== '') ||
                            $t('administration.players.enterName'),
                        ]"
                      />
                      <span id="Span-IP0" class="placeholder">{{
                        $t("administration.players.name")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item
                  class="formular1"
                  style="position: relative; top: -5px; height: unset"
                >
                  <q-item-section class="custom-field one">
                    <q-select
                      :readonly="readonly"
                      borderless
                      dense
                      class="selektKlass"
                      :options="opcijeZaPol"
                      v-model="editedItem.pol"
                      emit-value
                      map-options
                      ref="select1"
                      @focus="popniPlaceholder('Span-SL1')"
                      @input="popniPlaceholder('Span-SL1')"
                      @blur="spustiPlaceholder('Span-SL1', editedItem.pol)"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '' && val.length > 0) ||
                          $t('administration.players.enterGender'),
                      ]"
                    />
                    <span
                      @click="$refs.select1.showPopup()"
                      id="Span-SL1"
                      class="placeholder placeholder1"
                      >{{ $t("administration.players.gender") }}</span
                    >
                  </q-item-section>
                </q-item>

                <q-item class="formular1" style="padding-top: unset">
                  <q-item-section>
                    <label class="custom-field one">
                      <q-input
                        :readonly="readonly"
                        style="margin-bottom: 10px"
                        borderless
                        dense
                        placeholder=" "
                        v-model="editedItem.prezime"
                        @focus="popniPlaceholder('Span-IP1')"
                        @input="popniPlaceholder('Span-IP1')"
                        @blur="
                          spustiPlaceholder('Span-IP1', editedItem.prezime)
                        "
                        ref="input2"
                        :rules="[
                          (val) =>
                            (val !== null && val !== '') ||
                            $t('administration.players.enterSurname'),
                        ]"
                      />
                      <span id="Span-IP1" class="placeholder">{{
                        $t("administration.players.surname")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item class="formular1 ponisti" style="padding-top: 0px">
                  <label class="custom-field one datumInput">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.datumRodjenja"
                      @focus="popniPlaceholder('Span-IP3')"
                      @input="popniPlaceholder('Span-IP3')"
                      @blur="
                        spustiPlaceholder('Span-IP3', editedItem.datumRodjenja)
                      "
                      ref="input4"
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
                              v-model="editedItem.datumRodjenja"
                              mask="DD/MM/YYYY"
                              @input="() => $refs.qDateProxy.hide()"
                            ></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>

                    <span id="Span-IP3" class="placeholder">{{
                      $t("administration.players.birthDate")
                    }}</span>
                  </label>
                </q-item>

                <q-item class="formular1 ponisti">
                  <q-item-section>
                    <label class="custom-field one">
                      <q-input
                        :readonly="readonly"
                        style="margin-bottom: 30px"
                        borderless
                        dense
                        placeholder=" "
                        v-model="editedItem.nadimak"
                        @focus="popniPlaceholder('Span-IP2')"
                        @input="popniPlaceholder('Span-IP2')"
                        @blur="
                          spustiPlaceholder('Span-IP2', editedItem.nadimak)
                        "
                        ref="input3"
                      />
                      <span id="Span-IP2" class="placeholder">{{
                        $t("administration.players.nick")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item class="formular1">
                  <q-item-section>
                    <label class="custom-field one" style="margin-top: 20px">
                      <q-input
                        :readonly="readonly"
                        style="margin-bottom: -10px"
                        borderless
                        dense
                        placeholder=" "
                        v-model="editedItem.drzavljanstvo"
                        @focus="popniPlaceholder('Span-IP4')"
                        @input="popniPlaceholder('Span-IP4')"
                        @blur="
                          spustiPlaceholder(
                            'Span-IP4',
                            editedItem.drzavljanstvo
                          )
                        "
                        ref="input5"
                      />
                      <span id="Span-IP4" class="placeholder">{{
                        $t("administration.players.nationality")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="desnaStranaSlika">
                <q-item>
                  <q-item-section style="text-align: center">
                    <div class="row">
                      <div class="col-3"></div>
                      <div class="col-3" style="width: 100% !important">
                        <!-- <q-uploader
                          :url="editedItem.fotografija"
                          :change="getMenuImage"
                          accept=".jpg, image/*"
                          color="teal"
                          style="
                            height: 200px;
                            max-width: 200px;
                            border: ridge;
                            margin-top: 10px;
                            margin-bottom: 20px;
                          "
                        ></q-uploader> -->
                        <q-img
                          :readonly="readonly"
                          @click="propagateClick"
                          @drop="dropFile"
                          @dragenter="preventDragDefault"
                          @dragover="preventDragDefault"
                          :src="editedItem.fotografija"
                          spinner-color="white"
                          style="
                            height: 200px;
                            max-width: 150px;
                            border: ridge;
                            margin-top: 10px;
                            margin-bottom: 20px;
                          "
                        />
                      </div>
                      <div class="col-3">
                        <base64
                          v-show="false"
                          class="custom-file-input"
                          ref="customFileInput"
                          style="
                            text-align: center;
                            width: 200px;
                            margin-left: 10px;
                            margin-bottom: 20px;
                          "
                          :multiple="false"
                          :done="getMenuImage"
                        ></base64>
                      </div>
                      <div class="col-3"></div>
                    </div>
                  </q-item-section>
                </q-item>
              </div>

              <div>
                <q-item class="formular rasiri">
                  <q-item-section>
                    <label class="custom-field one">
                      <q-input
                        :readonly="readonly"
                        borderless
                        dense
                        placeholder=" "
                        v-model="editedItem.adresa"
                        @focus="popniPlaceholder('Span-IP5')"
                        @input="popniPlaceholder('Span-IP5')"
                        @blur="spustiPlaceholder('Span-IP5', editedItem.adresa)"
                        ref="input6"
                      />
                      <span id="Span-IP5" class="placeholder">{{
                        $t("administration.players.address")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item class="formular rasiri">
                  <q-item-section>
                    <label class="custom-field one" style="margin-bottom: 25px">
                      <q-input
                        :readonly="readonly"
                        borderless
                        dense
                        placeholder=" "
                        v-model="editedItem.mobilni"
                        ref="input7"
                        @focus="popniPlaceholder('Span-IP6')"
                        @input="popniPlaceholder('Span-IP6')"
                        @blur="
                          spustiPlaceholder('Span-IP6', editedItem.mobilni)
                        "
                      />
                      <span id="Span-IP6" class="placeholder">{{
                        $t("administration.players.mobile")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>
                <div style="width: 100%">
                  <q-item class="formular rasiri">
                    <q-item-section>
                      <label class="custom-field one" style="margin-top: 20px">
                        <q-input
                          :readonly="readonly"
                          borderless
                          dense
                          placeholder=" "
                          v-model="editedItem.email"
                          ref="input8"
                          @focus="popniPlaceholder('Span-IP7')"
                          @input="popniPlaceholder('Span-IP7')"
                          @blur="
                            spustiPlaceholder('Span-IP7', editedItem.email)
                          "
                          :rules="[
                            (val) =>
                              (val !== null && val !== '') ||
                              $t('administration.players.enterEmail'),
                          ]"
                        />
                        <span id="Span-IP7" class="placeholder">{{
                          $t("administration.players.email")
                        }}</span>
                      </label>
                    </q-item-section>
                  </q-item>
                </div>
                <!-- <q-item
                  class="formular rasiri"
                  style="padding-top: -10px; height: unset"
                >
                  <q-item-section class="custom-field one">
                    <q-select
                      :readonly="readonly"
                      borderless
                      dense
                      class="selektKlass"
                      :options="opcijeZaKlub"
                      v-model="editedItem.kakoJeDosaoUKlub"
                      emit-value
                      map-options
                      ref="select2"
                      @focus="popniPlaceholder('Span-SL2')"
                      @input="popniPlaceholder('Span-SL2')"
                      @blur="
                        spustiPlaceholder(
                          'Span-SL2',
                          editedItem.kakoJeDosaoUKlub
                        )
                      "
                      :rules="[
                        val =>
                          (val !== null && val !== '' && val.length > 0) ||
                          $t('administration.players.enterClubArival')
                      ]"
                    />
                    <span
                      @click="$refs.select2.showPopup()"
                      id="Span-SL2"
                      class="placeholder placeholder1"
                      >{{ $t("administration.players.clubConn") }}</span
                    >
                  </q-item-section>
                </q-item> -->

                <q-item
                  class="formular rasiri ponisti"
                  style="position: relative; top: 5px"
                >
                  <q-item-section>
                    <label class="custom-field one">
                      <q-input
                        :readonly="readonly"
                        borderless
                        dense
                        placeholder=" "
                        v-model="editedItem.koGaJePreporucio"
                        @focus="popniPlaceholder('Span-IP8')"
                        @input="popniPlaceholder('Span-IP8')"
                        @blur="
                          spustiPlaceholder(
                            'Span-IP8',
                            editedItem.koGaJePreporucio
                          )
                        "
                        ref="input9"
                      />
                      <span id="Span-IP8" class="placeholder">{{
                        $t("administration.players.recommendation")
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
                        placeholder=" "
                        v-model="editedItem.brojPasosa"
                        @focus="popniPlaceholder('Span-IP9')"
                        @input="popniPlaceholder('Span-IP9')"
                        @blur="
                          spustiPlaceholder('Span-IP9', editedItem.brojPasosa)
                        "
                        ref="input10"
                      />
                      <span id="Span-IP9" class="placeholder">{{
                        $t("administration.players.passportNum")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item class="formular ponisti" style="width: 50%">
                  <label class="custom-field one datumInput">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.vaznostPasosa"
                      @focus="popniPlaceholder('Span-IP10')"
                      @input="popniPlaceholder('Span-IP10')"
                      @blur="
                        spustiPlaceholder('Span-IP10', editedItem.vaznostPasosa)
                      "
                      ref="input11"
                      mask="##/##/####"
                    >
                      <!-- :rules="[val => valiDate(val) || 'DD/MM/YYYY']" -->
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy2"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              :readonly="readonly"
                              v-model="editedItem.vaznostPasosa"
                              @input="() => $refs.qDateProxy2.hide()"
                              mask="DD/MM/YYYY"
                            ></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <span id="Span-IP10" class="placeholder">{{
                      $t("administration.players.passportImportance")
                    }}</span>
                  </label>
                </q-item>

                <p
                  style="
                    padding-top: 10px;
                    text-align: center;
                    margin-bottom: 10px;
                  "
                  class="ponisti"
                >
                  {{ $t("administration.players.fam") }}
                </p>

                <q-item
                  class="formular rasiri"
                  style="padding-top: -5px; height: unset"
                >
                  <q-item-section class="custom-field one">
                    <q-select
                      :readonly="readonly"
                      borderless
                      class="selektKlass"
                      :options="opcijeSaKimZivi"
                      v-model="editedItem.saKimZivi"
                      emit-value
                      map-options
                      ref="select3"
                      @focus="popniPlaceholder('Span-SL3')"
                      @input="popniPlaceholder('Span-SL3')"
                      @blur="
                        spustiPlaceholder('Span-SL3', editedItem.saKimZivi)
                      "
                    />
                    <span
                      @click="$refs.select3.showPopup()"
                      id="Span-SL3"
                      class="placeholder placeholder1"
                      >{{ $t("administration.players.livingWith") }}</span
                    >
                  </q-item-section>
                </q-item>

                <q-item
                  class="formular ponisti"
                  style="width: 50%; position: relative; top: 5px"
                >
                  <q-item-section>
                    <label class="custom-field one">
                      <q-input
                        :readonly="readonly"
                        borderless
                        dense
                        placeholder=" "
                        v-model="editedItem.brojDeceUPorodici"
                        @focus="popniPlaceholder('Span-IP11')"
                        @input="popniPlaceholder('Span-IP11')"
                        @blur="
                          spustiPlaceholder(
                            'Span-IP11',
                            editedItem.brojDeceUPorodici
                          )
                        "
                      />
                      <span id="Span-IP11" class="placeholder">{{
                        $t("administration.players.childNum")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>
                <q-item
                  class="formular rasiri"
                  style="padding-top: -5px; height: unset"
                >
                  <q-item-section class="custom-field one">
                    <q-select
                      :readonly="readonly"
                      borderless
                      class="selektKlass"
                      :options="opcijeZaObrazovanjeRoditelja"
                      v-model="editedItem.obrazovanjeRoditelja"
                      emit-value
                      map-options
                      ref="select4"
                      @focus="popniPlaceholder('Span-SL4')"
                      @input="popniPlaceholder('Span-SL4')"
                      @blur="
                        spustiPlaceholder(
                          'Span-SL4',
                          editedItem.obrazovanjeRoditelja
                        )
                      "
                    />
                    <span
                      @click="$refs.select4.showPopup()"
                      id="Span-SL4"
                      class="placeholder placeholder1"
                      >{{ $t("administration.players.parentEdu") }}</span
                    >
                  </q-item-section>
                </q-item>

                <q-item
                  class="formular ponisti"
                  style="width: 50%; position: relative; top: 5px"
                >
                  <q-item-section>
                    <label class="custom-field one">
                      <q-input
                        :readonly="readonly"
                        borderless
                        dense
                        placeholder=" "
                        v-model="editedItem.kojeJeDetePoRedu"
                        @focus="popniPlaceholder('Span-IP12')"
                        @input="popniPlaceholder('Span-IP12')"
                        @blur="
                          spustiPlaceholder(
                            'Span-IP12',
                            editedItem.kojeJeDetePoRedu
                          )
                        "
                      />
                      <span id="Span-IP12" class="placeholder">{{
                        $t("administration.players.childorder")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>
                <q-item
                  class="formular rasiri"
                  style="padding-top: -5px; height: unset"
                >
                  <q-item-section class="custom-field one">
                    <q-select
                      :readonly="readonly"
                      borderless
                      class="selektKlass"
                      :options="opcijeZaroditeljiZaposleni"
                      v-model="editedItem.roditeljiZaposleni"
                      emit-value
                      map-options
                      ref="select5"
                      @focus="popniPlaceholder('Span-SL5')"
                      @input="popniPlaceholder('Span-SL5')"
                      @blur="
                        spustiPlaceholder(
                          'Span-SL5',
                          editedItem.roditeljiZaposleni
                        )
                      "
                    />
                    <span
                      @click="$refs.select5.showPopup()"
                      id="Span-SL5"
                      class="placeholder placeholder1"
                      >{{ $t("administration.players.parentJob") }}</span
                    >
                  </q-item-section>
                </q-item>

                <!-- <q-item class="formular ponisti" style="width: 50%;">
                        <q-item-section>
                            <q-select
                              borderless
                              class="selektKlass"
                              :options="opcijeZaUspeh"
                              v-model="editedItem.uspehPorodice"
                              emit-value
                              map-options
                            />
                          </q-item-section>
                      </q-item> -->
                <q-item class="formular ponisti" style="width: 50%">
                  <q-item-section style="display: block">
                    <q-checkbox
                      :disable="readonly"
                      v-model="editedItem.uspehPorodice"
                      true-value="DA"
                      false-value="NE"
                      :label="$t('administration.players.familiRank')"
                    />
                  </q-item-section>
                </q-item>

                <!-- <q-item class="formular" style="width: 100%">
                        <q-item-section style="width: 100%; font-size: 11pt;;">
                          {{$t('administration.players.familiRank')}}
                        </q-item-section>
                        </q-item> -->
              </div>
            </q-list>
          </q-form>
        </q-card-section>
        <q-card-section>
          <q-card-actions
            :class="{ sakriDugmice: readonly }"
            align="center"
            class="bg-white text-teal ponisti"
          >
            <q-btn
              :label="$t('administration.players.cancel')"
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
              :label="$t('administration.players.save')"
              @click="addRow"
              type="submit"
              style="
                background-color: #ff4b00;
                color: white;
                width: 20%;
                margin: 10px;
              "
            ></q-btn> </q-card-actions
        ></q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dataPreview">
      <q-card
        style="
          width: 700px;
          max-width: 70vw;
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
          />

          <div class="text-h6" style="text-align: center">
            {{ $t("administration.players.players") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular">
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      readonly
                      v-model="editedItem.ime"
                      :label="$t('administration.players.name')"
                    />
                    <span class="placeholder">{{
                      $t("administration.players.name")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item class="formular">
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      readonly
                      v-model="editedItem.prezime"
                      :label="$t('administration.players.surname')"
                    />
                    <span class="placeholder">{{
                      $t("administration.players.surname")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item class="formular ponisti">
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      readonly
                      v-model="editedItem.nadimak"
                      :label="$t('administration.players.nick')"
                    />
                    <span class="placeholder">{{
                      $t("administration.players.nick")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item class="formular">
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="
                      background: #f5f8fb;
                      color: #323b62;
                      height: 45px;
                      border-radius: 5px;
                      padding-left: 14px !important;
                    "
                    :label="$t('administration.players.gender')"
                    :options="opcijeZaPol"
                    v-model="editedItem.pol"
                  />
                </q-item-section>
              </q-item>

              <q-item class="formular ponisti" style="">
                <label class="custom-field one">
                  <input
                    type="text"
                    placeholder=" "
                    readonly
                    v-model="editedItem.datumRodjenja"
                    :label="$t('administration.players.birthDate')"
                  />
                  <span class="placeholder">{{
                    $t("administration.players.birthDate")
                  }}</span>
                </label>
              </q-item>

              <q-item class="formular">
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      type="text"
                      placeholder=" "
                      v-model="editedItem.drzavljanstvo"
                      :label="$t('administration.players.nationality')"
                    />
                    <span class="placeholder">{{
                      $t("administration.players.nationality")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <div>
                <q-img
                  :src="editedItem.fotografija"
                  spinner-color="white"
                  style="
                    height: 170px;
                    max-width: 200px;
                    border: ridge;
                    margin: 7px;
                    margin-top: 4px;
                  "
                />
              </div>

              <div style="margin-top: -15px">
                <q-item class="formular rasiri">
                  <q-item-section>
                    <label class="custom-field one">
                      <input
                        type="text"
                        placeholder=" "
                        readonly
                        v-model="editedItem.adresa"
                        :label="$t('administration.players.address')"
                      />
                      <span class="placeholder">{{
                        $t("administration.players.address")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item class="formular rasiri">
                  <q-item-section>
                    <label class="custom-field one">
                      <input
                        type="text"
                        placeholder=" "
                        readonly
                        v-model="editedItem.mobilni"
                        :label="$t('administration.players.mobile')"
                      />
                      <span class="placeholder">{{
                        $t("administration.players.mobile")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item class="formular rasiri">
                  <q-item-section>
                    <label class="custom-field one">
                      <input
                        type="text"
                        placeholder=" "
                        readonly
                        v-model="editedItem.email"
                        :label="$t('administration.players.email')"
                      />
                      <span class="placeholder">{{
                        $t("administration.players.email")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item class="formular rasiri">
                  <q-item-section>
                    <q-select
                      borderless
                      readonly
                      style="
                        background: #f5f8fb;
                        color: #323b62;
                        height: 45px;
                        border-radius: 5px;
                        padding-left: 14px !important;
                      "
                      :label="$t('administration.players.clubConn')"
                      :options="opcijeZaKlub"
                      v-model="editedItem.kakoJeDosaoUKlub"
                    />
                  </q-item-section>
                </q-item>

                <q-item class="formular rasiri ponisti">
                  <q-item-section>
                    <label class="custom-field one">
                      <input
                        type="text"
                        placeholder=" "
                        readonly
                        v-model="editedItem.koGaJePreporucio"
                        :label="$t('administration.players.recommendation')"
                      />
                      <span class="placeholder">{{
                        $t("administration.players.recommendation")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item class="formular rasiri">
                  <q-item-section>
                    <label class="custom-field one">
                      <input
                        type="text"
                        placeholder=" "
                        readonly
                        v-model="editedItem.brojPasosa"
                        :label="$t('administration.players.passportNum')"
                      />
                      <span class="placeholder">{{
                        $t("administration.players.passportNum")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item class="formular ponisti" style="">
                  <label class="custom-field one unesiDatum">
                    <input
                      type="text"
                      placeholder=" "
                      readonly
                      v-model="editedItem.vaznostPasosa"
                      :label="$t('administration.players.passportImportance')"
                    />
                    <span class="placeholder">{{
                      $t("administration.players.passportImportance")
                    }}</span>

                    <q-popup-proxy
                      ref="qDateProxy1"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="editedItem.vaznostPasosa"
                        @input="() => $refs.qDateProxy1.hide()"
                      ></q-date>
                    </q-popup-proxy>
                  </label>
                </q-item>

                <p style="padding-top: 5px; margin-bottom: 5px" class="ponisti">
                  {{ $t("administration.players.fam") }}
                </p>
                <q-item class="formular">
                  <q-item-section>
                    <q-select
                      borderless
                      readonly
                      style="
                        background: #f5f8fb;
                        color: #323b62;
                        height: 45px;
                        border-radius: 5px;
                        padding-left: 14px !important;
                      "
                      :label="$t('administration.players.livingWith')"
                      :options="opcijeSaKimZivi"
                      v-model="editedItem.saKimZivi"
                    />
                  </q-item-section>
                </q-item>

                <q-item class="formular">
                  <q-item-section>
                    <label class="custom-field one">
                      <input
                        type="text"
                        placeholder=" "
                        readonly
                        v-model="editedItem.brojDeceUPorodici"
                        :label="$t('administration.players.childNum')"
                      />
                      <span class="placeholder">{{
                        $t("administration.players.childNum")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item class="formular">
                  <q-item-section>
                    <label class="custom-field one">
                      <input
                        type="text"
                        placeholder=" "
                        readonly
                        v-model="editedItem.kojeJeDetePoRedu"
                        :label="$t('administration.players.childorder')"
                      />
                      <span class="placeholder">{{
                        $t("administration.players.childorder")
                      }}</span>
                    </label>
                  </q-item-section>
                </q-item>

                <q-item class="formular">
                  <q-item-section>
                    <q-select
                      borderless
                      readonly
                      style="
                        background: #f5f8fb;
                        color: #323b62;
                        height: 45px;
                        border-radius: 5px;
                        padding-left: 14px !important;
                      "
                      :label="$t('administration.players.parentEdu')"
                      :options="opcijeZaObrazovanjeRoditelja"
                      v-model="editedItem.obrazovanjeRoditelja"
                    />
                  </q-item-section>
                </q-item>

                <q-item class="formular">
                  <q-item-section>
                    <q-select
                      borderless
                      readonly
                      style="
                        background: #f5f8fb;
                        color: #323b62;
                        height: 45px;
                        border-radius: 5px;
                        padding-left: 14px !important;
                      "
                      :label="$t('administration.players.parentJob')"
                      :options="opcijeZaroditeljiZaposleni"
                      v-model="editedItem.roditeljiZaposleni"
                    />
                  </q-item-section>
                </q-item>

                <q-item class="formular" style="width: 100%">
                  <q-item-section style="width: 100%">
                    {{ $t("administration.players.familiRank") }}
                  </q-item-section>
                </q-item>

                <q-item class="formular" style="width: 100%">
                  <q-item-section>
                    <q-select
                      readonly
                      borderless
                      style="
                        background: #f5f8fb;
                        color: #323b62;
                        height: 45px;
                        border-radius: 5px;
                        padding-left: 14px !important;
                      "
                      :options="opcijeZaUspeh"
                      v-model="editedItem.uspehPorodice"
                    />
                  </q-item-section>
                </q-item>
              </div>
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
import base64 from "../../components/base64.vue";

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
  components: {
    base64,
  },
  data() {
    return {
      readonly: false,
      loadingUtakmice: false,
      date: "2019-01-01",
      filter: "",
      listOptions: [
        {
          label: this.$t("administration.players.administrator"),
          value: "ROLE_ADMIN",
        },
        {
          label: this.$t("administration.players.trener"),
          value: "ROLE_TRENER",
        },
        {
          label: this.$t("administration.players.pomocniTrener"),
          value: "ROLE_POMTRENER",
        },
        {
          label: this.$t("administration.players.direktor"),
          value: "ROLE_MANAGER",
        },
        {
          label: this.$t("administration.players.igrac"),
          value: "ROLE_PLAYER",
        },
      ],
      opcijeZaKlub: [
        {
          label: this.$t("administration.players.preporukaMenadzer"),
          value: "PREPORUKA_MENADZERA",
        },
        {
          label: this.$t("administration.players.preporukaSkauta"),
          value: "PREPORUKA_SKAUTA",
        },
        {
          label: this.$t("administration.players.preporukaTrenera"),
          value: "PREPORUKA_TRENERA",
        },
        {
          label: this.$t("administration.players.selektivniTrening"),
          value: "SELEKTIVNI_TRENING",
        },
        {
          label: this.$t("administration.players.regionalniCentar"),
          value: "REGIONALNI_CENTAR",
        },
        {
          label: this.$t("administration.players.skolaFudbala"),
          value: "SKOLA_FUDBALA",
        },
        { label: this.$t("administration.players.kamp"), value: "KAMP" },
        { label: this.$t("administration.players.vip"), value: "VIP" },
        { label: this.$t("administration.players.ostalo"), value: "OSTALO" },
      ],
      opcijeSaKimZivi: [
        {
          label: this.$t("administration.players.obaRoditelja"),
          value: "OBA_RODITELJA",
        },
        { label: this.$t("administration.players.majka"), value: "MAJKA" },
        { label: this.$t("administration.players.otac"), value: "OTAC" },
        {
          label: this.$t("administration.players.nijedno"),
          value: "SAMOSTALNO",
        },
        {
          label: this.$t("administration.players.samostalno"),
          value: "STARATELJ",
        },
      ],
      opcijeZaObrazovanjeRoditelja: [
        { label: this.$t("administration.players.osnovno"), value: "OSNOVNO" },
        { label: this.$t("administration.players.srednje"), value: "SREDNJE" },
        { label: this.$t("administration.players.vise"), value: "VISE" },
        { label: this.$t("administration.players.visoko"), value: "VISOKO" },
        {
          label: this.$t("administration.players.doktorat"),
          value: "DONTORAT",
        },
      ],
      opcijeZaroditeljiZaposleni: [
        {
          label: this.$t("administration.players.obaRoditelja"),
          value: "OBA_RODITELJA",
        },
        { label: this.$t("administration.players.majka"), value: "MAJKA" },
        { label: this.$t("administration.players.otac"), value: "OTAC" },
        { label: this.$t("administration.players.nijedno"), value: "NIJEDNO" },
      ],
      opcijeZaUspeh: [
        { label: this.$t("administration.players.da"), value: "DA" },
        { label: this.$t("administration.players.ne"), value: "NE" },
      ],
      opcijeZaPol: [
        { label: this.$t("administration.players.male"), value: "M" },
        { label: this.$t("administration.players.female"), value: "F" },
      ],
      customer: {},
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      editedItem: {
        id: 0,
        ime: "",
        prezime: "",
        nadimak: "",
        pol: "",
        datumRodjenja: "",
        drzavljanstvo: "",
        adresa: "",
        mobilni: "",
        email: "",
        fotografija: "",
        brojPasosa: "",
        vaznostPasosa: "",
        kakoJeDosaoUKlub: "",
        koGaJePreporucio: "",
        saKimZivi: "",
        brojDeceUPorodici: null,
        kojeJeDetePoRedu: null,
        obrazovanjeRoditelja: "",
        roditeljiZaposleni: "",
        uspehPorodice: "NE",
        active: true,
      },
      defaultItem: {
        id: 0,
        ime: "",
        prezime: "",
        nadimak: "",
        pol: "",
        datumRodjenja: "",
        drzavljanstvo: "",
        adresa: "",
        mobilni: "",
        email: "",
        fotografija: "",
        brojPasosa: "",
        vaznostPasosa: "",
        kakoJeDosaoUKlub: "",
        koGaJePreporucio: "",
        saKimZivi: "",
        brojDeceUPorodici: null,
        kojeJeDetePoRedu: null,
        obrazovanjeRoditelja: "",
        roditeljiZaposleni: "",
        uspehPorodice: "NE",
        active: true,
      },
      mode: "list",
      columns: [
        {
          name: "ime",
          required: true,
          label: this.$t("administration.players.name"),
          align: "left",
          field: "ime",
          sortable: true,
        },
        {
          name: "prezime",
          align: "left",
          label: this.$t("administration.players.surname"),
          field: "prezime",
          sortable: true,
        },
        {
          name: "nadimak",
          align: "left",
          label: this.$t("administration.players.nick"),
          field: "nadimak",
          sortable: true,
        },
        // {
        //   name: "pol",
        //   align: "left",
        //   label: "Пол",
        //   field: "pol",
        //   sortable: true
        // },
        // {
        //   name: "datumRodjenja",
        //   align: "left",
        //   label: "Datum рођења",
        //   field: "datumRodjenja",
        //   sortable: true
        // },
        // {
        //   name: "drzavljanstvo",
        //   align: "left",
        //   label: "Држављанство",
        //   field: "drzavljanstvo",
        //   sortable: true
        // },
        // {
        //   name: "adresa",
        //   align: "left",
        //   label: "Адреса",
        //   field: "adresa",
        //   sortable: true
        // },
        {
          name: "mobilni",
          align: "left",
          label: this.$t("administration.players.mobile"),
          field: "mobilni",
          sortable: true,
        },
        {
          name: "email",
          align: "left",
          label: this.$t("administration.players.email"),
          field: "email",
          sortable: true,
        },
        // {
        //   name: "fotografija",
        //   align: "left",
        //   label: "Фотографија",
        //   field: "fotografija",
        //   sortable: true
        // },
        // {
        //   name: "brojPasosa",
        //   align: "left",
        //   label: "Број пасоша",
        //   field: "brojPasosa",
        //   sortable: true
        // },
        {
          name: "datumRodjenja",
          align: "left",
          label: this.$t("administration.players.birthDate"),
          field: "datumRodjenja",
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
      // data1: [
      //   {
      //   id: 1,
      //   ime: "Душан",
      //   prezime: "Савић",
      //   nadimak: "Дуле",
      //   pol: "мушко",
      //   datumRodjenja: "1-1-1955",
      //   drzavljanstvo: "Српско",
      //   adresa: "адреса",
      //   mobilni: "066-123-123",
      //   email: "dule@savic.com",
      //   fotografija: "",
      //   brojPasosa:"125412121",
      //   vaznostPasosa: "12/12/2021",
      //   kakoJeDosaoUKlub: "Препорука trenera",
      //   saKimZivi: "Оба родитеља",
      //   brojDeceUPorodici: "1",
      //   kojeJeDetePoRedu: "1",
      //   obrazovanjeRoditelja: "Високо",
      //   roditeljiZaposleni: "Оба",
      //   uspehPorodice: "Да",
      //   active: true
      //   },
      //   {
      //   id: 2,
      //   ime: "Владимир",
      //   prezime: "Петровић",
      //   nadimak: "Пижон",
      //   pol: "мушко",
      //   datumRodjenja: "1-1-1955",
      //   drzavljanstvo: "Српско",
      //   adresa: "адреса",
      //   mobilni: "066-123-123",
      //   email: "mile@cz.com",
      //   fotografija: "",
      //   brojPasosa:"125412121",
      //   vaznostPasosa: "12/12/2021",
      //   kakoJeDosaoUKlub: "Камп",
      //   saKimZivi: "Мајком",
      //   brojDeceUPorodici: "3",
      //   kojeJeDetePoRedu: "1",
      //   obrazovanjeRoditelja: "Средње",
      //   roditeljiZaposleni: "Мајка",
      //   uspehPorodice: "Не",
      //   active: true
      //   },
      //   {
      //   id: 3,
      //   ime: "Дејан",
      //   prezime: "Савићевић",
      //   nadimak: "Дејооо",
      //   pol: "мушко",
      //   datumRodjenja: "1-1-1955",
      //   drzavljanstvo: "Српско",
      //   adresa: "адреса",
      //   mobilni: "066-123-123",
      //   email: "cile@cz.com",
      //   fotografija: "",
      //   brojPasosa:"125412121",
      //   vaznostPasosa: "12/12/2021",
      //   kakoJeDosaoUKlub: "Школа фудбала",
      //   saKimZivi: "Оба родитеља",
      //   brojDeceUPorodici: "3",
      //   kojeJeDetePoRedu: "3",
      //   obrazovanjeRoditelja: "Више",
      //   roditeljiZaposleni: "Мајка",
      //   uspehPorodice: "Не",
      //   active: true
      //   },

      // ],
      data: [],
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  mounted() {
    //this.editedItem.datumRodjenja = new Date().toJSON().slice(0,10).replace(/-/g,'/'); //todo: proveriti da li je danasnji datum OK
    //this.editedItem.vaznostPasosa = new Date().toJSON().slice(0,10).replace(/-/g,'/');

    this.getData(); //idemo da uzmenmo podatke iz baze
  },
  methods: {
    preventDragDefault(evt) {
      evt.preventDefault();
      // console.log(evt)
    },
    dropFile(evt) {
      if (this.$refs.customFileInput == undefined) return;
      // pretty simple -- but not for IE :(
      var file = evt.dataTransfer.files;

      // If you want to use some of the dropped files
      const dT = new DataTransfer();
      dT.items.add(evt.dataTransfer.files[0]);
      file = dT.files[0];
      console.log(this.$refs.customFileInput.$el.files);

      let reader = new FileReader();
      // Convert the file to base64 text
      reader.readAsDataURL(file);
      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        // let fileInfo = {
        //   name: file.name,
        //   type: file.type,
        //   size: Math.round(file.size / 1000)+' kB',
        //   base64: reader.result,
        //   file: file
        // }

        this.editedItem.fotografija = reader.result;
      }; // reader.onload

      evt.preventDefault();
    },
    propagateClick() {
      this.$refs.customFileInput.$el.click();
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
        izabraniPlaceholder.style.padding = "0px";
        izabraniPlaceholder.style.color = "#aaa";
      }
    },
    otvoriPreviewDialog(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.datumRodjenja = date.formatDate(
        this.editedItem.datumRodjenja,
        "DD/MM/YYYY"
      );
      if (this.editedItem.vaznostPasosa != "")
        this.editedItem.vaznostPasosa = date.formatDate(
          this.editedItem.vaznostPasosa,
          "DD/MM/YYYY"
        );
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
    getData() {
      let linkStr = this.$apiPutanja + "/igraci";
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
    // dodavsanje novog igraca
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/igraci";
      var self = this;
      let datumRodjenja1 = this.getDateTime(this.editedItem.datumRodjenja);
      if (
        this.editedItem.vaznostPasosa != "" &&
        this.editedItem.vaznostPasosa != undefined
      )
        var vaznostPasosa1 = this.getDateTime(this.editedItem.vaznostPasosa);
      else var vaznostPasosa1 = "";
      let fotka = this.editedItem.fotografija; //this.getMenuImage(this.editedItem.fotografija)

      var dataString = {
        active: 1,
        adresa: this.editedItem.adresa,
        brojDeceUPorodici: this.editedItem.brojDeceUPorodici,
        brojPasosa: this.editedItem.brojPasosa,
        datumRodjenja: datumRodjenja1,
        drzavljanstvo: this.editedItem.drzavljanstvo,
        email: this.editedItem.email,
        fotografija: fotka,
        id: this.editedItem.id,
        ime: this.editedItem.ime,
        kakoJeDosaoUKlub: this.editedItem.kakoJeDosaoUKlub,
        koGaJePreporucio: this.editedItem.koGaJePreporucio,
        kojeJeDetePoRedu: this.editedItem.kojeJeDetePoRedu,
        mobilni: this.editedItem.mobilni,
        nadimak: this.editedItem.nadimak,
        obrazovanjeRoditelja: this.editedItem.obrazovanjeRoditelja,
        password: this.editedItem.password,
        pol: this.editedItem.pol,
        prezime: this.editedItem.prezime,
        roditeljiZaposleni: this.editedItem.roditeljiZaposleni,
        roles: [],
        saKimZivi: this.editedItem.saKimZivi,
        userName: this.editedItem.userName,
        uspehPorodice: this.editedItem.uspehPorodice,
        vaznostPasosa: vaznostPasosa1,
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
          self.getData();
          self.$q.notify({
            message: self.$t("administration.players.msgPositive"),
            color: "green",
          });
          self.close();
        })
        .catch(function (error) {
          //handle error
          console.log(error);
          console.log(error.response);
          if (
            error.response.data.exceptionMsg.includes(
              "Already exists user with email"
            )
          )
            self.$q.notify({
              message: self.$t("administration.players.emailTaken"),
              color: "red",
            });
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena tima
    //........................................
    putData() {
      debugger;
      let linkStr = this.$apiPutanja + "/igraci/" + this.editedItem.id;
      var self = this;
      let datumRodjenja1 = this.getDateTime(this.editedItem.datumRodjenja);
      if (
        this.editedItem.vaznostPasosa != "" &&
        this.editedItem.vaznostPasosa != undefined
      )
        var vaznostPasosa1 = this.getDateTime(this.editedItem.vaznostPasosa);
      else var vaznostPasosa1 = "";
      let fotka = this.editedItem.fotografija; //this.getMenuImage(this.editedItem.fotografija)

      var dataString = {
        active: 1,
        adresa: this.editedItem.adresa,
        brojDeceUPorodici: this.editedItem.brojDeceUPorodici,
        brojPasosa: this.editedItem.brojPasosa,
        datumRodjenja: datumRodjenja1,
        drzavljanstvo: this.editedItem.drzavljanstvo,
        email: this.editedItem.email,
        fotografija: fotka,
        id: this.editedItem.id,
        ime: this.editedItem.ime,
        kakoJeDosaoUKlub: this.editedItem.kakoJeDosaoUKlub,
        koGaJePreporucio: this.editedItem.koGaJePreporucio,
        kojeJeDetePoRedu: this.editedItem.kojeJeDetePoRedu,
        mobilni: this.editedItem.mobilni,
        nadimak: this.editedItem.nadimak,
        obrazovanjeRoditelja: this.editedItem.obrazovanjeRoditelja,
        password: this.editedItem.password,
        pol: this.editedItem.pol,
        prezime: this.editedItem.prezime,
        roditeljiZaposleni: this.editedItem.roditeljiZaposleni,
        roles: [],
        saKimZivi: this.editedItem.saKimZivi,
        userName: this.editedItem.userName,
        uspehPorodice: this.editedItem.uspehPorodice,
        vaznostPasosa: vaznostPasosa1,
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
          self.getData();
          self.$q.notify({
            message: self.$t("administration.players.msgChange"),
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
      debugger;
      let linkStr = this.$apiPutanja + "/igraci/" + item.id;
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
            message: self.$t("administration.players.msgDel"),
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
    // dodavanje igraca kao korisnika sistema
    //........................................
    dodajKorinika(item) {
      debugger;
      let linkStr = this.$apiPutanja + "/igraci/update-to-korisnik";
      var self = this;
      var dataString = {
        id: item.id,
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
          self.getData();
          self.$q.notify({
            message: self.$t("administration.players.msgPositmsgPositivePlyve"),
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
      console.log(a);
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
    getMenuImage(files) {
      //slika
      console.log(files);
      this.editedItem.fotografija = files.base64;
    },
    addRow() {
      debugger;
      let sveOK = true;

      if (this.editedItem.ime == null || this.editedItem.ime == "")
        sveOK = false;
      if (this.editedItem.prezime == null || this.editedItem.prezime == "")
        sveOK = false;
      if (this.editedItem.pol == null || this.editedItem.pol == "")
        sveOK = false;
      if (
        this.editedItem.datumRodjenja == null ||
        this.editedItem.datumRodjenja == ""
      )
        sveOK = false;

      if (this.editedItem.email == null || this.editedItem.email == "")
        sveOK = false;

      if (sveOK == false) {
        this.$q.notify({
          message: this.$t("administration.user.notSaved"),
          color: "red",
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
        }
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
        title: this.$t("administration.players.war"),
        message: this.$t("administration.players.msgDelConf"),
        customCloseBtnText: this.$t("administration.players.txtNo"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: this.$t("administration.players.txtYes"),
        onConfirm: onConfirmWrapper,
        type: "warning",
        showXclose: true,
      };
      this.$Simplert.open(obj);
      var self = this;
      function onConfirmWrapper() {
        self.data.splice(index, 1);
        debugger;
        self.deleteData(item);
      }
    },
    otvordeDialog() {
      //this.editedItem.datumRodjenja = this.getDateTime(Date.now());
      //this.editedItem.vaznostPasosa = this.getDateTime(Date.now());
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.datumRodjenja = date.formatDate(
        this.editedItem.datumRodjenja,
        "DD/MM/YYYY"
      );
      if (this.editedItem.vaznostPasosa != "")
        this.editedItem.vaznostPasosa = date.formatDate(
          this.editedItem.vaznostPasosa,
          "DD/MM/YYYY"
        );
      if (this.editedItem.uspehPorodice == "")
        this.editedItem.uspehPorodice = "NE";
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
    igracKorisnkSistema(item) {
      let obj = {
        title: this.$t("administration.players.war"),
        message: this.$t("administration.players.msgConf"),
        customCloseBtnText: this.$t("administration.players.txtNo"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: this.$t("administration.players.txtYes"),
        onConfirm: onConfirmWrapper,
        type: "warning",
        showXclose: true,
        color: "#ff4b00",
      };
      this.$Simplert.open(obj);
      var self = this;
      function onConfirmWrapper() {
        debugger;
        self.dodajKorinika(item);
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

      const status = exportFile("igraci.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: this.$t("administration.players.msgPrtSc"),
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
};
</script>

<style scoped>
.rasiri {
  width: 50%;
}
.rasiri1 {
  width: 49%;
}
.custom-file-input {
  color: transparent;
}
.custom-file-input::-webkit-file-upload-button {
  visibility: hidden;
}
.custom-file-input::before {
  width: 98%;
  content: "Select a photo";
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

tbody tr:hover td #dugmeModifaj {
  background-color: #30cc83 !important;
  color: #ffffff !important;
}

tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}

.unesiDatum:hover {
  cursor: pointer;
}

.levaStranaSlike {
  width: 66%;
  float: left;
}

.formular1 {
  width: 50%;
  height: 40px;
  display: inline-flex;
  padding-right: 0px;
  padding-top: 20px;
}

.sakriDugmice {
  display: none;
}
</style>
