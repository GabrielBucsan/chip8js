<template>
  <div id="keyboard">
    <div class="keyboard-container">
      <span class="keyboard-label">KEYS</span>
      <div>
        <span class='key' v-bind:class="{ 'selected': isSelected('1') }">1</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('2') }">2</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('3') }">3</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('4') }">4</span>
      </div>
      <div>
        <span class='key' v-bind:class="{ 'selected': isSelected('q') }">Q</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('w') }">W</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('e') }">E</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('r') }">R</span>
      </div>
      <div>
        <span class='key' v-bind:class="{ 'selected': isSelected('a') }">A</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('s') }">S</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('d') }">D</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('f') }">F</span>
      </div>
      <div>
        <span class='key' v-bind:class="{ 'selected': isSelected('z') }">Z</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('x') }">X</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('c') }">C</span>
        <span class='key' v-bind:class="{ 'selected': isSelected('v') }">V</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Keyboard",
  inject: ["cpu"],
  data(){
    return {
      pressed: []
    }
  },
  mounted() {
    document.addEventListener('keydown', e => {
      this.cpu.setKey(e.key, true);
      this.pressed.push(e.key);
    })
    document.addEventListener('keyup', e => {
      this.cpu.setKey(e.key, false);
      this.pressed = this.pressed.filter(item => item != e.key);
    })
  },
  methods: {
    isSelected(key){
      return this.pressed.indexOf(key) >= 0;
    }
  }
};
</script>

<style>
.keyboard-container{
  display: flex;
  flex-flow: column;
  position: relative;
  border: 2px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  margin-left: 10px;
}

.keyboard-label{
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 15px;
  text-align: center;
  background-color: var(--background-color);
}

.key{
  font-size: 24px;
  padding: 5px 10px;
}
</style>
