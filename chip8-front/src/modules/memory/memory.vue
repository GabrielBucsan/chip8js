<template>
  <div id="memory">
      <div class='memory-container'>
        <span class='memory-label'>MEMORY</span>
        <div v-for='content in memoryContent' :key='content.address'>

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

        let before = pcAddress - 8;
        if(before < 0) before = 0;

        let after = pcAddress + 8;
        if(after > 4096) after = 4096;
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

</style>
