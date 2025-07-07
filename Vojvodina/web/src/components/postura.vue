<template>
  <q-page class="q-pa-sm">

<h5> Izabrani igrač: {{this.igrac}}</h5>

        <q-table
          title="Postura"
          :data="data"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="ident"
          :grid="mode=='grid'"
          :filter="filter"
          :pagination.sync="pagination"
          rows-per-page-label="Broj redova po strani"
          table-header-style="font-weight: bold; background: #ffeb3b4f; color: red; font-style: italic;"
        >
<!--           selection="single"
          :selected.sync="selected" -->

          <template v-slot:top-right="props">
            <q-btn @click="otvordeDialog()" outline color="primary" label="Nova postura" class="q-mr-xs" />

            <q-input outlined dense debounce="300" v-model="filter" placeholder="Pretraživanje">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-btn
              flat
              round
              dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              v-if="mode === 'list'"
            >
              <q-tooltip
                :disable="$q.platform.is.mobile"
                v-close-popup
              >{{props.inFullscreen ? 'Izađi iz moda celog ekrana' : 'Otvori ceo ekran'}}</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              :icon="mode === 'grid' ? 'list' : 'grid_on'"
              @click="mode = mode === 'grid' ? 'list' : 'grid'; separator = mode === 'grid' ? 'none' : 'horizontal'"
              v-if="!props.inFullscreen"
            >
              <q-tooltip
                :disable="$q.platform.is.mobile"
                v-close-popup
              >{{mode==='grid' ? 'Lista' : 'Mreža'}}</q-tooltip>
            </q-btn>

            <q-btn
              color="primary"
              icon-right="archive"
              label="Izvoz u CSV"
              no-caps
              @click="exportTable"
            />
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div class="q-gutter-sm">
                <q-btn @click="editItem(props.row)" dense color="primary" icon="edit">
                    <q-tooltip>
                      Izmena podataka o posturi
                    </q-tooltip>
                </q-btn>
                <q-btn @click="deleteItem(props.row)" dense color="red" icon="delete">
                  <q-tooltip>
                    Brisanje 
                  </q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
        <q-dialog persistent v-model="new_customer">
          <q-card style="width: 600px; max-width: 60vw;">
            <q-card-section>
              <div class="text-h6">
                Dodavanje nove posture
                <!-- <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn> -->
              </div>
            </q-card-section>
            <q-separator inset></q-separator>
            <q-card-section class="q-pt-none">
              <q-form class="q-gutter-md">
                <q-list>
                  <q-item>
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
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.datumVreme" label="Datum unosa"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.forwardHeadR" label="forwardHeadR"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.forwardHeadL" label="forwardHeadL"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.FrankfortPlane_R" label="FrankfortPlane_R"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.frankfortPlaneL" label="frankfortPlaneL"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.frankfortPlaneR" label="frankfortPlaneR"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.roundSholdersL" label="roundSholdersL"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.roundSholdersR" label="roundSholdersR"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.thoracicKyphosysAngle" label="thoracicKyphosysAngle"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.lumbarLordosisAngle" label="lumbarLordosisAngle"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.pelvicTiltR" label="pelvicTiltR"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.pelvicTiltL" label="pelvicTiltL"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.kneeFlexR" label="kneeFlexR "></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.kneeFlexL" label="kneeFlexL"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.flatFootR" label="flatFootR"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.flatFootL" label="flatFootL"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.normBnavichularL" label="normBnavichularL"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.normBnavichularB" label="normBnavichularB"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.headAligment" label="headAligment"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.sholderAligment" label="sholderAligment"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.pelvicAligment" label="pelvicAligment"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.kneeAligment" label="kneeAligment"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.ankleAligment" label="ankleAligment"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.quadricepsAngleR" label="quadricepsAngleR"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.quadricepsAngleL" label="quadricepsAngleL"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.genuValgumR" label="genuValgumR"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.genuValgumL" label="genuValgumL"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.headSholder" label="headSholder"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.sholdersPelvic" label="sholdersPelvic"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.pelisKnees" label="pelisKnees"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.kneesAngles" label="kneesAngles"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.footToeL" label="footToeL"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.footToeR" label="footToeR"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.cervikalnaKrivina" label="cervikalnaKrivina"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.torakalnaKrvinina" label="torakalnaKrvinina"></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.lumbalnaKrivina" label="lumbalnaKrivina"></q-input>
                    </q-item-section>
                  </q-item>
                  
                </q-list>
              </q-form>
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn label="Odustani" @click="close" type="submit" color="primary" v-close-popup />
              <q-btn label="Snimi" @click="addRow" type="submit" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
    </q-page>
      
