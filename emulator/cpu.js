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

    this.stack = mem.createMemory(128);

    this.halted = false;

    // FILLS THE INITIAL MEMORY ADDRESSES WITH THE CHARACTERS FROM 0 TO F
    const sprites = [
      0xf0,
      0x90,
      0x90,
      0x90,
      0xf0, // 0
      0x20,
      0x60,
      0x20,
      0x20,
      0x70, // 1
      0xf0,
      0x10,
      0xf0,
      0x80,
      0xf0, // 2
      0xf0,
      0x10,
      0xf0,
      0x10,
      0xf0, // 3
      0x90,
      0x90,
      0xf0,
      0x10,
      0x10, // 4
      0xf0,
      0x80,
      0xf0,
      0x10,
      0xf0, // 5
      0xf0,
      0x80,
      0xf0,
      0x90,
      0xf0, // 6
      0xf0,
      0x10,
      0x20,
      0x40,
      0x40, // 7
      0xf0,
      0x90,
      0xf0,
      0x90,
      0xf0, // 8
      0xf0,
      0x90,
      0xf0,
      0x10,
      0xf0, // 9
      0xf0,
      0x90,
      0xf0,
      0x90,
      0x90, // A
      0xe0,
      0x90,
      0xe0,
      0x90,
      0xe0, // B
      0xf0,
      0x80,
      0x80,
      0x80,
      0xf0, // C
      0xe0,
      0x90,
      0x90,
      0x90,
      0xe0, // D
      0xf0,
      0x80,
      0xf0,
      0x80,
      0xf0, // E
      0xf0,
      0x80,
      0xf0,
      0x80,
      0x80, // F
    ];

    for (let i = 0; i < sprites.length; i++) {
      this.memory.setUint8(i, sprites[i]);
    }

    this.keyMap = [
      "1",
      "2",
      "3",
      "4",
      "q",
      "w",
      "e",
      "r",
      "a",
      "s",
      "d",
      "f",
      "z",
      "x",
      "c",
      "v",
    ];

    this.keyPressed = [];
    this.lastKeyPressed;

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
    if (index > 16) throw new Error(`[CPU] No such register`);

    this.registers.setUint8(index, value);
  }

  getRegister(index) {
    if (index > 16) throw new Error(`[CPU] No such register`);

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
    const content =
      (this.memory.getUint8(address) << 8) +
      (this.memory.getUint8(address + 1) & 0xff);
    this.setProgramCounter(address + 2);
    return content;
  }

  execute(raw) {
    const instruction = raw >> 12;

    switch (instruction) {
      // 00E
      case 0x0: {
        const id = raw & 0xff;

        switch (id) {
          // 00E0
          // Clears the screen.
          case 0xe0: {
            this.display.clearDisplay();
            return;
          }

          // 00EE
          // Returns from a subroutine
          case 0xee: {
            const stackPos = this.stackPointer.getUint8(0);
            const address = this.stack.getUint16(stackPos - 1);
            this.setProgramCounter(address);
            this.stackPointer.setUint8(0, stackPos - 1);
            return;
          }
        }

        return;
      }

      // 1NNN
      // Jumps to address NNN
      case 0x1: {
        const address = raw & 0xfff;
        this.setProgramCounter(address);
        return;
      }

      // 2NNN
      // Calls subroutine at NNN
      case 0x2: {
        const address = raw & 0xfff;
        const stackPos = this.stackPointer.getUint8(0);
        this.stack.setUint16(stackPos, this.getProgramCounter());
        this.setProgramCounter(address);
        this.stackPointer.setUint8(0, stackPos + 1);
        return;
      }

      // 3XNN
      // Skips the next instruction if VX equals NN. (Usually the next instruction is a jump to skip a code block)
      case 0x3: {
        const VXIndex = (raw >> 8) & 0xf;
        const value = raw & 0xff;
        if (this.getRegister(VXIndex) == value) {
          const address = this.programCounter.getUint16(0);
          this.programCounter.setUint16(0, address + 2);
        }
        return;
      }

      // 4XNN
      // Skips the next instruction if VX doesn't equal NN. (Usually the next instruction is a jump to skip a code block)
      case 0x4: {
        const VXIndex = (raw >> 8) & 0xf;
        const value = raw & 0xff;
        if (this.getRegister(VXIndex) != value) {
          const address = this.programCounter.getUint16(0);
          this.programCounter.setUint16(0, address + 2);
        }
        return;
      }

      // 5XY0
      // Skips the next instruction if VX equals VY. (Usually the next instruction is a jump to skip a code block)
      case 0x5: {
        const VXIndex = (raw >> 8) & 0xf;
        const VYIndex = (raw >> 4) & 0xf;
        if (this.getRegister(VXIndex) == this.getRegister(VYIndex)) {
          const address = this.programCounter.getUint16(0);
          this.programCounter.setUint16(0, address + 2);
        }
        return;
      }

      // 6XNN
      // 	Sets VX to NN.
      case 0x6: {
        const VXIndex = (raw >> 8) & 0xf;
        const value = raw & 0xff;
        this.setRegister(VXIndex, value);
        return;
      }

      // 7XNN
      // Adds NN to VX. (Carry flag is not changed)
      case 0x7: {
        const VXIndex = (raw >> 8) & 0xf;
        const value = raw & 0xff;
        this.setRegister(VXIndex, this.getRegister(VXIndex) + value);
        return;
      }

      // 8XY
      case 0x8: {
        const VXIndex = (raw >> 8) & 0xf;
        const valueX = this.getRegister(VXIndex);
        const VYIndex = (raw >> 4) & 0xf;
        const valueY = this.getRegister(VYIndex);
        const id = raw & 0xf;

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
            if (total > 0xff) {
              this.setRegister(15, 1);
            } else this.setRegister(15, 0);
            this.setRegister(VXIndex, total & 0xff);
            return;
          }

          // 8XY5
          // VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
          case 0x5: {
            let total = valueX - valueY;
            if (valueY > valueX) {
              this.setRegister(15, 0);
              total = 0;
            } else this.setRegister(15, 1);
            this.setRegister(VXIndex, total & 0xff);
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
              this.setRegister(15, 0);
            } else this.setRegister(15, 1);
            this.setRegister(VXIndex, total & 0xff);
            return;
          }

          // 8XYE
          // Stores the most significant bit of VX in VF and then shifts VX to the left by 1
          case 0xe: {
            const bit = (valueX & 0xff) >> 7;
            this.setRegister(15, bit);
            this.setRegister(VXIndex, (valueX << 1) & 0xff);
            return;
          }
        }

        return;
      }

      // 9XY0
      // Skips the next instruction if VX doesn't equal VY. (Usually the next instruction is a jump to skip a code block)
      case 0x9: {
        const VXIndex = (raw >> 8) & 0xf;
        const VYIndex = (raw >> 4) & 0xf;
        if (this.getRegister(VXIndex) != this.getRegister(VYIndex)) {
          const address = this.programCounter.getUint16(0);
          this.programCounter.setUint16(0, address + 2);
        }
        return;
      }

      // ANNN
      // Sets I to the address NNN.
      case 0xa: {
        const address = raw & 0xfff;
        this.addressRegister.setUint16(0, address);
        return;
      }

      // BNNN
      // Jumps to the address NNN plus V0.
      case 0xb: {
        const address = raw & 0xfff;
        const value0 = this.getRegister(0);
        this.programCounter.setUint16(0, address + value0);
        return;
      }

      // CXNN
      // Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN.
      case 0xc: {
        const rnd = Math.floor(Math.random() * 255) + 0;
        const VXIndex = (raw >> 8) & 0xf;
        const value = raw & 0xff;
        this.setRegister(VXIndex, value & rnd);
        return;
      }

      // DXYN
      // Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N+1 pixels.
      // Each row of 8 pixels is read as bit-coded starting from memory location I;
      // I value doesn’t change after the execution of this instruction.
      // As described above, VF is set to 1 if any screen pixels are flipped from set to unset when the sprite is drawn, and to 0 if that doesn’t happen
      case 0xd: {
        const VXIndex = (raw >> 8) & 0xf;
        const VYIndex = (raw >> 4) & 0xf;
        const quantity = (raw & 0xf);

        const valueX = this.getRegister(VXIndex);
        const valueY = this.getRegister(VYIndex);

        const address = this.addressRegister.getUint16(0);

        let data = [];

        for (let i = 0; i < quantity; i++) {
          data.push(
            this.memory
              .getUint8(address + i)
              .toString(2)
              .padStart(8, "0")
          );
        }

        let alteredPixels = this.display.drawSprite(valueX, valueY, data);
        if (alteredPixels) this.setRegister(15, 1);
        else this.setRegister(15, 0);

        return;
      }

      case 0xe: {

        const id = raw & 0xff;

        switch (id) {
          // EX9E
          // Skips the next instruction if the key stored in VX is pressed. (Usually the next instruction is a jump to skip a code block)
          case 0x9e: {
            const VXIndex = (raw >> 8) & 0xf;
            const key = this.getRegister(VXIndex);
            const pressed = this.keyPressed[this.keyMap[key]];
            if(pressed){
              const address = this.programCounter.getUint16(0);
              this.programCounter.setUint16(0, address + 2);
            }
            return;
          }

          // EXA1
          // Skips the next instruction if the key stored in VX isn't pressed. (Usually the next instruction is a jump to skip a code block)
          case 0xa1: {
            const VXIndex = (raw >> 8) & 0xf;
            const key = this.getRegister(VXIndex);
            const pressed = this.keyPressed[this.keyMap[key]];
            if(!pressed){
              const address = this.programCounter.getUint16(0);
              this.programCounter.setUint16(0, address + 2);
            }
            return;
          }
        }
        return;
      }

      case 0xf: {

        const id = raw & 0xff;

        switch (id) {
          // FX07
          // Sets VX to the value of the delay timer.
          case 0x07: {
            const VXIndex = (raw >> 8) & 0xf;
            const value = this.delayTimer.getUint8(0);
            this.setRegister(VXIndex, value);
            return;
          }

          // FX0A
          // A key press is awaited, and then stored in VX. (Blocking Operation. All instruction halted until next key event)
          case 0x0a: {

            if(!this.halted){
              this.halted = true;
              this.setProgramCounter(this.getProgramCounter() - 2);
            }else if(this.lastKeyPressed){
              this.halted = false;
              const VXIndex = (raw >> 8) & 0xf;
              this.setRegister(VXIndex, this.keyMap.indexOf(this.lastKeyPressed));
              this.lastKeyPressed = undefined;
              this.setProgramCounter(this.getProgramCounter() + 2);
            }

            return;
          }

          // FX15
          // Sets the delay timer to VX.
          case 0x15: {
            const VXIndex = (raw >> 8) & 0xf;
            const value = this.getRegister(VXIndex);
            this.delayTimer.setUint8(0, value);
            return;
          }

          // FX18
          // Sets the sound timer to VX.
          case 0x18: {
            const VXIndex = (raw >> 8) & 0xf;
            const value = this.getRegister(VXIndex);
            this.soundTimer.setUint8(0, value);
            return;
          }

          // FX1E
          // Adds VX to I. VF is not affected
          case 0x1e: {
            const VXIndex = (raw >> 8) & 0xf;
            const value = this.getRegister(VXIndex);
            const nextAddress = Number(this.addressRegister.getUint16(0)) + Number(value);
            this.addressRegister.setUint16(0, nextAddress);
            return;
          }

          // FX29
          // Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font.
          case 0x29: {
            const VXIndex = (raw >> 8) & 0xf;
            const character = this.getRegister(VXIndex);
            const address = character * 5;
            this.addressRegister.setUint16(0, address);
            return;
          }

          // FX33
          // Store BCD representation of Vx in memory locations I, I+1, and I+2.
          case 0x33: {
            const VXIndex = (raw >> 8) & 0xf;
            const value = this.getRegister(VXIndex);
            const stringValue = Number(value).toString(10).padStart(3, "0");
            const address = this.addressRegister.getUint16(0);
            for (let i = 0; i < 3; i++) {
              this.memory.setUint8(address + i, Number(stringValue[i]));
            }
            return;
          }

          // FX55
          // Stores V0 to VX (including VX) in memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified.
          case 0x55: {
            const VXIndex = (raw >> 8) & 0xf;
            const address = this.addressRegister.getUint16(0);
            for (let i = 0; i < VXIndex + 1; i++) {
              this.memory.setUint8(address + i, this.getRegister(i));
            }
            return;
          }

          // FX65
          // Fills V0 to VX (including VX) with values from memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified.
          case 0x65: {
            const VXIndex = (raw >> 8) & 0xf;
            const address = this.addressRegister.getUint16(0);
            for (let i = 0; i < VXIndex + 1; i++) {
              this.setRegister(i, this.memory.getUint8(address + i));
            }
            return;
          }
        }
        return;
      }

    }
  }

  setKey(key, set) {
    if(this.keyMap.includes(key)){
      this.keyPressed[key] = set;
      if(set && this.halted){
        this.lastKeyPressed = key;
      }else{
        this.lastKeyPressed = undefined;
      }
    }
  }

  step() {
    if(!this.halted)
      this.nextInstruction = this.fetch();
    this.execute(this.nextInstruction);
    let DT = this.delayTimer.getUint8(0);
    if(DT > 0)
      this.delayTimer.setUint8(0, DT - 1);
    return;
  }
}

export default CPU;