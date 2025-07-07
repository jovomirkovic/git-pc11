<template>
  <q-page class="q-pa-sm">
    <q-table
      :title="$t('administration.technique.setpointMatrix.setTactics')"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      :grid="mode == 'grid'"
      :filter="filter"
      :pagination.sync="pagination"
      :rows-per-page-label="$t('table.rowsPerPage')"
      :no-data-label="$t('table.noData')"
      :loading-label="$t('table.loadingLabel')"
      :no-results-label="$t('table.noResultLabel')"
      :loading="loadingUtakmice"
      class="mojaTabela my-sticky-header-table"
      :visible-columns="visibleColumns"
      style="
            background-color: unset;
            box-shadow: unset;
          "
      table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10"
    >
      <template v-slot:top-right="props">
        <q-input
          outlined
          class="dugmeSearch"
          dense
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
        <q-th style="color: #ffffff00; width: 110px; min-width: 110px;">
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
          v-else-if="props.value == props.row.grupa"
          @click="otvoriPreviewDialog(props.row)"
        >
          <div class="" id="username">
            {{ props.row.grupa }}
          </div>
        </q-td>
        <q-td :props="props" v-else @click="otvoriPreviewDialog(props.row)">
          <div v-if="props.value == null">
            /
          </div>
          <div v-else>
            {{ props.value }}
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog persistent v-model="new_customer">
      <q-card
        style="
              width: 500px;
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
            {{ $t("administration.technique.setpointMatrix.setLvlTech") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <!--
    za input

                  <label class="custom-field one">
                    <input type="text" placeholder=" "
                    v-model="editedItem.userName"
                    :label="$t('administration.user.username')"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        $t('administration.user.enterUserName'),
                    ]"/>
                    <span class="placeholder">{{$t('administration.user.username')}}</span>
                  </label>

      za selekt
                  <q-select
                  borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px;"
                    :label="$t('administration.user.role')"
                    option-value="value"
                    option-label="label"
                    multiple
                    use-chips
                    :options="listOptions"
                    v-model="editedItem.roles"
                    emit-value
                    map-options
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        $t('administration.user.enterRole'),
                    ]"
                  />


