<template>
  <div id="registers">
      <div class='register-container'>
        <span class='register-label'>REGISTERS</span>
        <div class='register-list'>
            <div v-for="register in registers" :key='register.name' class='register-item' v-bind:class="{'register-changed': register.changed}">
                <div>
                    {{ register.name }}
                </div>
                <div>
                {{register.value | hex(register.size)}}
                </div>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Registers',
  inject: ['cpu'],
  data () {
      return {
          registers: []
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
        let registerData = [];

        registerData.push({
            name: `PC`,
            value: this.cpu.getProgramCounter(),
            size: 4,
            changed: false
        });

        registerData.push({
            name: `I`,
            value: this.cpu.addressRegister.getUint16(0),
            size: 4,
            changed: false
        });

        registerData.push({
            name: `SP`,
            value: this.cpu.stackPointer.getUint8(0),
            size: 2,
            changed: false
        });

        registerData.push({
            name: `DT`,
            value: this.cpu.delayTimer.getUint8(0),
            size: 2,
            changed: false
        });

        registerData.push({
            name: `ST`,
            value: this.cpu.soundTimer.getUint8(0),
            size: 2,
            changed: false
        });

        for (let i = 0; i < 16; i++) {
            registerData.push({
                name: `V${i.toString(16).toUpperCase()}`,
                value: this.cpu.getRegister(i),
                size: 2,
                changed: false
            });
        }

        if(this.registers !== undefined && this.registers.length > 0){
            for (let i = 0; i < registerData.length; i++) {
                if(registerData[i].value != this.registers[i].value) registerData[i].changed = true;
            }
        }

        this.registers = registerData;
    }
  }
}
</script>

<style>
#registers {
  margin: 10px 0;
}

.register-container{
    display: flex;
    flex-flow: column;
    position: relative;
    border: 2px solid;
    border-radius: 5px;
    padding: 10px;
}

.register-label{
    position: absolute;
    top: -12px;
    left: calc(50% - 50px);
    width: 100px;
    text-align: center;
    background-color: var(--background-color);
}

.register-list{
    display: flex;
    flex-wrap: wrap;
}

.register-item{
    margin: 5px 10px;
}

.register-changed{
    color: var(--background-color);
    background-color: var(--primary-color);
    font-weight: bold;
}
</style>
