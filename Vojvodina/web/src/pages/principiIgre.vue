<template>
  <q-page class="q-pa-sm">

    <principiIgre></principiIgre>
  </q-page>
      
</template>

<script>
import principiIgre from "../components/administracija/principiIgreKomponenta"

export default {
  components: {
    principiIgre,
  },
  data() {
    return {
      tab: 'tab-0'
    };
  },
  methods: {

  }
};
</script>
