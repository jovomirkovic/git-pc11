<template>
  <q-page class="q-pa-sm">
    <!-- <div class="row"
          style="
            position: absolute;
            top: -90px;
            z-index: 5000;
            margin: 0 30%;"
            >
            <h5> {{$t('players.psychologicalProfile.assessmentSelfssessment.selectedPlayer')}}: {{this.igr}}</h5>
            <q-btn style="padding:22px;margin:10px;color:red" flat round icon="people" @click="izborIgraca()" >
              <q-tooltip>{{$t('players.psychologicalProfile.assessmentSelfssessment.browsePlayers')}}</q-tooltip>
            </q-btn>
        </div> -->
    <q-table
      :title="
        $t(
          'players.psychologicalProfile.assessmentSelfssessment.psychologicalProfileAssessmentSelfAssessment'
        )
      "
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
      <!-- vrati != -->
      <template
        v-if="
          igr !=
            $t(
              'players.psychologicalProfile.assessmentSelfssessment.selectPlayer'
            ) +
              ' ->'
        "
        v-slot:top-right="props"
      >
        <q-btn
          v-if="Object.keys(selektovaniIgrac).length != 0"
          @click="otvordeDialog()"
          :label="
            $t(
              'players.psychologicalProfile.assessmentSelfssessment.newMesurement'
            )
          "
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
              >{{props.inFullscreen ? $t('players.psychologicalProfile.assessmentSelfssessment.exitFullscreen') : $t('players.psychologicalProfile.assessmentSelfssessment.enterFullscreen')}}</q-tooltip>
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
              ? $t("players.psychologicalProfile.assessmentSelfssessment.list")
              : $t("players.psychologicalProfile.assessmentSelfssessment.grid")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          class="dugmeCVS"
          :label="
            $t('players.psychologicalProfile.assessmentSelfssessment.exportCSV')
          "
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
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.delete"
                )
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
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.changeData"
                )
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
            {{
              $t(
                "players.psychologicalProfile.assessmentSelfssessment.mesurement"
              )
            }}
          </div>
          <!-- <q-list>
                  <q-item class="formular ponisti" style="">
                    <q-input dense outlined v-model="editedItem.datumVreme" :label="$t('players.psychologicalProfile.assessmentSelfssessment.date') " mask="date" :rules="['date']" class="datumKlasa">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="editedItem.datumVreme" @input="() => $refs.qDateProxy.hide()"></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </q-list> -->
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section style="padding: 0px 15px">
          <div class="row">
            <div class="col">
              <div id="strelica">
                <p class="naslov">
                  {{
                    $t(
                      "players.psychologicalProfile.assessmentSelfssessment.parameter"
                    )
                  }}
                </p>
              </div>
            </div>
            <div class="col">
              <div id="strelica">
                <p class="naslov">
                  {{
                    $t(
                      "players.psychologicalProfile.assessmentSelfssessment.coachAssessment"
                    )
                  }}
                </p>
              </div>
            </div>
            <div class="col">
              <div id="strelica">
                <p class="naslov">
                  {{
                    $t(
                      "players.psychologicalProfile.assessmentSelfssessment.selfAssessment"
                    )
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.internalMotivation"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.unutrasnjaMotivacijaTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.unutrasnjaMotivacijaIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.concentration"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.koncentracijaTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.koncentracijaIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.anxiety"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.anksioznostTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.anksioznostIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.achivementUnderPressure"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.postignucePodPritiskomTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.postignucePodPritiskomIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.reactionToAnError"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.reakcijaNaGreskuTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.reakcijaNaGreskuIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.emotionControl"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.kontrolaEmocijaTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.kontrolaEmocijaIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.reactionToCriticism"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.reakcijaNaKritikuTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.reakcijaNaKritikuIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.teamSpirit"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.timskiDuhTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.timskiDuhIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.confidence"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.samopouzdanjeTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.samopouzdanjeIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.intelligence"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.inteligencijaTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col"></div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.courage"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.hrabrostTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col"></div>
          </div>

          <div class="row">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.insight"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                :readonly="readonly"
                class="slajderKlasa"
                v-model="editedItem.samouvidTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div
              :class="{ sakriDugmice: readonly }"
              class="col"
              style="text-align: right;"
            >
              <q-btn
                :label="$t('administration.user.cancel')"
                @click="close"
                type="submit"
                style="background-color: #f5f8fb; color: #323b62; width: 120px; margin: 10px; margin-top: 30px"
                v-close-popup
              ></q-btn>
              <q-btn
                :label="$t('administration.user.save')"
                @click="addRow"
                type="submit"
                style="background-color: #ff4b00; color: white; width: 120px; margin: 10px; margin-top: 30px"
                v-close-popup
              ></q-btn>
            </div>
          </div>
        </q-card-section>
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

          <div
            class="text-h6"
            style="
                  text-align: left;
                  color: #323b62;
                  display: inline-block;

                "
          >
            {{
              $t(
                "players.psychologicalProfile.assessmentSelfssessment.mesurement"
              )
            }}
          </div>

          <q-item
            class="formular ponisti"
            style="float: unset; display: inline-block; padding: 0px 10px;"
          >
            <q-input
              readonly
              dense
              outlined
              v-model="editedItem.datumVreme"
              :label="
                $t('players.psychologicalProfile.assessmentSelfssessment.date')
              "
              class="datumInputReadOnly"
              mask="##/##/####"
            />
          </q-item>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col">
              <div id="strelica">
                <p class="naslov">
                  {{
                    $t(
                      "players.psychologicalProfile.assessmentSelfssessment.parameter"
                    )
                  }}
                </p>
              </div>
            </div>
            <div class="col">
              <div id="strelica">
                <p class="naslov">
                  {{
                    $t(
                      "players.psychologicalProfile.assessmentSelfssessment.coachAssessment"
                    )
                  }}
                </p>
              </div>
            </div>
            <div class="col">
              <div id="strelica">
                <p class="naslov">
                  {{
                    $t(
                      "players.psychologicalProfile.assessmentSelfssessment.selfAssessment"
                    )
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.internalMotivation"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.unutrasnjaMotivacijaTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.unutrasnjaMotivacijaIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.concentration"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.koncentracijaTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.koncentracijaIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.anxiety"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.anksioznostTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.anksioznostIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.achivementUnderPressure"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.postignucePodPritiskomTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.postignucePodPritiskomIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.reactionToAnError"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.reakcijaNaGreskuTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.reakcijaNaGreskuIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.emotionControl"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.kontrolaEmocijaTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.kontrolaEmocijaIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.reactionToCriticism"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.reakcijaNaKritikuTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.reakcijaNaKritikuIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.teamSpirit"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.timskiDuhTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.timskiDuhIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.confidence"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.samopouzdanjeTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.samopouzdanjeIg"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.intelligence"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.inteligencijaTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col"></div>
          </div>

          <div class="row" style="border-bottom: 1px solid #ccc; margin: 4px;">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.courage"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.hrabrostTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col"></div>
          </div>

          <div class="row">
            <div class="col" style="margin-top: 15px;">
              {{
                $t(
                  "players.psychologicalProfile.assessmentSelfssessment.insight"
                )
              }}
            </div>
            <div class="col">
              <q-slider
                readonly
                class="slajderKlasa"
                v-model="editedItem.samouvidTr"
                label
                markers
                marker-labels
                :min="0"
                :max="10"
                :step="1"
              />
            </div>
            <div class="col" style="text-align: right;">
              <q-btn
                :label="$t('administration.user.cancel')"
                @click="close"
                type="submit"
                style="background-color: #f5f8fb; color: #323b62; width: 120px; margin: 10px; margin-top: 30px"
                v-close-popup
              ></q-btn>
              <q-btn
                :label="$t('administration.user.save')"
                @click="addRow"
                type="submit"
                style="background-color: #ff4b00; color: white; width: 120px; margin: 10px; margin-top: 30px"
                v-close-popup
              ></q-btn>
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
      testtest: 0,
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
        anksioznostIg: 0,
        anksioznostTr: 0,
        koncentracijaIg: 0,
        koncentracijaTr: 0,
        kontrolaEmocijaIg: 0,
        kontrolaEmocijaTr: 0,
        postignucePodPritiskomIg: 0,
        postignucePodPritiskomTr: 0,
        reakcijaNaKritikuIg: 0,
        reakcijaNaKritikuTr: 0,
        reakcijaNaGreskuTr: 0,
        reakcijaNaGreskuIg: 0,
        timskiDuhIg: 0,
        timskiDuhTr: 0,
        unutrasnjaMotivacijaIg: 0,
        unutrasnjaMotivacijaTr: 0,
        hrabrostTr: 0,
        inteligencijaTr: 0,
        samouvidTr: 0,
        samopouzdanjeTr: 0,
        samopouzdanjeIg: 0
      },
      defaultItem: {
        datumVreme: "",
        ident: 0,
        identKorisnik: 0,
        korisnikImePrezime: "",
        userIdent: this.igrID,
        anksioznostIg: 0,
        anksioznostTr: 0,
        koncentracijaIg: 0,
        koncentracijaTr: 0,
        kontrolaEmocijaIg: 0,
        kontrolaEmocijaTr: 0,
        postignucePodPritiskomIg: 0,
        postignucePodPritiskomTr: 0,
        reakcijaNaKritikuIg: 0,
        reakcijaNaKritikuTr: 0,
        reakcijaNaGreskuTr: 0,
        reakcijaNaGreskuIg: 0,
        timskiDuhIg: 0,
        timskiDuhTr: 0,
        unutrasnjaMotivacijaIg: 0,
        unutrasnjaMotivacijaTr: 0,
        hrabrostTr: 0,
        inteligencijaTr: 0,
        samouvidTr: 0,
        samopouzdanjeTr: 0,
        samopouzdanjeIg: 0
      },
      mode: "list",
      columns: [
        {
          name: "datumVreme",
          required: true,
          label: this.$t(
            "players.psychologicalProfile.assessmentSelfssessment.date"
          ),
          align: "left",
          field: "datumVreme",
          sortable: true,
          format: val => date.formatDate(val, "DD/MM/YYYY")
        },
        {
          name: "koncentracijaIg",
          align: "left",
          label: this.$t(
            "players.psychologicalProfile.assessmentSelfssessment.concentrationSelfAssessment"
          ),
          field: "koncentracijaIg",
          sortable: true
        },
        {
          name: "koncentracijaTr",
          align: "left",
          label: this.$t(
            "players.psychologicalProfile.assessmentSelfssessment.concentrationCoachAssessment"
          ),
          field: "koncentracijaTr",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: this.$t(
            "players.psychologicalProfile.assessmentSelfssessment.action"
          ),
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
        this.$apiPutanja + "/psiholoski-profil/igrac/trener/" + this.igrID;
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
      let linkStr = this.$apiPutanja + "/psiholoski-profil/trener";
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
        anksioznostIg: this.editedItem.anksioznostIg,
        anksioznostTr: this.editedItem.anksioznostTr,
        koncentracijaIg: this.editedItem.koncentracijaIg,
        koncentracijaTr: this.editedItem.koncentracijaTr,
        kontrolaEmocijaIg: this.editedItem.kontrolaEmocijaIg,
        kontrolaEmocijaTr: this.editedItem.kontrolaEmocijaTr,
        postignucePodPritiskomIg: this.editedItem.postignucePodPritiskomIg,
        postignucePodPritiskomTr: this.editedItem.postignucePodPritiskomTr,
        reakcijaNaGreskuIg: this.editedItem.reakcijaNaGreskuIg,
        reakcijaNaGreskuTr: this.editedItem.reakcijaNaGreskuTr,
        reakcijaNaKritikuIg: this.editedItem.reakcijaNaKritikuIg,
        reakcijaNaKritikuTr: this.editedItem.reakcijaNaKritikuTr,
        timskiDuhIg: this.editedItem.timskiDuhIg,
        timskiDuhTr: this.editedItem.timskiDuhTr,
        unutrasnjaMotivacijaIg: this.editedItem.unutrasnjaMotivacijaIg,
        unutrasnjaMotivacijaTr: this.editedItem.unutrasnjaMotivacijaTr,
        hrabrostTr: this.editedItem.hrabrostTr,
        inteligencijaTr: this.editedItem.inteligencijaTr,
        samouvidTr: this.editedItem.samouvidTr
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
              "players.psychologicalProfile.assessmentSelfssessment.newMeasurementSuccessfullyAdded"
            ),
            color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          debugger;
          switch (response.response.status) {
            case 400:
              //alert(response.response.status);
              break;
            case 405:
              //alert(response.response.status);
              break;
            default:
              break;
          }
          console.log(response.response.status);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena merenja
    //........................................
    putData() {
      debugger;
      let linkStr =
        this.$apiPutanja + "/psiholoski-profil/trener/" + this.editedItem.ident;
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
        anksioznostIg: this.editedItem.anksioznostIg,
        anksioznostTr: this.editedItem.anksioznostTr,
        koncentracijaIg: this.editedItem.koncentracijaIg,
        koncentracijaTr: this.editedItem.koncentracijaTr,
        kontrolaEmocijaIg: this.editedItem.kontrolaEmocijaIg,
        kontrolaEmocijaTr: this.editedItem.kontrolaEmocijaTr,
        postignucePodPritiskomIg: this.editedItem.postignucePodPritiskomIg,
        postignucePodPritiskomTr: this.editedItem.postignucePodPritiskomTr,
        reakcijaNaGreskuIg: this.editedItem.reakcijaNaGreskuIg,
        reakcijaNaGreskuTr: this.editedItem.reakcijaNaGreskuTr,
        reakcijaNaKritikuIg: this.editedItem.reakcijaNaKritikuIg,
        reakcijaNaKritikuTr: this.editedItem.reakcijaNaKritikuTr,
        timskiDuhIg: this.editedItem.timskiDuhIg,
        timskiDuhTr: this.editedItem.timskiDuhTr,
        unutrasnjaMotivacijaIg: this.editedItem.unutrasnjaMotivacijaIg,
        unutrasnjaMotivacijaTr: this.editedItem.unutrasnjaMotivacijaTr,
        hrabrostTr: this.editedItem.hrabrostTr,
        inteligencijaTr: this.editedItem.inteligencijaTr,
        samouvidTr: this.editedItem.samouvidTr
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
              "players.psychologicalProfile.assessmentSelfssessment.measurementDataChangedSuccessfully"
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
      let linkStr =
        this.$apiPutanja + "/psiholoski-profil/trener/" + item.ident;
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
              "players.psychologicalProfile.assessmentSelfssessment.measurementDataDeletedSuccessfully"
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
      var self = this;
      const index = this.data.indexOf(item);
      let obj = {
        title: self.$t(
          "players.psychologicalProfile.assessmentSelfssessment.warning"
        ),
        message: self.$t(
          "players.psychologicalProfile.assessmentSelfssessment.areYouSureDelete"
        ),
        customCloseBtnText: self.$t(
          "players.psychologicalProfile.assessmentSelfssessment.no"
        ),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: self.$t(
          "players.psychologicalProfile.assessmentSelfssessment.yes"
        ),
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

      const status = exportFile(
        "Psiholog - procena i samoprocena.csv",
        content,
        "text/csv"
      );
      let self = this;
      if (status !== true) {
        this.$q.notify({
          message: self.$t(
            "players.psychologicalProfile.assessmentSelfssessment.browserForbids"
          ),
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
/* .custom-file-input:hover::before { */
/* border-color: black; */
/* } */
/*.custom-file-input:active::before {
   background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
}*/
tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}
.tekstKlasa {
  margin-top: 20px;
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

.sakriDugmice {
  display: none;
}
</style>
