<template>
  <q-page>
    <q-card>
      <q-card-section class="column flex-center">
        <q-table
          :data="data"
          :columns="columns"
          title="List of Tenants"
          row-key="keycloakId"
          v-model:selected="selectedRow"
          selection="single"
          style="width: min(1000px, 90vw)"
        >
          <template v-slot:top-right="props">
            <q-btn
              rounded
              icon="fas fa-arrow-circle-down"
              class="q-ma-xs"
              color="green"
              label="Export CSV"
              @click="exportCSV"
            />
            <q-btn
              rounded
              class="q-ma-xs"
              icon="add"
              color="primary"
              label="Add tenant"
              @click="addEntryDialog = true"
            />
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                class="q-ma-sm"
                round
                color="primary"
                icon="edit"
                @click="editEntry(props.row)"
              />
              <q-btn
                class="q-ma-sm"
                round
                color="negative"
                icon="delete"
                @click="deleteEntry(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="addEntryDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Enter page name</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="column flex-center">
          <q-input
            :disable="selectedTenant != null"
            ref="nameRef"
            rounded
            outlined
            class="q-ma-md"
            v-model="name"
            style="min-width: 350px;"
            label="Tenant name"
            :rules="[
              val =>
                /^[a-zA-Z0-9]*$/.test(val) ||
                'Only alphanumerical characters allowed'
            ]"
          />
          <q-input
            rounded
            outlined
            class="q-ma-md"
            v-model="tokenLifespanInMinutes"
            style="min-width: 350px;"
            label="Token lifespan (min)"
            type="number"
            mask="#######"
          />
          <q-input
            rounded
            outlined
            class="q-ma-md"
            v-model="customConfiguration"
            style="min-width: 350px;"
            label="Token configuration (json)"
            type="textarea"
          />
          <q-btn
            @click="
              () => {
                selectedTenant == null ? addEntry() : editEntry1();
              }
            "
            class="q-ma-md"
            color="primary"
            :disable="!/^[a-zA-Z0-9]*$/.test(name)"
            :label="(selectedTenant == null ? 'Add' : 'Save') + ' tenant'"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      columns: [
        { name: "name", label: "Name", field: "name", align: "left" },
        {
          name: "tokenLifespanInMinutes",
          label: "Token Lifespan",
          field: "tokenLifespanInMinutes",
          align: "left"
        },
        { name: "actions", label: "Actions", field: "actions", align: "center" }
      ],
      selectedRow: null,
      selectedTenant: null,
      addEntryDialog: false,
      name: "",
      tokenLifespanInMinutes: 0,
      customConfiguration: null
    };
  },
  watch: {
    addEntryDialog: function(val) {
      if (val == false) {
        this.selectedTenant = null;
        this.name = "";
        this.tokenLifespanInMinutes = 0;
        this.customConfiguration = null;
      }
    }
  },
  methods: {
    getTenants() {
      let self = this;
      fetch("https://redstar-dev.atomdataservices.com/tenants", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.$token
        }
      })
        .then(response => response.json())
        // .then(response => {
        //   debugger
        //   self.data = response.data;
        //   console.log('Успешно tenants data:', self.data);
        //     })

        .then(data => {
          debugger;
          //window.$tenant = data[0].name;
          //self.data = data;
          self.data = data.map(e => {
            let tmp;
            try {
              tmp = JSON.parse(e.customConfiguration);
            } catch (err) {
              tmp = null; // or '' if you prefer
            }

            return {
              keycloakId: e.keycloakId,
              name: e.name,
              tokenLifespanInMinutes: e.tokenLifespanInMinutes,
              customConfiguration: tmp
            };
          });
          console.log("Успешно tenants data:", self.rows);
        })
        .catch(error => {
          //console.error('Greska u logovanju:', error);
          self.$q.notify({ message: self.$t("login.checkData"), color: "red" });
        });
    },
    getTenant(tenant) {
      let self = this;
      fetch("https://redstar-dev.atomdataservices.com/tenants/" + tenant, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.$token
        }
      })
        .then(response => response.json())
        // .then(response => {
        //   debugger
        //   self.data = response.data;
        //   console.log('Успешно tenants data:', self.data);
        //     })

        .then(data => {
          debugger;

          console.log(data);

          let tmp;
          try {
            tmp = JSON.parse(data.customConfiguration);
          } catch (err) {
            tmp = null; // or '' if you prefer
          }

          self.customConfiguration = tmp;
          self.addEntryDialog = true;
        })
        .catch(error => {
          //console.error('Greska u logovanju:', error);
          self.$q.notify({ message: self.$t("login.checkData"), color: "red" });
        });
    },
    addEntry() {
      // Logika za dodavanje novog elementa
      if (!/^[a-zA-Z0-9]*$/.test(this.name)) {
        this.$q.notify({
          message: "Only alphanumerical characters are allowed in tenant name",
          color: "negative"
        });
        return;
      }
      var self = this;

      var dataString = {
        name: this.name,
        tokenLifespanInMinutes: this.tokenLifespanInMinutes,
        customConfiguration: JSON.stringify(this.customConfiguration)
      };

      let data1 = JSON.stringify(dataString);

      debugger;
      this.$axios
        .post("https://redstar-dev.atomdataservices.com/tenants", data1, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token
          }
        })
        .then(function(response) {
          debugger;
          self.getTenants();
          self.addEntryDialog = false;
          self.$q.notify({
            message: "Tenant successfully added",
            color: "positive"
          });
          console.log(response);
        })
        .catch(function(response) {
          //handle error
          response.errors.forEach(entry => {
            self.$q.notify({
              message: "An error occurred while adding tenant",
              caption: entry.message,
              color: "negative"
            });
          });
          console.log(response);
        });
    },
    editEntry(entry) {
      this.getTenant(entry.name);
      this.selectedTenant = entry;
      this.name = entry.name;
      this.tokenLifespanInMinutes = entry.tokenLifespanInMinutes;
    },
    editEntry1() {
      // Logika za uređivanje izabranog elementa
      // Logika za dodavanje novog elementa
      if (!/^[a-zA-Z0-9]*$/.test(this.name)) {
        this.$q.notify({
          message: "Only alphanumerical characters are allowed in tenant name",
          color: "negative"
        });
        return;
      }
      var self = this;

      var dataString = {
        tokenLifespanInMinutes: this.tokenLifespanInMinutes,
        customConfiguration: JSON.stringify(this.customConfiguration)
      };

      let data1 = JSON.stringify(dataString);

      debugger;
      this.$axios
        .put(
          "https://redstar-dev.atomdataservices.com/tenants/" +
            this.selectedTenant.name,
          data1,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + window.$token
            }
          }
        )
        .then(function(response) {
          debugger;
          self.getTenants();
          self.addEntryDialog = false;
          self.$q.notify({
            message: "Tenant successfully edited",
            color: "positive"
          });
          console.log(response);
        })
        .catch(function(response) {
          //handle error
          response.errors.forEach(entry => {
            self.$q.notify({
              message: "An error occurred while editing tenant",
              caption: entry.message,
              color: "negative"
            });
          });
          console.log(response);
        });
    },
    deleteEntry(entry) {
      var self = this;

      debugger;
      this.$axios
        .delete(
          "https://redstar-dev.atomdataservices.com/tenants/" + entry.name,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + window.$token
            }
          }
        )
        .then(response => {
          debugger;
          this.getTenants();
          self.$q.notify({
            message: "Tenant successfully deleted",
            color: "positive"
          });
          console.log(response);
        })
        .catch(response => {
          //handle error
          console.log(response);
          response.errors.forEach(entry => {
            self.$q.notify({
              message: "An error occurred while deleting tenant",
              caption: entry.message,
              color: "negative"
            });
          });
        });
    },
    exportCSV() {
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

      const status = exportFile("brzina.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: self.$t("players.motorSkills.speed.browserForbids"),
          color: "negative",
          icon: "warning"
        });
      }
    }
  },
  mounted() {
    this.getTenants();
  }
};
</script>

<style scoped>
/* Stilizacija po potrebi */
</style>
