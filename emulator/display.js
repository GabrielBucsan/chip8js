import mem from "./memory.js";

class Display {
  constructor(sizeX, sizeY, clear = false) {
    this.sizeX = sizeX / 8;
    this.sizeY = sizeY;
    this.clear = clear;

    this.displayMemory = mem.createMemory(this.sizeX * this.sizeY);

    this.topLine = '     ';
    this.bottomLine = '     ';

    for (let i = 0; i < 64; i++) {
      this.topLine += `${Math.floor(i / 10)} `;
      this.bottomLine += `${i % 10} `;
    }
  }

  test() {
    for (let y = 0; y < this.sizeY; y++) {
      for (let x = 0; x < this.sizeX; x++) {
        this.displayMemory.setUint8(y * this.sizeX + x, Math.floor(Math.random() * 255) + 1);
      }
    }
  }

  clearDisplay() {
    this.displayMemory = mem.createMemory(this.sizeX * this.sizeY);
  }

  drawSprite(xPos, yPos, data) {

    let alteredPixels = false;

    for (let i = 0; i < data.length; i++) {

      const xIndex1 = xPos % 8;

      let modifiedData = parseInt(data[i], 2) >> xIndex1;
      let index = ((yPos + i) % this.sizeY) * this.sizeX + (Math.floor((xPos % (this.sizeX * 8)) / this.sizeX));
      if(index > 255) index = 0;
      let currentValue = this.displayMemory.getUint8(index);
      if ((currentValue & modifiedData) > 0) alteredPixels = true;
      let value = currentValue ^ modifiedData;
      this.displayMemory.setUint8(index, value);

      if (xIndex1 != 0) {
        modifiedData = (parseInt(data[i], 2) << (8 - xIndex1)) & 0xFF;
        if(index + 1 > 255) index = -1;
        currentValue = this.displayMemory.getUint8((index + 1));
        if ((currentValue & modifiedData) > 0) alteredPixels = true;
        value = currentValue ^ modifiedData;
        if ((Math.floor((xPos % (this.sizeX * 8)) / this.sizeX)) + 1 < this.sizeX)
          this.displayMemory.setUint8((index + 1), value);
      }
    }

    return alteredPixels;
  }

  print() {
    if (this.clear)
      console.clear();

    console.log(this.topLine);
    console.log(this.bottomLine);
    console.log("    ".padEnd(134, '_'));
    console.log("   |" + "".padEnd(130, ' ') + "|");

    for (let y = 0; y < this.sizeY; y++) {

      let line = `${y.toString().padStart(2, '0')} | `;

      for (let x = 0; x < this.sizeX; x++) {
        let binary = this.displayMemory.getUint8(y * this.sizeX + x).toString(2).padStart(8, '0');
        let result = binary.replace(/1/g, "▓▓").replace(/0/g, '  ');
        line += result;
      }

      line += ' |';
      console.log(line);
    }

    console.log("   |" + "".padStart(130, '_') + "|");
  }
}

export default Display;