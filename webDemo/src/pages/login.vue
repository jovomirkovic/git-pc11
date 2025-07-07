<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div id="particles-js"></div>
        <div
          class="login-form"
          v-bind:class="$q.platform.is.mobile ? 'mobilniStajl' : 'webStajl'"
        >
          <div style="width: 100%;">
            <q-img
              style="width: 80%; margin: auto; margin-bottom: 50px;"
              src="../assets/pro-coach11 assets/foto/web/logo login.png"
            ></q-img>
          </div>
          <div>
            <label class="custom-field one" style="margin-top: 15px;">
              <input
                type="text"
                placeholder=" "
                v-model="username"
                :label="$t('login.username')"
                style=" background: #3b5d99; color: white;"
                :rules="[
                  val =>
                    (val !== null && val !== '') || $t('login.enterUserName')
                ]"
              />
              <span class="placeholder">{{ $t("login.username") }}</span>
            </label>

            <label class="custom-field one" style="">
              <input
                type="password"
                placeholder=" "
                v-model="password"
                :label="$t('login.password')"
                style=" background: #3b5d99; color: white;margin-top: 15px;"
                :rules="[
                  val =>
                    (val !== null && val !== '') || $t('login.enterPassword')
                ]"
                @keydown.enter.prevent="login"
              />
              <span class="placeholder">{{ $t("login.password") }}</span>
            </label>
            <!-- <q-input

                v-model="username"
                :label="$t('login.username')"
                :rules="[val => !!val || $t('login.enterUserName')]"
                style="background: #3b5d99; color: white; width: 90%; height: 40px; margin: 10px;"
              />

              <q-input
                type="password"

                v-model="password"
                :label="$t('login.password')"
                :rules="[val => !!val || $t('login.enterPassword')]"
                style="background: #3b5d99; color: white; width: 90%; height: 40px; margin: 10px;"
              /> -->

            <div>
              <q-btn
                class="dugmeNewNesto"
                :label="$t('login.login')"
                @click="login"
                type="button"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script type="text/javascript"></script>
<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "milivoje",
      password: ""
    };
  },

  methods: {
    // login() {
    //   if (this.password == 'radivoje') {
    //       //this.$q.notify("Здраво Миливоје :)")
    //       this.$router.push({ path: "dashboard" }); //idemo u program, sve je OK
    //   } else {
    //     alert("Проверите корисничко име и лозинку")
    //   }
    // }
    login() {
      if (this.password == "radivoje1") {
        this.$q.notify({
          message: self.$t("login.notAllowes"),
          color: "red"
        });
        return;
      }
      debugger;
      var userName = "RedStarAppJWT"; // app clientID
      var passWord = "ZY7kpGsYoNzl10P9"; // app clientSecret
      var bodyFormData = new FormData();
      const self = this;
      //bodyFormData.append("username", "usrpass:testRS");
      //bodyFormData.append("password", "testPass#0066");

      bodyFormData.append("username", "usrpass:" + this.username);
      bodyFormData.append("password", this.password);
      bodyFormData.append("grant_type", "password");
      bodyFormData.append("client_id", "RedStarAppJWT");

      let linkStr = this.$apiPutanja + "/oauth/token";

      axios({
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
        .then(function(response) {
          //handle success
          //console.log(response);
          debugger;

          //alert("VelkoM " + response.data.user.username);
          self.tolkin = response.data.access_token;
          window.$token = response.data.access_token;
          window.$userID = response.data.user.id;
          window.$userName = response.data.user.firstName;
          window.$userFullName =
            response.data.user.firstName + " " + response.data.user.lastName;
          //console.log("this.token : " + self.$token)
          //window.location.href = '/Index';
          //self.$router.push({ path: "/index" });

          //debugger
          window.$userIsAdmin = false;

          self.$router.push({ name: "administracija" });
          //self.$router.push({ name: "dashboard1"});
          //router.go("/index")
        })
        .catch(function(response) {
          //handle error
          //console.log(response);
          //alert(response);
          self.$q.notify({
            message: self.$t("login.checkData"),
            color: "red"
          });
        });
    }
  },
  mounted() {}
};
</script>

<style scoped>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  /* background: linear-gradient(145deg, rgb(74, 94, 137) 15%, #b61924 70%); */
  background-image: url("../assets/pro-coach11 assets/foto/web/login foto1x.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}

.login-form {
  /* position: absolute;
    box-shadow: 10px 10px 5px 0px rgb(0 0 0 / 75%);
    border-radius: 44px 44px 52px 0px;
    border: 0px solid #000000; */

  text-align: center;
}

.mobilniStajl {
  width: 80%;
}

.webStajl {
  width: 25%;
  position: absolute;
  left: 8%;
  background: unset;
}

.dugmeNewNesto {
  background-color: #ff4b00;
  color: white;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  margin-top: 50px;
}

.custom-field {
  position: relative;
  font-size: 14px;
  /* border-top: 20px solid transparent; */
  margin-bottom: 5px;
  --field-padding: 12px;
}

.custom-field input {
  border: none;
  -webkit-appearance: none;
  -ms-appearance: none;
  -moz-appearance: none;
  /* appearance: none; */
  background: #f2f2f2;
  padding: var(--field-padding);
  border-radius: 5px;
  width: 100%;
  outline: none;
  font-size: 14px;
}

.custom-field .placeholder {
  position: absolute;
  left: var(--field-padding);
  width: calc(100% - (var(--field-padding) * 2));
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* top: 22px; */
  top: 7px;
  text-align: left;
  line-height: 100%;
  transform: translateY(-50%);
  color: #aaa;
  transition: top 0.3s ease, color 0.3s ease, font-size 0.3s ease;
}

.custom-field input.dirty + .placeholder,
.custom-field input:focus + .placeholder,
.custom-field input:not(:placeholder-shown) + .placeholder {
  top: -10px;
  font-size: 12px;
  color: #222;
}

.custom-field .error-message {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 12px;
  background: #d30909;
  color: #fff;
  height: 24px;
}

.custom-field .error-message:empty {
  opacity: 0;
}

/* ONE */
.custom-field.one input {
  background: #f5f8fb;
  /* background: #f5f8fb; */
  /* border: 2px solid #ddd; */
  transition: border-color 0.3s ease;
}

.custom-field.one input + .placeholder {
  left: 8px;
  padding: 0 5px;
}

.custom-field.one input.dirty,
.custom-field.one input:not(:placeholder-shown),
.custom-field.one input:focus {
  border: 2px solid #3b5d99;
  background: none;
  /* transition-delay: 0.1s */
}

.custom-field.one input.dirty + .placeholder,
.custom-field.one input:not(:placeholder-shown) + .placeholder,
.custom-field.one input:focus + .placeholder {
  top: -8px;
  font-size: 12px;
  color: #222;
  background: unset;
  /* background: #fff; */
  width: auto;
}

/* TWO */
.custom-field.two input {
  border-radius: 0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background: linear-gradient(90deg, #222, #222) center bottom/0 0.15em
      no-repeat,
    linear-gradient(90deg, #ccc, #ccc) left bottom/100% 0.15em no-repeat,
    linear-gradient(90deg, #fafafa, #fafafa) left bottom/100% no-repeat;
  transition: background-size 0.3s ease;
}

.custom-field.two input.dirty,
.custom-field.two input:not(:placeholder-shown),
.custom-field.two input:focus {
  background-size: 100% 0.15em, 100% 0.1em, 100%;
}
</style>
