
import {
  draw,
  drawStartLoop,
  prepareFrame,
  drawWorld,
  drawHUD,
  handleBossLogic,
  drawEndScreensIfNeeded,
  handlePauseInput,
  scheduleNextFrame,
  addObjectsToMap,
  addToMap,
  togglePause
} from "./world.draw.js";

import {
  checkCollisions,
  processEnemyCollision,
  shouldProcessCollision,
  handleAttackCollision,
  handleCharacterDamage,
  checkProjectileCollisions,
  processProjectileCollision,
  applyProjectileDamage,
  updateBossHealth,
  applyEndbossHurtState,
  removeMarkedProjectiles
} from "./world.collision.js";


import {
  checkThrowObjects,
  canThrowBubble,
  createBubble,
  startThrowAnimation
} from "./world.throw.js";

import {
  applyMuteState,
  playBackgroundSound,
  stopBackgroundSound
} from "./world.sounds.js";


export class World {

  character = new Character();
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  endbossSpawned = false;
  endboss = null;

  statusBarLife = new StatusBar("life", 100, 20, 0);
  statusBarCoin = new StatusBar("coins", 0, 20, 50);
  statusBarPoison = new StatusBar("poison", 0, 20, 100);

  throwableObjects = [];
  collectibleObject = [
    new CollectableObject("coin"),
    new CollectableObject("coin"),
    new CollectableObject("coin"),
    new CollectableObject("coin"),
    new CollectableObject("coin"),
    new CollectableObject("poison"),
    new CollectableObject("poison"),
    new CollectableObject("poison"),
    new CollectableObject("poison"),
    new CollectableObject("poison"),
    new CollectableObject("poison"),
    new CollectableObject("poison"),
  ];

  gameOverImg = new Image();
  tryAgainImg = new Image();
  tryAgainButton = null;
  winImg = new Image();
  gameWon = false;
  startImg = new Image();
  gameStarted = false;
  startButton = null;
  isPaused = false;
  backgroundPlaying = false;


  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = createLevel1();
    this.level.enemies.forEach(e => {
      e.world = this;
      if (e.startBehavior) e.startBehavior();
    });
    this.loadUIImages();
    this.canvas.addEventListener("click", () => this.handleCanvasClick());
    this.bossHealthBar = new StatusBar("life", 100, 450, 0);
    this.initWorldSystems()
  }

  initWorldSystems() {
  this.draw();
  this.setWorld();
  this.checkThrowObjects();
  this.checkCollisions();
  this.checkProjectileCollisions();
  this.checkCollectableCollisions();
}

loadUIImages() {
    this.gameOverImg.src = "img/6.Botones/Tittles/Game Over/Recurso 9.png";
    this.tryAgainImg.src = "img/6.Botones/Try again/Recurso 15.png";
    this.winImg.src = "img/6.Botones/Tittles/You win/Recurso 22.png";
    this.startImg.src = "img/6.Botones/Start/3.png";
}


  setWorld() {
    this.character.world = this;
  }

   /**
 * Handles logic when collecting an item.
 * Updates coin or poison bar and plays coin sound if applicable.
 */
  handleCollectable(item) {
    if (item.type === "coin") {
      const bar = this.statusBarCoin;
      const newValue = Math.min(bar.percentage_coin + 20, 100);
      bar.setPercentageCoin(newValue);
      Sounds.coin.play();
    } else if (item.type === "poison") {
      const bar = this.statusBarPoison;
      const newValue = Math.min(bar.percentage_poison + 20, 100);
      bar.setPercentagePoison(newValue);
    }
  }

