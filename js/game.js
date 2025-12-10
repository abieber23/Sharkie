import { World } from "../models/world.js";

let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  window.world = world;
  window.keyboard = keyboard;
}
window.init = init;

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "ArrowDown") {
    e.preventDefault(); 
  }
  if (e.code === "ArrowLeft") keyboard.LEFT = true;
  if (e.code === "ArrowRight") keyboard.RIGHT = true;
  if (e.code === "ArrowUp") keyboard.UP = true;
  if (e.code === "ArrowDown") keyboard.DOWN = true;
  if (e.code === "Space") keyboard.SPACE = true;
  if (e.code === "KeyD") keyboard.ATTACK = true;
  if (e.code === "KeyP");
});

window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") keyboard.LEFT = false;
  if (e.code === "ArrowRight") keyboard.RIGHT = false;
  if (e.code === "ArrowUp") keyboard.UP = false;
  if (e.code === "ArrowDown") keyboard.DOWN = false;
  if (e.code === "Space") keyboard.SPACE = false;
  if (e.code === "KeyP") world.togglePause();
});
