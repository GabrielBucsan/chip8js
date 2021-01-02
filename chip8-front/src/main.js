import Vue from 'vue'
import App from './App.vue'
import CPU from "../../emulator/cpu.js";
import mem from '../../emulator/memory.js';
import Display from "../../emulator/display.js";
import roms from "../../emulator/roms.js";

Vue.config.productionTip = false
Vue.filter("hex", function(value, size = 2){
  if(value == undefined) return '';
  return `${value.toString(16).padStart(size, "0").toUpperCase()}`;
});

const memory = mem.createMemory(4096);
const display = new Display(64, 32);
const cpu = new CPU(memory, display);

const writable = new Uint8Array(3583);

for (let i = 0; i < roms['invaders'].length; i++) {
  writable[i] = roms['invaders'][i];
}

// let i = 0;

// writable[i++] = 0x60;
// writable[i++] = 0x38;

// writable[i++] = 0x61;
// writable[i++] = 0x1b;

// writable[i++] = 0xA0;
// writable[i++] = 0x05;

// writable[i++] = 0xD0;
// writable[i++] = 0x15;

// writable[i++] = 0x60;
// writable[i++] = 0x07;

// writable[i++] = 0xA0;
// writable[i++] = 0x00;

// writable[i++] = 0xD0;
// writable[i++] = 0x14;

// writable[i++] = 0x60;
// writable[i++] = 0x0c;

// writable[i++] = 0xa0;
// writable[i++] = 0x0a;

// writable[i++] = 0xd0;
// writable[i++] = 0x14;

cpu.loadProgram(writable);

new Vue({
  render: h => h(App),
  provide: {
    cpu,
    memory,
    display
  }
}).$mount('#app')
