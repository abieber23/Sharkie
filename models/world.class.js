class World {
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
    this.level.enemies.forEach((e) => {
      e.world = this;
      if (e.startBehavior) e.startBehavior();
    });
    this.gameOverImg.src = "img/6.Botones/Tittles/Game Over/Recurso 9.png";
    this.tryAgainImg.src = "img/6.Botones/Try again/Recurso 15.png";
    this.winImg.src = "img/6.Botones/Tittles/You win/Recurso 22.png";
    this.startImg.src = "img/6.Botones/Start/3.png";
    this.canvas.addEventListener("click", () => this.handleCanvasClick());
    this.draw();
    this.setWorld();
    this.checkThrowObjects();
    this.checkCollisions();
    this.checkProjectileCollisions();
    this.checkCollectableCollisions();
    this.bossHealthBar = new StatusBar("life", 100, 450, 0);
  }

  /**
 * Assigns this world instance to the character.
 */
  setWorld() {
    this.character.world = this;
  }

  /**
 * Main draw cycle.
 * Renders start screen if not started; otherwise draws world, HUD,
 * boss logic, end screens, pause handling, and schedules next frame.
 */
draw() {
    if (!this.gameStarted) return this.drawStartLoop();
    this.prepareFrame();
    this.drawWorld();
    this.drawHUD();
    this.handleBossLogic();
    this.drawEndScreensIfNeeded();
    this.handlePauseInput();
    this.scheduleNextFrame();
  }

  /**
 * Continuously renders the start screen until the game begins.
 * Uses requestAnimationFrame for looping.
 */
  drawStartLoop() {
    drawStartScreen(this);
    return requestAnimationFrame(() => this.draw());
  }
  
  /**
 * Prepares the frame by clearing the canvas and applying camera translation.
 */
  prepareFrame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
  }
  
  /**
 * Draws all world elements in correct order.
 * Renders background, character, enemies, collectibles, and projectiles.
 * Removes marked enemies before drawing and resets camera translation.
 */
  drawWorld() {
    this.addObjectsToMap(this.level.backroundObjects);
    this.addToMap(this.character);
    this.level.enemies = this.level.enemies.filter(e => !e.markedForRemoval);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.collectibleObject);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }
  
  /**
 * Draws HUD elements such as life, coin, and poison bars.
 */
  drawHUD() {
    this.addToMap(this.statusBarLife);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarPoison);
  }
  
  /**
 * Handles boss-related logic.
 * Spawns boss when needed and draws its health bar if alive.
 */
  handleBossLogic() {
    this.checkBossSpawn();
    if (this.endboss && !this.endboss.isDead()) {
      this.addToMap(this.bossHealthBar);
    }
  }
  
  /**
 * Displays win or game-over screen when conditions are met.
 * Triggers win sound, then draws the appropriate end screen.
 */
  drawEndScreensIfNeeded() {
    if (!this.gameWon && this.endboss && this.endboss.isDead()) {
      this.gameWon = true;
      Sounds.win.play();
    }
    if (this.gameWon) {
      drawEndScreen(this, this.winImg);
    } else if (this.character.deathAnimationFinished) {
      drawEndScreen(this, this.gameOverImg);
    }
  }

  /**
 * Checks pause key input and toggles pause state if pressed.
 */
  handlePauseInput() {
    if (this.keyboard.PAUSE) {
      this.togglePause();
    }
  }
  
  /**
 * Schedules the next animation frame for the game loop.
 */
  scheduleNextFrame() {
    requestAnimationFrame(() => this.draw());
  }
  
