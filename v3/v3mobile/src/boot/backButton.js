import { App as CapacitorApp } from "@capacitor/app";
import globalState from "src/globalState"; // Import the global state
// import Vue from "vue";
console.log("window");
console.log(window);

export default async ({ app, router }) => {
  // console.log("GO BACK");
  // console.log(window);
  window.$dialogActive = false;
  // console.log(app);

  CapacitorApp.addListener("backButton", ({ canGoBack }) => {
    const currentRoute = router.currentRoute.value.path;

    // console.log("window.$dialogActive");
    // console.log(window.$dialogActive);
    // console.log("globalState.globalVariable");
    // console.log(globalState.globalVariable);
    // if (currentRoute === "/start") {
    //   // If the current page is the home page ('/'), exit the app
    //   CapacitorApp.exitApp();
    // } else if (currentRoute === "/") {
    //   // If the current page is the home page ('/'), exit the app
    //   CapacitorApp.exitApp();
    // } else {
    //   // Check if there are any dialogs open
    //   if (window.$dialogActive) {
    //     // Close the currently open dialog
    //     // Dialog.hide();
    //     window.$dialogActive = false;
    //     console.log("globalState.globalVariable - new 2");
    //     globalState.globalVariable = false;
    //     console.log("kme");
    //   } else {
    //     // Navigate back to the home page ('/') instead of the previous page
    //     router.push("/start");
    //   }
    // }
  });
};
