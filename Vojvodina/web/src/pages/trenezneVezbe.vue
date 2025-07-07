<template>
  <q-page class="q-pa-sm">

    <trenazneVezbe></trenazneVezbe>
  </q-page>
      
</template>

<script>
import trenazneVezbe from "../components/trenazneVezbeKomponenta"
export default {
  components: {
    trenazneVezbe,
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
