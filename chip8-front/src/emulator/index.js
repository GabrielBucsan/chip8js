$(document).ready(()=>{
    /* 
    
    CHIP8 HAS A TOTAL OF 4096 (4KB) OF ADDRESSABLE MEMORY TO WORK WITH
    
    THE FISRT 512 BYTES ARE USED FOR THE INTERPRETER ITSELF. NO PROGRAM DATA CAN ACCESS THOSE ADDRESSES (FROM 0X000 TO 0X1FF)
    THE REST OF THE MEMORY CAN BE USED BY THE PROGRAMS (FROM 0X200 TO 0XFFF)
    
    */
    const memory = createMemory(4096);
    
    const display = new Display(64, 32);
    
    const cpu = new CPU(memory, display);
    
    const writable = new Uint8Array(30);
    let i = 0;
    
    writable[i++] = 0x60;
    writable[i++] = 0x05;
    
    writable[i++] = 0xA0;
    writable[i++] = 0x05;
    
    writable[i++] = 0xD0;
    writable[i++] = 0x04;

    // const fps = 60;
    // const interval = setInterval(() => {
    //     console.clear();
    //     cpu.step();
    //     cpu.viewRegisters();
    //     cpu.viewMemoryAt(cpu.programCounter.getUint16(0));
    //     cpu.viewKeys();
    //     display.print();
    // }, 1000 / fps);
    
    // cpu.loadProgram(writable);
    // console.clear();
    // //display.test();
    // cpu.viewRegisters();
    // cpu.viewMemoryAt(cpu.programCounter.getUint16(0));
    // display.print();
    
    // let program;
    
    // fs.readFile('./roms/BMP Viewer - Hello (C8 example) [Hap, 2005].ch8', function (err,data) {
    //     if (err) {
    //         throw new Error(err);
    //     }
    //     program = new Uint8Array(data);
    //     cpu.loadProgram(program);
    //     console.clear();
    //     //display.test();
    //     cpu.viewRegisters();
    //     //cpu.viewMemoryAt(cpu.programCounter.getUint16(0));
    //     cpu.viewKeys();
    //     display.print();
    
    //     const fps = 60;
    //     const interval = setInterval(() => {
    //         console.clear();
    //         cpu.step();
    //         cpu.viewRegisters();
    //         //cpu.viewMemoryAt(cpu.programCounter.getUint16(0));
    //         cpu.viewKeys();
    //         display.print();
    //     }, 1000 / fps);
    // });
    
    // const fps = 60;
    // const interval = setInterval(() => {
    //     console.clear();
    //     cpu.step();
    //     cpu.viewRegisters();
    //     cpu.viewMemoryAt(cpu.programCounter.getUint16(0));
    //     cpu.viewKeys();
    //     display.print();
    // }, 1000 / fps);
    
    // const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    // });
    
    // rl.on('line', () => {
    //     console.clear();
    //     cpu.step();
    //     cpu.viewRegisters();
    //     cpu.viewMemoryAt(cpu.programCounter.getUint16(0));
        // cpu.viewKeys();
    //     display.print();
    // });
});
