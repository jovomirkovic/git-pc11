<template>
  <q-layout view="lHh LpR lFf">
    <q-header reveal elevated style="background: #6000f0 ">  <!-- linear-gradient(145deg, rgb(74, 94, 137) 15%, rgb(30, 75, 131) 70%); -->
      <q-toolbar>
        <q-btn @click="left = !left" flat round dense icon="menu" class="q-mr-sm"/>
                 <q-avatar>
                   <img src="/statics/images/logo.png">
                 </q-avatar>

        <q-toolbar-title>RED STAR - DATA STAR </q-toolbar-title>

        <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()"
               >
                       <q-tooltip>Ceo ekran</q-tooltip>
          </q-btn>

        <q-btn flat round dense icon="fas fa-sign-out-alt" to="/">
            <q-tooltip>Kraj rada</q-tooltip>
          </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer class="left-navigation text-white"
              show-if-above v-model="left"
              style="background-image: url('/statics/images/marakana.png') !important;"
              side="left"
              elevated>
      <div style="height: calc(100% - 117px);padding:10px">
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>

          <q-toolbar-title>Milivoje</q-toolbar-title>
        </q-toolbar>
        <hr/>
        <q-scroll-area style="height:100%;">
          <q-list padding>

            <!-- <div v-for="d in menu" :key="d.label">
              <q-item active-class="tab-active" :to="d.to" exact class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="d.iconName"/>
              </q-item-section>

              <q-item-section>
                {{d.label}}
              </q-item-section>
            </q-item>
            </div> -->

            <q-item active-class="tab-active" to="/dashboard" exact class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="dashboard"/>
              </q-item-section>

              <q-item-section>
                Dashboard
              </q-item-section>
            </q-item>

<!--
            <q-item active-class="tab-active" to="/dashboard1" exact class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="dashboard"/>
              </q-item-section>

              <q-item-section>
                Избор тима и играча
              </q-item-section>
            </q-item> -->

            <q-item active-class="tab-active" to="/administracija" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="star"/>
              </q-item-section>

              <q-item-section>
                Administracija
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/treninzi" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="send"/>
              </q-item-section>

              <q-item-section>
                Treninzi
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/trenezneVezbe" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="attach_money"/>
              </q-item-section>

              <q-item-section>
                Trenažne vežbe
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/utakmice" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="money"/>
              </q-item-section>

              <q-item-section>
                Utakmice
              </q-item-section>
            </q-item>

            <!-- <q-item active-class="tab-active" to="/podaciOigri" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="list"/>
              </q-item-section>

              <q-item-section>
                Podaci o igri
              </q-item-section>
            </q-item> -->

            <q-item active-class="tab-active" to="/catapult" class="q-ma-sm navigation-item" clickable
                    v-ripple>
              <q-item-section avatar>
                <q-icon name="list"/>
              </q-item-section>

              <q-item-section>
                Katapult
              </q-item-section>
            </q-item>

            <q-separator color="orange" inset />

            <q-item active-class="tab-active" to="/tehnickiElementi" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="calendar_today"/>
              </q-item-section>

              <q-item-section>
                Tehnički elementi
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/taktickiElementi" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="business"/>
              </q-item-section>

              <q-item-section>
                Taktički elementi
              </q-item-section>
            </q-item>

<!--             <q-item active-class="tab-active" to="/principiIgre" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts"/>
              </q-item-section>

              <q-item-section>
                Principi igre
              </q-item-section>
            </q-item> -->

            <q-separator color="orange" inset />

            <q-item active-class="tab-active" to="/medicinskiKarton" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts"/>
              </q-item-section>

              <q-item-section>
                Medicinski karton
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/povredeIgraca" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts"/>
              </q-item-section>

              <q-item-section>
                Povrede igrača
              </q-item-section>
            </q-item>

            <q-separator color="orange" inset />

            <!-- <q-item active-class="tab-active" to="/strucniTim" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts"/>
              </q-item-section>

              <q-item-section>
                Stručni tim
              </q-item-section>
            </q-item> -->

            <q-item active-class="tab-active" to="/igraci" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts"/>
              </q-item-section>

              <q-item-section>
                Igrači
              </q-item-section>
            </q-item>



          </q-list>
        </q-scroll-area>
      </div>
    </q-drawer>

    <q-page-container style="background-color:#f1f2f6">
      <router-view/>
    </q-page-container>


  </q-layout>
</template>

<script>
    export default {
        data() {
            return {
                dialog_za_promenu_igraca: false,
                selektovaniTim:null,
                selektovaniIgrac: null,
                listaTimova:[],
                listaIgraca:[],
                left: false,
                igrac: "",
                menu: [
                  {
                    label: "Igrači",
                    to: "/igraci",
                    iconName: "drafts"
                  },
                  {
                    label: "Dashboard",
                    to: "/dashboard",
                    iconName: "drafts"
                  },
                  {
                    label: "Administracija",
                    to: "/administracija",
                    iconName: "star"
                  },
                ],
            }
        },
        mounted() {
          //this.igrac = window.$igracName;
        },
        methods: {


      }
    }
</script>

<style>
  .q-drawer {
    background-image: url('/statics/images/marakana.png') !important;
    background-size: cover !important;
  }

  .q-drawer__content {
    background-color: rgba(1, 1, 1, 0.75);
  }

  .navigation-item {
    border-radius: 5px;
  }

  .tab-active {
    background-color: green;
  }
</style>