-->
            <q-list>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.grupa"
                      disable
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')"
                      @blur="spustiPlaceholder('Span-IP1', editedItem.grupa)"
                    ></q-input>
                    <span id="Span-IP1" class="placeholder">{{
                      $t("administration.technique.setpointMatrix.group")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item style="margin-bottom: 30px">
                <q-item-section>
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.naziv"
                      disable
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="spustiPlaceholder('Span-IP2', editedItem.naziv)"
                    ></q-input>
                    <span id="Span-IP2" class="placeholder">{{
                      $t("administration.technique.setpointMatrix.item")
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
                    v-model="editedItem.u7"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select1"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="spustiPlaceholder('Span-SL1', editedItem.u7)"
                  />
                  <span
                    @click="$refs.select1.showPopup()"
                    id="Span-SL1"
                    class="placeholder placeholder1"
                    >U7</span
                  >
                </q-item-section>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u8"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select2"
                    @focus="popniPlaceholder('Span-SL2')"
                    @input="popniPlaceholder('Span-SL2')"
                    @blur="spustiPlaceholder('Span-SL2', editedItem.u8)"
                  />
                  <span
                    @click="$refs.select2.showPopup()"
                    id="Span-SL2"
                    class="placeholder placeholder1"
                    >U8</span
                  >
                </q-item-section>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u9"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select3"
                    @focus="popniPlaceholder('Span-SL3')"
                    @input="popniPlaceholder('Span-SL3')"
                    @blur="spustiPlaceholder('Span-SL3', editedItem.u9)"
                  />
                  <span
                    @click="$refs.select3.showPopup()"
                    id="Span-SL3"
                    class="placeholder placeholder1"
                    >U9</span
                  >
                </q-item-section>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u10"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select4"
                    @focus="popniPlaceholder('Span-SL4')"
                    @input="popniPlaceholder('Span-SL4')"
                    @blur="spustiPlaceholder('Span-SL4', editedItem.u10)"
                  />
                  <span
                    @click="$refs.select4.showPopup()"
                    id="Span-SL4"
                    class="placeholder placeholder1"
                    >U10</span
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u11"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select5"
                    @focus="popniPlaceholder('Span-SL5')"
                    @input="popniPlaceholder('Span-SL5')"
                    @blur="spustiPlaceholder('Span-SL5', editedItem.u11)"
                  />
                  <span
                    @click="$refs.select5.showPopup()"
                    id="Span-SL5"
                    class="placeholder placeholder1"
                    >U11</span
                  >
                </q-item-section>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u12"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select6"
                    @focus="popniPlaceholder('Span-SL6')"
                    @input="popniPlaceholder('Span-SL6')"
                    @blur="spustiPlaceholder('Span-SL6', editedItem.u12)"
                  />
                  <span
                    @click="$refs.select6.showPopup()"
                    id="Span-SL6"
                    class="placeholder placeholder1"
                    >U12</span
                  >
                </q-item-section>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u13"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select7"
                    @focus="popniPlaceholder('Span-SL7')"
                    @input="popniPlaceholder('Span-SL7')"
                    @blur="spustiPlaceholder('Span-SL7', editedItem.u13)"
                  />
                  <span
                    @click="$refs.select7.showPopup()"
                    id="Span-SL7"
                    class="placeholder placeholder1"
                    >U13</span
                  >
                </q-item-section>

                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u14"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select8"
                    @focus="popniPlaceholder('Span-SL8')"
                    @input="popniPlaceholder('Span-SL8')"
                    @blur="spustiPlaceholder('Span-SL8', editedItem.u14)"
                  />
                  <span
                    @click="$refs.select8.showPopup()"
                    id="Span-SL8"
                    class="placeholder placeholder1"
                    >U14</span
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u15"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select9"
                    @focus="popniPlaceholder('Span-SL9')"
                    @input="popniPlaceholder('Span-SL9')"
                    @blur="spustiPlaceholder('Span-SL9', editedItem.u15)"
                  />
                  <span
                    @click="$refs.select9.showPopup()"
                    id="Span-SL9"
                    class="placeholder placeholder1"
                    >U15</span
                  >
                </q-item-section>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u16"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select10"
                    @focus="popniPlaceholder('Span-SL10')"
                    @input="popniPlaceholder('Span-SL10')"
                    @blur="spustiPlaceholder('Span-SL10', editedItem.u16)"
                  />
                  <span
                    @click="$refs.select10.showPopup()"
                    id="Span-SL10"
                    class="placeholder placeholder1"
                    >U16</span
                  >
                </q-item-section>

                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u17"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select11"
                    @focus="popniPlaceholder('Span-SL11')"
                    @input="popniPlaceholder('Span-SL11')"
                    @blur="spustiPlaceholder('Span-SL11', editedItem.u17)"
                  />
                  <span
                    @click="$refs.select11.showPopup()"
                    id="Span-SL11"
                    class="placeholder placeholder1"
                    >U17</span
                  >
                </q-item-section>

                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u18"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select12"
                    @focus="popniPlaceholder('Span-SL12')"
                    @input="popniPlaceholder('Span-SL12')"
                    @blur="spustiPlaceholder('Span-SL12', editedItem.u18)"
                  />
                  <span
                    @click="$refs.select12.showPopup()"
                    id="Span-SL12"
                    class="placeholder placeholder1"
                    >U18</span
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u19"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select13"
                    @focus="popniPlaceholder('Span-SL13')"
                    @input="popniPlaceholder('Span-SL13')"
                    @blur="spustiPlaceholder('Span-SL13', editedItem.u19)"
                  />
                  <span
                    @click="$refs.select13.showPopup()"
                    id="Span-SL13"
                    class="placeholder placeholder1"
                    >U19</span
                  >
                </q-item-section>

                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u20"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select14"
                    @focus="popniPlaceholder('Span-SL14')"
                    @input="popniPlaceholder('Span-SL14')"
                    @blur="spustiPlaceholder('Span-SL14', editedItem.u20)"
                  />
                  <span
                    @click="$refs.select14.showPopup()"
                    id="Span-SL14"
                    class="placeholder placeholder1"
                    >U20</span
                  >
                </q-item-section>

                <q-item-section class="custom-field one">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    v-model="editedItem.u21"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                    ref="select15"
                    @focus="popniPlaceholder('Span-SL15')"
                    @input="popniPlaceholder('Span-SL15')"
                    @blur="spustiPlaceholder('Span-SL15', editedItem.u21)"
                  />
                  <span
                    @click="$refs.select15.showPopup()"
                    id="Span-SL15"
                    class="placeholder placeholder1"
                    >U21</span
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
              width: 500px;
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
            {{ $t("administration.technique.setpointMatrix.setLvlTech") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-input
                    borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    v-model="editedItem.grupa"
                    readonly
                    :label="$t('administration.technique.setpointMatrix.group')"
                  ></q-input>
                </q-item-section>
              </q-item>

              <q-item style="margin-bottom: 30px">
                <q-item-section>
                  <q-input
                    borderless
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    v-model="editedItem.naziv"
                    readonly
                    :label="$t('administration.technique.setpointMatrix.item')"
                  ></q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u7"
                    label="U7"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u8"
                    label="U8"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u9"
                    label="U9"
                    :options="listaOd1Do5"
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
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u10"
                    label="U10"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u11"
                    label="U11"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u12"
                    label="U12"
                    :options="listaOd1Do5"
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
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u13"
                    label="U13"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u14"
                    label="U14"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u15"
                    label="U15"
                    :options="listaOd1Do5"
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
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u16"
                    label="U16"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u17"
                    label="U17"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u18"
                    label="U18"
                    :options="listaOd1Do5"
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
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u19"
                    label="U19"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u20"
                    label="U20"
                    :options="listaOd1Do5"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section>
                  <q-select
                    borderless
                    readonly
                    style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important; width: 100px; margin: auto; margin-bottom: 20px"
                    v-model="editedItem.u21"
                    label="U21"
                    :options="listaOd1Do5"
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
      //indeks: [],
      filter: "",
      naslov: "Zadati nivo tehnike",
      customer: {},
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      editedItem: {
        identGrupe: 0,
        grupa: "",
        identStavke: 0,
        naziv: "",
        ident: 0,
        u7: -1,
        u8: -1,
        u9: -1,
        u10: -1,
        u11: -1,
        u12: -1,
        u13: -1,
        u14: -1,
        u15: -1,
        u16: -1,
        u17: -1,
        u18: -1,
        u19: -1,
        u20: -1,
        u21: -1
      },
      defaultItem: {
        identGrupe: 0,
        grupa: "",
        identStavke: 0,
        naziv: "",
        ident: 0,
        u7: -1,
        u8: -1,
        u9: -1,
        u10: -1,
        u11: -1,
        u12: -1,
        u13: -1,
        u14: -1,
        u15: -1,
        u16: -1,
        u17: -1,
        u18: -1,
        u19: -1,
        u20: -1,
        u21: -1
      },
      mode: "list",
      listaOd1Do5: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" }
      ],
      columns: [
        {
          name: "grupa",
          align: "left",
          label: this.$t("administration.technique.setpointMatrix.group"),
          field: "grupa",
          sortable: true
        },
        {
          name: "naziv",
          align: "left",
          label: this.$t("administration.technique.setpointMatrix.item"),
          field: "naziv",
          sortable: true
        },
        {
          name: "u7",
          align: "left",
          label: "U7",
          field: "u7",
          sortable: true
        },
        {
          name: "u8",
          align: "left",
          label: "U8",
          field: "u8",
          sortable: true
        },
        {
          name: "u9",
          align: "left",
          label: "U9",
          field: "u9",
          sortable: true
        },
        {
          name: "u10",
          align: "left",
          label: "U10",
          field: "u10",
          sortable: true
        },
        {
          name: "u11",
          align: "left",
          label: "U11",
          field: "u11",
          sortable: true
        },
        {
          name: "u12",
          align: "left",
          label: "U12",
          field: "u12",
          sortable: true
        },
        {
          name: "u13",
          align: "left",
          label: "U13",
          field: "u13",
          sortable: true
        },
        {
          name: "u14",
          align: "left",
          label: "U14",
          field: "u14",
          sortable: true
        },
        {
          name: "u15",
          align: "left",
          label: "U15",
          field: "u15",
          sortable: true
        },
        {
          name: "u16",
          align: "left",
          label: "U16",
          field: "u16",
          sortable: true
        },
        {
          name: "u17",
          align: "left",
          label: "U17",
          field: "u17",
          sortable: true
        },
        {
          name: "u18",
          align: "left",
          label: "U18",
          field: "u18",
          sortable: true
        },
        {
          name: "u19",
          align: "left",
          label: "U19",
          field: "u19",
          sortable: true
        },
        {
          name: "u20",
          align: "left",
          label: "U20",
          field: "u20",
          sortable: true
        },
        {
          name: "u21",
          align: "left",
          label: "U21",
          field: "u21",
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

      visibleColumns: [
        "grupa",
        "naziv",
        "u7",
        "u8",
        "u9",
        "u10",
        "u11",
        "u12",
        "u13",
        "action"
      ],
      data: [],

      pagination: {
        rowsPerPage: 100
      }
    };
  },
  beforeMount() {},
  mounted() {
    this.getData(); //idemo da uzmenmo podatke iz baze
    //  var i;
    //  for (i = 0; i < 100; i++) {
    //    this.index[i]=i
    //  }

    // change table height
    var temp = document.querySelectorAll(".q-table__middle");
    for (var i = 0; i < temp.length; i++)
      temp[i].style.setProperty("max-height", "calc(100vh - 380px)");
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
    otvoriPreviewDialog(item) {
      console.log(item);
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.readonly = true;
      this.new_customer = true;
      let self = this;
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje rola
    //........................................
    getData() {
      let linkStr = this.$apiPutanja + "/zadati-nivo-tehnike";
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
          console.log(response.data);
          this.data = response.data;
          this.data.forEach((entry, index) => {
            if (entry.u7 == null) this.data[index].u7 = "0";
            if (entry.u8 == null) this.data[index].u8 = "0";
            if (entry.u9 == null) this.data[index].u9 = "0";
            if (entry.u10 == null) this.data[index].u10 = "0";
            if (entry.u11 == null) this.data[index].u11 = "0";
            if (entry.u12 == null) this.data[index].u12 = "0";
            if (entry.u13 == null) this.data[index].u13 = "0";
            if (entry.u14 == null) this.data[index].u14 = "0";
            if (entry.u15 == null) this.data[index].u15 = "0";
            if (entry.u16 == null) this.data[index].u16 = "0";
            if (entry.u17 == null) this.data[index].u17 = "0";
            if (entry.u18 == null) this.data[index].u18 = "0";
            if (entry.u19 == null) this.data[index].u19 = "0";
            if (entry.u20 == null) this.data[index].u20 = "0";
            if (entry.u21 == null) this.data[index].u21 = "0";
          });
          this.loadingUtakmice = false;
          debugger;
          // var i;
          // for (i = 0; i < data.length; i++) {
          //   data[]
          // }
        })
        .catch(e => {
          //this.errors.push(e);
          this.loadingUtakmice = false;
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje nove role
    //........................................
    postData() {
      debugger;
      let linkStr = this.$apiPutanja + "/element-tehnike-sifrarnik";
      var self = this;
      //let datetime = this.getDateTime();

      var dataString = {
        bazaTehnikeStavkeIdent: this.editedItem.identStavke,
        element: this.editedItem.grupa + " - " + this.editedItem.naziv,
        u10: this.editedItem.u10,
        u11: this.editedItem.u11,
        u12: this.editedItem.u12,
        u13: this.editedItem.u13,
        u14: this.editedItem.u14,
        u15: this.editedItem.u15,
        u16: this.editedItem.u16,
        u17: this.editedItem.u17,
        u18: this.editedItem.u18,
        u19: this.editedItem.u19,
        u20: this.editedItem.u20,
        u21: this.editedItem.u21,
        u7: this.editedItem.u7,
        u8: this.editedItem.u8,
        u9: this.editedItem.u9
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
          self.getData();
          self.$q.notify({
            message: self.$t(
              "administration.technique.setpointMatrix.msgPositive"
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
    // izmena role
    //........................................
    putData() {
      debugger;
      let linkStr =
        this.$apiPutanja +
        "/element-tehnike-sifrarnik/" +
        this.editedItem.ident;
      var self = this;
      let datetime = this.getDateTime();

      var dataString = {
        bazaTehnikeStavkeIdent: this.editedItem.identStavke,
        element: this.editedItem.grupa + " - " + this.editedItem.naziv,
        u10: this.editedItem.u10,
        u11: this.editedItem.u11,
        u12: this.editedItem.u12,
        u13: this.editedItem.u13,
        u14: this.editedItem.u14,
        u15: this.editedItem.u15,
        u16: this.editedItem.u16,
        u17: this.editedItem.u17,
        u18: this.editedItem.u18,
        u19: this.editedItem.u19,
        u20: this.editedItem.u20,
        u21: this.editedItem.u21,
        u7: this.editedItem.u7,
        u8: this.editedItem.u8,
        u9: this.editedItem.u9
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
          self.getData();
          self.$q.notify({
            message: self.$t(
              "administration.technique.setpointMatrix.msgChange"
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
    // brisanje/deaktiviranje role
    //........................................
    deleteData(item) {
      debugger;
      let linkStr =
        this.$apiPutanja + "/element-tehnike-sifrarnik/" + item.ident;
      var self = this;
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
          self.getData();
          self.$q.notify({
            message: self.$t("administration.technique.setpointMatrix.msgDel"),
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
    getDateTime() {
      const today = new Date();
      return today.toISOString();
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavanje novog i editovanje zapisa
    //........................................
    addRow() {
      debugger;
      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem);
        this.naslov = "Izmena";
        this.postData();
        //this.putData();
      } else {
        this.naslov = "Unos";
        //this.data.push(this.editedItem);
        this.postData();
      }
      this.close();
    },
    //''''''''''''''''''''''''''''''''''''''''
    // брисање записа у локау, и позивање функције за брисање записа у бази
    //........................................
    deleteItem(item) {
      const index = this.data.indexOf(item);
      let obj = {
        title: this.$t("administration.user.war"),
        message: this.$t("administration.technique.setpointMatrix.msgDelConf"),
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
    //''''''''''''''''''''''''''''''''''''''''
    // едитовање појединачног записа
    //........................................
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
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
    //''''''''''''''''''''''''''''''''''''''''
    // затварање дијалога
    //........................................
    close() {
      this.new_customer = false;
      this.readonly = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // извоз података у CSV формат
    //........................................
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

      const status = exportFile("ZadatiNivoTehnike.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: this.$t("administration.technique.setpointMatrix.msgPrtSc"),
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

.sakriDugmice {
  display: none;
}
</style>
