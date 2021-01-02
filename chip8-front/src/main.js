import Vue from 'vue'
import App from './App.vue'
import CPU from "./emulator/cpu.js";
import mem from './emulator/memory.js';
import Display from "./emulator/display.js";
import roms from "./emulator/roms.js";

Vue.config.productionTip = false
Vue.filter("hex", function(value, size = 2){
  if(value == undefined) return '';
  return `${value.toString(16).padStart(size, "0").toUpperCase()}`;
});

const memory = mem.createMemory(4096);
const display = new Display(64, 32);
const cpu = new CPU(memory, display);

const writable = new Uint8Array(3583);

for (let i = 0; i < roms[0].file.length; i++) {
  writable[i] = roms[0].file[i];
}

cpu.loadProgram(writable);

new Vue({
  render: h => h(App),
  provide: {
    cpu,
    memory,
    display
  }
}).$mount('#app')
