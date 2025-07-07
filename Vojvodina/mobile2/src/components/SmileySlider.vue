<template>
  <div>
       <section style="position:fixed; top: 45%; z-index: 5">
            <transition name="animacijaVS">
              <img
                v-if="animVS"
                alt="Vue Logo"
                src="../images/emoji/very_sad.png"
                width="150px"
              >
            </transition>
            <transition name="animacijaS">
              <img
                v-if="animS"
                alt="Vue Logo"
                src="../images/emoji/sad.png"
                width="150px"
              >
            </transition>
            <transition name="animacijaNS">
              <img
                v-if="animNS"
                alt="Vue Logo"
                src="../images/emoji/not_sure.png"
                width="150px"
              >
            </transition>
            <transition name="animacijaH">
              <img
                v-if="animH"
                alt="Vue Logo"
                src="../images/emoji/happy.png"
                width="150px"
              >
            </transition>
            <transition name="animacijaVH">
              <img
                v-if="animVH"
                alt="Vue Logo"
                src="../images/emoji/very_happy.png"
                width="150px"
              >
            </transition>
          </section>
    <div class="q-pl-md q-pr-md">

              <img
                @click="asdfg(1)"
                src="../images/emoji/very_sad.png"
                alt="Very Sad"
                width="36px"
                style="margin:5px;"
                :style="stVerySad"
              >
              <img
                @click="asdfg(2)"
                src="../images/emoji/sad.png"
                alt="Sad"
                width="36px"
                style="margin:5px;"
                :style="stSad"
              >
              <img
                @click="asdfg(3)"
                src="../images/emoji/not_sure.png"
                alt="What?"
                width="36px"
                style="margin:5px;"
                :style="stNotSure"
              >
              <img
                @click="asdfg(4)"
                src="../images/emoji/happy.png"
                alt="Happy"
                width="36px"
                style="margin:5px;"
                :style="stHappy"
              >
              <img
                @click="asdfg(5)"
                src="../images/emoji/very_happy.png"
                alt="Very Happy"
                width="36px"
                style="margin:5px;"
                :style="stVeryHappy"
              >
            </div>
  </div>
</template>
<script>

export default {
  name: 'smiley-slider',
  props: ['izabranaOpcija'],
  data: function () {
    return {
      stVerySad: "",
      stSad: "",
      stNotSure: "",
      stHappy: "",
      stVeryHappy: "",
      animVH: false,
      animH: false,
      animNS: false,
      animS: false,
      animVS: false
    }
  },
  methods: {
    asdfg: function (br) {
      this.$emit('update-izabrana-ocena', br);
      switch (br) {
        case 1:
          this.stVerySad = "";
          this.stSad = "filter: grayscale(100%); padding: 5px;";
          this.stNotSure = "filter: grayscale(100%); padding: 5px;";
          this.stHappy = "filter: grayscale(100%); padding: 5px;";
          this.stVeryHappy = "filter: grayscale(100%); padding: 5px;";
          this.animVS = !this.animVS;
          setTimeout(() => this.animVS = !this.animVS, 500);
          break;
        case 2:
          this.stVerySad = "filter: grayscale(100%); padding: 5px;";
          this.stSad = "";
          this.stNotSure = "filter: grayscale(100%); padding: 5px;";
          this.stHappy = "filter: grayscale(100%); padding: 5px;";
          this.stVeryHappy = "filter: grayscale(100%); padding: 5px;";
          this.animS = !this.animS;
          setTimeout(() => this.animS = !this.animS, 500);
          break;
        case 3:
          this.stVerySad = "filter: grayscale(100%); padding: 5px;";
          this.stSad = "filter: grayscale(100%); padding: 5px;";
          this.stNotSure = "";
          this.stHappy = "filter: grayscale(100%); padding: 5px;";
          this.stVeryHappy = "filter: grayscale(100%); padding: 5px;";
          this.animNS = !this.animNS;
          setTimeout(() => this.animNS = !this.animNS, 500);
          break;
        case 4:
          this.stVerySad = "filter: grayscale(100%); padding: 5px;";
          this.stSad = "filter: grayscale(100%); padding: 5px;";
          this.stNotSure = "filter: grayscale(100%); padding: 5px;";
          this.stHappy = "";
          this.stVeryHappy = "filter: grayscale(100%); padding: 5px;";
          this.animH = !this.animH;
          setTimeout(() => this.animH = !this.animH, 500);
          break;
        case 5:
          this.stVerySad = "filter: grayscale(100%); padding: 5px;";
          this.stSad = "filter: grayscale(100%); padding: 5px;";
          this.stNotSure = "filter: grayscale(100%); padding: 5px;";
          this.stHappy = "filter: grayscale(100%); padding: 5px;";
          this.stVeryHappy = "";
          this.animVH = !this.animVH;
          setTimeout(() => this.animVH = !this.animVH, 500);
          break;
      }
    },
  },
  mounted () {

  }
}
</script>
<style scoped>
.animacijaVS-enter-active {
  animation: bounce-in 1s;
}
.animacijaVS-leave-active {
  animation: bounce-in 1s;
}

.animacijaS-enter-active {
  animation: bounce-in 1s;
}
.animacijaS-leave-active {
  animation: bounce-in 1s;
}

.animacijaNS-enter-active {
  animation: bounce-in 1s;
}
.animacijaNS-leave-active {
  animation: bounce-in 1s;
}

.animacijaH-enter-active {
  animation: bounce-in 1s;
}
.animacijaH-leave-active {
  animation: bounce-in 1s;
}

.animacijaVH-enter-active {
  animation: bounce-in 1s;
}
.animacijaVH-leave-active {
  animation: bounce-in 1s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  25% {
    transform: scale(1.5);
    opacity: 1;
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}
</style>
