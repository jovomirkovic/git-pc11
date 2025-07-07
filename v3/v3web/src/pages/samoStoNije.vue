<template>
  <q-page class="q-pa-sm">

    <q-tabs v-model="tab" style="background-color: lavender;">
      <!-- Tabs -->
      <q-tab label="Korisnici" name="tab-0"> <i class="fas fa-user fa-2x"></i> </q-tab>
      <q-tab label="Timovi" name="tab-1"> <i class="fas fa-users fa-2x"></i> </q-tab>
      <q-tab label="Igrači" name="tab-2"> <i class="fas fa-user-graduate fa-2x"></i> </q-tab>
      <q-tab label="Veze" name="tab-3"> <i class="fas fa-users-cog fa-2x"></i> </q-tab>
    </q-tabs>

    <q-tab-panels v-model="tab" animated style="overflow: auto; ">  <!-- style="overflow: auto; height: 80vh;" -->
        <q-tab-panel name="tab-0">
            <div class="fixed-center text-center">
                <p>
                <img
                    src="~assets/sad.svg"
                    style="width:30vw;max-width:150px;"
                >
                </p>
                <p class="text-faded">Čekam svoj red.. strpljivo :)</p>

            </div>
        </q-tab-panel>
    </q-tab-panels>
  </q-page>
      
</template>

<script>

export default {
  data() {
    return {
      tab: 'tab-0'
    };
  },
  methods: {

  }
};
</script>
