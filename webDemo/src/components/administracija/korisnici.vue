<template>
  <q-page class="q-pa-sm">
    <q-table
      :title="$t('administration.user.users')"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="userName"
      :grid="mode == 'grid'"
      :filter="filter"
      :pagination.sync="pagination"
      :rows-per-page-label="$t('table.rowsPerPage')"
      :no-data-label="$t('table.noData')"
      :loading-label="$t('table.loadingLabel')"
      :no-results-label="$t('table.noResultLabel')"
      virtual-scroll
      :virtual-scroll-sticky-size-start="48"
      :loading="loadingUtakmice"
      class="mojaTabela my-sticky-header-table"
      style="
        background-color: unset;
        box-shadow: unset;
      "
      table-header-style="font-weight: bold; background: #e5edf4; color: #8b94aa; height: 24px !important; text-transform: uppercase;"
      color="blue-10"
    >
      <template v-slot:top-right="props">
        <q-btn
          @click="otvordeDialog()"
          :label="$t('administration.user.newUser')"
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
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            props.inFullscreen
              ? $t("table.exitFullScreen")
              : $t("table.fullScreen")
          }}</q-tooltip>
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
        <!-- <div style="height: 100px; background: red;"> -->
        <q-th style="color: #ffffff00; width: 110px;">
          {{ props.col.label }}
        </q-th>
        <!-- </div> -->
      </template>

      <template v-slot:body-cell="props" >
        <q-td v-if="props.row.roles == props.value"  @click="otvoriPreviewDialog(props.row)">
          {{ props.value.join(", ") }}
        </q-td>
        <q-td v-else-if="props.row.action == props.value" >
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
        <q-td v-else-if="props.row.userName == props.value"  @click="otvoriPreviewDialog(props.row)">
          <div class="" id="username">
            {{ props.row.userName }}
          </div>
        </q-td>
        <q-td v-else  @click="otvoriPreviewDialog(props.row)">
          {{ props.value }}
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
      ">
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
            {{ $t("administration.user.users") }}
          </div>
        </q-card-section>
        <!-- <q-separator inset></q-separator> -->
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <!-- <q-input
                    filled
                    bg-color="blue-1"
                    style="opacity: 0.7; color: #323b62;"
                    v-model="editedItem.userName"
                    :label="$t('administration.user.username')"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        $t('administration.user.enterUserName'),
                    ]"
                  >
                  </q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.userName"
                      @focus="popniPlaceholder('Span-IP1')"
                      @input="popniPlaceholder('Span-IP1')"
                      @blur="spustiPlaceholder('Span-IP1', editedItem.userName)"
                      ref="input1"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          $t('administration.user.enterUserName'),
                      ]"/>
                    <span id="Span-IP1" class="placeholder">{{$t('administration.user.username')}}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input
                    filled
                    bg-color="blue-1"
                    style="opacity: 0.7; color: #323b62;"
                    v-model="editedItem.password"
                    :label="$t('administration.user.password')"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        $t('administration.user.enterPassword'),
                    ]"
                  ></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.password"
                      @focus="popniPlaceholder('Span-IP2')"
                      @input="popniPlaceholder('Span-IP2')"
                      @blur="spustiPlaceholder('Span-IP2', editedItem.password)"
                      ref="input2"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          $t('administration.user.enterPassword'),
                      ]"/>
                    <span id="Span-IP2" class="placeholder">{{$t('administration.user.password')}}</span>
                  </label>
                </q-item-section>
              </q-item>

              <q-item @click="this.proveri(); ">
                <q-item-section class="custom-field one" style="margin-top: 10px">
                  <q-select
                    :readonly="readonly"
                    borderless
                    class="selektKlass"
                    option-value="value"
                    option-label="label"
                    :options="listOptions"
                    v-model="editedItem.roles"
                    multiple
                    use-chips
                    emit-value
                    map-options
                    :style="{height: [editedItem.roles.length > 3 ? '80px' : '40px']}"
                    ref="select1"
                    @focus="popniPlaceholder('Span-SL1')"
                    @input="popniPlaceholder('Span-SL1')"
                    @blur="spustiPlaceholder('Span-SL1', editedItem.roles)"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '' && val.length != 0) ||
                        $t('administration.user.enterRole'),
                    ]"
                  />
                  <span @click="$refs.select1.showPopup()" id="Span-SL1" class="placeholder placeholder1">{{$t('administration.user.role')}}</span>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- <q-input
                    filled
                    bg-color="blue-1"
                    style="opacity: 0.7; color: #323b62;"
                    v-model="editedItem.ime"
                    :label="$t('administration.user.name')"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        $t('administration.user.enterName'),
                    ]"
                  ></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.ime"
                      @focus="popniPlaceholder('Span-IP3')"
                      @input="popniPlaceholder('Span-IP3')"
                      @blur="spustiPlaceholder('Span-IP3', editedItem.ime)"
                      ref="input3"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          $t('administration.user.enterName'),
                      ]"/>
                    <span id="Span-IP3" class="placeholder">{{$t('administration.user.name')}}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <!-- <q-input
                    filled
                    bg-color="blue-1"
                    style="opacity: 0.7; color: #323b62;"
                    v-model="editedItem.prezime"
                    :label="$t('administration.user.surname')"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        $t('administration.user.enterSurName'),
                    ]"
                  ></q-input> -->
                  <label class="custom-field one">
                    <q-input
                      :readonly="readonly"
                      hide-bottom-space
                      borderless
                      dense
                      placeholder=" "
                      v-model="editedItem.prezime"
                      @focus="popniPlaceholder('Span-IP4')"
                      @input="popniPlaceholder('Span-IP4')"
                      @blur="spustiPlaceholder('Span-IP4', editedItem.prezime)"
                      ref="input4"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          $t('administration.user.enterSurName'),
                      ]"/>
                    <span id="Span-IP4" class="placeholder">{{$t('administration.user.surname')}}</span>
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


    <q-dialog  v-model="dataPreview">
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
            {{ $t("administration.user.users") }}
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <label class="custom-field one">
                    <input readonly type="text" placeholder=" "
                      v-model="editedItem.userName"
                      :label="$t('administration.user.username')"
                    />
                    <span class="placeholder">{{$t('administration.user.username')}}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-Item>
                <q-item-section>
                  <label class="custom-field one">
                    <input readonly type="text" placeholder=" "
                      v-model="editedItem.password"
                      :label="$t('administration.user.password')"
                    />
                    <span class="placeholder">{{$t('administration.user.password')}}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-Item>
                <q-item-section>
                  <q-select
                  borderless
                  readonly
                  style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; padding-left: 14px !important;"
                    multiple
                    :options="listOptions"
                    :label="$t('administration.user.role')"
                    v-model="editedItem.roles"
                  />
                </q-item-section>
              </q-item>
              <q-Item>
                <q-item-section>
                  <label class="custom-field one">
                    <input type="text" placeholder=" "
                    v-model="editedItem.ime"
                    readonly
                    :label="$t('administration.user.name')"
                    />
                    <span class="placeholder">{{$t('administration.user.name')}}</span>
                  </label>
                </q-item-section>
              </q-item>
              <q-Item>
                <q-item-section>
                  <label class="custom-field one">
                    <input type="text" placeholder=" "
                    v-model="editedItem.prezime"
                    readonly
                    :label="$t('administration.user.surname')"
                    />
                    <span class="placeholder">{{$t('administration.user.surname')}}</span>
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
      naslov: "Korisnik",
      listOptions: [],
      customer: {},
      new_customer: false,
      dataPreview: false,
      editedIndex: -1,
      editedItem: {
        id: 0,
        userName: "",
        password: "",
        roles: [],
        ime: "",
        prezime: "",
        active: true,
      },
      defaultItem: {
        id: 0,
        userName: "",
        password: "",
        roles: [],
        ime: "",
        prezime: "",
        active: true,
      },
      mode: "list",
      columns: [
        {
          name: "userName",
          required: true,
          label: this.$t("administration.user.username"),
          align: "left",
          field: "userName",
          sortable: true,
        },
        {
          name: "roles",
          align: "left",
          label: this.$t("administration.user.role"),
          field: "roles",
          sortable: true,
        },
        {
          name: "ime",
          align: "left",
          label: this.$t("administration.user.name"),
          field: "ime",
          sortable: true,
        },
        {
          name: "prezime",
          align: "left",
          label: this.$t("administration.user.surname"),
          field: "prezime",
          sortable: true,
        },
        {
          name: "action",
          align: "left",
          label: this.$t("table.action"),
          field: "action",
          sortable: true,
        },
      ],
      data: [],
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  mounted() {
    //this.getData() //idemo da uzmenmo podatke iz baze
    this.getDataRoles();
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
    // citanje podataka o ulogama
    //........................................
    getDataRoles() {
      let linkStr = this.$apiPutanja + "/roles";
      this.loadingUtakmice = true
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token,
          },
        })
        .then((response) => {
          debugger;
          if (response.status == 401) {
            this.$router.push({ name: "login" });
          }
          this.listOptions = response.data.map(this.dajRole);
          debugger;
          this.getData();
        })
        .catch((e) => {
          console;
          //this.errors.push(e);
          this.loadingUtakmice = false
          console.log("Greska: " + e);
          this.$router.push({ name: "login" });
        });
    },
    dajRole(item) {
      return { label: item.naziv_uloge, value: item.uloga };
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o korisnicima
    //........................................
    getData() {
      let linkStr = this.$apiPutanja + "/korisnici";
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token,
          },
        })
        .then((response) => {
          if (response.status == 401) {
            this.$router.push({ name: "login" });
          }
          this.data = response.data;
          debugger;
          this.loadingUtakmice = false
        })
        .catch((e) => {
          //this.errors.push(e);
          this.loadingUtakmice = false
          this.$router.push({ name: "login" });
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // dodavsanje новог корисника
    //........................................
    postData() {
      debugger;

      let linkStr = this.$apiPutanja + "/korisnici";
      var self = this;
      //let datetime = this.getDateTime();

      var dataString = {
        active: true,
        id: this.editedItem.id,
        ime: this.editedItem.ime,
        password: this.editedItem.password,
        prezime: this.editedItem.prezime,
        roles: this.editedItem.roles,
        userName: this.editedItem.userName,
      };

      let data1 = JSON.stringify(dataString);

      debugger;
      this.$axios
        .post(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token,
          },
        })
        .then(function (response) {
          debugger;
          console.log(response);
          self.getData();
          self.$q.notify({
            icon: "done",
            message: self.$t("administration.user.msgPositive"),
            color: "positive",
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          self.$q.notify({
            message: self.$t("administration.user.msgNeg"),
            color: "red",
          });
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // izmena корисника
    //........................................
    putData() {
      debugger;
      let linkStr = this.$apiPutanja + "/korisnici/" + this.editedItem.id;
      var self = this;
      //let datetime = this.getDateTime();

      var dataString = {
        active: 1,
        id: this.editedItem.id,
        ime: this.editedItem.ime,
        password: this.editedItem.password,
        prezime: this.editedItem.prezime,
        roles: this.editedItem.roles,
        userName: this.editedItem.userName,
      };
      debugger;
      let data1 = JSON.stringify(dataString);
      this.$axios
        .put(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token,
          },
        })
        .then(function (response) {
          debugger;
          console.log(response);
          self.getData();
          self.$q.notify({
            message: self.$t("administration.user.msgChange"),
            color: "green",
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          //alert(response);
          self.$q.notify({
            message: self.$t("administration.user.msgNotChange"),
            color: "red",
          });
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
    // brisanje/deaktiviranje korisnika
    //........................................
    deleteData(item) {
      debugger;
      // /korisnici/izbaci-iz-korisnka/{ident}
      let linkStr =
        this.$apiPutanja + "/korisnici/izbaci-iz-korisnka/" + item.id;
      var self = this;
      var dataString = {};
      let data1 = JSON.stringify(dataString);
      debugger;
      this.$axios
        .put(linkStr, data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + window.$token,
          },
        })
        .then(function (response) {
          debugger;
          console.log(response);
          self.getData();
          self.$q.notify({
            message: self.$t("administration.user.msgDel"),
            color: "green",
          });
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          alert(response);
        });
    },
    addRow() {
      debugger;
      let sveOK = true;

      if (this.editedItem.ime == null || this.editedItem.ime == "")
        sveOK = false;
      if (this.editedItem.password == null || this.editedItem.password == "")
        sveOK = false;
      if (this.editedItem.ime == null || this.editedItem.ime == "")
        sveOK = false;
      if (this.editedItem.prezime == null || this.editedItem.prezime == "")
        sveOK = false;
      if (this.editedItem.roles == null || this.editedItem.roles == "")
        sveOK = false;
      if (this.editedItem.userName == null || this.editedItem.userName == "")
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
          this.close();
        }
      }
    },
    deleteItem(item) {
      if(item == undefined)
        var item = this.editedItem
        console.log(item)
      const index = this.data.indexOf(item);
      let obj = {
        title: this.$t("administration.user.war"),
        message: this.$t("administration.user.msgDelConf"),
        customCloseBtnText: this.$t("administration.user.txtNo"),
        disableOverlayClick: true,
        useConfirmBtn: true,
        customConfirmBtnText: this.$t("administration.user.txtYes"),
        onConfirm: onConfirmWrapper,
        type: "warning",
        showXclose: true,
      };
      this.$Simplert.open(obj);
      var self = this;
      function onConfirmWrapper() {
        self.data.splice(index, 1);
        self.deleteData(item);
      }
    },
    otvordeDialog() {
      //this.editedItem.datumVreme = this.getDateTime(Date.now());
      this.new_customer = true;
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
    },
    editItem(item) {
      if(item != undefined){
        this.editedIndex = this.data.indexOf(item);
        this.editedItem = Object.assign({}, item);
      }
      this.new_customer = true;
      this.readonly = false;
      let self = this
      setTimeout(() => {
        self.podigniPopunjenePlaceholdere();
      }, 300);
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
          this.$refs['select'+i].validate()
        }

        i++;
        sviSelektovi = document.getElementById("Span-SL" + i);
      }
    },
    close() {
      debugger;
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

      const status = exportFile(
        "korisnici.csv",
        content,
        "application/vnd.ms-excel"
      );

      if (status !== true) {
        this.$q.notify({
          message: this.$t("administration.user.msgPrtSc"),
          color: "negative",
          icon: "warning",
        });
      }
    },
    proveri() {
      console.log("usla u proveri");
      debugger
      var selekt = document.getElementById('selektovi');
      if (selekt.options.length == 0)
        selekt.style.background = "red";
        else
        selekt.style.background = "blue";
    },
  },
};
</script>

<style scoped>

.q-field__label {
  font-size: 14px !important;
  color: #aaaaaa !important;
}

tbody tr:hover td #username {
  font-weight: 700 !important;
  color: #ff4b00;
}

.sakriDugmice{
  display: none;
}

</style>
