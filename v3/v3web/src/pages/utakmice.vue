<template>
  <q-page class="q-pa-sm">

    <utakmice :selektovaniIgrac="selektovaniIgrac"></utakmice>
  </q-page>
      
</template>

<script>

import utakmice from "../components/utakmiceKomponenta"

export default {
  components: {
    utakmice,
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
