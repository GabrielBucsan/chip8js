import chip8Logo from './roms/chip8logo.js';
import invaders from './roms/invaders.js';
import test1 from './roms/test1.js';
import test2 from './roms/test2.js';
import pong from './roms/pong.js';
import trip8 from './roms/trip8.js';
import tetris from './roms/tetris.js';
import puzzle15 from './roms/15puzzle.js';
import brix from './roms/brix.js';
import maze from './roms/maze.js';
import life from './roms/life.js';
import intro from './roms/intro.js';
import rndTest from './roms/rndTest.js';
import fishie from './roms/fishie.js';
import particles from './roms/particles.js';
import sierpinski from './roms/sierpinski.js';
import bowling from './roms/bowling.js';
import rushhour from './roms/rushhour.js';

const roms = [
  {
    name: 'Intro',
    id: 'intro',
    file: intro
  },{
    name: 'Bowling',
    id: 'bowling',
    file: bowling
  },{
    name: 'Brix',
    id: 'brix',
    file: brix
  },{
    name: 'Chip8 Logo',
    id: 'chip8Logo',
    file: chip8Logo
  },{
    name: 'Fishie',
    id: 'fishie',
    file: fishie
  },{
    name: 'Life',
    id: 'life',
    file: life
  },{
    name: 'Maze',
    id: 'maze',
    file: maze
  },{
    name: 'Particles',
    id: 'particles',
    file: particles
  },{
    name: 'Pong',
    id: 'pong',
    file: pong
  },{
    name: 'Puzzle 15',
    id: 'puzzle15',
    file: puzzle15
  },{
    name: 'Random Number Test',
    id: 'rndTest',
    file: rndTest
  },{
    name: 'Rush Hour',
    id: 'rushhour',
    file: rushhour
  },{
    name: 'Sierpinski',
    id: 'sierpinski',
    file: sierpinski
  },{
    name: 'Space Invaders',
    id: 'invaders',
    file: invaders
  },{
    name: 'Test 1',
    id: 'test1',
    file: test1
  },{
    name: 'Test 2',
    id: 'test2',
    file: test2
  },{
    name: 'Tetris',
    id: 'tetris',
    file: tetris
  },{
    name: 'Trip8',
    id: 'trip8',
    file: trip8
  }
]

export default roms;