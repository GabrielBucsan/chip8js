<template>
  <div id="display">
    <canvas id="c"></canvas>
  </div>
</template>

<script>
export default {
  name: "Displat",
  inject: ["display"],
  data() {
    return {
      displayContent: [],
    };
  },
  created() {
    this.initialize();
    this.update();
  },
  methods: {
    initialize() {
      let c = document.getElementById("c");
      this.ctx = c.getContext("2d");
    },
    update() {
      if (this.ctx !== undefined) {
      }
    },
  },
};
</script>

<style>
#display {
  margin: 10px 0;
}
</style>
