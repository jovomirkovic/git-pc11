<template>
  <q-page class="q-pa-sm">

        <q-table
          :title="$t('administration.roles.role')"
          :data="data"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="uloga"
          :grid="mode=='grid'"
          :filter="filter"
          :pagination.sync="pagination"
          :rows-per-page-label="$t('table.rowsPerPage')"
          :no-data-label="$t('table.noData')"
          :loading-label="$t('table.loadingLabel')"
          :no-results-label="$t('table.noResultLabel')"
          :loading="loadingUtakmice"
          class="mojaTabela"
          style="background-color: unset; box-shadow: unset;"
          table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px; text-transform: uppercase;"
          color="blue-10"
        >
<!--           selection="single"
          :selected.sync="selected" -->

          <template v-slot:top-right="props">
            <q-btn
              @click="otvordeDialog()"
              :label="$t('administration.roles.newRole')"
              class="q-mr-xs dugmeNewNesto" />

            <q-input outlined class="dugmeSearch" dense debounce="300" v-model="filter" :placeholder="$t('table.search')">
              <template v-slot:append>
                <q-icon name="search" />
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
              @click="mode = mode === 'grid' ? 'list' : 'grid'; separator = mode === 'grid' ? 'none' : 'horizontal'"
              v-if="!props.inFullscreen"
            >
              <q-tooltip
                :disable="$q.platform.is.mobile"
                v-close-popup
              >{{mode==='grid' ?  $t('table.list') :  $t('table.grid')}}</q-tooltip>
            </q-btn>

            <q-btn
              class="dugmeCVS"
              :label="$t('table.exportToCSV')"
              no-caps
              @click="exportTable"
            />
          </template>

          <template v-slot:header-cell-action="props">
            <q-th style="color: #ffffff00; width: 110px;">
              {{ props.col.label }}
            </q-th>
          </template>

          <template v-slot:body-cell="props">
            <q-td :props="props" v-if="props.value == props.row.action">
              <div class="q-gutter-sm">
                <q-btn @click="editItem(props.row)" id="dugmeEdit" round dense style="background-color: #e5edf4; color: #3b5d99"  icon="edit">
                    <q-tooltip>
                     {{ $t('table.editData') }}
                    </q-tooltip>
                </q-btn>
                <q-btn @click="deleteItem(props.row)" id="dugmeBrisi" round dense style="background-color: #e5edf4; color: #3b5d99"  icon="delete">
                  <q-tooltip>
                    {{ $t('table.delete') }}
                  </q-tooltip>
                </q-btn>
              </div>
            </q-td>

            <q-td :props="props"  v-else-if="props.row.uloga == props.value"  @click="otvoriPreviewDialog(props.row)">
              <div class="" id="uloga">
                {{props.row.uloga}}
              </div>
            </q-td>

            <q-td :props="props"  v-else  @click="otvoriPreviewDialog(props.row)">
              <div>
                {{props.value}}
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
              <div class="text-h6"
                  style="text-align: center;">
                {{$t('administration.roles.role')}}
              </div>
            </q-card-section>
            <!-- <q-separator inset></q-separator> -->
            <q-card-section class="q-pt-none">
              <q-form class="q-gutter-md">
                <q-list>
