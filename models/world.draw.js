  /**
 * Main draw cycle.
 * Renders start screen if not started; otherwise draws world, HUD,
 * boss logic, end screens, pause handling, and schedules next frame.
 */
export function draw() {
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
export function  drawStartLoop() {
    drawStartScreen(this);
    return requestAnimationFrame(() => this.draw());
  }
  
  /**
 * Prepares the frame by clearing the canvas and applying camera translation.
 */
export function   prepareFrame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
  }
  
  /**
 * Draws all world elements in correct order.
 * Renders background, character, enemies, collectibles, and projectiles.
 * Removes marked enemies before drawing and resets camera translation.
 */
 export function  drawWorld() {
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
 export function  drawHUD() {
    this.addToMap(this.statusBarLife);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarPoison);
  }
  
  /**
 * Handles boss-related logic.
 * Spawns boss when needed and draws its health bar if alive.
 */
 export function  handleBossLogic() {
    this.checkBossSpawn();
    if (this.endboss && !this.endboss.isDead()) {
      this.addToMap(this.bossHealthBar);
    }
  }
  
  /**
 * Displays win or game-over screen when conditions are met.
 * Triggers win sound, then draws the appropriate end screen.
 */
 export function  drawEndScreensIfNeeded() {
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
 export function  handlePauseInput() {
    if (this.keyboard.PAUSE) {
      this.togglePause();
    }
  }
  
  /**
 * Schedules the next animation frame for the game loop.
 */
 export function  scheduleNextFrame() {
    requestAnimationFrame(() => this.draw());
  }
  
/**
 * Adds multiple objects to the render map.
 * Iterates through the list and draws each object.
 */
 export function  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
 * Draws a game object, flipping it horizontally if needed.
 * Also draws its frame for debugging or outlining.
 */
 export function  addToMap(mo) {
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
 export function  togglePause() {
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