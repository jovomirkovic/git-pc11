<template>
  <q-layout>
    <q-page-container>
      <router-view @share-user-data="shareUserData" @menjaj-test="menjajTest" :userData="userData"
        :globalTest="globalTest" />
    </q-page-container>
  </q-layout>
</template>

<script>
// import { defineComponent, ref } from 'vue'
// import EssentialLink from 'components/EssentialLink.vue'
import { App as CapacitorApp } from "@capacitor/app";

export default {
  name: "MyLayout",

  data() {
    return {
      userData: {},
      globalTest: false,
    };
  },
  mounted() {
    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      const currentRoute = this.$router.currentRoute.value.path;
      console.log("globalna test");

      if (currentRoute === "/start") {
        // If the current page is the home page ('/'), exit the app
        CapacitorApp.exitApp();
      } else if (currentRoute === "/") {
        // If the current page is the home page ('/'), exit the app
        CapacitorApp.exitApp();
      } else {
        // Check if there are any dialogs open
        if (this.globalTest) {
          // Close the currently open dialog
          // Dialog.hide();
          console.log("global test 2");
          this.globalTest = false;
          console.log("kme 21");
        } else {
          // Navigate back to the home page ('/') instead of the previous page
          this.$router.push("/start");
        }
      }
    });
  },
  methods: {
    shareUserData(data) {
      console.log("mainlayout data");
      console.log(data);
      this.userData = data;
    },
    menjajTest(data) {
      this.globalTest = data;
    },
  }
};
</script>
