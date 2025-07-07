<template>
  <q-page class="q-pa-sm">
    <trening :selektovaniIgrac="selektovaniIgrac"></trening>
  </q-page>
      
</template>

<script>

import trening from "../components/treningKomponenta"
export default {
  components: {
    trening,
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
