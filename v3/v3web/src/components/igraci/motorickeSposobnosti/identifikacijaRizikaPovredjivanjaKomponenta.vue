<template>
  <q-page class="q-pa-sm">
    <!-- <div class="row"
          style="
            position: absolute;
            top: -90px;
            z-index: 5000;
            margin: 0 30%;"
            >
            <h5> {{$t('players.motorSkills.riskOfInjury.selectedPlayer')}}: {{this.igrac}}</h5>
            <q-btn style="padding:22px;margin:10px;color:red" flat round icon="people" @click="izborIgraca()" >
              <q-tooltip>{{$t('players.motorSkills.riskOfInjury.browsePlayers')}}</q-tooltip>
            </q-btn>
        </div> -->
    <q-table
      :title="$t('players.motorSkills.riskOfInjury.injuryRiskIdentification')"
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
        v-if="
          igr != $t('players.motorSkills.riskOfInjury.selectPlayer') + ' ->'
        "
        v-slot:top-right="props"
      >
        <q-btn
          v-if="Object.keys(selektovaniIgrac).length != 0"
          @click="otvordeDialog()"
          :label="$t('players.motorSkills.riskOfInjury.newMesurement')"
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
              >{{props.inFullscreen ? $t('players.motorSkills.riskOfInjury.exitFullscreen') : $t('players.motorSkills.riskOfInjury.enterFullscreen')}}</q-tooltip>
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
              ? $t("players.motorSkills.riskOfInjury.list")
              : $t("players.motorSkills.riskOfInjury.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('players.motorSkills.riskOfInjury.exportCSV')"
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
                $t("players.motorSkills.riskOfInjury.delete")
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
                $t("players.motorSkills.riskOfInjury.changeData")
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
            {{ $t("players.motorSkills.riskOfInjury.mesurement") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular" style="">
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
                    $t("players.motorSkills.riskOfInjury.date")
                  }}</span>
                </label>
              </q-item>

              <q-item class="formular" style="width: 63%">
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
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
                      $t("players.motorSkills.riskOfInjury.whoDidTheTesting")
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
                      v-model="editedItem.desnaNogaDuzina"
                      type="number"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP2',
                          editedItem.desnaNogaDuzina
                        )
                      "
                    />
                    <span id="Span-IP2" class="placeholder"
                      >{{
                        $t(
                          "players.motorSkills.riskOfInjury.lengthOfRightLegWhileStanding"
                        )
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <div style="margin: 10px 30px">
                {{ $t("players.motorSkills.riskOfInjury.rightLegReach") }}
              </div>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.desnaNogaDohvatNapred"
                      type="number"
                      @focus="popniPlaceholder('Span-IP3')"
                      @input="popniPlaceholder('Span-IP3')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP3',
                          editedItem.desnaNogaDohvatNapred
                        )
                      "
                    />
                    <span id="Span-IP3" class="placeholder"
                      >{{
                        $t("players.motorSkills.riskOfInjury.forward")
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
                      v-model="editedItem.desnaNogaDohvatSpolja"
                      type="number"
                      @focus="popniPlaceholder('Span-IP4')"
                      @input="popniPlaceholder('Span-IP4')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP4',
                          editedItem.desnaNogaDohvatSpolja
                        )
                      "
                    />
                    <span id="Span-IP4" class="placeholder"
                      >{{
                        $t("players.motorSkills.riskOfInjury.outward")
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
                      v-model="editedItem.desnaNogaDohvatUnutra"
                      type="number"
                      @focus="popniPlaceholder('Span-IP5')"
                      @input="popniPlaceholder('Span-IP5')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP5',
                          editedItem.desnaNogaDohvatUnutra
                        )
                      "
                    />
                    <span id="Span-IP5" class="placeholder"
                      >{{
                        $t("players.motorSkills.riskOfInjury.inside")
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <div style="margin: 10px 30px">
                {{ $t("players.motorSkills.riskOfInjury.leftLegReach") }}
              </div>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.levaNogaDohvatNapred"
                      type="number"
                      @focus="popniPlaceholder('Span-IP6')"
                      @input="popniPlaceholder('Span-IP6')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP6',
                          editedItem.levaNogaDohvatNapred
                        )
                      "
                    />
                    <span id="Span-IP6" class="placeholder"
                      >{{
                        $t("players.motorSkills.riskOfInjury.forward")
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
                      v-model="editedItem.levaNogaDohvatSpolja"
                      type="number"
                      @focus="popniPlaceholder('Span-IP7')"
                      @input="popniPlaceholder('Span-IP7')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP7',
                          editedItem.levaNogaDohvatSpolja
                        )
                      "
                    />
                    <span id="Span-IP7" class="placeholder"
                      >{{
                        $t("players.motorSkills.riskOfInjury.outward")
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
                      v-model="editedItem.levaNogaDohvatUnutra"
                      type="number"
                      @focus="popniPlaceholder('Span-IP8')"
                      @input="popniPlaceholder('Span-IP8')"
                      @blur="
                        spustiPlaceholder(
                          'Span-IP8',
                          editedItem.levaNogaDohvatUnutra
                        )
                      "
                    />
                    <span id="Span-IP8" class="placeholder"
                      >{{
                        $t("players.motorSkills.riskOfInjury.inside")
                      }}
                      [cm]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-separator style="margin: 25px 0px;"></q-separator>
              <q-item style="height: 75px;">
                <q-item-section>
                  <label class="custom-field one">
                    <p
                      style="
                            text-align: center;
                            color: #000000;
                            margin-top: 10px;
                            margin-bottom: 0px;
                          "
                    >
                      {{
                        $t("players.motorSkills.riskOfInjury.oneLegSquatLeft")
                      }}
                    </p>
                    <div
                      :disable="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="editedItem.cucanjNaJednojNoziLevo = item.value"
                      style="
                            display: inline-block;
                            width: 21%;
                            margin: 2%;
                            padding: 10px;
                            background-color:#f5f8fb;
                            border-radius: 4px;
                            text-align: center;
                            cursor:pointer;
                          "
                      :style="{
                        border: [
                          editedItem.cucanjNaJednojNoziLevo == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input
                          borderless
                          dense
                          placeholder=" "
                          v-model="editedItem.cucanjNaJednojNoziLevo"
                        />
                        <span class="placeholder">{{$t('players.motorSkills.riskOfInjury.oneLegSquatLeft')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item style="height: 75px;">
                <q-item-section>
                  <label class="custom-field one">
                    <p
                      style="
                            text-align: center;
                            color: #000000;
                            margin-top: 10px;
                            margin-bottom: 0px;
                          "
                    >
                      {{
                        $t("players.motorSkills.riskOfInjury.oneLegSquatRight")
                      }}
                    </p>
                    <div
                      :disable="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="editedItem.cucanjNaJednojNoziDesno = item.value"
                      style="
                            display: inline-block;
                            width: 21%;
                            margin: 2%;
                            padding: 10px;
                            background-color:#f5f8fb;
                            border-radius: 4px;
                            text-align: center;
                            cursor:pointer;
                          "
                      :style="{
                        border: [
                          editedItem.cucanjNaJednojNoziDesno == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input
                          borderless
                          dense
                          placeholder=" "
                          v-model="editedItem.cucanjNaJednojNoziDesno"
                        />
                        <span class="placeholder">{{$t('players.motorSkills.riskOfInjury.oneLegSquatRight')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>

              <q-item style="height: 75px;">
                <q-item-section>
                  <label class="custom-field one">
                    <p
                      style="
                            text-align: center;
                            color: #000000;
                            margin-top: 10px;
                            margin-bottom: 0px;
                          "
                    >
                      {{ $t("players.motorSkills.riskOfInjury.nordikTest") }}
                    </p>
                    <div
                      :disable="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="editedItem.nordikTest = item.value"
                      style="
                            display: inline-block;
                            width: 21%;
                            margin: 2%;
                            padding: 10px;
                            background-color:#f5f8fb;
                            border-radius: 4px;
                            text-align: center;
                            cursor:pointer;
                          "
                      :style="{
                        border: [
                          editedItem.nordikTest == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input
                          borderless
                          dense
                          placeholder=" "
                          v-model="editedItem.nordikTest"
                        />
                        <span class="placeholder">{{$t('players.motorSkills.riskOfInjury.nordikTest')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.skoliometarCervikalni"
                    />
                    <span class="placeholder"
                      >{{
                        $t(
                          "players.motorSkills.riskOfInjury.scolionetarCervical"
                        )
                      }}
                      [°]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.skoliometarTorakalni"
                    />
                    <span class="placeholder"
                      >{{
                        $t(
                          "players.motorSkills.riskOfInjury.scolionetarThoracic"
                        )
                      }}
                      [°]</span
                    >
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      :readonly="readonly"
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.skoliometarLumbalni"
                    />
                    <span class="placeholder"
                      >{{
                        $t("players.motorSkills.riskOfInjury.scolionetarLumbar")
                      }}
                      [°]</span
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
            {{ $t("players.motorSkills.riskOfInjury.mesurement") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item class="formular" style="">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="editedItem.datumVreme"
                  :label="$t('players.motorSkills.riskOfInjury.date')"
                  class="datumInputReadOnly"
                  mask="##/##/####"
                />
              </q-item>

              <q-item v-if="this.editedIndex > -1">
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      dense
                      outlined
                      v-model="editedItem.korisnikImePrezime"
                      :label="
                        $t('players.motorSkills.riskOfInjury.whoDidTheTesting')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.whoDidTheTesting")
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
                      v-model="editedItem.desnaNogaDuzina"
                      :label="
                        $t(
                          'players.motorSkills.riskOfInjury.lengthOfRightLegWhileStanding'
                        )
                      "
                    />
                    <span class="placeholder">{{
                      $t(
                        "players.motorSkills.riskOfInjury.lengthOfRightLegWhileStanding"
                      )
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <div style="margin: 10px 30px">
                {{ $t("players.motorSkills.riskOfInjury.rightLegReach") }}
              </div>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      v-model="editedItem.desnaNogaDohvatNapred"
                      :label="$t('players.motorSkills.riskOfInjury.forward')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.forward")
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
                      v-model="editedItem.desnaNogaDohvatSpolja"
                      :label="$t('players.motorSkills.riskOfInjury.outward')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.outward")
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
                      v-model="editedItem.desnaNogaDohvatUnutra"
                      :label="$t('players.motorSkills.riskOfInjury.inside')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.inside")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>
              <div style="margin: 10px 30px">
                {{ $t("players.motorSkills.riskOfInjury.leftLegReach") }}
              </div>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      readonly
                      placeholder=" "
                      type="number"
                      v-model="editedItem.levaNogaDohvatNapred"
                      :label="$t('players.motorSkills.riskOfInjury.forward')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.forward")
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
                      v-model="editedItem.levaNogaDohvatSpolja"
                      :label="$t('players.motorSkills.riskOfInjury.outward')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.outward")
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
                      v-model="editedItem.levaNogaDohvatUnutra"
                      :label="$t('players.motorSkills.riskOfInjury.inside')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.inside")
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
                      v-model="editedItem.cucanjNaJednojNoziLevo"
                      :label="
                        $t('players.motorSkills.riskOfInjury.oneLegSquatLeft')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.oneLegSquatLeft")
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
                      v-model="editedItem.cucanjNaJednojNoziDesno"
                      :label="
                        $t('players.motorSkills.riskOfInjury.oneLegSquatRight')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.oneLegSquatRight")
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
                      v-model="editedItem.nordikTest"
                      :label="$t('players.motorSkills.riskOfInjury.nordikTest')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.nordikTest")
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
                      v-model="editedItem.skoliometarCervikalni"
                      :label="
                        $t(
                          'players.motorSkills.riskOfInjury.scolionetarCervical'
                        )
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.scolionetarCervical")
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
                      v-model="editedItem.skoliometarTorakalni"
                      :label="
                        $t(
                          'players.motorSkills.riskOfInjury.scolionetarThoracic'
                        )
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.scolionetarThoracic")
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
                      v-model="editedItem.skoliometarLumbalni"
                      :label="
                        $t('players.motorSkills.riskOfInjury.scolionetarLumbar')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.riskOfInjury.scolionetarLumbar")
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
      thomasTest4Options: [
        {
          label: "0 - " + this.$t("players.motorSkills.thomasTest.painfull"),
          value: "0"
        },
        {
          label: "1 - " + this.$t("players.motorSkills.thomasTest.bad"),
          value: "1"
        },
        {
          label: "2 - " + this.$t("players.motorSkills.thomasTest.good"),
          value: "2"
        },
        {
          label: "3 - " + this.$t("players.motorSkills.thomasTest.excelent"),
          value: "3"
        }
      ],
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
        userIdent: this.igrID,
        desnaNogaDohvatNapred: "",
        desnaNogaDohvatSpolja: "",
        desnaNogaDohvatUnutra: "",
        desnaNogaDuzina: "",
        levaNogaDohvatNapred: "",
        levaNogaDohvatSpolja: "",
        levaNogaDohvatUnutra: "",
        nordikTest: "",

        cucanjNaJednojNoziDesno: "",
        cucanjNaJednojNoziLevo: "",
        skoliometarCervikalni: "",
        skoliometarLumbalni: "",
        skoliometarTorakalni: ""
      },
      defaultItem: {
        datumVreme: "",
        ident: "",
        identKorisnik: "",
        korisnikImePrezime: "",
        userIdent: this.igrID,
        desnaNogaDohvatNapred: "",
        desnaNogaDohvatSpolja: "",
        desnaNogaDohvatUnutra: "",
        desnaNogaDuzina: "",
        levaNogaDohvatNapred: "",
        levaNogaDohvatSpolja: "",
        levaNogaDohvatUnutra: "",
        nordikTest: "",

        cucanjNaJednojNoziDesno: "",
        cucanjNaJednojNoziLevo: "",
        skoliometarCervikalni: "",
        skoliometarLumbalni: "",
        skoliometarTorakalni: ""
      },
      mode: "list",
      columns: [
        {
          name: "datumVreme",
          required: true,
          label: this.$t("players.motorSkills.riskOfInjury.date"),
          align: "left",
          field: "datumVreme",
          sortable: true,
          format: val => date.formatDate(val, "DD/MM/YYYY")
        },
        {
          name: "nordikTest",
          align: "left",
          label: this.$t("players.motorSkills.riskOfInjury.nordikTest"),
          field: "nordikTest",
          sortable: true
        },
        {
          name: "desnaNogaDuzina",
          align: "left",
          label: this.$t("players.motorSkills.riskOfInjury.rightLegLength"),
          field: "desnaNogaDuzina",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t("players.motorSkills.riskOfInjury.action"),
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
        this.$apiPutanja + "/identifikacija-povreda/igrac/" + this.igrID;
      this.loadingUtakmice = true;
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
      let linkStr = this.$apiPutanja + "/identifikacija-povreda";
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
        userIdent: parseFloat(this.igrID),
        desnaNogaDohvatNapred: parseFloat(
          this.editedItem.desnaNogaDohvatNapred
        ),
        desnaNogaDohvatSpolja: parseFloat(
          this.editedItem.desnaNogaDohvatSpolja
        ),
        desnaNogaDohvatUnutra: parseFloat(
          this.editedItem.desnaNogaDohvatUnutra
        ),
        desnaNogaDuzina: parseFloat(this.editedItem.desnaNogaDuzina),
        levaNogaDohvatNapred: parseFloat(this.editedItem.levaNogaDohvatNapred),
        levaNogaDohvatSpolja: parseFloat(this.editedItem.levaNogaDohvatSpolja),
        levaNogaDohvatUnutra: parseFloat(this.editedItem.levaNogaDohvatUnutra),
        nordikTest: parseFloat(this.editedItem.nordikTest),
        cucanjNaJednojNoziDesno: parseFloat(
          this.editedItem.cucanjNaJednojNoziDesno
        ),
        cucanjNaJednojNoziLevo: parseFloat(
          this.editedItem.cucanjNaJednojNoziLevo
        ),
        skoliometarLumbalni: parseFloat(this.editedItem.skoliometarLumbalni),
        skoliometarTorakalni: parseFloat(this.editedItem.skoliometarTorakalni),
        skoliometarCervikalni: parseFloat(this.editedItem.skoliometarCervikalni)
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
            message: self.$t(
              "players.motorSkills.riskOfInjury.newMeasurementSuccessfullyAdded"
            ),
            color: "green"
          });
        })
        .catch(function(response) {
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
      let linkStr =
        this.$apiPutanja + "/identifikacija-povreda/" + this.editedItem.ident;
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
        userIdent: parseFloat(this.igrID),
        desnaNogaDohvatNapred: parseFloat(
          this.editedItem.desnaNogaDohvatNapred
        ),
        desnaNogaDohvatSpolja: parseFloat(
          this.editedItem.desnaNogaDohvatSpolja
        ),
        desnaNogaDohvatUnutra: parseFloat(
          this.editedItem.desnaNogaDohvatUnutra
        ),
        desnaNogaDuzina: parseFloat(this.editedItem.desnaNogaDuzina),
        levaNogaDohvatNapred: parseFloat(this.editedItem.levaNogaDohvatNapred),
        levaNogaDohvatSpolja: parseFloat(this.editedItem.levaNogaDohvatSpolja),
        levaNogaDohvatUnutra: parseFloat(this.editedItem.levaNogaDohvatUnutra),
        nordikTest: parseFloat(this.editedItem.nordikTest),
        cucanjNaJednojNoziDesno: parseFloat(
          this.editedItem.cucanjNaJednojNoziDesno
        ),
        cucanjNaJednojNoziLevo: parseFloat(
          this.editedItem.cucanjNaJednojNoziLevo
        ),
        skoliometarLumbalni: parseFloat(this.editedItem.skoliometarLumbalni),
        skoliometarTorakalni: parseFloat(this.editedItem.skoliometarTorakalni),
        skoliometarCervikalni: parseFloat(this.editedItem.skoliometarCervikalni)
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
          console.log(response);
          self.getDataZaID();
          self.$q.notify({
            message: self.$t(
              "players.motorSkills.riskOfInjury.measurementDataChangedSuccessfully"
            ),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          //alert(response);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje/deaktiviranje igraca
    //........................................
    deleteData(item) {
      let linkStr = this.$apiPutanja + "/identifikacija-povreda/" + item.ident;
      var self = this;
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
            message: self.$t(
              "players.motorSkills.riskOfInjury.measurementDataDeletedSuccessfully"
            ),
            color: "green"
          });
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
        title: self.$t("players.motorSkills.riskOfInjury.warning"),
        message: self.$t("players.motorSkills.riskOfInjury.areYouSureDelete"),
        customCloseBtnText: self.$t("players.motorSkills.riskOfInjury.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("players.motorSkills.riskOfInjury.yes"),
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

      const status = exportFile(
        "rizikOdPovredjivanja.csv",
        content,
        "text/csv"
      );
      let self = this;
      if (status !== true) {
        this.$q.notify({
          message: self.$t("players.motorSkills.riskOfInjury.browserForbids"),
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
