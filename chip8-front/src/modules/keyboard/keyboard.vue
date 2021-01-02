<template>
  <div id="keyboard"></div>
</template>

<script>
export default {
  name: "Keyboard",
  inject: ["cpu"],
  mounted() {
    document.addEventListener('keydown', e => {
      this.cpu.setKey(e.key, true);
    })
    document.addEventListener('keyup', e => {
      this.cpu.setKey(e.key, false);
    })
  }
};
</script>

<style>
</style>
