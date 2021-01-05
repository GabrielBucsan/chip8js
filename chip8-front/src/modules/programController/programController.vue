<template>
  <div id="programController">
    <div class="program-container">
      <div>
        <span class='option'>Enter: select</span>
        <span class='option'>P: {{(paused)? 'resume' : 'pause'}} execution</span>
        <span class='option' v-if='paused'>Space: step</span>
        <span class='option' v-if='!paused'>FPS: {{fps | formatFps}}</span>
      </div>
      <div class='rom-list'>
        <span v-if='romIndex != 0'>&#8593;</span>
        <span v-if='romIndex == 0' class='padding-offset'></span>
        <div v-for='(rom, index) in roms' :key='rom.id'>
          <span v-bind:class="{ 'selected': index == selectedIndex - romIndex }">{{ rom.name }}</span>
        </div>
        <span v-if='totalRomLength - romIndex != showedRoms'>&#8595;</span>
        <span v-if='totalRomLength - romIndex == showedRoms' class='padding-offset'></span>
      </div>
    </div>
  </div>
</template>

<script>
import roms from "../../emulator/roms.js";

export default {
  name: "ProgramController",
  inject: ["cpu"],
  data() {
    return {
      paused: false,
      roms: [],
      totalRomLength: 0,
      showedRoms: 10,
      romIndex: 0,
      selectedIndex: 0,
      fps: 0
    };
  },
  filters: {
    formatFps: function(fps){
      return Math.floor(Number(fps));
    }
  },
  mounted() {
    let lastLoop = new Date();
    const self = this;

    this.totalRomLength = roms.length;

    this.buildRomList();

    setInterval(function(){
      if(self.cpu !== undefined && !self.paused){
        let thisLoop = new Date();
        self.fps = 1000 / (thisLoop - lastLoop);
        lastLoop = thisLoop;

        self.cpu.step();
        self.$parent.$refs.registers.update();
        self.$parent.$refs.memory.update();
        self.$parent.$refs.display.update();
        self.$parent.$refs.sound.update();
      }
    }, 0);

    setInterval(function(){
      if(self.cpu !== undefined && !self.paused){
        self.cpu.tick();
      }
    }, 1000/60);

    window.addEventListener("keydown", (e) => {
      if (e.keyCode == 32) {
        this.cpu.step();
        this.$parent.$refs.registers.update();
        this.$parent.$refs.memory.update();
        this.$parent.$refs.display.update();
        this.$parent.$refs.sound.update();
      }
      if (e.key == "p") {
        this.paused = !this.paused;
      }
      if (e.key == "Enter") {
        this.selectRom();
      }
      if (e.keyCode == 38) {
        if(this.selectedIndex == 0){
          this.selectedIndex = this.totalRomLength - 1;
          this.buildRomList(false);
        }
        else
          this.selectedIndex--;

        this.changeRomList(true);
      }
      if (e.keyCode == 40) {
        if(this.selectedIndex == (this.totalRomLength - 1)){
          this.selectedIndex = 0;
          this.buildRomList();
        }
        else
          this.selectedIndex++;

        this.changeRomList(false);
      }
    });
  },
  methods: {
    selectRom(){

      this.paused = true;

      this.cpu.reset();

      const writable = new Uint8Array(3583);

      let rom = roms[this.selectedIndex];

      for (let i = 0; i < rom.file.length; i++) {
        writable[i] = rom.file[i];
      }

      this.cpu.loadProgram(writable);

      this.paused = false;
    },
    buildRomList(start = true){
      this.roms = [];
      if(start){
        for (let i = 0; i < this.showedRoms; i++) {
          this.roms.push(roms[i]);
          this.romIndex = 0;
        }
      }else{
        for (let i = roms.length - this.showedRoms; i < roms.length; i++) {
          this.roms.push(roms[i]);
          this.romIndex = roms.length - this.showedRoms;
        }
      }
    },
    changeRomList(up){
      if(up){
        if(this.selectedIndex < this.romIndex){
          this.roms.pop();
          this.roms.unshift(roms[this.selectedIndex]);
          this.romIndex--;
        }
      }else{
        if(this.selectedIndex >= this.showedRoms + this.romIndex){
          this.roms.shift();
          this.roms.push(roms[this.selectedIndex]);
          this.romIndex++;
        }
      }
    }
  }
};
</script>

<style>
#programController {
  margin: 10px 0;
}

.program-container {
  display: flex;
  flex-flow: column;
  position: relative;
  border: 2px solid;
  border-radius: 5px;
  padding: 10px;
}

.option{
  font-weight: bold;
  margin: 0 10px;
}

.rom-list{
  display: flex;
  flex-flow: column;
  margin: 10px;
}

.selected{
  color: var(--background-color);
  background-color: var(--primary-color);
  font-weight: bold;
}

.padding-offset{
  padding-top: 17.6px;
}
</style>
