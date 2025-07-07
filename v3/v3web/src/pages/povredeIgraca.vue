<template>
  <q-page class="q-pa-sm">

    <povredeIgraca :selektovaniIgrac="selektovaniIgrac"></povredeIgraca>
  </q-page>
      
</template>

<script>

import povredeIgraca from "../components/povredeIgracaKomponenta"

export default {
  components: {
    povredeIgraca,
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
