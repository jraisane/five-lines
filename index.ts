
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

enum InputRaw {
  UP, DOWN, LEFT, RIGHT
}

interface Input {
  handle(): void;
}

interface FallingState {
  isFalling(): boolean;
  moveHorizontal(tile: Tile, dx: number): void;
}

class FallStrategy{
  state: FallingState;
  constructor(state: FallingState) {
    this.state = state;
  }
  getState(): FallingState {
    return this.state;
  }
  update(tile: Tile, x: number, y: number): void {
    this.state = map[y + 1][x].isAir() ? new Falling() : new Resting();
    this.drop(tile, x, y);
  }
  private drop(tile: Tile, x: number, y: number): void {
    if(this.state.isFalling()) {
      map[y + 1][x] = tile;
      map[y][x] = new Air();
    }
  }
}

class KeyConfiguration {
  constructor(
    private color: string,
    private keyId: number,
    private removeStrategy: RemoveStrategy) {
  }
  getColor() : string {
    return this.color;
  }
  getKeyId() : number {
    return this.keyId;
  }
  getRemoveStrategy(): RemoveStrategy {
    return this.removeStrategy;
  }
}
interface RemoveStrategy {
  check(tile: Tile): boolean;
}
class RemoveLock1 implements RemoveStrategy {
  check(tile: Tile): boolean {
    return tile.isLock1();
  }
}
class RemoveLock2 implements RemoveStrategy {
  check(tile: Tile): boolean {
    return tile.isLock2();
  }
}
class Falling implements FallingState {
  isFalling(): boolean {
    return true;
  }
  moveHorizontal(tile: Tile, dx: number): void {
  }
}

class Resting implements FallingState {
  isFalling(): boolean {
    return false;
  }
  moveHorizontal(tile: Tile, dx: number): void {
    if (map[playery][playerx + dx + dx].isAir()
    && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = tile;
      moveToTile(playerx + dx, playery);
    }
  }

}


interface Tile {
  draw(y: number, x: number, g: CanvasRenderingContext2D): void;
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
  update(x: number, y: number): void;
  isAir(): boolean;
  isPlayer(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
}

class Air implements Tile {
  update(x: number, y: number): void {
  }
  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }
  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }
  draw(_y: number, _x: number, _g: CanvasRenderingContext2D): void {
  }
  isAir(): boolean {
    return true;
  }
  isPlayer(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
}

class Flux implements Tile {
  update(x: number, y: number): void {
  }
  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }
  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }
  draw(y: number, x: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
}

class Unbreakable implements Tile {
  update(x: number, y: number): void {
  }
  moveVertical(dy: number): void {
  }
  moveHorizontal(dx: number): void {
  }
  draw(y: number, x: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
}

class Player implements Tile {
  update(x: number, y: number): void {
  }
  moveVertical(dy: number): void {
  }
  moveHorizontal(dx: number): void {
  }
  draw(_y: number, _x: number, _g: CanvasRenderingContext2D): void {
  }

  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return true;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
}

class Stone implements Tile {
  strategy: FallStrategy;

  constructor(falling: FallingState) {
    this.strategy = new FallStrategy(falling);
  }
  update(x: number, y: number): void {
    this.strategy.update(this, x, y);
  }
  moveVertical(dy: number): void {
  }
  moveHorizontal(dx: number): void {
    this.strategy.getState().moveHorizontal(this, dx)
  }
  draw(y: number, x: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
}

class Box implements Tile {
  strategy: FallStrategy;

  constructor(falling: FallingState) {
    this.strategy = new FallStrategy(falling);
  }
  update(x: number, y: number): void {
    this.strategy.update(this, x, y);
  }
  moveVertical(dy: number): void {
  }
  moveHorizontal(dx: number): void {
    this.strategy.getState().moveHorizontal(this, dx)
  }
  draw(y: number, x: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
}

class Key implements Tile {
  constructor(private config: KeyConfiguration) {}
  update(x: number, y: number): void {
  }
  moveVertical(dy: number): void {
    remove(this.config.getRemoveStrategy());
    moveToTile(playerx, playery + dy);
  }
  moveHorizontal(dx: number): void {
    remove(this.config.getRemoveStrategy());
    moveToTile(playerx + dx, playery);
  }
  draw(y: number, x: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = this.config.getColor();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
}

class LockedDoor implements Tile {
  constructor(private config: KeyConfiguration) {}
  update(x: number, y: number): void {
  }
  moveVertical(dy: number): void {
  }
  moveHorizontal(dx: number): void {
  }
  draw(y: number, x: number, g: CanvasRenderingContext2D): void {
    g.fillStyle = this.config.getColor();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isLock1(): boolean {
    return this.config.getKeyId() == 1;
  }
  isLock2(): boolean {
    return this.config.getKeyId() == 2;
  }
}

class Right implements Input {
  handle(): void {
    moveHorizontal(1);
  }
}

class Left implements Input {
  handle(): void {
    moveHorizontal(-1);
  }
}

class Up implements Input {
  handle(): void {
    moveVertical(-1);
  }
}

class Down implements Input {
  handle(): void {
    moveVertical(1);
  }
}

const YELLOW_KEY = new KeyConfiguration('#ffcc00', 1, new RemoveLock1())
const TEAL_KEY = new KeyConfiguration('#00ccff', 2, new RemoveLock2())
let playerx = 1;
let playery = 1;
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let map: Tile[][];

function assertExhausted(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

function transformMap(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR: return new Air();
    case RawTile.FLUX: return new Flux();
    case RawTile.UNBREAKABLE: return new Unbreakable();
    case RawTile.PLAYER: return new Player();
    case RawTile.STONE: return new Stone(new Resting());
    case RawTile.FALLING_STONE: return new Stone(new Falling());
    case RawTile.BOX: return new Box(new Resting());
    case RawTile.FALLING_BOX: return new Box(new Falling());
    case RawTile.KEY1: return new Key(YELLOW_KEY);
    case RawTile.LOCK1: return new LockedDoor(YELLOW_KEY);
    case RawTile.KEY2: return new Key(TEAL_KEY);
    case RawTile.LOCK2: return new LockedDoor(TEAL_KEY);
    default: assertExhausted(tile);
  }
}

function createMap() {
  map = rawMap.map<Tile[]>(row => row.map<Tile>(transformMap))
}

let inputs: Input[] = [];

function remove(shouldRemove: RemoveStrategy) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (shouldRemove.check(map[y][x])) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function moveHorizontal(dx: number) {
  map[playery][playerx + dx].moveHorizontal(dx);
}

function moveVertical(dy: number) {
  map[playery + dy][playerx].moveVertical(dy);
}

function update() {
  handleInputs();
  updateMap();
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(y, x);
    }
  }
}

function updateTile(y: number, x: number) {
  map[y][x].update(x,y);
}

function handleInputs() {
  while (inputs.length > 0) {
    let current = inputs.pop();
    current.handle();
  }
}

function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

function createGraphics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(y, x, g);
    }
  }
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  createMap();
  gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

