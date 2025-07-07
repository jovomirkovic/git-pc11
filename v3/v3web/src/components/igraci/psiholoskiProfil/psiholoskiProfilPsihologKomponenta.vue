<template>
  <q-page class="q-pa-sm">
    <!-- <div class="row"
          style="
            position: absolute;
            top: -90px;
            z-index: 5000;
            margin: 0 30%;"
            >
            <h5> {{$t('players.psychologicalProfile.tests.selectedPlayer')}}: {{this.igrac}}</h5>
            <q-btn style="padding:22px;margin:10px;color:red" flat round icon="people" @click="izborIgraca()" >
              <q-tooltip>{{$t('players.psychologicalProfile.tests.browsePlayers')}}</q-tooltip>
            </q-btn>
        </div> -->
    <q-table
      :title="$t('players.psychologicalProfile.tests.psychologicalProfile')"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="ident"
      :grid="mode == 'grid'"
      :filter="filter"
      :pagination.sync="pagination"
      :loading="loadingUtakmice"
      :rows-per-page-label="$t('table.rowsPerPage')"
      :no-data-label="$t('table.noData')"
      :loading-label="$t('table.loadingLabel')"
      :no-results-label="$t('table.noResultLabel')"
      class="mojaTabela my-sticky-header-table"
      style="
            background-color: unset;
            box-shadow: unset;
          "
      table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10"
    >
      <!-- vrati != -->
      <template
        v-if="
          igr != $t('players.psychologicalProfile.tests.selectPlayer') + ' ->'
        "
        v-slot:top-right="props"
      >
        <q-btn
          v-if="Object.keys(selektovaniIgrac).length != 0"
          @click="otvordeDialog()"
          :label="$t('players.psychologicalProfile.tests.newMesurement')"
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
              >{{props.inFullscreen ? $t('players.psychologicalProfile.tests.exitFullscreen') : $t('players.psychologicalProfile.tests.enterFullscreen')}}</q-tooltip>
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
              ? $t("players.psychologicalProfile.tests.list")
              : $t("players.psychologicalProfile.tests.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="$t('players.psychologicalProfile.tests.exportCSV')"
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
                $t("players.psychologicalProfile.tests.delete")
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
                $t("players.psychologicalProfile.tests.changeData")
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
          <!-- TODO: ISTO ?? -->
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
        style="width: 1400px; max-width: 100vw; height:100%; overflow: hidden auto; background-image: linear-gradient(to bottom, #f5f8fb, #ffffff); color: #323b62;"
        flat
        bordered
      >
        <!-- <q-card
            style="
              width: 600px;
              max-width: 60vw;
              border-radius: 5px;
              box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7);
              color: #323b62;
            "
          > -->
        <q-card-section class="q-pb-none">
          <q-btn
            icon="close"
            @click="close"
            flat
            round
            dense
            style="float: right;"
            v-close-popup
          ></q-btn>
          <div class="text-h6" style="text-align: left; color: #323b62;">
            {{ $t("players.psychologicalProfile.tests.mesurement") }}
          </div>
          <!-- <q-item class="formular ponisti" style="">
                    <q-input dense outlined v-model="editedItem.datumVreme" :label="$t('players.psychologicalProfile.tests.date')" mask="date" :rules="['date']" class="datumKlasa">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="editedItem.datumVreme" @input="() => $refs.qDateProxy.hide()"></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item> -->
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section style="padding: 0px 15px 0px 15px">
          <!--

                 <table style=" width:100%; padding-top: 3px; border-radiu" cellpadding="20">
                    <tbody style=" width:100%; padding: 3px;">
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.internalMotivation')}} </td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.unutrasnjaMotivacija" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.externalMotivation')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.spoljnaMotivacija" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.amotivation')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.amotivacija" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                         <p class="naslov">{{$t('players.psychologicalProfile.tests.selfConfidence')}}</p>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.selfConfidenceInPhisicalAbilities')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.samopouzdanjeUFizickeSposobnosti" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.cognitiveEfficiency')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.kognitivnaEfikasnost" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.psychologicalResilience')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.psiholoskaRezilijentnost" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.concentration')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.koncentracija" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.anxiety')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.anksioznost" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.achivementUnderPressure')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.postignucePodPritiskom" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.reactionToCriticism')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.reakcijaNaGresku" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.assessmentOfOtherPeoplesEmotions')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.procenaTudjihEmocija" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr v-if="this.editedIndex > -1">
                        <td>{{$t('players.psychologicalProfile.tests.emotionalIntelligence')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.emocijalnaInteligencija" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <p class="naslov"> {{$t('players.psychologicalProfile.tests.socialIntelligence')}} </p>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.assessmentOfOnesOwnEmotions')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.procenaSopstvenihEmocija" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td> {{$t('players.psychologicalProfile.tests.managingYourOwnEmotions')}} </td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.upravljanjeSopstvenimEmocijama" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.socialSkills')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.socijalneVestine" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.usingEmotions')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.koriscenjeEmocija" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                      <tr>
                        <td>{{$t('players.psychologicalProfile.tests.optimism')}}</td>
                        <td> <q-slider dense class="slajderKlasa" v-model="editedItem.optimizam" label markers marker-labels :min="0" :max="10" :step="1"  /> </td>
                      </tr>
                    </tbody>
                   </table>    -->

          <div style="width: 100%; display: table; padding: 0px">
            <div style="display: table-cell; padding: 15px;">
              <div id="strelica">
                <p class="naslov">
                  {{ $t("players.psychologicalProfile.tests.general") }}
                </p>
              </div>

              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.unutrasnjaMotivacija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t("players.psychologicalProfile.tests.internalMotivation")
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.spoljnaMotivacija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t("players.psychologicalProfile.tests.externalMotivation")
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.amotivacija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.amotivation") }}
              </div>
            </div>
            <div style="display: table-cell; padding: 15px 15px 0px 15px;">
              <div id="strelica">
                <p class="naslov">
                  {{ $t("players.psychologicalProfile.tests.selfConfidence") }}
                </p>
              </div>

              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.samopouzdanjeUFizickeSposobnosti"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.selfConfidenceInPhisicalAbilities"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.kognitivnaEfikasnost"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t("players.psychologicalProfile.tests.cognitiveEfficiency")
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.psiholoskaRezilijentnost"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.psychologicalResilience"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.koncentracija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.concentration") }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.anksioznost"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.anxiety") }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.postignucePodPritiskom"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.achivementUnderPressure"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.reakcijaNaGresku"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.reactionToMistake") }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.reakcijaNaKritiku"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t("players.psychologicalProfile.tests.reactionToCriticism")
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.procenaTudjihEmocija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.assessmentOfOtherPeoplesEmotions"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <div v-if="this.editedIndex > -1">
                  <q-slider
                    :readonly="readonly"
                    dense
                    class="slajderKlasa"
                    v-model="editedItem.emocijalnaInteligencija"
                    label
                    markers
                    marker-labels
                    :min="0"
                    :max="10"
                    :step="1"
                  />
                  {{
                    $t(
                      "players.psychologicalProfile.tests.emotionalIntelligence"
                    )
                  }}
                </div>
              </div>
            </div>
            <div style="display: table-cell; padding: 15px;">
              <div id="strelica">
                <p class="naslov">
                  {{
                    $t("players.psychologicalProfile.tests.socialIntelligence")
                  }}
                </p>
              </div>

              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.procenaSopstvenihEmocija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.assessmentOfOnesOwnEmotions"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.upravljanjeSopstvenimEmocijama"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.managingYourOwnEmotions"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.socijalneVestine"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.socialSkills") }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.koriscenjeEmocija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.usingEmotions") }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  :readonly="readonly"
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.optimizam"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.optimism") }}
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions
          :class="{ sakriDugmice: readonly }"
          align="right"
          class="bg-white text-teal"
        >
          <q-btn
            :label="$t('administration.user.cancel')"
            @click="close"
            type="submit"
            style="background-color: #f5f8fb; color: #323b62; width: 120px; margin: 10px;"
            v-close-popup
          ></q-btn>
          <q-btn
            :label="$t('administration.user.save')"
            @click="addRow"
            type="submit"
            style="background-color: #ff4b00; color: white; width: 120px; margin: 10px;"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dataPreview">
      <q-card
        style="width: 1400px; max-width: 100vw; height:100%; overflow: hidden auto; background-image: linear-gradient(to bottom, #f5f8fb, #ffffff); color: #323b62;"
        flat
        bordered
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
          <div class="text-h6" style="text-align: left; color: #323b62;">
            {{ $t("players.psychologicalProfile.tests.mesurement") }}
          </div>
          <q-item class="formular ponisti" style="">
            <q-input
              readonly
              dense
              outlined
              v-model="editedItem.datumVreme"
              :label="$t('players.psychologicalProfile.tests.date')"
              class="datumInputReadOnly"
              mask="##/##/####"
            />
          </q-item>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div style="width: 100%; display: table;">
            <div style="display: table-cell; padding: 15px;">
              <div id="strelica">
                <p class="naslov">
                  {{ $t("players.psychologicalProfile.tests.general") }}
                </p>
              </div>

              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.unutrasnjaMotivacija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t("players.psychologicalProfile.tests.internalMotivation")
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.spoljnaMotivacija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t("players.psychologicalProfile.tests.externalMotivation")
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.amotivacija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.amotivation") }}
              </div>
            </div>
            <div style="display: table-cell; padding: 15px;">
              <div id="strelica">
                <p class="naslov">
                  {{ $t("players.psychologicalProfile.tests.selfConfidence") }}
                </p>
              </div>

              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.samopouzdanjeUFizickeSposobnosti"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.selfConfidenceInPhisicalAbilities"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.kognitivnaEfikasnost"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t("players.psychologicalProfile.tests.cognitiveEfficiency")
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.psiholoskaRezilijentnost"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.psychologicalResilience"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.koncentracija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.concentration") }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.anksioznost"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.anxiety") }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.postignucePodPritiskom"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.achivementUnderPressure"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.reakcijaNaGresku"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t("players.psychologicalProfile.tests.reactionToCriticism")
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.procenaTudjihEmocija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.assessmentOfOtherPeoplesEmotions"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <div v-if="this.editedIndex > -1">
                  <q-slider
                    dense
                    readonly
                    dense
                    class="slajderKlasa"
                    v-model="editedItem.emocijalnaInteligencija"
                    label
                    markers
                    marker-labels
                    :min="0"
                    :max="10"
                    :step="1"
                  />
                  {{
                    $t(
                      "players.psychologicalProfile.tests.emotionalIntelligence"
                    )
                  }}
                </div>
              </div>
            </div>
            <div style="display: table-cell; padding: 15px;">
              <div id="strelica">
                <p class="naslov">
                  {{
                    $t("players.psychologicalProfile.tests.socialIntelligence")
                  }}
                </p>
              </div>

              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.procenaSopstvenihEmocija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.assessmentOfOnesOwnEmotions"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.upravljanjeSopstvenimEmocijama"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{
                  $t(
                    "players.psychologicalProfile.tests.managingYourOwnEmotions"
                  )
                }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.socijalneVestine"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.socialSkills") }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.koriscenjeEmocija"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.usingEmotions") }}
              </div>
              <div style="padding-bottom: 15px;">
                <q-slider
                  dense
                  readonly
                  dense
                  class="slajderKlasa"
                  v-model="editedItem.optimizam"
                  label
                  markers
                  marker-labels
                  :min="0"
                  :max="10"
                  :step="1"
                />
                {{ $t("players.psychologicalProfile.tests.optimism") }}
              </div>
            </div>
          </div>
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
        amotivacija: 0,
        anksioznost: 0,
        emocijalnaInteligencija: 0,
        kognitivnaEfikasnost: 0,
        koncentracija: 0,
        koriscenjeEmocija: 0,
        optimizam: 0,
        postignucePodPritiskom: 0,
        procenaSopstvenihEmocija: 0,
        procenaTudjihEmocija: 0,
        psiholoskaRezilijentnost: 0,
        reakcijaNaGresku: 0,
        reakcijaNaKritiku: 0,
        samopouzdanje: 0,
        samopouzdanjeUFizickeSposobnosti: 0,
        socijalneVestine: 0,
        spoljnaMotivacija: 0,
        unutrasnjaMotivacija: 0,
        upravljanjeSopstvenimEmocijama: 0
      },
      defaultItem: {
        datumVreme: "",
        ident: 0,
        identKorisnik: 0,
        korisnikImePrezime: "",
        userIdent: this.igrID,
        amotivacija: 0,
        anksioznost: 0,
        emocijalnaInteligencija: 0,
        kognitivnaEfikasnost: 0,
        koncentracija: 0,
        koriscenjeEmocija: 0,
        optimizam: 0,
        postignucePodPritiskom: 0,
        procenaSopstvenihEmocija: 0,
        procenaTudjihEmocija: 0,
        psiholoskaRezilijentnost: 0,
        reakcijaNaGresku: 0,
        reakcijaNaKritiku: 0,
        samopouzdanje: 0,
        samopouzdanjeUFizickeSposobnosti: 0,
        socijalneVestine: 0,
        spoljnaMotivacija: 0,
        unutrasnjaMotivacija: 0,
        upravljanjeSopstvenimEmocijama: 0
      },
      mode: "list",
      columns: [
        {
          name: "datumVreme",
          required: true,
          label: this.$t("players.psychologicalProfile.tests.date"),
          align: "left",
          field: "datumVreme",
          sortable: true,
          format: val => date.formatDate(val, "DD/MM/YYYY")
        },
        {
          name: "optimizam",
          align: "left",
          label: this.$t("players.psychologicalProfile.tests.optimism"),
          field: "optimizam",
          sortable: true
        },
        {
          name: "koncentracija",
          align: "left",
          label: this.$t("players.psychologicalProfile.tests.concentration"),
          field: "koncentracija",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t("players.psychologicalProfile.tests.action"),
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
        this.$apiPutanja + "/psiholoski-profil/igrac/psiholog/" + this.igrID;
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
      let linkStr = this.$apiPutanja + "/psiholoski-profil/psiholog";
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
        amotivacija: this.editedItem.amotivacija,
        anksioznost: this.editedItem.anksioznost,
        //"emocijalnaInteligencija": 0,
        kognitivnaEfikasnost: this.editedItem.kognitivnaEfikasnost,
        koncentracija: this.editedItem.koncentracija,
        koriscenjeEmocija: this.editedItem.koriscenjeEmocija,
        optimizam: this.editedItem.optimizam,
        postignucePodPritiskom: this.editedItem.postignucePodPritiskom,
        procenaSopstvenihEmocija: this.editedItem.procenaSopstvenihEmocija,
        procenaTudjihEmocija: this.editedItem.procenaTudjihEmocija,
        psiholoskaRezilijentnost: this.editedItem.psiholoskaRezilijentnost,
        reakcijaNaGresku: this.editedItem.reakcijaNaGresku,
        reakcijaNaKritiku: this.editedItem.reakcijaNaKritiku,
        //"samopouzdanje": 0,
        samopouzdanjeUFizickeSposobnosti: this.editedItem
          .samopouzdanjeUFizickeSposobnosti,
        socijalneVestine: this.editedItem.socijalneVestine,
        spoljnaMotivacija: this.editedItem.spoljnaMotivacija,
        unutrasnjaMotivacija: this.editedItem.unutrasnjaMotivacija,
        upravljanjeSopstvenimEmocijama: this.editedItem
          .upravljanjeSopstvenimEmocijama
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
              "players.psychologicalProfile.tests.newMeasurementSuccessfullyAdded"
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
        this.$apiPutanja +
        "/psiholoski-profil/psiholog/" +
        this.editedItem.ident;
      var self = this;
      var datumVreme1;
      try {
        datumVreme1 = this.getDateTime(this.editedItem.datumVreme);
      } catch (error) {}

      var dataString = {
        datumVreme: datumVreme1,
        ident: this.editedItem.ident,
        identKorisnik: 0, // ide ulogovani korisnik, iz bekenda! za sad... this.editedItem.identKorisnik,
        korisnikImePrezime: "", // this.editedItem.korisnikImePrezime,
        userIdent: this.igrID,
        amotivacija: this.editedItem.amotivacija,
        anksioznost: this.editedItem.anksioznost,
        //"emocijalnaInteligencija": 0,
        kognitivnaEfikasnost: this.editedItem.kognitivnaEfikasnost,
        koncentracija: this.editedItem.koncentracija,
        koriscenjeEmocija: this.editedItem.koriscenjeEmocija,
        optimizam: this.editedItem.optimizam,
        postignucePodPritiskom: this.editedItem.postignucePodPritiskom,
        procenaSopstvenihEmocija: this.editedItem.procenaSopstvenihEmocija,
        procenaTudjihEmocija: this.editedItem.procenaTudjihEmocija,
        psiholoskaRezilijentnost: this.editedItem.psiholoskaRezilijentnost,
        reakcijaNaGresku: this.editedItem.reakcijaNaGresku,
        reakcijaNaKritiku: this.editedItem.reakcijaNaKritiku,
        //"samopouzdanje": 0,
        samopouzdanjeUFizickeSposobnosti: this.editedItem
          .samopouzdanjeUFizickeSposobnosti,
        socijalneVestine: this.editedItem.socijalneVestine,
        spoljnaMotivacija: this.editedItem.spoljnaMotivacija,
        unutrasnjaMotivacija: this.editedItem.unutrasnjaMotivacija,
        upravljanjeSopstvenimEmocijama: this.editedItem
          .upravljanjeSopstvenimEmocijama
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
              "players.psychologicalProfile.tests.measurementDataChangedSuccessfully"
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
      debugger;
      let linkStr =
        this.$apiPutanja + "/psiholoski-profil/psiholog/" + item.ident;
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
              "players.psychologicalProfile.tests.measurementDataDeletedSuccessfully"
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
      const index = this.data.indexOf(item);
      var self = this;
      let obj = {
        title: self.$t("players.psychologicalProfile.tests.warning"),
        message: self.$t("players.psychologicalProfile.tests.areYouSureDelete"),
        customCloseBtnText: self.$t("players.psychologicalProfile.tests.no"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t("players.psychologicalProfile.tests.yes"),
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

      const status = exportFile("Psiholog-testovi.csv", content, "text/csv");
      let self = this;

      if (status !== true) {
        this.$q.notify({
          message: self.$t("players.psychologicalProfile.tests.browserForbids"),
          color: "negative",
          icon: "warning"
        });
      }
    }
  }
};
</script>

<style scoped>
table {
  width: 80%;
  margin: 10px;
}

td,
th {
  width: 25%;
}

td {
  /* border-left: 1px solid #d4c9c9; */
  /* border-bottom: 1px solid #d4c9c9; */
  border-bottom-left-radius: 5px;
  /* padding: 7px; */
  padding-bottom: 0px;
}

th {
  /* border: 1px solid #998686; */
  border-radius: 10px;
}
.slajderKlasa {
  width: 90%;
  color: #ff4b00;
  margin-top: 17px;
  margin-right: 10px;
  margin-left: 5px;
  margin-bottom: 3px;
}
.naslov {
  margin-bottom: 40px;
  font-size: 20px;
  background: #e5edf4;
  padding: 5px 0 5px 20px;
}

#strelica {
  width: 90%;
  height: 40px;
  position: relative;
  background: #e5edf4;
}
#strelica:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-left: 20px solid white;
  /* /* border-top: 20px solid transparent;
  border-bottom: 20px solid transparent; */
}
#strelica:before {
  content: "";
  position: absolute;
  right: -20px;
  bottom: 0;
  width: 0;
  height: 0;
  border-left: 20px solid #e5edf4;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
}

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