</template>


<script>

export default {
  data() {
    return {
      igrac: '',
      date: '2019-01-01',
      filter: "",
      listOptions:[
                { label: 'Administrator',  value: 'ROLE_ADMIN' },
                { label: 'Trener',  value: 'ROLE_TRENER' },
                { label: 'Pomoćni trener',  value: 'ROLE_POMTRENER' },
                { label: 'Direktor',  value: 'ROLE_MANAGER' },
                { label: 'Igrač',  value: 'ROLE_PLAYER' },
              ],
      opcijeZaKlub:[
                { label: 'Preporuka menadžera',  value: 'PREPORUKA_MENADZERA' },
                { label: 'Preporuka skauta',  value: 'PREPORUKA_SKAUTA' },
                { label: 'Preporuka trenera',  value: 'PREPORUKA_TRENERA' },
                { label: 'Selektivni trening',  value: 'SELEKTIVNI_TRENING' },
                { label: 'Regionalni centar',  value: 'REGIONALNI_CENTAR' },
                { label: 'Škola fudbala',  value: 'SKOLA_FUDBALA' },
                { label: 'Kamp',  value: 'KAMP' },
                { label: 'VIP',  value: 'VIP' },
                { label: 'Ostalo',  value: 'OSTALO' },
              ],
      opcijeSaKimZivi:[
                { label: 'Oba roditelja',  value: 'PREPORUKA_MENADZERA' },
                { label: 'Majka',  value: 'PREPORUKA_SKAUTA' },
                { label: 'Otac',  value: 'PREPORUKA_TRENERA' },
                { label: 'Samostalno',  value: 'SELEKTIVNI_TRENING' },
                { label: 'Staratelj',  value: 'REGIONALNI_CENTAR' }
              ],
      opcijeZaObrazovanjeRoditelja:[
                { label: 'Osnovno',  value: 'PREPORUKA_MENADZERA' },
                { label: 'Srednje',  value: 'PREPORUKA_SKAUTA' },
                { label: 'Više',  value: 'PREPORUKA_TRENERA' },
                { label: 'Visoko',  value: 'SELEKTIVNI_TRENING' },
                { label: 'Doktorat',  value: 'REGIONALNI_CENTAR' }
              ],
      opcijeZaZaposlenjeRoditelja:[
                { label: 'Oba roditelja',  value: 'PREPORUKA_MENADZERA' },
                { label: 'Majka',  value: 'PREPORUKA_SKAUTA' },
                { label: 'Otac',  value: 'PREPORUKA_TRENERA' },
                { label: 'Nijedno',  value: 'SELEKTIVNI_TRENING' },
                ],
      opcijeZaUspeh:[
                { label: 'Da',  value: 'PREPORUKA_MENADZERA' },
                { label: 'Ne',  value: 'PREPORUKA_SKAUTA' },
                ],
      customer: {},
      new_customer: false,
      editedIndex: -1,
      editedItem: {
        ident: 0,
        igracIdent: 0,
        identKorisnika: 0,
        korisnikImePrezime: "",
        datumVreme: "",
        forwardHeadR: 0,
        forwardHeadL: 0,          
        FrankfortPlane_R: 0,
        frankfortPlaneL: 0,
        frankfortPlaneR: 0,
        roundSholdersL: 0,
        roundSholdersR: 0,
        thoracicKyphosysAngle: 0,
        lumbarLordosisAngle:0,
        pelvicTiltR: 0,
        pelvicTiltL: 0,
        kneeFlexR: 0,
        kneeFlexL: 0,
        flatFootR: 0,
        flatFootL: 0,
        normBnavichularL: 0,
        normBnavichularB: 0,
        headAligment: 0,
        sholderAligment: 0,
        pelvicAligment: 0,
        kneeAligment: 0,
        ankleAligment: 0,
        quadricepsAngleR: 0,
        quadricepsAngleL: 0,
        genuValgumR: 0,
        genuValgumL: 0,
        headSholder: 0,
        sholdersPelvic: 0,
        pelisKnees: 0,
        kneesAngles: 0,
        footToeL: 0,
        footToeR: 0,
        cervikalnaKrivina: 0,
        torakalnaKrvinina: 0,
        lumbalnaKrivina: 0,
        active: true
      },
      defaultItem: {
        ident: 0,
        igracIdent: 0,
        korisnikIdent: 0,
        korisnikImePrezime: "",
        datumVreme: "",
        forwardHeadR: 0,
        forwardHeadL: 0,          
        FrankfortPlane_R: 0,
        frankfortPlaneL: 0,
        frankfortPlaneR: 0,
        roundSholdersL: 0,
        roundSholdersR: 0,
        thoracicKyphosysAngle: 0,
        lumbarLordosisAngle:0,
        pelvicTiltR: 0,
        pelvicTiltL: 0,
        kneeFlexR: 0,
        kneeFlexL: 0,
        flatFootR: 0,
        flatFootL: 0,
        normBnavichularL: 0,
        normBnavichularB: 0,
        headAligment: 0,
        sholderAligment: 0,
        pelvicAligment: 0,
        kneeAligment: 0,
        ankleAligment: 0,
        quadricepsAngleR: 0,
        quadricepsAngleL: 0,
        genuValgumR: 0,
        genuValgumL: 0,
        headSholder: 0,
        sholdersPelvic: 0,
        pelisKnees: 0,
        kneesAngles: 0,
        footToeL: 0,
        footToeR: 0,
        cervikalnaKrivina: 0,
        torakalnaKrvinina: 0,
        lumbalnaKrivina: 0,
        active: true
      },
      mode: "list",
      igracID1: 0,
      columns: [
        {
          name: "ident",
          required: true,
          label: "ID",
          align: "left",
          field: "ident",
          sortable: true
        },
        {
          name: "korisnikImePrezime",
          align: "left",
          label: "Ko je radio testiranje",
          field: "korisnikImePrezime",
          sortable: true
        },
        {
          name: "datumVreme",
          align: "left",
          label: "Datum unosa",
          field: "datumVreme",
          sortable: true,
          format: val => date.formatDate(val, 'DD/MM/YYYY')
        },
        {
          name: "forwardHeadR",
          align: "left",
          label: "forwardHeadR",
          field: "forwardHeadR",
          sortable: true
        },
        // {
        //   name: "forwardHeadR",
        //   align: "left",
        //   label: "forwardHeadR",
        //   field: "forwardHeadR",
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
        // {
        //   name: "mobilni",
        //   align: "left",
        //   label: "Mobilni telefon",
        //   field: "mobilni",
        //   sortable: true
        // },
        // {
        //   name: "email",
        //   align: "left",
        //   label: "Elektronska pošta",
        //   field: "email",
        //   sortable: true
        // },
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
        // {
        //   name: "vaznostPasosa",
        //   align: "left",
        //   label: "Важност пасоша",
        //   field: "vaznostPasosa",
        //   sortable: true
        // },
        {
            name: "action",
            align: "left",
            label: "Akcija",
            field: "action",
            sortable: true
        }
      ],
      data: [],
      data1: [
        {
        ident: 0,
        igracIdent: 1,
        korisnikIdent: 2,
        datumVreme: "2-2-2020",
        forwardHeadR: 0.2,
        forwardHeadL: 0.12,          
        FrankfortPlane_R: 0.32,
        frankfortPlaneL: 0.43,
        frankfortPlaneR: 0.76,
        roundSholdersL: 0.9,
        roundSholdersR: 0,
        thoracicKyphosysAngle: 0.98,
        lumbarLordosisAngle:0.01,
        pelvicTiltR: 0.3,
        pelvicTiltL: 0.2,
        kneeFlexR: 0.14,
        kneeFlexL: 0.56,
        flatFootR:1.2,
        flatFootL: 1.04,
        normBnavichularL: 0,
        normBnavichularB: 0,
        headAligment: -1.03,
        sholderAligment: -0.2,
        pelvicAligment: 1.05,
        kneeAligment: 0.34,
        ankleAligment: 0.72,
        quadricepsAngleR: 0.12,
        quadricepsAngleL: 0.32,
        genuValgumR: 0.42,
        genuValgumL: 0.97,
        headSholder: 0.11,
        sholdersPelvic: 0.12,
        pelisKnees: -0.54,
        kneesAngles: 0.65,
        footToeL: 0.01,
        footToeR: 0.4,
        cervikalnaKrivina: 0.5,
        torakalnaKrvinina: 0.19,
        lumbalnaKrivina: 0.45,
        active: true
        },
        {
        ident: 2,
        igracIdent: 3,
        korisnikIdent: 4,
        datumVreme: "21-3-2019",
        forwardHeadR: 0.2,
        forwardHeadL: 0.12,          
        FrankfortPlane_R: 0.32,
        frankfortPlaneL: 0.43,
        frankfortPlaneR: 0.76,
        roundSholdersL: 0.69,
        roundSholdersR: 0,
        thoracicKyphosysAngle: 0.98,
        lumbarLordosisAngle:0.01,
        pelvicTiltR: 0.3,
        pelvicTiltL: 0.2,
        kneeFlexR: 0.14,
        kneeFlexL: 0.56,
        flatFootR:1.2,
        flatFootL: -1.04,
        normBnavichularL: 1.5,
        normBnavichularB: 0,
        headAligment: -1.03,
        sholderAligment: -0.2,
        pelvicAligment: 1.05,
        kneeAligment: -1.34,
        ankleAligment: 0.72,
        quadricepsAngleR: 0.12,
        quadricepsAngleL: 0.32,
        genuValgumR: 0.42,
        genuValgumL: 0.97,
        headSholder: 0.11,
        sholdersPelvic: 0.12,
        pelisKnees: -0.54,
        kneesAngles: 0.65,
        footToeL: -0.01,
        footToeR: 0.32,
        cervikalnaKrivina: 0.54,
        torakalnaKrvinina: -0.19,
        lumbalnaKrivina: 1.45,
        },
        {
        ident: 3,
        igracIdent: 4,
        korisnikIdent: 5,
        datumVreme: "1-1-2010",
        forwardHeadR: 0.2,
        forwardHeadL: 0.12,          
        FrankfortPlane_R: 0.32,
        frankfortPlaneL: 0.43,
        frankfortPlaneR: 0.76,
        roundSholdersL: 0.9,
        roundSholdersR: 0,
        thoracicKyphosysAngle: 0.98,
        lumbarLordosisAngle:0.01,
        pelvicTiltR: 0.3,
        pelvicTiltL: 0.2,
        kneeFlexR: -0.14,
        kneeFlexL: 0.56,
        flatFootR:1.2,
        flatFootL: 1.04,
        normBnavichularL: 0,
        normBnavichularB: 0,
        headAligment: 1.03,
        sholderAligment: -0.2,
        pelvicAligment: 1.05,
        kneeAligment: 0.34,
        ankleAligment: 0.72,
        quadricepsAngleR: 0.12,
        quadricepsAngleL: -0.32,
        genuValgumR: 0.42,
        genuValgumL: 0.97,
        headSholder: 0.11,
        sholdersPelvic: 0.12,
        pelisKnees: -0.54,
        kneesAngles: 0.35,
        footToeL: 1.01,
        footToeR: 0.4,
        cervikalnaKrivina: 0.5,
        torakalnaKrvinina: 1.19,
        lumbalnaKrivina: -0.45,
        },
        
      ],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  mounted() {
            this.igrac = window.$igracName;
            this.igracID1 = window.$igracID;
            this.getDataZaID() //idemo da uzmenmo podatke iz baze
        },
  methods: {
    //''''''''''''''''''''''''''''''''''''''''
    // citanje postura
    //........................................
    getData() {       
    let linkStr = this.$apiPutanja +  '/posture' 
    //debugger;
        this.$axios
        .get(linkStr,{
                headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer  " + window.$token
                }
            })
        .then(response => {
            debugger
            this.data = response.data;
            debugger

        })
        .catch(e => {
            //this.errors.push(e);
            console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje postura
    //........................................
    getDataZaID() {  
      debugger     
    let linkStr = this.$apiPutanja +  '/posture/igrac/' + this.igracID1 
    //debugger;
        this.$axios
        .get(linkStr,{
                headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer  " + window.$token
                }
            })
        .then(response => {
            debugger
            this.data = response.data;
            debugger

        })
        .catch(e => {
            //this.errors.push(e);
            console.log("Greska: " + e);
        });
    },
    getMenuImage(files){ //slika
        console.log(files);
        this.editedItem.fotografija = files.base64;
      },
    addRow() {
      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem);
      } else {
        this.data.push(this.editedItem);
      }
      this.close()
    },
    deleteItem(item) {
      const index = this.data.indexOf(item);
      let obj = {
            title: 'Upozorenje!',
            message: 'Da li zaista želite da izbrišete tekući zapis?',
            customCloseBtnText: 'Ne',            
            disableOverlayClick: true,
            useConfirmBtn: true,
            customConfirmBtnText: 'Da, želim',            
            onConfirm: onConfirmWrapper,
            type: 'warning',                
            showXclose: true,
        }
        this.$Simplert.open(obj);
        var self=this
        function onConfirmWrapper ()  {
            self.data.splice(index, 1);
            debugger
            self.deleteData(item);
        }
        
    },
    otvordeDialog() {
      //this.editedItem.datumVreme = this.getDateTime(Date.now());
      this.new_customer=true
    },
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.new_customer = true;
    },
    close () {
      this.new_customer = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
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

      const status = exportFile("postura.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Pregledač ne dozvoljava snimanje fajlova...",
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
  content: 'Izaberi fotografiju';
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

.datumKlasa {
    height: 40px; 
    padding: 0px;
}
</style>