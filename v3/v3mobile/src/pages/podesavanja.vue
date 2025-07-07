<template>
  <div class="">

    <q-carousel-slide name="settings" class="q-pa-none">
      <q-scroll-area class="fit">
        <div class="column no-wrap flex-center q-carousel--padding">
          <q-icon name="settings" size="56px" style="top:20px" />
          <div class="">
            <p
              style="position: relative; top: 55px; text-align: center; font-size: xx-large; font-weight: 200; line-height: 50%">
              Podešavanja
            </p>
          </div>
          <div style="position: relative; top: 55px; " class="q-mt-md">
            ToDo... <br />
            <br />

            <br />
          </div>
        </div>
      </q-scroll-area>
    </q-carousel-slide>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {

      lorem: "Dobar dan, i tako to...",
      tolkin: "",
      userId: 0

    };
  },
  beforeMount() {
    this.tolkin = this.$route.params.tolkin;
    this.userId = this.$route.params.userId;
  },
  mounted() {
    this.userName = localStorage.getItem("mAppsUsername");
    //this.$refs.karusel.goTo("home");
    //this.$refs.karusel.goToSlide(this.slideNumber); //idemo na stranu na kojoj smo bili kad smo pozvali neku mApp
  },

  methods: {

    podesi() {
      //alert("podeseno");
    }
  },

  watch: {
    vertical(val) {
      this.navPos = val === true ? "right" : "bottom";
    }
  }
};
</script>

<style scoped>
.my-custom-toggle {
  border: 1px solid #027be3;
}

.mobilniCss {
  width: 100%;
  background-image: url("../assets/img/pozadina-pozadina.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  vertical-align: -webkit-baseline-middle;
}
</style>