<!--                   <q-item>
                    <q-item-section>
                      <q-input dense outlined v-model="editedItem.id" label="Identifikator"></q-input>
                    </q-item-section>
                  </q-item>
 -->
                  <q-item>
                    <q-item-section>
                      <!-- <q-input dense outlined v-model="editedItem.uloga" :label="$t('administration.roles.role')"
                      :rules="[val => val !== null && val !== '' || $t('administration.roles.enterRole')]"
                      ></q-input> -->

                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.uloga"
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')"
                      @blur="spustiPlaceholder('Span-IP1', editedItem.telesnaVisina)"
                      ref="input1"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          $t('administration.roles.enterRole'),
                      ]"/>
                    <span id="Span-IP1" class="placeholder">{{$t('administration.roles.role')}}</span>
                  </label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <!-- <q-input dense outlined v-model="editedItem.naziv_uloge" :label="$t('administration.roles.roleName')"
                      :rules="[val => val !== null && val !== '' || $t('administration.roles.enterRoleName')]"
                      ></q-input>
                       -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.naziv_uloge"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="spustiPlaceholder('Span-IP2', editedItem.telesnaVisina)"
                      ref="input2"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          $t('administration.roles.enterRoleName'),
                      ]"/>
                    <span id="Span-IP2" class="placeholder">{{$t('administration.roles.roleName')}}</span>
                  </label>
                    </q-item-section>
                  </q-item>

                </q-list>
              </q-form>
            </q-card-section>

        <q-card-actions :class="{ sakriDugmice: readonly }" align="center" class="bg-white text-teal">
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
              <div class="text-h6"
                  style="text-align: center;">
                {{$t('administration.roles.role')}}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form class="q-gutter-md">
                <q-list>

                  <q-item>
                    <q-item-section>
                      <label class="custom-field one">
                        <input type="text" readonly placeholder=" "
                        v-model="editedItem.uloga"
                        :label="$t('administration.roles.role')"
                        />
                        <span class="placeholder">{{$t('administration.roles.role')}}</span>
                      </label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <label class="custom-field one">
                        <input type="text" readonly placeholder=" "
                        v-model="editedItem.naziv_uloge"
                        :label="$t('administration.roles.roleName')"
                        />
                        <span class="placeholder">{{$t('administration.roles.roleName')}}</span>
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
      filter: "",
      naslov: "Uloge",
      customer: {},
      dataPreview: false,
      new_customer: false,
      editedIndex: -1,
      editedItem: {
        ident: 0,
        uloga: "",
        naziv_uloge: "",
      },
      defaultItem: {
        ident: 0,
        uloga: "",
        naziv_uloge: "",
      },
      mode: "list",
      columns: [
        // {
        //   name: "id",
        //   required: true,
        //   label: "Identifikator",
        //   align: "left",
        //   field: "id",
        //   sortable: true
        // },
        {
          name: "uloga",
          align: "left",
          label: this.$t('administration.roles.role'),
          field: "uloga",
          sortable: true
        },
        {
          name: "naziv_uloge",
          align: "left",
          label: this.$t('administration.roles.roleName'),
          field: "naziv_uloge",
          sortable: true
        },
        {
          name: "action",
          align: "right",
          label: this.$t('table.action'),
          field: "action",
          sortable: true
        }
      ],
      data: [],
      // data: [       //ovo je samo za test, podatke vucemo iz baze
      //   {
      //     id: 99,
      //     uloga: "Администратор",
      //     naziv_uloge: "ROLE_ADMIN",
      //   },
      //   {
      //     id: 100,
      //     uloga: "Тренер",
      //     naziv_uloge: "ROLE_TRENER",
      //   },
      //   {
      //     id: 99,
      //     uloga: "Директор",
      //     naziv_uloge: "ROLE_MANAGER",
      //   },
      // ],
      pagination: {
        rowsPerPage: 10
      },

    };
  },
  beforeMount() {

  },
  mounted() {
    this.getData() //idemo da uzmenmo podatke iz baze
  },
  methods: {
    popniPlaceholder(id){
      var izabraniPlaceholder = document.getElementById(id)

      izabraniPlaceholder.style.top = '0px'
      izabraniPlaceholder.style.backgroundColor = 'white'
      izabraniPlaceholder.style.fontSize = '9pt'
      izabraniPlaceholder.style.width = 'unset'
      izabraniPlaceholder.style.padding = '3px'
      izabraniPlaceholder.style.color = 'black'
    },
    spustiPlaceholder(id, val){
      var izabraniPlaceholder = document.getElementById(id)

      if(val === '' || val == null || val.length == 0){
        izabraniPlaceholder.style.top = '22px'
        izabraniPlaceholder.style.backgroundColor = 'unset'
        izabraniPlaceholder.style.fontSize = 'unset'
        izabraniPlaceholder.style.padding = '3px'
        izabraniPlaceholder.style.color = '#aaa'
      }
    },
    otvoriPreviewDialog(item){
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.readonly = true;
      this.new_customer = true
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje rola
    //........................................
    getData() {
      let linkStr = this.$apiPutanja +  '/roles'
        this.loadingUtakmice = true
      debugger;
        this.$axios
          .get(linkStr,{
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer  " + window.$token
                }
              })
          .then(response => {
            if(response.status == 401) { this.$router.push({ name: "login"}); }
            debugger
            this.data = response.data;
            this.loadingUtakmice = false
            debugger

          })
          .catch(e => {
            //this.errors.push(e);
            console.log("Greska: " + e);
            this.$router.push({ name: "login"});
            this.loadingUtakmice = false
          });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje nove role
    //........................................
    postData() {
    debugger
      let linkStr = this.$apiPutanja +  '/roles'
      var self=this;
      let datetime = this.getDateTime();

      var dataString = {
        datumKreiranja: datetime,
        naziv_uloge: this.editedItem.naziv_uloge,
        uloga: this.editedItem.uloga,
        ident: this.editedItem.ident
      };

      let data1 = JSON.stringify(dataString);

debugger
      this.$axios
        .post(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function(response) {
          debugger
          console.log(response);
          self.$q.notify({
            message: self.$t('administration.user.msgPositive'),
          color: "green"
        });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          //alert(response);
          self.$q.notify({
            message: self.$t('administration.user.msgNeg'),
          color: "red"
        });

        });

    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena role
    //........................................
    putData() {
    debugger
    var self=this;
      if(this.editedItem.naziv_uloge == "" || this.editedItem.naziv_uloge == " ") {
        self.$q.notify({
            message: self.$t('administration.user.enterRoleName'),
          color: "red"
          });
          return
      }
      let linkStr = this.$apiPutanja +  '/roles/' + this.editedItem.ident

      let datetime = this.getDateTime();

      var dataString = {
        datumKreiranja: datetime,
        naziv_uloge: this.editedItem.naziv_uloge,
        uloga: this.editedItem.uloga,
        ident: this.editedItem.ident
      };

      let data1 = JSON.stringify(dataString);

debugger
      this.$axios
        .put(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function(response) {
          debugger
          console.log(response);
          self.getData();
          self.$q.notify({
            message: self.$t('administration.user.msgChange'),
          color: "green"
          });
        })
        .catch(function(response) {
          //handle error
          console.log(response);
          //alert(response);
          self.$q.notify({
            message: self.$t('administration.user.msgNotChange'),
          color: "red"
          });
        });

    },
    //''''''''''''''''''''''''''''''''''''''''
    // brisanje/deaktiviranje role
    //........................................
    deleteData(item) {
    debugger
      let linkStr = this.$apiPutanja +  '/roles/' + item.ident
      var self=this;
debugger
      this.$axios
        .delete(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token
          }
        })
        .then(function(response) {
          debugger
          console.log(response);
          self.getData();
          self.$q.notify({
            message: self.$t('administration.user.msgDel'),
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
    getDateTime() {
      const today = new Date();
      return today.toISOString();
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavanje novog i editovanje zapisa
    //........................................
    addRow() {
      debugger
      let sveOK = true;

      if(this.editedItem.uloga == null || this.editedItem.uloga == '')  sveOK = false
      if(this.editedItem.naziv_uloge == null || this.editedItem.naziv_uloge == '')  sveOK = false

      if(sveOK == false) {
        this.$q.notify({
            message: this.$t('administration.roles.notSaved'),
            color: "red"
          });
        this.zacrveniPrazne();
      } else {
        if (this.editedIndex > -1) {
          Object.assign(this.data[this.editedIndex], this.editedItem);
          this.naslov = this.$t('administration.roles.newRole')
          this.putData();
        } else {
          this.naslov = this.$t('administration.roles.role')
          this.data.push(this.editedItem);
          this.postData();
        }
        this.close()
      }
    },
    //''''''''''''''''''''''''''''''''''''''''
    // брисање записа у локау, и позивање функције за брисање записа у бази
    //........................................
    deleteItem(item) {
      if (item.uloga   == 'ROLE_IGRAC') {
        this.$q.notify({
            message: this.$t('administration.roles.msgDelNot'),
          color: "red"
          });
      } else {
        const index = this.data.indexOf(item);
        let obj = {
              title: this.$t('administration.roles.war'),
              message: this.$t('administration.roles.msgDelConf'),
              customCloseBtnText: this.$t('administration.roles.txtNo'),
              disableOverlayClick: true,
              useConfirmBtn: true,
              customConfirmBtnText: this.$t('administration.roles.txtYes'),
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
        }

    },
    otvordeDialog() {
      //this.editedItem.datumVreme = this.getDateTime(Date.now());
      this.new_customer=true
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300); 
    },
    //''''''''''''''''''''''''''''''''''''''''
    // едитовање појединачног записа
    //........................................
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      debugger
      this.readonly = false;
      if (this.editedItem.uloga    == 'ROLE_IGRAC') {
        this.$q.notify({
            message: this.$t('administration.roles.msgVeto'),
          color: "red"
          });
      } else {
        this.new_customer = true;
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300); 
      }

    },
    podigniPopunjenePlaceholdere(){
      var i = 0
      var sviInputi = document.getElementById("Span-IP" + i);
      while(!(i > 1 && sviInputi == null)){
        if(sviInputi != null){
          var val = sviInputi.parentElement.children[0].getElementsByTagName("input")[0].value 

          if(val != '' && val != null)
            this.popniPlaceholder("Span-IP" + i)
        }
        
        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0
      var sviSelektovi = document.getElementById("Span-SL" + i);
      while(!(i > 1 && sviSelektovi == null)){
        if(sviSelektovi != null){
          var val = sviSelektovi.parentElement.children[0].innerText.split("\n").length

          if(val > 1)
            this.popniPlaceholder("Span-SL" + i)
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    zacrveniPrazne(){
      let self = this
      var i = 0
      var sviInputi = document.getElementById("Span-IP" + i);

      while(!(i > 1 && sviInputi == null)){
        if(sviInputi != null){
          var val = sviInputi.parentElement.children[0].getElementsByTagName("input")[0].value
          debugger
          if(val == '' && val == null)
            this.$refs['input'+i].validate()
            this.$refs['input'+i].validate()
        }

        i++;
        sviInputi = document.getElementById("Span-IP" + i);
      }

      i = 0
      var sviSelektovi = document.getElementById("Span-SL" + i);
      while(!(i > 1 && sviSelektovi == null)){
        debugger
        if(sviSelektovi != null){
          var val = sviSelektovi.parentElement.children[0].innerText.split("\n").length

          if(val <= 1)
            this.$refs['select'+i].validate()
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    //''''''''''''''''''''''''''''''''''''''''
    // затварање дијалога
    //........................................
    close () {
      this.new_customer = false
      this.readonly = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
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

      const status = exportFile("uloge.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: this.$t('administration.roles.msgPrtSc'),
          color: "negative",
          icon: "warning"
        });
      }
    }
  }
};
</script>

<style scoped>
 tbody tr:hover td #uloga{
    font-weight: 700  !important;
    color: #ff4b00;
 }

.sakriDugmice{
  display: none;
}

</style>
