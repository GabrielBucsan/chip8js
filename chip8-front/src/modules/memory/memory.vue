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
        <span>{{ content.opcode }}</span>
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

      let before = pcAddress - 6;
      if (before < 0) before = 0;

      let after = pcAddress + 12;
      if (after > 4096) after = 4096;

      let content = [];

      for (let i = 0; i < ((before < 0)? 3 + before : 3); i++) {
        let index = ((before < 0)? 0 : before) + i * 2;
        content.push({
          address: index,
          value: this.cpu.getMemoryAt16(index),
          opcode: d.decode(this.cpu.getMemoryAt16(index)),
          selected: false,
        });
      }

      content.push({
        address: pcAddress,
        value: this.cpu.getMemoryAt16(pcAddress),
        opcode: d.decode(this.cpu.getMemoryAt16(pcAddress)),
        selected: true,
      });

      for (let i = 0; i < 6; i++) {
        let index = after - 10 + i * 2;
        content.push({
          address: index,
          value: this.cpu.getMemoryAt16(index),
          opcode: d.decode(this.cpu.getMemoryAt16(index)),
          selected: false,
        });
      }

      this.pcMemory = content;

      const iAddress = this.cpu.addressRegister.getUint16(0);

      before = iAddress - 2;

      after = iAddress + 6;
      if (after > 4096) after = 4096;

      content = [];

      for (let i = 0; i < ((before < 0)? 1 + before : 1); i++) {
        let index = ((before < 0)? 0 : before) + i * 2;
        content.push({
          address: index,
          value: this.cpu.getMemoryAt16(index),
          selected: false,
        });
      }

      content.push({
        address: iAddress,
        value: this.cpu.getMemoryAt16(iAddress),
        selected: true,
      });

      for (let i = 0; i < 3; i++) {
        let index = after - 4 + i * 2;
        content.push({
          address: index,
          value: this.cpu.getMemoryAt16(index),
          selected: false,
        });
      }

      this.iMemory = content;

      const stackAddress = this.cpu.stackPointer.getUint8(0);

      before = stackAddress - 2;

      after = stackAddress + 6;
      if (after > 32) after = 32;

      content = [];

      for (let i = 0; i < ((before < 0)? 1 + before : 1); i++) {
        let index = ((before < 0)? 0 : before) + i * 2;
        content.push({
          address: index,
          value: this.cpu.stack.getUint16(index),
          selected: false,
        });
      }

      content.push({
        address: stackAddress,
        value: this.cpu.stack.getUint16(stackAddress),
        selected: true,
      });

      for (let i = 0; i < 3; i++) {
        let index = after - 4 + i * 2;
        content.push({
          address: index,
          value: this.cpu.stack.getUint16(index),
          opcode: d.decode(this.cpu.stack.getUint16(index)),
          selected: false,
        });
      }

      this.stack = content;
    },
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
  left: calc(50% - 75px);
  width: 150px;
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
</style>
