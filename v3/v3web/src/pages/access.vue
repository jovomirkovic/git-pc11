<template>
  <q-page padding style="height: 90vh; overflow: auto">
    <!-- Add Entry Button -->

    <q-btn
      rounded
      icon="fas fa-arrow-circle-up"
      class="q-ma-xs"
      color="teal"
      label="Import from JSON"
      @click="importDialog = true"
    />
    <q-btn
      rounded
      icon="fas fa-arrow-circle-down"
      class="q-ma-xs"
      color="green"
      label="Export JSON"
      @click="exportJSON"
    />
    <q-btn
      rounded
      class="q-ma-xs"
      icon="add"
      color="primary"
      label="Add new page"
      @click="dialogVisible = true"
    />

    <!-- No Data Message -->
    <div v-if="!entries.length" class="text-subtitle1 text-grey text-center">
      No data available.
    </div>

    <!-- Tree View -->
    <q-card class="q-pa-md" v-if="entries.length">
      <q-card-section>
        <div class="text-h6 q-mb-md">Entry Tree</div>
        <div>
          <tree-node
            style="border-bottom: 1px solid #e1e1e1"
            v-for="entry in rootEntries"
            :key="entry.id"
            :entry="entry"
            :all-entries="entries"
            @edit="editEntry"
            @delete="deleteEntry"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Entry Dialog -->
    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="width: min(800px, 90vw)">
        <q-card-section>
          <div class="text-h6">
            {{ editingId ? "Edit Entry" : "New Entry" }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="submitForm" class="q-gutter-md">
            <q-input v-model="form.key" label="Key" dense />
            <q-input v-model="form.label" label="Label" dense />

            <q-input
              v-if="form.type === 'page'"
              v-model="form.to"
              label="Route (to)"
              dense
            />

            <q-input v-model="form.icon" label="Icon filename" dense />

            <q-select
              v-model="form.type"
              :options="['page', 'component']"
              label="Type"
              emit-value
              map-options
              dense
            />

            <q-select
              v-model="form.parentId"
              :options="parentOptions"
              option-label="label"
              option-value="id"
              emit-value
              label="Parent"
              dense
              clearable
              :rules="[
                (val) =>
                  form.type === 'component'
                    ? !!val || 'Component must have a parent'
                    : true,
              ]"
            />

            <div>
              <div class="text-subtitle2 q-mb-sm">Roles</div>
              <q-option-group
                v-model="form.roles"
                :options="roleOptions"
                option-label="label"
                option-value="value"
                type="checkbox"
                dense
              />
            </div>

            <q-card-actions align="right">
              <q-btn flat label="Cancel" @click="closeDialog" />
              <q-btn label="Save" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="importDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Import menu items from JSON</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="column flex-center">
          <span class="text-weight-bold q-ma-md" style="width: 350px">
            <span class="text-red">IMPORTANT NOTE:</span> The import will
            overwrite the current menu items</span
          >
          <q-input
            rounded
            outlined
            type="textarea"
            class="q-ma-md"
            v-model="menuItemsJSONString"
            style="min-width: 350px"
            label="Menu Item JSON"
          />

          <q-btn
            rounded
            icon="fas fa-arrow-circle-up"
            class="q-ma-xs"
            color="teal"
            label="Import"
            @click="importFromJSON"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { date, exportFile } from "quasar";
import TreeNode from "components/TreeNode.vue";

