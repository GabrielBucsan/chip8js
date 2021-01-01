<template>
  <div id="app">
    <div class="left-panel">
      <registers ref="registers"></registers>
      <memory ref="memory"></memory>
      <display ref="display"></display>
    </div>
    <div></div>
  </div>
</template>

<script>
import Registers from "./modules/registers/registers.vue";
import Memory from "./modules/memory/memory.vue";
import Display from "./modules/display/display.vue";
export default {
  name: "App",
  components: {
    Registers,
    Memory,
    Display,
  },
  inject: ["cpu"],
  created() {
    window.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        this.cpu.step();
        this.$refs.registers.update();
        this.$refs.memory.update();
        this.$refs.display.update();
      }
    });
  },
  methods: {
    run() {},
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap");

html {
  height: 100vh;
  overflow: hidden;
}

body {
  height: 100%;
  width: 100%;
  margin: 0;

  --background-color: #0e0e0e;
  --primary-color: #4af626;

  background-color: var(--background-color);
  color: var(--primary-color);
}
#app {
  font-family: "Source Code Pro", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 40% 60%;
}

.left-panel {
  padding: 10px;
  display: flex;
  flex-flow: column;
}
</style>
