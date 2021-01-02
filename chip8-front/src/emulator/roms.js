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

const roms = [
  {
    name: 'Intro',
    id: 'intro',
    file: intro
  },{
    name: 'Chip8 Logo',
    id: 'chip8Logo',
    file: chip8Logo
  },{
    name: 'Space Invaders',
    id: 'invaders',
    file: invaders
  },{
    name: 'Tetris',
    id: 'tetris',
    file: tetris
  },{
    name: 'Pong',
    id: 'pong',
    file: pong
  },{
    name: 'Trip8',
    id: 'trip8',
    file: trip8
  },{
    name: 'Puzzle 15',
    id: 'puzzle15',
    file: puzzle15
  },{
    name: 'Brix',
    id: 'brix',
    file: brix
  },{
    name: 'Maze',
    id: 'maze',
    file: maze
  },{
    name: 'Life',
    id: 'life',
    file: life
  },{
    name: 'Test 1',
    id: 'test1',
    file: test1
  },{
    name: 'Test 2',
    id: 'test2',
    file: test2
  }
]

export default roms;