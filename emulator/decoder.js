const toHex = function(value, number = 4){
  return Number(value).toString(16).padStart(number, "0").toUpperCase();
}

const decode = function(raw){
  const instruction = raw >> 12;

  switch (instruction) {
    // 00E
    case 0x0: {
      const id = raw & 0xff;

      switch (id) {
        // 00E0
        // Clears the screen.
        case 0xe0: {
          return 'CLS';
        }

        // 00EE
        // Returns from a subroutine
        case 0xee: {
          return 'RET'
        }
      }

      return '';
    }

    // 1NNN
    // Jumps to address NNN
    case 0x1: {
      const address = raw & 0xfff;
      return `JP   ${toHex(address)}`;
    }

    // 2NNN
    // Calls subroutine at NNN
    case 0x2: {
      const address = raw & 0xfff;
      return `CALL ${toHex(address)}`;
    }

    // 3XNN
    // Skips the next instruction if VX equals NN. (Usually the next instruction is a jump to skip a code block)
    case 0x3: {
      const VXIndex = (raw >> 8) & 0xf;
      const value = raw & 0xff;
      return `SE   V${toHex(VXIndex, 1)}, ${toHex(value, 2)}`;
    }

    // 4XNN
    // Skips the next instruction if VX doesn't equal NN. (Usually the next instruction is a jump to skip a code block)
    case 0x4: {
      const VXIndex = (raw >> 8) & 0xf;
      const value = raw & 0xff;
      return `SNE  V${toHex(VXIndex, 1)}, ${toHex(value, 2)}`;
    }

    // 5XY0
    // Skips the next instruction if VX equals VY. (Usually the next instruction is a jump to skip a code block)
    case 0x5: {
      const VXIndex = (raw >> 8) & 0xf;
      const VYIndex = (raw >> 4) & 0xf;
      return `SE   V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`;
    }

    // 6XNN
    // 	Sets VX to NN.
    case 0x6: {
      const VXIndex = (raw >> 8) & 0xf;
      const value = raw & 0xff;
      return `LD   V${toHex(VXIndex, 1)}, ${toHex(value, 2)}`;
    }

    // 7XNN
    // Adds NN to VX. (Carry flag is not changed)
    case 0x7: {
      const VXIndex = (raw >> 8) & 0xf;
      const value = raw & 0xff;
      return `ADD  V${toHex(VXIndex, 1)}, ${toHex(value, 2)}`;
    }

    // 8XY
    case 0x8: {
      const VXIndex = (raw >> 8) & 0xf;
      const VYIndex = (raw >> 4) & 0xf;
      const id = raw & 0xf;

      switch (id) {
        // 8XY0
        // 	Sets VX to the value of VY.
        case 0x0: {
          return `LD   V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`;
        }

        // 8XY1
        // Sets VX to VX or VY. (Bitwise OR operation)
        case 0x1: {
          return `OR   V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`;
        }

        // 8XY2
        // Sets VX to VX and VY. (Bitwise AND operation)
        case 0x2: {
          return `AND  V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`;
        }

        // 8XY3
        // Sets VX to VX xor VY.
        case 0x3: {
          return `XOR  V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`;
        }

        // 8XY4
        // Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
        case 0x4: {
          return `ADD  V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`;
        }

        // 8XY5
        // VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
        case 0x5: {
          return `SUB  V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`;
        }

        // 8XY6
        // Stores the least significant bit of VX in VF and then shifts VX to the right by 1
        case 0x6: {
          return `SHR  V${toHex(VXIndex, 1)}`;
        }

        // 8XY7
        // Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
        case 0x7: {
          return `SUBN V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`;
        }

        // 8XYE
        // Stores the most significant bit of VX in VF and then shifts VX to the left by 1
        case 0xe: {
          return `SHL  V${toHex(VXIndex, 1)}`;
        }
      }

      return;
    }

    // 9XY0
    // Skips the next instruction if VX doesn't equal VY. (Usually the next instruction is a jump to skip a code block)
    case 0x9: {
      const VXIndex = (raw >> 8) & 0xf;
      const VYIndex = (raw >> 4) & 0xf;
      return `SNE  V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`;
    }

    // ANNN
    // Sets I to the address NNN.
    case 0xa: {
      const address = raw & 0xfff;
      return `LD   I, ${toHex(address)}`;
    }

    // BNNN
    // Jumps to the address NNN plus V0.
    case 0xb: {
      const address = raw & 0xfff;
      return `JP   V0, V${toHex(address)}`;
    }

    // CXNN
    // Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN.
    case 0xc: {
      const VXIndex = (raw >> 8) & 0xf;
      const value = raw & 0xff;
      return `RND  V${toHex(VXIndex, 1)}, ${toHex(value, 2)}`;
    }

    // DXYN
    // Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N+1 pixels.
    // Each row of 8 pixels is read as bit-coded starting from memory location I;
    // I value doesn’t change after the execution of this instruction.
    // As described above, VF is set to 1 if any screen pixels are flipped from set to unset when the sprite is drawn, and to 0 if that doesn’t happen
    case 0xd: {
      const VXIndex = (raw >> 8) & 0xf;
      const VYIndex = (raw >> 4) & 0xf;
      const quantity = (raw & 0xf) + 1;
      return `DRW  V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}, ${toHex(quantity, 1)}`;
    }

    case 0xe: {

      const id = raw & 0xff;

      switch (id) {
        // EX9E
        // Skips the next instruction if the key stored in VX is pressed. (Usually the next instruction is a jump to skip a code block)
        case 0x9e: {
          const VXIndex = (raw >> 8) & 0xf;
          return `SKP  V${toHex(VXIndex, 1)}`;
        }

        // EXA1
        // Skips the next instruction if the key stored in VX isn't pressed. (Usually the next instruction is a jump to skip a code block)
        case 0xa1: {
          const VXIndex = (raw >> 8) & 0xf;
          return `SKNP V${toHex(VXIndex, 1)}`;
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
          return `LD   V${toHex(VXIndex, 1)}, DT`;
        }

        // FX0A
        // A key press is awaited, and then stored in VX. (Blocking Operation. All instruction halted until next key event)
        case 0x0a: {
          const VXIndex = (raw >> 8) & 0xf;
          return `LD   V${toHex(VXIndex, 1)}, K`;
        }

        // FX15
        // Sets the delay timer to VX.
        case 0x15: {
          const VXIndex = (raw >> 8) & 0xf;
          return `LD   DT, V${toHex(VXIndex, 1)}`;
        }

        // FX18
        // Sets the sound timer to VX.
        case 0x18: {
          const VXIndex = (raw >> 8) & 0xf;
          return `LD   ST, V${toHex(VXIndex, 1)}`;
        }

        // FX1E
        // Adds VX to I. VF is not affected
        case 0x1e: {
          const VXIndex = (raw >> 8) & 0xf;
          return `ADD  I, V${toHex(VXIndex, 1)}`;
        }

        // FX29
        // Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font.
        case 0x29: {
          const VXIndex = (raw >> 8) & 0xf;
          return `LD   F, V${toHex(VXIndex, 1)}`;
        }

        // FX33
        // Store BCD representation of Vx in memory locations I, I+1, and I+2.
        case 0x33: {
          const VXIndex = (raw >> 8) & 0xf;
          return `LD   B, V${toHex(VXIndex, 1)}`;
        }

        // FX55
        // Stores V0 to VX (including VX) in memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified.
        case 0x55: {
          const VXIndex = (raw >> 8) & 0xf;
          return `LD   [I], V${toHex(VXIndex, 1)}`;
        }

        // FX65
        // Fills V0 to VX (including VX) with values from memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified.
        case 0x65: {
          const VXIndex = (raw >> 8) & 0xf;
          return `LD   V${toHex(VXIndex, 1)}, [I]`;
        }
      }
      return '';
    }
  }
}

export default {decode};