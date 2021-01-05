<template>
  <div id="sound">
  </div>
</template>

<script>
export default {
  name: "Sound",
  inject: ["cpu"],
  data() {
    return {
      audioCtx: undefined,
      playing: false
    };
  },
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    },
    update() {
      if(this.cpu.getSoundTimer() > 0){
        this.play();
      }
    },
    play(){
      if(!this.playing){
        this.playing = true;
        const oscillator = this.audioCtx.createOscillator();
        const self = this;
  
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(600, this.audioCtx.currentTime);
        oscillator.connect(this.audioCtx.destination);
        oscillator.onended = function(){
          self.playing = false;
        }
        oscillator.start(0);
        oscillator.stop(this.audioCtx.currentTime + 1 / 10);
        console.log('111');
      }
    }
  },
};
</script>

<style>
#sound {
}

</style>
