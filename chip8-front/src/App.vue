<template>
  <div id="app">
    <div class="left-panel">
      <registers ref="registers"></registers>
      <memory ref="memory"></memory>
      <keyboard></keyboard>
      <span>{{ fps }}</span>
    </div>
    <div>
      <display ref="display"></display>
    </div>
  </div>
</template>

<script>
import Registers from "./modules/registers/registers.vue";
import Memory from "./modules/memory/memory.vue";
import Display from "./modules/display/display.vue";
import Keyboard from "./modules/keyboard/keyboard.vue";
export default {
  name: "App",
  components: {
    Registers,
    Memory,
    Display,
    Keyboard
  },
  inject: ["cpu"],
  mounted() {

    let lastLoop = new Date();
    const self = this;
    let paused = false;

    setInterval(function(){
      if(self.cpu !== undefined && !paused){
        let thisLoop = new Date();
        this.fps = 1000 / (thisLoop - lastLoop);
        lastLoop = thisLoop;

        self.cpu.step();
        self.$refs.registers.update();
        self.$refs.memory.update();
        self.$refs.display.update();
      }
    }, 0);

    window.addEventListener("keydown", (e) => {
      if (e.key == "p") {
        paused = !paused;
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        this.cpu.step();
        this.$refs.registers.update();
        this.$refs.memory.update();
        this.$refs.display.update();
      }
    });
  }
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
  font-size: 14px;

  --background-color: #0e0e0e;
  --primary-color: #4af628;

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
