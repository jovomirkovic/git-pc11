<template>
  <q-page class="q-pa-sm">
    <!-- <div class="row"
          style="
            position: absolute;
            top: -90px;
            z-index: 5000;
            margin: 0 30%;"
            >
            <h5> {{$t('players.motorSkills.FMS.selectedPlayer')}}: {{this.igrac}}</h5>
            <q-btn style="padding:22px;margin:10px;color:red" flat round icon="people" @click="izborIgraca()" >
              <q-tooltip>{{$t('players.motorSkills.FMS.browsePlayers')}}</q-tooltip>
            </q-btn>
        </div> -->
    <q-table
      title="FMS"
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
        v-if="igr != $t('players.motorSkills.FMS.selectPlayer') + ' ->'"
        v-slot:top-right="props"
      >
        <q-btn
          v-if="Object.keys(selektovaniIgrac).length != 0"
          @click="otvordeDialog()"
          :label="$t('players.motorSkills.FMS.newMesurement')"
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
              >{{props.inFullscreen ? $t('players.motorSkills.FMS.exitFullscreen') : $t('players.motorSkills.FMS.enterFullscreen')}}</q-tooltip>
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
              ? $t("players.motorSkills.FMS.list")
              : $t("players.motorSkills.FMS.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('players.motorSkills.FMS.exportCSV')"
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
            <!-- <q-btn @click="editItem(props.row)" dense color="primary" icon="edit">
                    <q-tooltip>
                      {{$t('players.motorSkills.FMS.changeData')}}
                    </q-tooltip>
                </q-btn>
                <q-btn @click="deleteItem(props.row)" dense color="red" icon="delete">
                  <q-tooltip>
                    {{$t('players.motorSkills.FMS.delete')}}
                  </q-tooltip>
                </q-btn> -->
            <q-btn
              @click="deleteItem(props.row)"
              id="dugmeBrisi"
              round
              dense
              style="background-color: #e5edf4; color: #3b5d99; float: right"
              icon="delete"
            >
              <q-tooltip>{{ $t("players.motorSkills.FMS.delete") }}</q-tooltip>
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
                $t("players.motorSkills.FMS.changeData")
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
            {{ $t("players.motorSkills.FMS.mesurement") }}
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
                    $t("players.motorSkills.FMS.date")
                  }}</span>
                </label>
              </q-item>

              <q-item class="formular" style="width: 62%">
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
                      $t("players.motorSkills.FMS.whoDidTheTesting")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one" style="height: 75px;">
                    <p
                      style="
                            text-align: center;
                            color: #000000;
                            margin-top: 10px;
                            margin-bottom: 0px;
                          "
                    >
                      {{ $t("players.motorSkills.FMS.foldingLegsLeft") }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.pregibanjeNogeLevo = item.value;
                        fn4pregibanjeNogeUkupno();
                      "
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
                          editedItem.pregibanjeNogeLevo == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>
                    <!-- <input placeholder=" " @keyup="fn4pregibanjeNogeUkupno" dense outlined v-model="editedItem.pregibanjeNogeLevo" :label="$t('players.motorSkills.FMS.foldingLegsLeft')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.foldingLegsLeft')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
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
                      {{ $t("players.motorSkills.FMS.foldingLegsRight") }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.pregibanjeNogeDesno = item.value;
                        fn4pregibanjeNogeUkupno();
                      "
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
                          editedItem.pregibanjeNogeDesno == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>
                    <!-- <input placeholder=" " @keyup="fn4pregibanjeNogeUkupno" dense outlined v-model="editedItem.pregibanjeNogeDesno" :label="$t('players.motorSkills.FMS.foldingLegsRight')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.foldingLegsRight')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      style="cursor:not-allowed"
                      readonly
                      placeholder=" "
                      @keyup="fn4Ukupno"
                      dense
                      outlined
                      v-model="editedItem.pregibanjeNogeUkupno"
                      :label="$t('players.motorSkills.FMS.foldingLegsBoth')"
                    />
                    <span style="cursor:not-allowed" class="placeholder">{{
                      $t("players.motorSkills.FMS.foldingLegsBoth")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one" style="height: 75px;">
                    <p
                      style="
                            text-align: center;
                            color: #000000;
                            margin-top: 10px;
                            margin-bottom: 0px;
                          "
                    >
                      {{ $t("players.motorSkills.FMS.squatWithCausation") }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.cucanj = item.value;
                        fn4Ukupno();
                      "
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
                          editedItem.cucanj == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input placeholder=" " @keyup="fn4Ukupno" dense outlined v-model="editedItem.cucanj" :label="$t('players.motorSkills.FMS.squatWithCausation')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.squatWithCausation')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one" style="height: 75px;">
                    <p
                      style="
                            text-align: center;
                            color: #000000;
                            margin-top: 10px;
                            margin-bottom: 0px;
                          "
                    >
                      {{ $t("players.motorSkills.FMS.inLineStepLeft") }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.liniskiIskorakLevo = item.value;
                        fn4liniskiIskorakUkupno();
                      "
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
                          editedItem.liniskiIskorakLevo == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input placeholder=" " @keyup="fn4liniskiIskorakUkupno" dense outlined v-model="editedItem.liniskiIskorakLevo" :label="$t('players.motorSkills.FMS.inLineStepLeft')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.inLineStepLeft')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
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
                      {{ $t("players.motorSkills.FMS.inLineStepRight") }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.liniskiIskorakDesno = item.value;
                        fn4liniskiIskorakUkupno();
                      "
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
                          editedItem.liniskiIskorakDesno == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input placeholder=" " @keyup="fn4liniskiIskorakUkupno" dense outlined v-model="editedItem.liniskiIskorakDesno" :label="$t('players.motorSkills.FMS.inLineStepRight')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.inLineStepRight')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      style="cursor:not-allowed"
                      placeholder=" "
                      @keyup="fn4Ukupno"
                      dense
                      outlined
                      v-model="editedItem.liniskiIskorakUkupno"
                      :label="$t('players.motorSkills.FMS.inLineStepTotal')"
                    />
                    <span style="cursor:not-allowed" class="placeholder">{{
                      $t("players.motorSkills.FMS.inLineStepTotal")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one" style="height: 75px;">
                    <p
                      style="
                            text-align: center;
                            color: #000000;
                            margin-top: 10px;
                            margin-bottom: 0px;
                          "
                    >
                      {{ $t("players.motorSkills.FMS.pushup") }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.sklek = item.value;
                        fn4Ukupno();
                      "
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
                          editedItem.sklek == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input placeholder=" " @keyup="fn4Ukupno" dense outlined v-model="editedItem.sklek" :label="$t('players.motorSkills.FMS.pushup')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.pushup')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one" style="height: 75px;">
                    <p
                      style="
                            text-align: center;
                            color: #000000;
                            margin-top: 10px;
                            margin-bottom: 0px;
                          "
                    >
                      {{ $t("players.motorSkills.FMS.groinCrossingLeft") }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.prelazakPreponaLevo = item.value;
                        fn4prelazakPreponaUkupno();
                      "
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
                          editedItem.prelazakPreponaLevo == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input placeholder=" " @keyup="fn4prelazakPreponaUkupno" dense outlined v-model="editedItem.prelazakPreponaLevo" :label="$t('players.motorSkills.FMS.groinCrossingLeft')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.groinCrossingLeft')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
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
                      {{ $t("players.motorSkills.FMS.groinCrossingRight") }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.prelazakPreponaDesno = item.value;
                        fn4prelazakPreponaUkupno();
                      "
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
                          editedItem.prelazakPreponaDesno == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input placeholder=" " @keyup="fn4prelazakPreponaUkupno" dense outlined v-model="editedItem.prelazakPreponaDesno" :label="$t('players.motorSkills.FMS.groinCrossingRight')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.groinCrossingRight')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      style="cursor:not-allowed"
                      placeholder=" "
                      @keyup="fn4Ukupno"
                      dense
                      outlined
                      v-model="editedItem.prelazakPreponaUkupno"
                      :label="$t('players.motorSkills.FMS.groinCrossingTotal')"
                    />
                    <span style="cursor:not-allowed" class="placeholder">{{
                      $t("players.motorSkills.FMS.groinCrossingTotal")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one" style="height: 75px;">
                    <p
                      style="
                            text-align: center;
                            color: #000000;
                            margin-top: 10px;
                            margin-bottom: 0px;
                          "
                    >
                      {{
                        $t("players.motorSkills.FMS.rotationalStabilityLeft")
                      }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.rotacionaStabilnostLevo = item.value;
                        fn4rotacionaStabilnostUkupno();
                      "
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
                          editedItem.rotacionaStabilnostLevo == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input placeholder=" "  @keyup="fn4rotacionaStabilnostUkupno" dense outlined v-model="editedItem.rotacionaStabilnostLevo" :label="$t('players.motorSkills.FMS.rotationalStabilityLeft')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.rotationalStabilityLeft')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
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
                        $t("players.motorSkills.FMS.rotationalStabilityRight")
                      }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.rotacionaStabilnostDesno = item.value;
                        fn4rotacionaStabilnostUkupno();
                      "
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
                          editedItem.rotacionaStabilnostDesno == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input placeholder=" " @keyup="fn4rotacionaStabilnostUkupno" dense outlined v-model="editedItem.rotacionaStabilnostDesno" :label="$t('players.motorSkills.FMS.rotationalStabilityRight')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.rotationalStabilityRight')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      style="cursor:not-allowed"
                      placeholder=" "
                      @keyup="fn4Ukupno"
                      dense
                      outlined
                      v-model="editedItem.rotacionaStabilnostUkupno"
                      :label="
                        $t('players.motorSkills.FMS.rotationalStabilityTotal')
                      "
                    />
                    <span style="cursor:not-allowed" class="placeholder">{{
                      $t("players.motorSkills.FMS.rotationalStabilityTotal")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one" style="height: 75px;">
                    <p
                      style="
                            text-align: center;
                            color: #000000;
                            margin-top: 10px;
                            margin-bottom: 0px;
                          "
                    >
                      {{ $t("players.motorSkills.FMS.shoulderMobilityLeft") }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.pokretljivostRamenaLevo = item.value;
                        fn4pokretljivostRamenaUkupno();
                      "
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
                          editedItem.pokretljivostRamenaLevo == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input placeholder=" " @keyup="fn4pokretljivostRamenaUkupno" dense outlined v-model="editedItem.pokretljivostRamenaLevo" :label="$t('players.motorSkills.FMS.shoulderMobilityLeft')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.shoulderMobilityLeft')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
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
                      {{ $t("players.motorSkills.FMS.shoulderMobilityRight") }}
                    </p>
                    <div
                      :readonly="readonly"
                      class="q-gutter-sm"
                      v-for="(item, index) in thomasTest4Options"
                      :key="item + ' ' + index"
                      @click="
                        editedItem.pokretljivostRamenaDesno = item.value;
                        fn4pokretljivostRamenaUkupno();
                      "
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
                          editedItem.pokretljivostRamenaDesno == item.value
                            ? '2px solid #3b5d99'
                            : '2px solid white'
                        ]
                      }"
                    >
                      {{ item.label }}
                    </div>

                    <!-- <input placeholder=" " @keyup="fn4pokretljivostRamenaUkupno" dense outlined v-model="editedItem.pokretljivostRamenaDesno" :label="$t('players.motorSkills.FMS.shoulderMobilityRight')"/>
                        <span class="placeholder">{{$t('players.motorSkills.FMS.shoulderMobilityRight')}}</span> -->
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      style="cursor:not-allowed"
                      placeholder=" "
                      @keyup="fn4Ukupno"
                      dense
                      outlined
                      v-model="editedItem.pokretljivostRamenaUkupno"
                      :label="
                        $t('players.motorSkills.FMS.shoulderMobilityTotal')
                      "
                    />
                    <span style="cursor:not-allowed" class="placeholder">{{
                      $t("players.motorSkills.FMS.shoulderMobilityTotal")
                    }}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input
                      style="cursor:not-allowed"
                      placeholder=" "
                      dense
                      outlined
                      v-model="editedItem.ukupnaOcena"
                      :label="$t('players.motorSkills.FMS.overallFMSTestScore')"
                    />
                    <span style="cursor:not-allowed" class="placeholder">{{
                      $t("players.motorSkills.FMS.overallFMSTestScore")
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
            {{ $t("players.motorSkills.FMS.mesurement") }}
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
                  :label="$t('players.motorSkills.FMS.date')"
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
                      :label="$t('players.motorSkills.FMS.whoDidTheTesting')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.whoDidTheTesting")
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
                      dense
                      outlined
                      v-model="editedItem.pregibanjeNogeLevo"
                      :label="$t('players.motorSkills.FMS.foldingLegsLeft')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.foldingLegsLeft")
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
                      dense
                      outlined
                      v-model="editedItem.pregibanjeNogeDesno"
                      :label="$t('players.motorSkills.FMS.foldingLegsRight')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.foldingLegsRight")
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
                      dense
                      outlined
                      v-model="editedItem.pregibanjeNogeUkupno"
                      :label="$t('players.motorSkills.FMS.foldingLegsBoth')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.foldingLegsBoth")
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
                      dense
                      outlined
                      v-model="editedItem.cucanj"
                      :label="$t('players.motorSkills.FMS.squatWithCausation')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.squatWithCausation")
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
                      dense
                      outlined
                      v-model="editedItem.liniskiIskorakLevo"
                      :label="$t('players.motorSkills.FMS.inLineStepLeft')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.inLineStepLeft")
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
                      dense
                      outlined
                      v-model="editedItem.liniskiIskorakDesno"
                      :label="$t('players.motorSkills.FMS.inLineStepRight')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.inLineStepRight")
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
                      dense
                      outlined
                      v-model="editedItem.liniskiIskorakUkupno"
                      :label="$t('players.motorSkills.FMS.inLineStepTotal')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.inLineStepTotal")
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
                      dense
                      outlined
                      v-model="editedItem.sklek"
                      :label="$t('players.motorSkills.FMS.pushup')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.pushup")
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
                      dense
                      outlined
                      v-model="editedItem.prelazakPreponaLevo"
                      :label="$t('players.motorSkills.FMS.groinCrossingLeft')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.groinCrossingLeft")
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
                      dense
                      outlined
                      v-model="editedItem.prelazakPreponaDesno"
                      :label="$t('players.motorSkills.FMS.groinCrossingRight')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.groinCrossingRight")
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
                      dense
                      outlined
                      v-model="editedItem.prelazakPreponaUkupno"
                      :label="$t('players.motorSkills.FMS.groinCrossingTotal')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.groinCrossingTotal")
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
                      dense
                      outlined
                      v-model="editedItem.rotacionaStabilnostLevo"
                      :label="
                        $t('players.motorSkills.FMS.rotationalStabilityLeft')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.rotationalStabilityLeft")
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
                      dense
                      outlined
                      v-model="editedItem.rotacionaStabilnostDesno"
                      :label="
                        $t('players.motorSkills.FMS.rotationalStabilityRight')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.rotationalStabilityRight")
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
                      dense
                      outlined
                      v-model="editedItem.rotacionaStabilnostUkupno"
                      :label="
                        $t('players.motorSkills.FMS.rotationalStabilityTotal')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.rotationalStabilityTotal")
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
                      dense
                      outlined
                      v-model="editedItem.pokretljivostRamenaLevo"
                      :label="
                        $t('players.motorSkills.FMS.shoulderMobilityLeft')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.shoulderMobilityLeft")
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
                      dense
                      outlined
                      v-model="editedItem.pokretljivostRamenaDesno"
                      :label="
                        $t('players.motorSkills.FMS.shoulderMobilityRight')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.shoulderMobilityRight")
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
                      dense
                      outlined
                      v-model="editedItem.pokretljivostRamenaUkupno"
                      :label="
                        $t('players.motorSkills.FMS.shoulderMobilityTotal')
                      "
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.shoulderMobilityTotal")
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
                      dense
                      outlined
                      v-model="editedItem.ukupnaOcena"
                      :label="$t('players.motorSkills.FMS.overallFMSTestScore')"
                    />
                    <span class="placeholder">{{
                      $t("players.motorSkills.FMS.overallFMSTestScore")
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
      dialog_za_promenu_igraca: false,
      date: "",
      filter: "",
      customer: {},
      readonly: false,
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      editedItem: {
        datumVreme: "",
        ident: 0,
        identKorisnik: 0,
        korisnikImePrezime: "",
        userIdent: this.igrID,
        cucanj: "",
        rotacionaStabilnostDesno: "",
        rotacionaStabilnostLevo: "",
        rotacionaStabilnostUkupno: "",
        sklek: "",

        liniskiIskorakDesno: "",
        liniskiIskorakLevo: "",
        liniskiIskorakUkupno: "",
        pokretljivostRamenaDesno: "",
        pokretljivostRamenaLevo: "",
        pokretljivostRamenaUkupno: "",
        pregibanjeNogeDesno: "",
        pregibanjeNogeLevo: "",
        pregibanjeNogeUkupno: "",
        prelazakPreponaDesno: "",
        prelazakPreponaLevo: "",
        prelazakPreponaUkupno: "",
        ukupnaOcena: ""
      },
      defaultItem: {
        datumVreme: "",
        ident: 0,
        identKorisnik: 0,
        korisnikImePrezime: "",
        userIdent: this.igrID,
        cucanj: 0,
        rotacionaStabilnostDesno: 0,
        rotacionaStabilnostLevo: 0,
        rotacionaStabilnostUkupno: 0,
        sklek: 0,

        liniskiIskorakDesno: 0,
        liniskiIskorakLevo: 0,
        liniskiIskorakUkupno: 0,
        pokretljivostRamenaDesno: 0,
        pokretljivostRamenaLevo: 0,
        pokretljivostRamenaUkupno: 0,
        pregibanjeNogeDesno: 0,
        pregibanjeNogeLevo: 0,
        pregibanjeNogeUkupno: 0,
        prelazakPreponaDesno: 0,
        prelazakPreponaLevo: 0,
        prelazakPreponaUkupno: 0,
        ukupnaOcena: 0
      },
      mode: "list",
      columns: [
        {
          name: "datumVreme",
          required: true,
          label: this.$t("players.motorSkills.FMS.date"),
          align: "left",
          field: "datumVreme",
          sortable: true,
          format: val => date.formatDate(val, "DD/MM/YYYY")
        },
        {
          name: "cucanj",
          align: "left",
          label: this.$t("players.motorSkills.FMS.squat"),
          field: "cucanj",
          sortable: true
        },
        {
          name: "sklek",
          align: "left",
          label: this.$t("players.motorSkills.FMS.pushup"),
          field: "sklek",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t("players.motorSkills.FMS.action"),
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
    fn4pregibanjeNogeUkupno() {
      debugger;
      if (
        this.editedItem.pregibanjeNogeDesno > this.editedItem.pregibanjeNogeLevo
      ) {
        this.editedItem.pregibanjeNogeUkupno = this.editedItem.pregibanjeNogeLevo;
      } else {
        this.editedItem.pregibanjeNogeUkupno = this.editedItem.pregibanjeNogeDesno;
      }
      this.fn4Ukupno();
    },
    fn4liniskiIskorakUkupno() {
      debugger;
      if (
        this.editedItem.liniskiIskorakDesno > this.editedItem.liniskiIskorakLevo
      ) {
        this.editedItem.liniskiIskorakUkupno = this.editedItem.liniskiIskorakLevo;
      } else {
        this.editedItem.liniskiIskorakUkupno = this.editedItem.liniskiIskorakDesno;
      }
      this.fn4Ukupno();
    },
    fn4prelazakPreponaUkupno() {
      debugger;
      if (
        this.editedItem.prelazakPreponaDesno >
        this.editedItem.prelazakPreponaLevo
      ) {
        this.editedItem.prelazakPreponaUkupno = this.editedItem.prelazakPreponaLevo;
      } else {
        this.editedItem.prelazakPreponaUkupno = this.editedItem.prelazakPreponaDesno;
      }
      this.fn4Ukupno();
    },
    fn4pokretljivostRamenaUkupno() {
      debugger;
      if (
        this.editedItem.pokretljivostRamenaDesno >
        this.editedItem.pokretljivostRamenaLevo
      ) {
        this.editedItem.pokretljivostRamenaUkupno = this.editedItem.pokretljivostRamenaLevo;
      } else {
        this.editedItem.pokretljivostRamenaUkupno = this.editedItem.pokretljivostRamenaDesno;
      }
      this.fn4Ukupno();
    },
    fn4rotacionaStabilnostUkupno() {
      debugger;
      if (
        this.editedItem.rotacionaStabilnostDesno >
        this.editedItem.rotacionaStabilnostLevo
      ) {
        this.editedItem.rotacionaStabilnostUkupno = this.editedItem.rotacionaStabilnostLevo;
      } else {
        this.editedItem.rotacionaStabilnostUkupno = this.editedItem.rotacionaStabilnostDesno;
      }
      this.fn4Ukupno();
    },
    fn4Ukupno() {
      this.editedItem.ukupnaOcena =
        Number(this.editedItem.pregibanjeNogeUkupno) +
        Number(this.editedItem.liniskiIskorakUkupno) +
        Number(this.editedItem.prelazakPreponaUkupno) +
        Number(this.editedItem.pokretljivostRamenaUkupno) +
        Number(this.editedItem.rotacionaStabilnostUkupno) +
        Number(this.editedItem.cucanj) +
        Number(this.editedItem.sklek);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje igraca
    //........................................
    getDataZaID() {
      let linkStr = this.$apiPutanja + "/fms/igrac/" + this.igrID;
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
      let linkStr = this.$apiPutanja + "/fms";
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
        cucanj: this.editedItem.cucanj,
        sklek: this.editedItem.sklek,

        liniskiIskorakDesno: this.editedItem.liniskiIskorakDesno,
        liniskiIskorakLevo: this.editedItem.liniskiIskorakLevo,
        liniskiIskorakUkupno: this.editedItem.liniskiIskorakUkupno,
        pokretljivostRamenaDesno: this.editedItem.pokretljivostRamenaDesno,
        pokretljivostRamenaLevo: this.editedItem.pokretljivostRamenaLevo,
        pokretljivostRamenaUkupno: this.editedItem.pokretljivostRamenaUkupno,
        pregibanjeNogeDesno: this.editedItem.pregibanjeNogeDesno,
        pregibanjeNogeLevo: this.editedItem.pregibanjeNogeLevo,
        pregibanjeNogeUkupno: this.editedItem.pregibanjeNogeUkupno,
        prelazakPreponaDesno: this.editedItem.prelazakPreponaDesno,
        prelazakPreponaLevo: this.editedItem.prelazakPreponaLevo,
        prelazakPreponaUkupno: this.editedItem.prelazakPreponaUkupno,
        rotacionaStabilnostLevo: this.editedItem.rotacionaStabilnostLevo,
        rotacionaStabilnostDesno: this.editedItem.rotacionaStabilnostDesno,
        rotacionaStabilnostUkupno: this.editedItem.rotacionaStabilnostUkupno,
        ukupnaOcena: this.editedItem.ukupnaOcena
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
              "players.motorSkills.FMS.newMeasurementSuccessfullyAdded"
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
      let linkStr = this.$apiPutanja + "/fms/" + this.editedItem.ident;
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
        cucanj: this.editedItem.cucanj,
        sklek: this.editedItem.sklek,

        liniskiIskorakDesno: this.editedItem.liniskiIskorakDesno,
        liniskiIskorakLevo: this.editedItem.liniskiIskorakLevo,
        liniskiIskorakUkupno: this.editedItem.liniskiIskorakUkupno,
        pokretljivostRamenaDesno: this.editedItem.pokretljivostRamenaDesno,
        pokretljivostRamenaLevo: this.editedItem.pokretljivostRamenaLevo,
        pokretljivostRamenaUkupno: this.editedItem.pokretljivostRamenaUkupno,
        pregibanjeNogeDesno: this.editedItem.pregibanjeNogeDesno,
        pregibanjeNogeLevo: this.editedItem.pregibanjeNogeLevo,
        pregibanjeNogeUkupno: this.editedItem.pregibanjeNogeUkupno,
        prelazakPreponaDesno: this.editedItem.prelazakPreponaDesno,
        prelazakPreponaLevo: this.editedItem.prelazakPreponaLevo,
        prelazakPreponaUkupno: this.editedItem.prelazakPreponaUkupno,
        rotacionaStabilnostLevo: this.editedItem.rotacionaStabilnostLevo,
        rotacionaStabilnostDesno: this.editedItem.rotacionaStabilnostDesno,
        rotacionaStabilnostUkupno: this.editedItem.rotacionaStabilnostUkupno,
        ukupnaOcena: this.editedItem.ukupnaOcena
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
              "players.motorSkills.FMS.measurementDataChangedSuccessfully"
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
      let linkStr = this.$apiPutanja + "/fms/" + item.ident;
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
              "players.motorSkills.FMS.measurementDataDeletedSuccessfully"
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
      let self = this;
      const index = this.data.indexOf(item);
      let obj = {
        title: self.$t("players.motorSkills.FMS.warning"),
        message: self.$t("players.motorSkills.FMS.areYouSureDelete"),
        customCloseBtnText: self.$t("players.motorSkills.FMS.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("players.motorSkills.FMS.yes"),
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

      const status = exportFile("fms.csv", content, "text/csv");
      let self = this;
      if (status !== true) {
        this.$q.notify({
          message: self.$t("players.motorSkills.FMS.browserForbids"),
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
