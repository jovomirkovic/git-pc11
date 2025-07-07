<template>
  <div class="stopwatch">
    <div class="time">{{ formattedTime }}</div>
  </div>
</template>

<script>
export default {
  name: 'Stopwatch',
  data() {
    return {
      time: 0,
      isRunning: false,
      intervalId: null,
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.time / 60000)
        .toString()
        .padStart(2, '0');
      const seconds = Math.floor((this.time % 60000) / 1000)
        .toString()
        .padStart(2, '0');
      const milliseconds = Math.floor((this.time % 1000) / 10)
        .toString()
        .padStart(2, '0');
      return `${minutes}:${seconds}:${milliseconds}`;
    },
  },
  methods: {
    start() {
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        this.time += 10;
      }, 10);
    },
    stop() {
      clearInterval(this.intervalId);
      this.isRunning = false;
    },
    reset() {
      this.time = 0;
      this.isRunning = false;
      clearInterval(this.intervalId);
    },
  },
};
</script>

<style scoped>
.stopwatch {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.time {
  width: 60px;
  font-size: 14pt;
  text-align: center;
  margin: 10px 0;
}

</style>
