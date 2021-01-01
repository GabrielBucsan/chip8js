import mem from "./memory.js";

class CPU {
  constructor(memory, display) {
    this.memory = memory;
    this.display = display;

    // 16 GENERAL PURPOSE REGISTERS, EACH WITH 8BITS (1BYTE) OF SIZE
    this.registers = mem.createMemory(16);

    // SPECIAL USE REGISTERS
    this.programCounter = mem.createMemory(2);
    this.programCounter.setUint16(0, 0x200);

    this.addressRegister = mem.createMemory(2);
    this.stackPointer = mem.createMemory(1);
    this.delayTimer = mem.createMemory(1);
    this.soundTimer = mem.createMemory(1);

    // FILLS THE INITIAL MEMORY ADDRESSES WITH THE CHARACTERS FROM 0 TO F
    const sprites = [
      0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
      0x20, 0x60, 0x20, 0x20, 0x70, // 1
      0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
      0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
      0x90, 0x90, 0xF0, 0x10, 0x10, // 4
      0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
      0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
      0xF0, 0x10, 0x20, 0x40, 0x40, // 7
      0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
      0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
      0xF0, 0x90, 0xF0, 0x90, 0x90, // A
      0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
      0xF0, 0x80, 0x80, 0x80, 0xF0, // C
      0xE0, 0x90, 0x90, 0x90, 0xE0, // D
      0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
      0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ];

    for (let i = 0; i < sprites.length; i++) {
      this.memory.setUint8(i, sprites[i]);
    }

    this.keyMap = [
      '1', '2', '3', '4',
      'q', 'w', 'e', 'r',
      'a', 's', 'd', 'f',
      'z', 'x', 'c', 'v'
    ]

    this.keyPressed = [];

    for (let i = 0; i < this.keyMap.length; i++) {
      this.keyPressed[this.keyMap[i]] = false;
    }
  }

  loadProgram(program) {
    for (let i = 0; i < program.length; i++) {
      this.memory.setUint8(0x200 + i, program[i]);
    }
  }

  setRegister(index, value) {
    if (index > 16)
      throw new Error(`[CPU] No such register`);

    this.registers.setUint8(index, value);
  }

  getRegister(index) {
    if (index > 16)
      throw new Error(`[CPU] No such register`);

    return this.registers.getUint8(index);
  }

  setProgramCounter(value) {
    this.programCounter.setUint16(0, value);
  }

  getProgramCounter() {
    return this.programCounter.getUint16(0);
  }

  getMemoryAt(index) {
    return this.memory.getUint8(index);
  }

  getMemoryAt16(index) {
    return this.memory.getUint16(index);
  }

  fetch() {
    const address = this.getProgramCounter();
    const content = (this.memory.getUint8(address) << 8) + (this.memory.getUint8(address + 1) & 0xFF);
    this.setProgramCounter(address + 2);
    return content;
  }

