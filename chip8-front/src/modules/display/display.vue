<template>
  <div id="display">
    <canvas id="c"></canvas>
  </div>
</template>

<script>
export default {
  name: "Display",
  inject: ["display"],
  data() {
    return {
      displayContent: [],
      bgColor: '#0e0e0e',
      primColor: '#4af628',
      scale: 10,
      sizeX: 64,
      sizeY: 32
    };
  },
  mounted() {
    this.initialize();
    this.clear();
  },
  methods: {
    initialize() {
      let c = document.getElementById("c");
      c.width = this.sizeX * this.scale;
      c.height = this.sizeY * this.scale;
      this.ctx = c.getContext("2d", { alpha: false });
    },
    update() {
      this.clear();
      if (this.ctx !== undefined) {
        const displayMemory = this.display.displayMemory;

        for (let y = 0; y < this.sizeY; y++) {
          for (let x = 0; x < this.sizeX / 8; x++) {
            let value = displayMemory.getUint8(y * this.sizeX / 8 + x).toString(2).padStart(8, '0');
            for (let i = 0; i < value.length; i++) {
              if(value[i] == '1')
                this.drawPixel(x * 8 + i, y);
            }
          }
        }
      }
    },
    drawPixel(posX, posY){
      this.ctx.fillStyle = this.primColor;
      this.ctx.fillRect(posX * this.scale, posY * this.scale , this.scale, this.scale);
    },
    clear(){
      if(this.ctx !== undefined){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      }
    }
  },
};
</script>

<style>
#display {
  margin: 10px 0;
}

canvas{
  border: 1px solid var(--primary-color);
}
</style>