/**
 * Adds multiple objects to the render map.
 * Iterates through the list and draws each object.
 */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
 * Draws a game object, flipping it horizontally if needed.
 * Also draws its frame for debugging or outlining.
 */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.ctx.save();
      this.ctx.translate(2 * mo.x + mo.width, 0);
      this.ctx.scale(-1, 1);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) {
      this.ctx.restore();
    }
  }

  /**
 * Toggles the game's pause state.
 * Pauses all sounds when pausing; resumes background sound when unpausing.
 */
  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      for (let s in Sounds) {
        Sounds[s].pause();
      }
    } else {
      Sounds.background.play();
      this.backgroundPlaying = true;
    }
  }
  
  /**
 * Periodically checks collisions with enemies.
 * Skips processing when paused.
 */
  checkCollisions() {
    this.collisionTimer = setInterval(() => {
      if (this.isPaused) return;
      this.level.enemies.forEach((enemy) => {
        this.processEnemyCollision(enemy);
      });
    }, 1000);
  }

  /**
 * Handles collision logic with a single enemy.
 * Processes attack collisions or applies damage to the character.
 */
  processEnemyCollision(enemy) {
    if (!this.shouldProcessCollision(enemy)) return;
    if (this.character.isAttacking) {
      this.handleAttackCollision(enemy);
    } else {
      this.handleCharacterDamage(enemy);
    }
  }

  /**
 * Determines whether a collision with the enemy should be processed.
 * @returns {boolean} True if character is alive and colliding.
 */
  shouldProcessCollision(enemy) {
    return !this.character.isDead() && this.character.isColliding(enemy);
  }

  /**
 * Handles collision when the character is attacking.
 * Deals damage and triggers enemy death if health reaches zero.
 */
  handleAttackCollision(enemy) {
    enemy.energy -= 100;
    Sounds.enemy_hurt.play();
    if (enemy.energy <= 0) {
      enemy.death = true;
    }
  }

  /**
 * Applies damage to the character when touching an enemy.
 * Uses enemy's contactDamage or defaults to 5, then updates life bar.
 */
  handleCharacterDamage(enemy) {
    const dmg = enemy.contactDamage || 5;
    this.character.hit(enemy, dmg);
    this.statusBarLife.setPercentageLife(this.character.energy);
  }

  /**
 * Checks collisions between projectiles and enemies.
 * Processes each hit and removes projectiles marked for deletion.
 */
  checkProjectileCollisions() {
    setInterval(() => {
      if (this.isPaused) return;
      this.throwableObjects.forEach((bubble) => {
        this.level.enemies.forEach((enemy) => {
          this.processProjectileCollision(bubble, enemy);
        });
      });
      this.removeMarkedProjectiles();
    }, 1000 / 30);
  }

  /**
 * Handles collision between a projectile and an enemy.
 * Applies damage, triggers boss hurt state, then marks projectile for removal.
 */
  processProjectileCollision(bubble, enemy) {
    if (bubble.markedForRemoval) return;
    if (enemy.death) return;
    if (!bubble.isColliding(enemy)) return;
    this.applyProjectileDamage(bubble, enemy);
    this.applyEndbossHurtState(enemy);
    bubble.markedForRemoval = true;
  }

  /**
 * Applies projectile damage based on poison or normal type.
 * Updates boss health if applicable and plays hurt sound.
 */
  applyProjectileDamage(bubble, enemy) {
    if (bubble.isPoison) {
      enemy.energy -= 80;
    } else {
      enemy.energy -= 40;
    }
    this.updateBossHealth(enemy);
    Sounds.enemy_hurt.play();
  }

  /**
 * Updates the boss health bar based on remaining energy.
 * Only applies if the enemy is an Endboss.
 */
  updateBossHealth(enemy) {
    if (!(enemy instanceof Endboss) || !this.bossHealthBar) return;
    let percent = Math.max((enemy.energy / 300) * 100, 0);
    this.bossHealthBar.setPercentageLife(percent);
  }

  /**
 * Activates hurt animation state for the endboss when hit.
 */
  applyEndbossHurtState(enemy) {
    if (enemy instanceof Endboss) {
      enemy.isHurtAnimation = true;
      enemy.hurtFrame = 0;
    }
  }

  /**
 * Removes all projectiles flagged for deletion.
 */
  removeMarkedProjectiles() {
    this.throwableObjects = this.throwableObjects.filter(
      (b) => !b.markedForRemoval
    );
  }

  /**
 * Checks input for throwing bubbles on cooldown.
 * Starts throw animation and creates bubble when allowed.
 */
  checkThrowObjects() {
    let lastThrow = 0;
    const cooldown = 700;
    setInterval(() => {
      if (this.isPaused) return;
      if (this.keyboard.SPACE) {
        const now = Date.now();
        if (this.canThrowBubble(now, lastThrow, cooldown)) {
          const isPoison = this.character.isPoison();
          this.startThrowAnimation(isPoison, () => {
            this.createBubble(isPoison);
          });
          lastThrow = now;
        }
      }
    }, 1000 / 60);
  }

  /**
 * Determines if a new bubble can be thrown based on cooldown.
 * @returns {boolean} True if enough time passed since last throw.
 */
  canThrowBubble(now, lastThrow, cooldown) {
    return now - lastThrow > cooldown;
  }

  /**
 * Creates a new bubble projectile and plays sound.
 * Spawns poison or normal bubble, adds it to the world,
 * and reduces poison meter if used.
 */
  createBubble(isPoison) {
    const bubble = new ThrowableObject(
      this.character.x + 100,
      this.character.y + 75,
      this.character.otherDirection,
      isPoison
    );
    this.throwableObjects.push(bubble);
    Sounds.bubble.play();
    if (isPoison) {
      const newValue = Math.max(this.statusBarPoison.percentage_poison - 20, 0);
      this.statusBarPoison.setPercentagePoison(newValue);
    }
  }

  /**
 * Starts the character’s shooting animation for throwing a bubble.
 * Delegates to the character’s startShoot method.
 */
  startThrowAnimation(isPoison, onFinished) {
    this.character.startShoot(isPoison, onFinished);
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

  /**
 * Handles canvas click interactions.
 * Starts game on start-screen click, or processes game over / win states.
 */
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

  /**
 * Applies mute state to all game sounds.
 * @param {boolean} isMuted - Whether all sounds should be muted.
 */
  applyMuteState(isMuted) {
    for (let key in Sounds) {
      Sounds[key].muted = isMuted;
    }
  }

  /**
 * Plays background music if not already active.
 * Resets playback time and marks background as playing.
 */
  playBackgroundSound() {
    if (!this.backgroundPlaying) {
      Sounds.background.currentTime = 0;
      Sounds.background.play();
      this.backgroundPlaying = true;
    }
  }

  /**
 * Stops background music if currently playing.
 */
  stopBackgroundSound() {
    if (this.backgroundPlaying) {
      Sounds.background.pause();
      this.backgroundPlaying = false;
    }
  }
}
