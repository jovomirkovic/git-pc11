<template>
  <q-page class="q-pa-sm">

<!--     
    <q-tabs v-model="tab" style="background-color: lavender;">
      <q-tab label="Taktika" name="tab-0"> <i class="fas fa-user fa-2x"></i> </q-tab>
      <q-tab label="Оцене тактике" name="tab-1"> <i class="fas fa-users fa-2x"></i> </q-tab>
    </q-tabs>

    <q-tab-panels v-model="tab" animated style="overflow: auto; ">  
        <q-tab-panel name="tab-0">
            <h5>Поља у табели базе тактике</h5>
        </q-tab-panel>
        <q-tab-panel name="tab-1">
            <h5>Поља у табели оцене елеманата тактике</h5>
        </q-tab-panel>
    </q-tab-panels>
 -->
 
 <ocenaTaktike :selektovaniIgrac="selektovaniIgrac"></ocenaTaktike>

  </q-page>
      
</template>

<script>
import ocenaTaktike from "../components/ocenaTaktikeKomponenta"

export default {
  components: {
    ocenaTaktike,
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
