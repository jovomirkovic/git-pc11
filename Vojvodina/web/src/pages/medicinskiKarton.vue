<template>
  <q-page class="q-pa-sm">

    <zdravstveniKarton :selektovaniIgrac="selektovaniIgrac"></zdravstveniKarton>
  </q-page>
      
</template>

<script>

import zdravstveniKarton from "../components/zdravstveniKartonKomponenta"

export default {
  components: {
    zdravstveniKarton,
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
