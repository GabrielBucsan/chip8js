<template>
  <div id="app">
    <div class="left-panel">
      <registers ref="registers"></registers>
      <memory ref="memory"></memory>
    </div>
    <div class='right-panel'>
      <display ref="display"></display>
      <div class='row'>
        <program-controller></program-controller>
        <keyboard></keyboard>
        <sound ref='sound'></sound>
      </div>
    </div>
  </div>
</template>

<script>
import Registers from "./modules/registers/registers.vue";
import Memory from "./modules/memory/memory.vue";
import Display from "./modules/display/display.vue";
import Keyboard from "./modules/keyboard/keyboard.vue";
import ProgramController from "./modules/programController/programController.vue";
import Sound from "./modules/sound/sound.vue";
export default {
  name: "App",
  components: {
    Registers,
    Memory,
    Display,
    Keyboard,
    ProgramController,
    Sound
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

.left-panel, .right-panel {
  padding: 10px;
  display: flex;
  flex-flow: column;
}

.row{
  display: flex;
  flex-flow: row;
}
</style>
