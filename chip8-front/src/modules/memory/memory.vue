<template>
  <div id="memory">
    <div class="memory-container">
      <span class="memory-label">MEMORY AT PC</span>
      <div class="memory-header">
        <span>ADDRESS</span>
        <span>CONTENT</span>
        <span>OPCODE</span>
      </div>
      <div
        v-for="content in pcMemory"
        :key="content.address"
        class="memory-item"
        v-bind:class="{ selected: content.selected }"
      >
        <span>{{ content.address | hex(4) }} </span>
        <span>{{ content.value | hex(4) }}</span>
        <span>{{ content.instruction.mnem }}</span>
      </div>
    </div>
    <div class='grid-50'>
      <div class="memory-container">
        <span class="memory-label">MEMORY AT I</span>
        <div class="memory-header-50">
          <span>ADDRESS</span>
          <span>CONTENT</span>
        </div>
        <div
          v-for="content in iMemory"
          :key="content.address"
          class="memory-item-50"
          v-bind:class="{ selected: content.selected }"
        >
          <span>{{ content.address | hex(4) }} </span>
          <span>{{ content.value | hex(4) }}</span>
        </div>
      </div>
      <div class="memory-container">
        <span class="memory-label">STACK</span>
        <div class="memory-header-50">
          <span>ADDRESS</span>
          <span>CONTENT</span>
        </div>
        <div
          v-for="content in stack"
          :key="content.address"
          class="memory-item-50"
          v-bind:class="{ selected: content.selected }"
        >
          <span>{{ content.address | hex(4) }} </span>
          <span>{{ content.value | hex(4) }}</span>
        </div>
      </div>
    </div>
    <div class="memory-container">
      <div class="memory-label">
        <span>{{ selectedInstruction.opcode }}</span>
        <span> ({{ selectedInstruction.mnem }})</span>
      </div>
      <span class='margin-top-5'>{{ selectedInstruction.desc }}</span>
    </div>
  </div>
</template>

<script>
import d from "../../../../emulator/decoder.js";

export default {
  name: "Memory",
  inject: ["cpu"],
  data() {
    return {
      pcMemory: [],
      iMemory: [],
      stack: []
    };
  },
  created() {
    this.update();
  },
  methods: {
    update() {
      const pcAddress = this.cpu.getProgramCounter();
      this.pcMemory = this.createList(pcAddress, 10, 3, this.cpu.memory, true);

      this.selectedInstruction = this.pcMemory.filter(item => item.selected)[0].instruction;

      const iAddress = this.cpu.addressRegister.getUint16(0);
      this.iMemory = this.createList(iAddress, 5, 1, this.cpu.memory);

      const stackAddress = this.cpu.stackPointer.getUint8(0);
      this.stack = this.createList(stackAddress, 5, 5, this.cpu.stack);

    },
    createItem(address, location, selected = false, hasOpcode = false){
      return {
          address: address,
          value: location.getUint16(address),
          instruction: (hasOpcode)? d.decode(location.getUint16(address)) : '',
          selected: selected,
        };
    },
    createList(address, nItens, nItensBefore, location, hasOpcode = false){
      let before = address - nItensBefore * 2;
      if(before < 0) before = 0;

      let content = [];

      for (let i = 0; i < nItens; i++) {
        let index = before + i * 2;
        if(index > location.byteLength) index = location.byteLength - 2; 
        content.push(this.createItem(index, location, index == address, hasOpcode));
      }

      return content;
    }
  },
};
</script>

<style>
#memory {
  display: flex;
  flex-flow: column;
}

.memory-container {
  margin: 10px 0;
  display: flex;
  flex-flow: column;
  position: relative;
  border: 2px solid;
  border-radius: 5px;
  padding: 10px;
}

.memory-label {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 15px;
  text-align: center;
  background-color: var(--background-color);
}

.memory-header , .memory-header-50{
  margin: 5px 0;
  border-bottom: 1px solid;
}

.memory-header,
.memory-item {
  display: grid;
  grid-template-columns: 25% 25% 50%;
}

.memory-header-50,
.memory-item-50 {
  display: grid;
  grid-template-columns: 50% 50%;
}

.memory-item.selected , .memory-item-50.selected{
  color: var(--background-color);
  background-color: var(--primary-color);
  font-weight: bold;
}

.grid-50{
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(50% - 5px));
  grid-template-rows: 100%;
  grid-gap: 10px;
}

.margin-top-5{
  margin-top: 5px;
}
</style>
