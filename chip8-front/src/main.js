import Vue from 'vue'
import App from './App.vue'
import CPU from "../../emulator/cpu.js";
import mem from '../../emulator/memory.js';
import Display from "../../emulator/display.js";

Vue.config.productionTip = false

const memory = mem.createMemory(4096);
const display = new Display(64, 32);
const cpu = new CPU(memory, display);

const writable = new Uint8Array(30);
let i = 0;

writable[i++] = 0x60;
writable[i++] = 0x05;

writable[i++] = 0xA0;
writable[i++] = 0x05;

writable[i++] = 0xD0;
writable[i++] = 0x04;

cpu.loadProgram(writable);

new Vue({
  render: h => h(App),
  provide: {
    cpu,
    memory,
    display
  }
}).$mount('#app')
