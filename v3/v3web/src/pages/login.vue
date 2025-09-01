<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div id="particles-js"></div>
        <div
          class="login-form"
          v-bind:class="$q.platform.is.mobile ? 'mobilniStajl' : 'webStajl'"
        >
          <div style="width: 100%">
            <q-img
              style="width: 80%; margin: auto; margin-bottom: 50px"
              src="../assets/pro-coach11 assets/foto/web/coklogo.png"
            ></q-img>
          </div>
          <div>
            <span v-if="listOfTenants.length == 0">
              <label class="custom-field one" style="margin-top: 15px">
                <input
                  type="text"
                  placeholder=" "
                  v-model="username"
                  :label="$t('login.username')"
                  style="background: #3b5d99; color: white"
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') || $t('login.enterUserName'),
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
                  style="background: #3b5d99; color: white; margin-top: 15px"
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') || $t('login.enterPassword'),
                  ]"
                  @keydown.enter.prevent="login"
                />
                <span class="placeholder">{{ $t("login.password") }}</span>
              </label>
            </span>
            <q-select
              v-else
              dark
              class="custom-field one"
              v-model="selectedTenant"
              :options="listOfTenants"
              :label="$t('login.selectTenant')"
              color="white"
              style="
                background: #3b5d99;
                color: white;
                padding-left: 10px;
                margin-top: 15px;
                border-radius: 5px;
              "
              @keydown.enter.prevent="loginAsTenant"
            />
            <div>
              <!-- odave krecemo, tražimo tenante -->
              <q-btn
                v-if="listOfTenants.length == 0"
                class="dugmeNewNesto"
                :label="$t('login.login')"
                @click="getTenants"
                type="button"
              />
              <q-btn
                v-else
                class="dugmeNewNesto"
                :label="$t('login.selectTenant')"
                @click="loginAsTenant"
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
      username: "test", //"milivoje",
      password: "super-ads-admin", //"radivoje"
      listOfTenants: [],
      selectedTenant: null,
    };
  },

  methods: {
    //treba da se pozove prvo tenants, pa login, pa user

    //1. tenants

    getTenants() {
      fetch(
        "https://redstar-dev.atomdataservices.com/api/auth/users/" +
          this.username +
          "/tenants",
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: this.password,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          debugger;
          this.listOfTenants = data.map((e) => e.name);
        })
        .catch((error) => {
          //console.error('Greska u logovanju:', error);
          this.$q.notify({ message: this.$t("login.checkData"), color: "red" });
        });
    },
    loginAsTenant() {
      console.log(this.selectedTenant);
      window.$tenant = this.selectedTenant;
      console.log("Успешно tenants:", this.selectedTenant);
      this.login2();
    },

    // 2. sad se logujemo, za dobijanje tokena, za odredjenog tenanta

    login() {
      this.$q.loading.show();
      axios
        .post("https://redstar-dev.atomdataservices.com/api/auth/token", {
          username: this.username,
          password: this.password,
          tenantId: this.selectedTenant, // "okcg" //ovo je zakucano - za svaki tentant je drugacije, ali se ovde menja
        })
        .then((response) => {
          this.$q.loading.hide();
          window.$token = response.data.token;
          this.$router.push({ name: "dashboard1" });
        })
        .catch((error) => {
          this.$q.loading.hide();
          console.error("Грешка:", error);
        });
    },

    // 2.1. login2, varijanta sa fetch
    login2() {
      let self = this;
      fetch("https://redstar-dev.atomdataservices.com/api/auth/token", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username, // "milivoje",
          password: this.password, //"",
          tenantId: this.selectedTenant, //ovo je zakucano - za svaki tentant je drugacije
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          debugger;
          window.$token = data.token;
          this.$token = data.token;
          console.log("Успешно:", window.$token);
          this.user();
        })
        .catch((error) => {
          console.error("Грешка:", error);
        });
    },

    // 3. uzimanje podataka o korisniku

    user() {
      let self = this;
      fetch("https://redstar-dev.atomdataservices.com/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.$token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Успешно user:", data);
          if (data.roles == undefined) {
            self.$q.notify({
              message: data.message,
              color: "negative",
            });
            return;
          }
          window.$roles = data.roles.map((role) => role.toLowerCase());
          window.$userName = data.username;
          window.$password = this.password;
          window.$userID = data.id;
          debugger;
          this.$router.push({ name: "dashboard1" });
          self.$q.notify({
            message: "Welcome " + data.firstName + " " + data.lastName,
            color: "positive",
          });

          //this.meni();
        })
        .catch((error) => {
          console.error("Грешка:", error);

          self.$q.notify({
            message: error.message,
            color: "negative",
          });
        });
    },
  },
  mounted() {},
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