/**
 * Processes collision with a collectible item.
 * Applies its effect, then removes it from the world.
 */
  processCollectableCollision(item, index) {
    if (!this.character.isColliding(item)) return;
    this.handleCollectable(item);
    this.collectibleObject.splice(index, 1);
  }

  /**
 * Periodically checks for collisions with collectible items.
 * Processes collection when detected.
 */
  checkCollectableCollisions() {
    setInterval(() => {
      if (this.isPaused) return;
      this.collectibleObject.forEach((item, index) => {
        this.processCollectableCollision(item, index);
      });
    }, 1000 / 10);
  }

  /**
 * Spawns the endboss when the character reaches the end-zone trigger.
 * Ensures boss is created only once and linked to the world.
 */
  checkBossSpawn() {
    if (this.isPaused) return;
    if (
      !this.endbossSpawned &&
      this.character.x > this.level.level_end_x - 500
    ) {
      let boss = new Endboss();
      this.level.enemies.push(boss);
      this.endboss = boss;
      this.endbossSpawned = true;
      boss.world = this;
    }
  }

  /**
 * Checks if the game is over based on the character's death animation.
 * Restarts game if finished.
 * @returns {boolean} True if game over was handled.
 */
  checkGameOver() {
    if (this.character.deathAnimationFinished) {
      this.restartGame();
      return true;
    }
    return false;
  }

  /**
 * Checks if the game has been won.
 * Restarts the game if victory is detected.
 * @returns {boolean} True if win state was handled.
 */
  checkWin() {
    if (this.gameWon) {
      this.restartGame();
      return true;
    }
    return false;
  }

  handleCanvasClick() {
    if (!this.gameStarted && this.startButton) {
      this.gameStarted = true;
      this.startButton = null;
      this.canvas.style.cursor = "default";
      this.restartGame();
      this.playBackgroundSound();
      return;
    }
    if (this.checkGameOver()) return;
    if (this.checkWin()) return;
  }

    /**
 * Fully resets and restarts the game.
 * Restores world + character state, reloads level, resets UI bars,
 * rebuilds collectibles/enemies, and restarts background audio.
 */
  restartGame() {
    this.resetWorldState();
    this.resetCharacter();
    this.loadLevel();
    this.resetStatusBars();
    this.resetCollectibles();
    this.initializeEnemies();
    this.playBackgroundSound();
  }

  /**
 * Resets core world state flags and values for a fresh game start.
 */
  resetWorldState() {
    this.isPaused = false;
    this.tryAgainButton = null;
    this.camera_x = 0;
    this.gameWon = false;
    this.backgroundPlaying = false;
    this.endbossSpawned = false;
    this.endboss = null;
  }

  /**
 * Resets all character stats and animation states to default values.
 */
  resetCharacter() {
    Object.assign(this.character, {
      energy: 100,
      x: 120,
      y: 100,
      currentImage: 0,
      deathAnimationFinished: false,
      death: false,
      lastHit: 0,
      otherDirection: false,
      isAttacking: false,
      isShooting: false,
      lastActionTime: Date.now(),
    });
  }

  loadLevel() {
    this.level = createLevel1();
  }

  /**
 * Recreates all status bars with default values and positions.
 */
  resetStatusBars() {
    this.statusBarLife = new StatusBar("life", 100, 20, 0);
    this.statusBarCoin = new StatusBar("coins", 0, 20, 50);
    this.statusBarPoison = new StatusBar("poison", 0, 20, 100);
    this.bossHealthBar = new StatusBar("life", 100, 450, 0);
  }

  /**
 * Resets collectible items by creating new coin and poison objects.
 * Also clears all throwable projectiles.
 */
  resetCollectibles() {
    const coins = Array(5)
      .fill()
      .map(() => new CollectableObject("coin"));
    const poison = Array(8)
      .fill()
      .map(() => new CollectableObject("poison"));
    this.collectibleObject = [...coins, ...poison];
    this.throwableObjects = [];
  }

  /**
 * Initializes all enemies in the level.
 * Assigns world reference and starts their behavior routines.
 */
  initializeEnemies() {
    this.level.enemies.forEach((e) => {
      e.world = this;
      if (e.startBehavior) e.startBehavior();
    });
  }
}


Object.assign(World.prototype, {

  draw,
  drawStartLoop,
  prepareFrame,
  drawWorld,
  drawHUD,
  handleBossLogic,
  drawEndScreensIfNeeded,
  handlePauseInput,
  scheduleNextFrame,
  addObjectsToMap,
  addToMap,
  togglePause,

  checkCollisions,
  processEnemyCollision,
  shouldProcessCollision,
  handleAttackCollision,
  handleCharacterDamage,

  checkProjectileCollisions,
  processProjectileCollision,
  applyProjectileDamage,
  updateBossHealth,
  applyEndbossHurtState,
  removeMarkedProjectiles,

  checkThrowObjects,
  canThrowBubble,
  createBubble,
  startThrowAnimation,

  applyMuteState,
  playBackgroundSound,
  stopBackgroundSound,
});
