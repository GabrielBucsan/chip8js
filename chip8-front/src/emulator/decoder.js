const toHex = function(value, number = 4){
  return Number(value).toString(16).padStart(number, "0").toUpperCase();
}

const decode = function(raw){
  const instruction = raw >> 12;

  switch (instruction) {
    case 0x0: {
      const id = raw & 0xff;

      switch (id) {
        case 0xe0: {
          return {
            mnem: 'CLS',
            opcode: '00E0',
            desc: 'Clears the screen'
          };
        }
        case 0xee: {
          return {
            mnem: 'RET',
            opcode: '00EE',
            desc: 'Returns from a subroutine'
          };
        }
      }

      return '';
    }
    case 0x1: {
      const address = raw & 0xfff;
      return {
            mnem: `JP\xa0\xa0\xa0${toHex(address)}`,
            opcode: '1NNN',
            desc: `Jumps to address ${toHex(address)}`
          };
    }
    case 0x2: {
      const address = raw & 0xfff;
      return {
            mnem: `CALL ${toHex(address)}`,
            opcode: '2NNN',
            desc: `Calls subroutine at ${toHex(address)}`
          };
    }
    case 0x3: {
      const VXIndex = (raw >> 8) & 0xf;
      const value = raw & 0xff;
      return {
            mnem: `SE\xa0\xa0\xa0V${toHex(VXIndex, 1)}, ${toHex(value, 2)}`,
            opcode: '3XNN',
            desc: `Skips the next instruction if V${toHex(VXIndex, 1)} equals ${toHex(value, 2)}. (Usually the next instruction is a jump to skip a code block)`
          };
    }
    case 0x4: {
      const VXIndex = (raw >> 8) & 0xf;
      const value = raw & 0xff;
      return {
            mnem: `SNE\xa0\xa0V${toHex(VXIndex, 1)}, ${toHex(value, 2)}`,
            opcode: '4XNN',
            desc: `Skips the next instruction if V${toHex(VXIndex, 1)} doesn't equal ${toHex(value, 2)}. (Usually the next instruction is a jump to skip a code block)`
          };
    }
    case 0x5: {
      const VXIndex = (raw >> 8) & 0xf;
      const VYIndex = (raw >> 4) & 0xf;
      return {
            mnem: `SE\xa0\xa0\xa0V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`,
            opcode: '5XY0',
            desc: `Skips the next instruction if V${toHex(VXIndex, 1)} equals V${toHex(VYIndex, 1)}. (Usually the next instruction is a jump to skip a code block)`
          };
    }
    case 0x6: {
      const VXIndex = (raw >> 8) & 0xf;
      const value = raw & 0xff;
      return {
            mnem: `LD\xa0\xa0\xa0V${toHex(VXIndex, 1)}, ${toHex(value, 2)}`,
            opcode: '6XNN',
            desc: `Sets V${toHex(VXIndex, 1)} to ${toHex(value, 2)}.`
          };
    }
    case 0x7: {
      const VXIndex = (raw >> 8) & 0xf;
      const value = raw & 0xff;
      return {
            mnem: `ADD\xa0\xa0V${toHex(VXIndex, 1)}, ${toHex(value, 2)}`,
            opcode: '7XNN',
            desc: `Adds ${toHex(value, 2)} to V${toHex(VXIndex, 1)}. (Carry flag is not changed)`
          };
    }

    // 8XY
    case 0x8: {
      const VXIndex = (raw >> 8) & 0xf;
      const VYIndex = (raw >> 4) & 0xf;
      const id = raw & 0xf;

      switch (id) {
        case 0x0: {
          return {
            mnem: `LD\xa0\xa0\xa0V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`,
            opcode: '8XY0',
            desc: `Sets V${toHex(VXIndex, 1)} to the value of V${toHex(VYIndex, 1)}`
          };
        }
        case 0x1: {
          return {
            mnem: `OR\xa0\xa0\xa0V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`,
            opcode: '8XY1',
            desc: `Sets V${toHex(VXIndex, 1)} to V${toHex(VXIndex, 1)} or V${toHex(VYIndex, 1)}. (Bitwise OR operation)`
          };
        }
        case 0x2: {
          return {
            mnem: `AND\xa0\xa0V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`,
            opcode: '8XY2',
            desc: `Sets V${toHex(VXIndex, 1)} to V${toHex(VXIndex, 1)} and V${toHex(VYIndex, 1)}. (Bitwise AND operation)`
          };
        }
        case 0x3: {
          return {
            mnem: `XOR\xa0\xa0V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`,
            opcode: '8XY3',
            desc: `Sets V${toHex(VXIndex, 1)} to V${toHex(VXIndex, 1)} xor V${toHex(VYIndex, 1)}`
          };
        }
        case 0x4: {
          return {
            mnem: `ADD\xa0\xa0V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`,
            opcode: '8XY4',
            desc: `Adds V${toHex(VYIndex, 1)} to V${toHex(VXIndex, 1)}. VF is set to 1 when there's a carry, and to 0 when there isn't`
          };
        }
        case 0x5: {
          return {
            mnem: `SUB\xa0\xa0V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`,
            opcode: '8XY5',
            desc: `V${toHex(VYIndex, 1)} is subtracted from V${toHex(VXIndex, 1)}. VF is set to 0 when there's a borrow, and 1 when there isn't`
          };
        }
        case 0x6: {
          return {
            mnem: `SHR\xa0\xa0V${toHex(VXIndex, 1)}`,
            opcode: '8XY6',
            desc: `Stores the least significant bit of V${toHex(VXIndex, 1)} in VF and then shifts V${toHex(VXIndex, 1)} to the right by 1`
          };
        }
        case 0x7: {
          return {
            mnem: `SUBN\xa0V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`,
            opcode: '8XY7',
            desc: `Sets V${toHex(VXIndex, 1)} to V${toHex(VYIndex, 1)} minus V${toHex(VXIndex, 1)}. VF is set to 0 when there's a borrow, and 1 when there isn't`
          };
        }
        case 0xe: {
          return {
            mnem: `SHL\xa0\xa0V${toHex(VXIndex, 1)}`,
            opcode: '8XYE',
            desc: `Stores the most significant bit of V${toHex(VXIndex, 1)} in VF and then shifts V${toHex(VXIndex, 1)} to the left by 1`
          };
        }
      }

      return;
    }
    case 0x9: {
      const VXIndex = (raw >> 8) & 0xf;
      const VYIndex = (raw >> 4) & 0xf;
      return {
            mnem: `SNE\xa0\xa0V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}`,
            opcode: '9XY0',
            desc: `Skips the next instruction if V${toHex(VXIndex, 1)} doesn't equal V${toHex(VYIndex, 1)}. (Usually the next instruction is a jump to skip a code block)`
          };
    }
    case 0xa: {
      const address = raw & 0xfff;
      return {
            mnem: `LD\xa0\xa0\xa0I, ${toHex(address)}`,
            opcode: 'ANNN',
            desc: `Sets I to the address ${toHex(address)}`
          };
    }
    case 0xb: {
      const address = raw & 0xfff;
      return {
            mnem: `JP\xa0\xa0\xa0V0, V${toHex(address)}`,
            opcode: 'BNNN',
            desc: `Jumps to the address ${toHex(address)} plus V0`
          };
    }
    case 0xc: {
      const VXIndex = (raw >> 8) & 0xf;
      const value = raw & 0xff;
      return {
            mnem: `RND\xa0\xa0V${toHex(VXIndex, 1)}, ${toHex(value, 2)}`,
            opcode: 'CXNN',
            desc: `Sets V${toHex(VXIndex, 1)} to the result of a bitwise and operation on a random number (Typically: 0 to 255) and ${toHex(value, 2)}`
          };
    }
    case 0xd: {
      const VXIndex = (raw >> 8) & 0xf;
      const VYIndex = (raw >> 4) & 0xf;
      const quantity = (raw & 0xf) + 1;
      return {
            mnem: `DRW\xa0\xa0V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}, ${toHex(quantity, 1)}`,
            opcode: 'DXYN',
            desc: `Draws a sprite at coordinate (V${toHex(VXIndex, 1)}, V${toHex(VYIndex, 1)}) that has a width of 8 pixels and a height of ${quantity + 1} pixels. Each row of 8 pixels is read as bit-coded starting from memory location I. I value doesn’t change after the execution of this instruction. As described above, VF is set to 1 if any screen pixels are flipped from set to unset when the sprite is drawn, and to 0 if that doesn’t happen`
          };
    }

    case 0xe: {

      const id = raw & 0xff;

      switch (id) {
        case 0x9e: {
          const VXIndex = (raw >> 8) & 0xf;
          return {
            mnem: `SKP\xa0\xa0V${toHex(VXIndex, 1)}`,
            opcode: 'EX9E',
            desc: `Skips the next instruction if the key stored in V${toHex(VXIndex, 1)} is pressed. (Usually the next instruction is a jump to skip a code block)`
          };
        }
        case 0xa1: {
          const VXIndex = (raw >> 8) & 0xf;
          return {
            mnem: `SKNP\xa0V${toHex(VXIndex, 1)}`,
            opcode: 'EXA1',
            desc: `Skips the next instruction if the key stored in V${toHex(VXIndex, 1)} isn't pressed. (Usually the next instruction is a jump to skip a code block)`
          };
        }
      }
      return;
    }

    case 0xf: {

      const id = raw & 0xff;

      switch (id) {
        case 0x07: {
          const VXIndex = (raw >> 8) & 0xf;
          return {
            mnem: `LD\xa0\xa0\xa0V${toHex(VXIndex, 1)}, DT`,
            opcode: 'FX07',
            desc: `Sets V${toHex(VXIndex, 1)} to the value of the delay timer`
          };
        }
        case 0x0a: {
          const VXIndex = (raw >> 8) & 0xf;
          return {
            mnem: `LD\xa0\xa0\xa0V${toHex(VXIndex, 1)}, K`,
            opcode: 'FX0A',
            desc: `A key press is awaited, and then stored in V${toHex(VXIndex, 1)}. (Blocking Operation. All instruction halted until next key event)`
          };
        }
        case 0x15: {
          const VXIndex = (raw >> 8) & 0xf;
          return {
            mnem: `LD\xa0\xa0\xa0DT, V${toHex(VXIndex, 1)}`,
            opcode: 'FX15',
            desc: `Sets the delay timer to V${toHex(VXIndex, 1)}`
          };
        }
        case 0x18: {
          const VXIndex = (raw >> 8) & 0xf;
          return {
            mnem: `LD\xa0\xa0\xa0ST, V${toHex(VXIndex, 1)}`,
            opcode: 'FX18',
            desc: `Sets the sound timer to V${toHex(VXIndex, 1)}`
          };
        }
        case 0x1e: {
          const VXIndex = (raw >> 8) & 0xf;
          return {
            mnem: `ADD\xa0\xa0I, V${toHex(VXIndex, 1)}`,
            opcode: 'FX1E',
            desc: `Adds V${toHex(VXIndex, 1)} to I. VF is not affected`
          };
        }
        case 0x29: {
          const VXIndex = (raw >> 8) & 0xf;
          return {
            mnem: `LD\xa0\xa0\xa0F, V${toHex(VXIndex, 1)}`,
            opcode: 'FX29',
            desc: `Sets I to the location of the sprite for the character in V${toHex(VXIndex, 1)}. Characters 0-F (in hexadecimal) are represented by a 4x5 font`
          };
        }
        case 0x33: {
          const VXIndex = (raw >> 8) & 0xf;
          return {
            mnem: `LD\xa0\xa0\xa0B, V${toHex(VXIndex, 1)}`,
            opcode: 'FX33',
            desc: `Store BCD representation of V${toHex(VXIndex, 1)} in memory locations I, I+1, and I+2`
          };
        }
        case 0x55: {
          const VXIndex = (raw >> 8) & 0xf;
          return {
            mnem: `LD\xa0\xa0\xa0[I], V${toHex(VXIndex, 1)}`,
            opcode: 'FX55',
            desc: `Stores V0 to V${toHex(VXIndex, 1)} (including V${toHex(VXIndex, 1)}) in memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified`
          };
        }
        case 0x65: {
          const VXIndex = (raw >> 8) & 0xf;
          return {
            mnem: `LD\xa0\xa0\xa0V${toHex(VXIndex, 1)}, [I]`,
            opcode: 'FX65',
            desc: `Fills V0 to V${toHex(VXIndex, 1)} (including V${toHex(VXIndex, 1)}) with values from memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified`
          };
        }
      }
      return '';
    }
  }
}

export default {decode};