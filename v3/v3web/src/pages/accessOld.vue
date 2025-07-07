<template>
  <div class="q-pa-none q-ma-none full-width">
    <q-table
      title="Pages and Roles"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
    >
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <div v-if="props.col.name === 'name'">
            {{ props.row.name }}
          </div>
          <div v-else>
            <q-checkbox
              v-model="props.row[props.col.name]"
              @input="updateRole(props.row, props.col.name)"
            />
          </div>
        </q-td>
      </template>
    </q-table>
    <q-btn @click="saveRoles" color="primary">Save</q-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { key: "administracija", label: "main.administration", to: "/administracija", icon: "Administration.svg", roles: ["admin"] },
        { key: "trenazneVezbe", label: "main.trainingExercises", to: "/trenezneVezbe", icon: "Training excersizes.svg", roles: ["admin"] },
        { key: "treninzi", label: "main.trainings", to: "/treninzi", icon: "Trainings.svg", roles: ["coach"] },
        { key: "utakmice", label: "main.matches", to: "/utakmice", icon: "Matches.svg", roles: ["admin", "coach"] },
        { key: "catapult", label: "main.catapult", to: "/catapult", icon: "Catapult.svg", roles: ["admin"], disabled: true },
        { key: "tehnickiElementi", label: "main.technicalElements", to: "/tehnickiElementi", icon: "Technical elements.svg", roles: ["coach"] },
        { key: "taktickiElementi", label: "main.tacticalElements", to: "/taktickiElementi", icon: "Tactical elements.svg", roles: ["coach"] },
        { key: "igraci", label: "main.players", to: "/igraci", icon: "Players.svg", roles: ["admin", "coach"] },
        { key: "medicinskiKarton", label: "main.medicalRecord", to: "/medicinskiKarton", icon: "Medical record.svg", roles: ["medic"] },
        { key: "povredeIgraca", label: "main.playerInjuries", to: "/povredeIgraca", icon: "Player injuries.svg", roles: ["medic", "coach"] },
        { key: "strucniTim", label: "main.coachingStaff", to: "/strucniTim", icon: "Administration.svg", roles: ["coach"] },
        { key: "access", label: "main.access", to: "/access", icon: "Administration.svg", roles: ["sys_Admin"] }

    ],
      pagination: {
        rowsPerPage: 20
      },
      allRoles:  ["admin", "coach", "medic", "sysAdmin"],
    };
  },
  created() {
    console.log("Component created - initializing data");
    this.meni();
    this.getRoles();
  },
  computed: {
    columns() {
      return [
        { name: "name", label: "Page", required: true, align: "left", field: row => row.name, sortable: true },
        ...this.allRoles.map(role => ({
          name: role.charAt(0).toLowerCase() + role.slice(1),
          label: role.charAt(0).toLowerCase() + role.slice(1),
          required: true,
          align: "center",
          field: role.charAt(0).toLowerCase() + role.slice(1),
        }))
      ];
    },
    data() {
      const processedData = this.menuItems.map((item, index) => {
        const roles = this.allRoles.reduce((acc, role) => {
          acc[role.charAt(0).toLowerCase() + role.slice(1)] = item.roles.includes(role);
          return acc;
        }, {});

        return {
          id: index + 1,
          name: this.$t(item.label),
          ...roles,
          key: item.key
        };
      });
      //console.log("Computed data:", JSON.stringify(processedData, null, 2));
      return processedData;
    }
  },
  methods: {
    meni() {
      console.log("Fetching menu items...");
      fetch('https://redstar-dev.atomdataservices.com/ui-access-user-kc/for-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + window.$token
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('Успешно meni:', data);
        //vazno!!!
        //kad se doda novi meni u menuItems, treba ovo komentarisati, da se ne ucitava iz baze
        //onda snimiti, pa odkomentarisati
        this.menuItems = data.keyValue;
      })
      .catch(error => console.error('Грешка meni:', error));
    },
    getRoles() {
      console.log("Fetching roles...");
      fetch('https://redstar-dev.atomdataservices.com/roles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + window.$token
        }
      })
      .then(response => response.json())
      .then(data => {

        this.allRoles = data.map(item => item.uloga.toLowerCase());
        console.log('Успешно role:', this.allRoles);
        //this.allRoles = ['pomocni_trener', 'role_trener', 'role_trener_golmana', 'role_kondicioni_trener', 'physiotherapist', 'storage-operator', 'role_psiholog', 'role_koordinator', 'role_lekar', 'administrator', 'user', 'role_igrac', 'admin', 'info', 'sys_admin', 'direktor', 'role_analiticar', 'role_skaut']
    })
      .catch(error => console.error('Грешка role:', error));
    },
    updateRole(row, roleName) {
      console.log(`updateRole triggered for Page: ${row.name}, Role: ${roleName}, Current Value: ${row[roleName]}`);
      const roleIndex = this.menuItems.findIndex(item => item.key === row.key);
      if (roleIndex === -1) {
        console.error("Row not found in menuItems");
        return;
      }
      if (row[roleName]) {
        if (!this.menuItems[roleIndex].roles.includes(roleName.toLowerCase())) {
          this.menuItems[roleIndex].roles.push(roleName.toLowerCase());
        }
      } else {
        const rolePos = this.menuItems[roleIndex].roles.indexOf(roleName.toLowerCase());
        if (rolePos !== -1) {
          this.menuItems[roleIndex].roles.splice(rolePos, 1);
        }
      }
      console.log("Updated menuItems:", JSON.stringify(this.menuItems, null, 2));
    },
    saveRoles() {
      console.log("Saving roles...");
      //console.log("Final menuItems:", JSON.stringify(this.menuItems, null, 2));
      fetch('https://redstar-dev.atomdataservices.com/ui-access-user-kc', {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + $token
        },
        body: JSON.stringify({ "tenantName": "redstar", "keyValue": this.menuItems })
      })
      .then(response => response.json())
      .then(data => {
        this.$q.notify({
          message: 'Saved',
          color: "green"
        });
        console.log("MeniPut: ", JSON.stringify(data));
      })
      .catch(error => console.error('Грешка MeniPut:', error));
    }
  }
};
</script>
