<template>
  <div id="memory">
      <div class='memory-container'>
        <span class='memory-label'>MEMORY</span>
        <div class='memory-header'>
          <span>ADDRESS</span>
          <span>CONTENT</span>
          <span>OPCODE</span>
        </div>
        <div v-for='content in memoryContent' :key='content.address' class='memory-item' v-bind:class="{'selected': content.selected}">
          <span>{{ content.address | hex(4)}}     </span>
          <span>{{ content.value | hex}}</span>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Memory',
  inject: ['cpu'],
  data () {
      return {
          memoryContent: []
      }
  },
  created(){
      this.update();
  },
  filters: {
    hex(value, size = 2){
      return `${value.toString(16).padStart(size, '0').toUpperCase()}`;
    }
  },
  methods:{
    update(){
      const pcAddress = this.cpu.getProgramCounter();

      let before = pcAddress - 16;
      if(before < 0) before = 0;

      let after = pcAddress + 16;
      if(after > 4096) after = 4096;

      let content = [];

      for (let i = 0; i < 8; i++) {
        let index = before + i * 2;
        content.push({
          address: index,
          value: this.cpu.getMemoryAt16(index),
          selected: false
        });
      }

      content.push({
          address: pcAddress,
          value: this.cpu.getMemoryAt16(pcAddress),
          selected: true
        });

      for (let i = 0; i < 8; i++) {
        let index = after - 14 + i * 2;
        content.push({
          address: index,
          value: this.cpu.getMemoryAt16(index),
          selected: false
        });
      }

      this.memoryContent = content;
    }
  }
}
</script>

<style>
#memory {
  margin: 10px 0;
}

.memory-container{
    display: flex;
    flex-flow: column;
    position: relative;
    border: 2px solid;
    border-radius: 5px;
    padding: 10px;
}

.memory-label{
    position: absolute;
    top: -12px;
    left: calc(50% - 50px);
    width: 100px;
    text-align: center;
    background-color: var(--background-color);
}

.memory-header{
  margin: 5px 0;
  border-bottom: 1px solid;
}

.memory-header, .memory-item{
  display: grid;
  grid-template-columns: 25% 25% 50%;
}

.memory-item.selected{
  color: var(--background-color);
  background-color: var(--primary-color);
  font-weight: bold;
}

</style>
