<template>
  <div class="flex flex-center column" style="height: 90vh;">
    <div class="flex items-center no-wrap column"
      style="width:100%; text-align: center; font-size: xx-large; font-weight: 200; line-height: 50%;">
      <q-img class="center q-mb-xl" :src="srcLogo" spinner-color="white" />
      <q-input style="width: 80%;" rounded class="q-mb-md" type="text" outlined id="txt_un" v-model="UserName"
        label="Korisničko ime" value="Pizon" />
      <q-input style="width: 80%;" rounded type="password" class="q-mb-xl" outlined id="txt_password" v-model="Password"
        label="Lozinka" value="P@ssw0rdSON" @keydown.enter.prevent="login" />

      <q-btn id="btn_prijava" no-caps style="font-size: 12pt; font-weight: 600; border-radius: 30px;" class="q-pa-sm "
        label="Prijavi se" color="primary" @click="login()" />
    </div>
    <!-- <div
      style="width:100%;position: fixed; bottom: 10px; margin-bottom:0px; text-align: center;"
    >
      <p
        style="text-align: center;background-color: rgba(255, 255, 255, 0.5); margin-bottom:0px;z-index: 1"
        id="copyright"
      >
        Copyright @ 2020. ФК Црвена Зведа
      </p>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
import slLogo from "../assets/img/logo.png";

export default {
  name: "Login",

  data() {
    return {
      pozdrav: "",
      loginResponse: [],
      UserName: "", // "yowo",
      Password: "", // "jovo",
      tekstAlerta: "",
      ikona: "",
      zapamtiMe: false,
      tolkin: "",
      srcLogo: slLogo,
      pratiOd: "",
      pratiDo: ""
    };
  },
  mounted() { },
  methods: {
    login() {
      debugger;
      var bodyFormData = new FormData();
      const self = this;

      bodyFormData.append("username", "usrpass:" + this.UserName);
      bodyFormData.append("password", this.Password);
      bodyFormData.append("grant_type", "password");
      bodyFormData.append("client_id", "RedStarAppJWT");

      let linkStr = this.$api.defaults.baseURL + "/oauth/token";

      this.$api({
        method: "post",
        withCredentials: false,
        url: linkStr,
        //url: 'http://51.105.117.254/oauth/authorize',
        data: bodyFormData,
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=--------------------------722259537065967260882472",
          Authorization: "Basic UmVkU3RhckFwcEpXVDpaWTdrcEdzWW9OemwxMFA5",
          Accept: "application/json"
        }
      })
        .then(function (response) {
          //handle success
          //console.log(response);
          debugger;
          console.log("response.data");
          console.log(response.data);
          console.log("response.data");
          //alert("VelkoM " + response.data.user.username);
          self.tolkin = response.data.access_token;
          // window.$token = response.data.access_token;
          // window.$userID = response.data.user.id;
          // window.$userName = response.data.user.firstName;
          //console.log("this.token : " + self.$token)
          //window.location.href = '/Index';
          //self.$router.push({ path: "/index" });
          localStorage.setItem("ajdi", response.data.user.id);
          localStorage.setItem("un", self.UserName);
          localStorage.setItem("pwd", self.Password);
          localStorage.setItem("token", response.data.access_token);

          //localStorage.setItem("t", response.data.access_token);

          //debugger
          //self.proveri();

          self.uzmiIgracInfo(response.data.user.id);
          //self.$router.push({ name: "dashboard1"});
          //router.go("/index")
        })
        .catch(function (response) {
          //handle error
          //console.log(response);
          self.$q.notify({
            message: "Proverite korisničko ime i lozinku!",
            color: "red"
          });
        });
    },

    obavestenje: function () {
      // swal({
      //     title: "ИНФО",
      //     text: this.tekstAlerta,
      //     icon: this.ikona,
      //     button: "Затвори!",
      // });
      this.$q.notify({ message: this.tekstAlerta, type: "negative" });
      // nesto
    },
    uzmiIgracInfo(id) {
      let linkStr = this.$api.defaults.baseURL + "/igraci/" + id;
      debugger;
      let self = this;
      this.$api
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + self.tolkin
          }
        })
        .then(response => {
          debugger;
          localStorage.setItem("ime", response.data[0].ime);
          localStorage.setItem("prezime", response.data[0].prezime);
          localStorage.setItem(
            "fotografija",
            response.data[0].fotografija == null
              ? ""
              : response.data[0].fotografija
          );

          debugger;
          this.$emit("share-user-data", response.data[0]);
          debugger;
        })
        .then(function () {
          //self.proveri();
          self.$router.push({ name: "start" });
        })
        .catch(e => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    }
  },
  //proveravamo da li je ukljucen autologin
  beforeMount() {
    debugger;
    try {
      if (localStorage.getItem("autologin") !== null)
        if (localStorage.getItem("autologin") === "1") {
          if (
            localStorage.getItem("pwd") !== null &&
            localStorage.getItem("un") !== null
          ) {
            this.UserName = localStorage.getItem("un");
            this.Password = localStorage.getItem("pwd");
            this.login();
            //this.$router.push({ path: "/menu/wellcome" });
            //this.$router.push({ path: "/menu/index" });
          }
        }
    } catch (e) {
      this.$q.notify(e);
    }
  }

  //components: { Simplert }
};
</script>

<style scoped>
.mobilniCss {
  width: 100%;
  height: 100vh;
  /* background-image: url("../assets/img/login.png"); */
  /* background-repeat: no-repeat;
  background-attachment: fixed;
  position: fixed;
  vertical-align: -webkit-baseline-middle; */
}

.center {
  width: 20%;
}
</style>
