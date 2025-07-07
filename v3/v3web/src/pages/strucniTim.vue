<template>
  <q-page class="q-pa-sm">
    <strucniTimKomponenta></strucniTimKomponenta>
  </q-page>
      
</template>

<script>
import { exportFile } from "quasar";
import strucniTimKomponenta from "../components/administracija/strucniTimKomponenta"

export default {
components: {
    strucniTimKomponenta,
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
