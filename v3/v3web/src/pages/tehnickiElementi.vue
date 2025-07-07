<template>
  <q-page class="q-pa-sm">
<!-- 
    <q-tabs v-model="tab" style="background-color: lavender;">
      <q-tab label="Tehnika" name="tab-0"> <i class="fas fa-user fa-2x"></i> </q-tab>
      <q-tab label="Оцене техника" name="tab-1"> <i class="fas fa-users fa-2x"></i> </q-tab>
    </q-tabs>

    <q-tab-panels v-model="tab" animated style="overflow: auto; "> 
        <q-tab-panel name="tab-0">
            <h5>Поља у табели базе технике</h5>
        </q-tab-panel>
        <q-tab-panel name="tab-1">
            <h5>Поља у табели оцене технике</h5>
        </q-tab-panel>
    </q-tab-panels>
     -->

     <ocenaTehnike :selektovaniIgrac="selektovaniIgrac"></ocenaTehnike>
  </q-page>
      
</template>

<script>
import ocenaTehnike from "../components/ocenaTehnikeKomponenta"

export default {
  components: {
    ocenaTehnike,
  },
  props: ['selektovaniIgrac'],
  data() {
    return {
      tab: 'tab-0'
    };
  },
  methods: {

  }
};
</script>