export default {
  name: "EntryManager",
  components: {
    TreeNode,
  },
  data() {
    return {
      dialogVisible: false,
      editingId: null,
      form: {
        key: "",
        label: "",
        to: "",
        icon: "",
        roles: [],
        type: "page",
        parentId: null,
      },
      entries: [
        {
          id: "dashboard",
          type: "page",
          key: "dashboard",
          label: "main.dashboard",
          to: "/dashboard",
          roles: ["direktor"],
          parentId: null,
          icon: "Administration.svg",
        },
        {
          id: "dashboard1",
          type: "page",
          key: "dashboard1",
          label: "main.dashboard1",
          to: "/dashboard1",
          roles: [
            "sys_admin",
            "pomocni_trener",
            "physiotherapist",
            "admin",
            "administrator",
          ],
          parentId: null,
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "administracija",
          type: "page",
          key: "administracija",
          label: "main.administracija",
          to: "/administracija",
          roles: ["sys_admin", "admin", "administrator"],
          parentId: null,
          icon: "Administration.svg",
          children: [
            {
              id: "1746989654609",
              key: "Users",
              label: "users",
              to: "",
              icon: "Administration.svg",
              roles: ["admin", "role_skaut", "sys_admin"],
              type: "component",
              parentId: "administracija",
              children: [],
            },
            {
              id: "1746989654610",
              key: "roles",
              label: "roles",
              to: "",
              icon: "Administration.svg",
              roles: ["role_skaut", "admin"],
              type: "component",
              parentId: "administracija",
              children: [],
            },
            {
              id: "1746989654611",
              key: "teams",
              label: "teams",
              to: "",
              icon: "Administration.svg",
              roles: ["role_skaut", "admin"],
              type: "component",
              parentId: "administracija",
              children: [],
            },
            {
              id: "1746989654612",
              key: "professionalStaff",
              label: "professionalStaff",
              to: "",
              icon: "Administration.svg",
              roles: ["role_skaut", "admin"],
              type: "component",
              parentId: "administracija",
              children: [],
            },
            {
              id: "1746989654613",
              key: "playersLabel",
              label: "playersLabel",
              to: "",
              icon: "Administration.svg",
              roles: ["role_skaut", "admin"],
              type: "component",
              parentId: "administracija",
              children: [],
            },
            {
              id: "1746989654614",
              key: "connections",
              label: "connections",
              to: "",
              icon: "Administration.svg",
              roles: ["role_skaut", "admin"],
              type: "component",
              parentId: "administracija",
              children: [],
            },
            {
              id: "1746989654615",
              key: "elementsOfTheGame",
              label: "elementsOfTheGame",
              to: "",
              icon: "Administration.svg",
              roles: ["role_skaut", "admin"],
              type: "component",
              parentId: "administracija",
              children: [],
            },
            {
              id: "1746989654616",
              key: "technique",
              label: "technique",
              to: "",
              icon: "Administration.svg",
              roles: ["role_skaut", "admin"],
              type: "component",
              parentId: "administracija",
              children: [],
            },
            {
              id: "1746989654617",
              key: "tactics",
              label: "tactics",
              to: "",
              icon: "Administration.svg",
              roles: ["role_skaut", "admin"],
              type: "component",
              parentId: "administracija",
              children: [],
            },
            {
              id: "1746989654618",
              key: "principlesOfTheGame",
              label: "principlesOfTheGame",
              to: "",
              icon: "Administration.svg",
              roles: ["role_skaut", "admin"],
              type: "component",
              parentId: "administracija",
              children: [],
            },
            {
              id: "1746989654619",
              key: "testData",
              label: "testData",
              to: "",
              icon: "Administration.svg",
              roles: ["role_skaut", "admin"],
              type: "component",
              parentId: "administracija",
              children: [],
            },
          ],
        },
        {
          id: "treninzi",
          type: "page",
          key: "treninzi",
          label: "main.treninzi",
          to: "/treninzi",
          roles: ["role_lekar", "administrator", "admin"],
          parentId: null,
          icon: "Trainings.svg",
          children: [],
        },
        {
          id: "trenezneVezbe",
          type: "page",
          key: "trenezneVezbe",
          label: "main.trenezneVezbe",
          to: "/trenezneVezbe",
          roles: ["physiotherapist", "administrator", "role_skaut", "admin"],
          parentId: null,
          icon: "Training excersizes.svg",
          children: [],
        },
        {
          id: "utakmice",
          type: "page",
          key: "utakmice",
          label: "main.utakmice",
          to: "/utakmice",
          roles: ["administrator", "role_skaut", "admin"],
          parentId: null,
          icon: "Matches.svg",
          children: [],
        },
        {
          id: "podaciOIgri",
          type: "page",
          key: "podaciOIgri",
          label: "main.podaciOIgri",
          to: "/podaciOIgri",
          roles: ["administrator", "admin"],
          parentId: null,
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "catapult",
          type: "page",
          key: "catapult",
          label: "main.catapult",
          to: "/catapult",
          roles: ["administrator", "admin"],
          parentId: null,
          icon: "Catapult.svg",
          children: [],
        },
        {
          id: "taktickiElementi",
          type: "page",
          key: "taktickiElementi",
          label: "main.taktickiElementi",
          to: "/taktickiElementi",
          roles: ["administrator", "role_skaut", "admin"],
          parentId: null,
          icon: "Tactical elements.svg",
          children: [],
        },
        {
          id: "tehnickiElementi",
          type: "page",
          key: "tehnickiElementi",
          label: "main.tehnickiElementi",
          to: "/tehnickiElementi",
          roles: ["administrator", "role_skaut", "admin"],
          parentId: null,
          icon: "Technical elements.svg",
          children: [],
        },
        {
          id: "principiIgre",
          type: "page",
          key: "principiIgre",
          label: "main.principiIgre",
          to: "/principiIgre",
          roles: ["administrator", "admin"],
          parentId: null,
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "medicinskiKarton",
          type: "page",
          key: "medicinskiKarton",
          label: "main.medicinskiKarton",
          to: "/igraci/medicinskiKarton",
          roles: ["administrator", "admin"],
          parentId: "igraci",
          icon: "Medical record.svg",
          children: [],
        },
        {
          id: "povredeIgraca",
          type: "page",
          key: "povredeIgraca",
          label: "main.povredeIgraca",
          to: "/igraci/povredeIgraca",
          roles: ["administrator", "admin", "direktor"],
          parentId: "igraci",
          icon: "Player injuries.svg",
          children: [],
        },
        {
          id: "strucniTim",
          type: "page",
          key: "strucniTim",
          label: "main.strucniTim",
          to: "/strucniTim",
          roles: ["administrator", "admin"],
          parentId: null,
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "igraci",
          type: "page",
          key: "igraci",
          label: "main.igraci",
          to: "/igraci",
          roles: ["administrator", "admin", "direktor"],
          parentId: null,
          icon: "Administration.svg",
          children: [
            {
              id: "medicinskiKarton",
              type: "page",
              key: "medicinskiKarton",
              label: "main.medicinskiKarton",
              to: "/igraci/medicinskiKarton",
              roles: ["administrator", "admin"],
              parentId: "igraci",
              icon: "Medical record.svg",
              children: [],
            },
            {
              id: "povredeIgraca",
              type: "page",
              key: "povredeIgraca",
              label: "main.povredeIgraca",
              to: "/igraci/povredeIgraca",
              roles: ["administrator", "admin", "direktor"],
              parentId: "igraci",
              icon: "Player injuries.svg",
              children: [],
            },
            {
              id: "1746989654620",
              type: "component",
              key: "sportTrails",
              label: "sportTrails",
              to: "",
              roles: ["admin"],
              parentId: "igraci",
              icon: "Administration.svg",
              children: [],
            },
            {
              id: "1746989654621",
              type: "component",
              key: "playerRating",
              label: "playerRating",
              to: "",
              roles: ["admin", "direktor"],
              parentId: "igraci",
              icon: "Administration.svg",
              children: [],
            },
            {
              id: "1746989654622",
              type: "component",
              key: "morphologicalCharacteristic",
              label: "morphologicalCharacteristic",
              to: "",
              roles: ["administrator", "admin"],
              parentId: "igraci",
              icon: "Administration.svg",
              children: [],
            },
            {
              id: "1746989654623",
              type: "component",
              key: "motorSkills",
              label: "motorSkills",
              to: "",
              roles: ["administrator", "admin"],
              parentId: "igraci",
              icon: "Administration.svg",
              children: [],
            },
            {
              id: "1746989654624",
              type: "component",
              key: "functionalData",
              label: "functionalData",
              to: "",
              roles: ["administrator", "admin"],
              parentId: "igraci",
              icon: "Administration.svg",
              children: [],
            },
            {
              id: "1746989654625",
              type: "component",
              key: "psychologicalProfile",
              label: "psychologicalProfile",
              to: "",
              roles: ["administrator", "admin"],
              parentId: "igraci",
              icon: "Administration.svg",
              children: [],
            },
            {
              id: "1746989654626",
              type: "component",
              key: "intelligence",
              label: "intelligence",
              to: "",
              roles: ["administrator", "admin"],
              parentId: "igraci",
              icon: "Administration.svg",
              children: [],
            },
            {
              id: "1746989654627",
              type: "component",
              key: "socialCapital",
              label: "socialCapital",
              to: "",
              roles: ["administrator", "admin"],
              parentId: "igraci",
              icon: "Administration.svg",
              children: [],
            },
            {
              id: "1746989654628",
              type: "component",
              key: "finance",
              label: "finance",
              to: "",
              roles: ["administrator", "admin"],
              parentId: "igraci",
              icon: "Administration.svg",
              children: [],
            },
            {
              id: "1746989654629",
              type: "component",
              key: "guardianAngel",
              label: "guardianAngel",
              to: "",
              roles: ["administrator", "admin"],
              parentId: "igraci",
              icon: "Administration.svg",
              children: [],
            },
          ],
        },
        {
          id: "1746989654620",
          type: "component",
          key: "sportTrails",
          label: "sportTrails",
          to: "",
          roles: ["admin"],
          parentId: "igraci",
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "1746989654621",
          type: "component",
          key: "playerRating",
          label: "playerRating",
          to: "",
          roles: ["admin", "direktor"],
          parentId: "igraci",
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "1746989654622",
          type: "component",
          key: "morphologicalCharacteristic",
          label: "morphologicalCharacteristic",
          to: "",
          roles: ["administrator", "admin"],
          parentId: "igraci",
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "1746989654623",
          type: "component",
          key: "motorSkills",
          label: "motorSkills",
          to: "",
          roles: ["administrator", "admin"],
          parentId: "igraci",
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "1746989654624",
          type: "component",
          key: "functionalData",
          label: "functionalData",
          to: "",
          roles: ["administrator", "admin"],
          parentId: "igraci",
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "1746989654625",
          type: "component",
          key: "psychologicalProfile",
          label: "psychologicalProfile",
          to: "",
          roles: ["administrator", "admin"],
          parentId: "igraci",
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "1746989654626",
          type: "component",
          key: "intelligence",
          label: "intelligence",
          to: "",
          roles: ["administrator", "admin"],
          parentId: "igraci",
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "1746989654627",
          type: "component",
          key: "socialCapital",
          label: "socialCapital",
          to: "",
          roles: ["administrator", "admin"],
          parentId: "igraci",
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "1746989654628",
          type: "component",
          key: "finance",
          label: "finance",
          to: "",
          roles: ["administrator", "admin"],
          parentId: "igraci",
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "1746989654629",
          type: "component",
          key: "guardianAngel",
          label: "guardianAngel",
          to: "",
          roles: ["administrator", "admin"],
          parentId: "igraci",
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "test",
          type: "page",
          key: "test",
          label: "main.test",
          to: "/test",
          roles: ["pomocni_trener"],
          parentId: null,
          icon: "Administration.svg",
        },
        {
          id: "access",
          type: "page",
          key: "access",
          label: "main.access",
          to: "/access",
          roles: ["sys_Admin", "sys_admin", "administrator", "admin"],
          parentId: null,
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "tenanti",
          type: "page",
          key: "tenanti",
          label: "main.tenanti",
          to: "/tenanti",
          roles: ["sys_admin", "administrator", "admin"],
          parentId: null,
          icon: "Administration.svg",
          children: [],
        },
        {
          id: "1746989654609",
          key: "Users",
          label: "users",
          to: "",
          icon: "Administration.svg",
          roles: ["admin", "role_skaut", "sys_admin"],
          type: "component",
          parentId: "administracija",
          children: [],
        },
        {
          id: "1746989654610",
          key: "roles",
          label: "roles",
          to: "",
          icon: "Administration.svg",
          roles: ["role_skaut", "admin"],
          type: "component",
          parentId: "administracija",
          children: [],
        },
        {
          id: "1746989654611",
          key: "teams",
          label: "teams",
          to: "",
          icon: "Administration.svg",
          roles: ["role_skaut", "admin"],
          type: "component",
          parentId: "administracija",
          children: [],
        },
        {
          id: "1746989654612",
          key: "professionalStaff",
          label: "professionalStaff",
          to: "",
          icon: "Administration.svg",
          roles: ["role_skaut", "admin"],
          type: "component",
          parentId: "administracija",
          children: [],
        },
        {
          id: "1746989654613",
          key: "playersLabel",
          label: "playersLabel",
          to: "",
          icon: "Administration.svg",
          roles: ["role_skaut", "admin"],
          type: "component",
          parentId: "administracija",
          children: [],
        },
        {
          id: "1746989654614",
          key: "connections",
          label: "connections",
          to: "",
          icon: "Administration.svg",
          roles: ["role_skaut", "admin"],
          type: "component",
          parentId: "administracija",
          children: [],
        },
        {
          id: "1746989654615",
          key: "elementsOfTheGame",
          label: "elementsOfTheGame",
          to: "",
          icon: "Administration.svg",
          roles: ["role_skaut", "admin"],
          type: "component",
          parentId: "administracija",
          children: [],
        },
        {
          id: "1746989654616",
          key: "technique",
          label: "technique",
          to: "",
          icon: "Administration.svg",
          roles: ["role_skaut", "admin"],
          type: "component",
          parentId: "administracija",
          children: [],
        },
        {
          id: "1746989654617",
          key: "tactics",
          label: "tactics",
          to: "",
          icon: "Administration.svg",
          roles: ["role_skaut", "admin"],
          type: "component",
          parentId: "administracija",
          children: [],
        },
        {
          id: "1746989654618",
          key: "principlesOfTheGame",
          label: "principlesOfTheGame",
          to: "",
          icon: "Administration.svg",
          roles: ["role_skaut", "admin"],
          type: "component",
          parentId: "administracija",
          children: [],
        },
        {
          id: "1746989654619",
          key: "testData",
          label: "testData",
          to: "",
          icon: "Administration.svg",
          roles: ["role_skaut", "admin"],
          type: "component",
          parentId: "administracija",
          children: [],
        },
        {
          id: "1746991818919",
          key: "nepostojecaStranica",
          label: "nepostojecaStranica",
          to: "nepostojecaStranica",
          icon: "Administration.svg",
          roles: [],
          type: "page",
          parentId: null,
        },
      ],
      importDialog: false,
      menuItemsJSONString: "",
      roleOptions: [],
    };
  },
  created() {
    console.log("Component created - initializing data");
    this.meni();
    this.getRoles();
  },
  computed: {
    rootEntries() {
      return this.entries.filter((e) => !e.parentId && e.id); // ensure id exists
    },
    parentOptions() {
      return this.entries.filter(
        (e) => e.type === "page" && (!this.editingId || e.id !== this.editingId)
      );
    },
  },
  methods: {
    importFromJSON() {
      try {
        let tmpMenu = JSON.parse(this.menuItemsJSONString);

        tmpMenu.forEach((entry, index) => {
          tmpMenu[index].roles = entry.roles.filter(
            (e) => !e.toLowerCase().includes("sys_admin")
          );
        });

        this.entries = tmpMenu;

        this.$q.notify({
          message: "JSON successfully imported",
          color: "positive",
        });
        this.importDialog = false;
        this.saveRoles();
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        this.$q.notify({
          message: "JSON is invalid",
          color: "negative",
        });
        return; // or you can return an empty object {}
      }
    },
    exportJSON() {
      this.entries.forEach((entry, index) => {
        this.entries[index].roles = entry.roles.filter(
          (e) => !e.toLowerCase().includes("sys_admin")
        );
      });
      const jsonString = JSON.stringify(this.entries, null, 2);

      // This format ensures filenames remain chronologically sortable by name
      exportFile(
        "Menu Structure (" +
          window.$tenant +
          ") " +
          date.formatDate(Date.now(), "YYYY_MM_DD HH_mm") +
          ".json",
        jsonString,
        "application/json"
      );
    },
    submitForm() {
      // Enforce component parent requirement
      if (this.form.type === "component" && !this.form.parentId) {
        this.$q.notify({
          type: "negative",
          message: "Component must have a parent.",
        });
        return;
      }

      // Prevent path for components
      if (this.form.type === "component") {
        this.form.to = "";
      }

      if (this.editingId) {
        const index = this.entries.findIndex((e) => e.id === this.editingId);
        if (index !== -1) {
          this.entries.splice(index, 1, {
            id: this.editingId,
            ...this.form,
          });
        }
      } else {
        this.entries.push({
          id: String(Date.now()),
          ...this.form,
        });
      }

      this.saveRoles();
      this.closeDialog();
    },
    editEntry(entry) {
      this.editingId = entry.id;
      this.form = { ...entry, roles: [...entry.roles] };
      this.dialogVisible = true;
    },
    deleteEntry(id) {
      console.log("delete");
      console.log("delete");
      this.entries = this.entries.filter((e) => e.id !== id);
      console.log("delete");
      console.log("delete");
      this.saveRoles();
      if (this.editingId === id) this.resetForm();
    },
    closeDialog() {
      this.dialogVisible = false;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        key: "",
        label: "",
        to: "",
        icon: "",
        roles: [],
        type: "page",
        parentId: null,
      };
      this.editingId = null;
    },
    automaticBackup(newElement) {
      if (newElement == undefined) return;
      const menuBackupString = localStorage.getItem("menuBackup");

      let menuBackup = [];
      if (menuBackupString != null && menuBackupString != undefined)
        menuBackup = JSON.parse(menuBackupString);

      // Add the current datetime as a timestamp to the new element
      const backupWithDatetime = {
        element: newElement,
        timestamp: new Date().toISOString(), // Save the current date and time in ISO format
      };

      menuBackup.push(backupWithDatetime); // Add new element to the end

      // We can have up to 10 automatic backups
      if (menuBackup.length > 10) {
        menuBackup.shift(); // Remove the first element if array exceeds 10 items
      }

      localStorage.setItem("menuBackup", JSON.stringify(menuBackup));
    },
    meni() {
      console.log("Fetching menu items...");
      fetch(
        "https://redstar-dev.atomdataservices.com/ui-access-user-kc/for-user",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Успешно meni:", data);
          //vazno!!!
          //kad se doda novi meni u menuItems, treba ovo komentarisati, da se ne ucitava iz baze
          //onda snimiti, pa odkomentarisati

          if (Object.keys(data.keyValue).length === 0) this.entries = [];
          //JSON.stringify(data.keyValue);
          else this.entries = data.keyValue; //JSON.stringify(data.keyValue);

          if (this.entries.length === 0) {
            debugger;
            this.entries = this.$router.options.routes
              .filter((e) => e.name == "basePath")[0]
              .children.map((e) => {
                return {
                  key: e.name,
                  label: "main." + e.name,
                  to: e.path,
                  icon: e.meta.icon,
                  roles: e.name == "access" ? ["sys_Admin", "sys_admin"] : [],
                };
              });
            console.log("this.entries");
            console.log(this.entries);
          }

          // Automatically save menu items in local storage
          this.automaticBackup(this.entries);
        })
        .catch((error) => console.error("Грешка meni:", error));
    },
    getRoles() {
      console.log("Fetching roles...");
      fetch("https://redstar-dev.atomdataservices.com/roles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.$token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.roleOptions = data
            .map((item) => {
              return { label: item.uloga, value: item.uloga.toLowerCase() };
            })
            .filter((e) => e.value != "sys_admin");
          console.log("Успешно role:", this.roleOptions);
          //this.roleOptions = ['pomocni_trener', 'role_trener', 'role_trener_golmana', 'role_kondicioni_trener', 'physiotherapist', 'storage-operator', 'role_psiholog', 'role_koordinator', 'role_lekar', 'administrator', 'user', 'role_igrac', 'admin', 'info', 'sys_admin', 'direktor', 'role_analiticar', 'role_skaut']
        })
        .catch((error) => console.error("Грешка role:", error));
    },
    updateRole(row, roleName) {
      console.log(
        `updateRole triggered for Page: ${row.name}, Role: ${roleName}, Current Value: ${row[roleName]}`
      );
      const roleIndex = this.entries.findIndex((item) => item.key === row.key);
      if (roleIndex === -1) {
        console.error("Row not found in entries");
        return;
      }
      if (row[roleName]) {
        if (!this.entries[roleIndex].roles.includes(roleName.toLowerCase())) {
          this.entries[roleIndex].roles.push(roleName.toLowerCase());
        }
      } else {
        const rolePos = this.entries[roleIndex].roles.indexOf(
          roleName.toLowerCase()
        );
        if (rolePos !== -1) {
          this.entries[roleIndex].roles.splice(rolePos, 1);
        }
      }
      console.log("Updated entries:", JSON.stringify(this.entries, null, 2));
    },
    saveRoles() {
      console.log("Saving roles...");

      // Deep clone entries so we don't mutate original directly
      let clonedEntries = JSON.parse(JSON.stringify(this.entries));

      // Recursive helper to update roles up the parent chain
      const propagateRolesUp = (entry, allEntries) => {
        if (entry.parentId) {
          const parent = allEntries.find((e) => e.id === entry.parentId);
          if (parent) {
            // Merge roles into parent
            parent.roles = Array.from(
              new Set([...(parent.roles || []), ...(entry.roles || [])])
            );

            // Recursively continue up the chain
            propagateRolesUp(parent, allEntries);
          }
        }
      };

      // Remove sys_admin roles (case-insensitive)
      const cleanRoles = (roles) =>
        (roles || []).filter((r) => r.toLowerCase() !== "sys_admin");

      // Process all entries
      clonedEntries.forEach((entry) => {
        entry.roles = cleanRoles(entry.roles);
        propagateRolesUp(entry, clonedEntries);
      });

      // Remove the "tenanti" page based on id, type, and key
      clonedEntries = clonedEntries.filter(
        (e) => !(e.id === "tenanti" && e.type === "page" && e.key === "tenanti")
      );
      clonedEntries.push({
        id: "tenanti",
        type: "page",
        key: "tenanti",
        label: "main.tenanti",
        to: "/tenanti",
        hidden: true,
        roles: ["sys_admin"],
        parentId: null,
        icon: "Administration.svg",
        children: [],
      });

      fetch("https://redstar-dev.atomdataservices.com/ui-access-user-kc", {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + $token,
        },
        body: JSON.stringify({
          tenantName: window.$tenant,
          keyValue: clonedEntries,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.meni();
          this.$emit("update-meni", clonedEntries);
          this.$q.notify({
            message: "Saved",
            color: "green",
          });
          console.log("MeniPut: ", JSON.stringify(data));
        })
        .catch((error) => console.error("Грешка MeniPut:", error));
    },
  },
};
</script>