  execute(raw) {

    const instruction = raw >> 12;

    switch (instruction) {

      // 00E
      case 0x0: {
        const id = raw & 0xFF;

        // 00E0
        // Clears the screen.
        switch (id) {
          case 0xE0: {
            this.display.clearDisplay();
            return;
          }
        }

        return;
      }

      // 1NNN
      // Jumps to address NNN
      case 0x1: {
        const address = raw & 0xFFF;
        this.setProgramCounter(address);
        return;
      }

      // 4XNN
      // Skips the next instruction if VX doesn't equal NN. (Usually the next instruction is a jump to skip a code block)
      case 0x4: {
        const VXIndex = (raw >> 8) & 0xF;
        const value = raw & 0xFF;
        if (this.getRegister(VXIndex) != value) {
          const address = this.programCounter.getUint16(0);
          this.programCounter.setUint16(0, address + 2)
        }
        return;
      }

      // 5XY0
      // Skips the next instruction if VX equals VY. (Usually the next instruction is a jump to skip a code block)
      case 0x5: {
        const VXIndex = (raw >> 8) & 0xF;
        const VYIndex = (raw >> 4) & 0xF;
        if (this.getRegister(VXIndex) == this.getRegister(VYIndex)) {
          const address = this.programCounter.getUint16(0);
          this.programCounter.setUint16(0, address + 2)
        }
        return;
      }

      // 3XNN
      // Skips the next instruction if VX equals NN. (Usually the next instruction is a jump to skip a code block)
      case 0x3: {
        const VXIndex = (raw >> 8) & 0xF;
        const value = raw & 0xFF;
        if (this.getRegister(VXIndex) == value) {
          const address = this.programCounter.getUint16(0);
          this.programCounter.setUint16(0, address + 2)
        }
        return;
      }

      // 6XNN
      // 	Sets VX to NN.
      case 0x6: {
        const VXIndex = (raw >> 8) & 0xF;
        const value = raw & 0xFF;
        this.setRegister(VXIndex, value);
        return;
      }

      // 8XY
      case 0x8: {
        const VXIndex = (raw >> 8) & 0xF;
        const valueX = this.getRegister(VXIndex);
        const VYIndex = (raw >> 4) & 0xF;
        const valueY = this.getRegister(VYIndex);
        const id = raw & 0xF;

        switch (id) {

          // 8XY0
          // 	Sets VX to the value of VY.
          case 0x0: {
            this.setRegister(VXIndex, valueY);
            return;
          }

          // 8XY1
          // Sets VX to VX or VY. (Bitwise OR operation)
          case 0x1: {
            this.setRegister(VXIndex, valueX | valueY);
            return;
          }

          // 8XY2
          // Sets VX to VX and VY. (Bitwise AND operation)
          case 0x2: {
            this.setRegister(VXIndex, valueX & valueY);
            return;
          }

          // 8XY3
          // Sets VX to VX xor VY.
          case 0x3: {
            this.setRegister(VXIndex, valueX ^ valueY);
            return;
          }

          // 8XY4
          // Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
          case 0x4: {
            let total = valueX + valueY;
            if (total > 0xFF) {
              this.setRegister(15, 1);
            } else this.setRegister(15, 0);
            this.setRegister(VXIndex, total & 0xFF);
            return;
          }

          // 8XY5
          // VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
          case 0x5: {
            let total = valueX - valueY;
            if (valueY > valueX) {
              this.setRegister(15, 1);
            } else this.setRegister(15, 0);
            this.setRegister(VXIndex, total & 0xFF);
            return;
          }

          // 8XY6
          // Stores the least significant bit of VX in VF and then shifts VX to the right by 1
          case 0x6: {
            const bit = valueX & 0x1;
            this.setRegister(15, bit);
            this.setRegister(VXIndex, valueX >> 1);
            return;
          }

          // 8XY7
          // Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
          case 0x7: {
            let total = valueY - valueX;
            if (valueX > valueY) {
              this.setRegister(15, 1);
            } else this.setRegister(15, 0);
            this.setRegister(VXIndex, total & 0xFF);
            return;
          }

          // 8XYE
          // Stores the most significant bit of VX in VF and then shifts VX to the left by 1
          case 0xE: {
            const bit = valueX & 0x1;
            this.setRegister(15, bit);
            this.setRegister(VXIndex, (valueX << 1) & 0xFF);
            return;
          }
        }

        return;
      }

      // 9XY0
      // Skips the next instruction if VX doesn't equal VY. (Usually the next instruction is a jump to skip a code block)
      case 0x9: {
        const VXIndex = (raw >> 8) & 0xF;
        const VYIndex = (raw >> 4) & 0xF;
        if (this.getRegister(VXIndex) != this.getRegister(VYIndex)) {
          const address = this.programCounter.getUint16(0);
          this.programCounter.setUint16(0, address + 2)
        }
        return;
      }

      // ANNN
      // Sets I to the address NNN.
      case 0xA: {
        const address = raw & 0xFFF;
        this.addressRegister.setUint16(0, address);
        return;
      }

      // BNNN
      // Jumps to the address NNN plus V0.
      case 0xB: {
        const address = raw & 0xFFF;
        const value0 = this.getRegister(0);
        this.programCounter.setUint16(0, address + value0);
        return;
      }

      // DXYN
      // Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N+1 pixels. 
      // Each row of 8 pixels is read as bit-coded starting from memory location I; 
      // I value doesn’t change after the execution of this instruction. 
      // As described above, VF is set to 1 if any screen pixels are flipped from set to unset when the sprite is drawn, and to 0 if that doesn’t happen
      case 0xD: {
        const VXIndex = (raw >> 8) & 0xF;
        const VYIndex = (raw >> 4) & 0xF;
        const quantity = (raw & 0xF) + 1;

        const valueX = this.getRegister(VXIndex);
        const valueY = this.getRegister(VYIndex);

        const address = this.addressRegister.getUint16(0);

        let data = [];

        for (let i = 0; i < quantity; i++) {
          data.push(this.memory.getUint8(address + i).toString(2).padStart(8, '0'));
        }

        let alteredPixels = this.display.drawSprite(valueX, valueY, data);
        if (alteredPixels)
          this.setRegister(15, 1);
        else
          this.setRegister(15, 0);

        return;
      }
    }

  }

  step() {
    const instruction = this.fetch();
    return this.execute(instruction);
  }
}

export default CPU;