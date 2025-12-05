class Character extends MovableObject {
  height = 180;
  width = 180;
  y = 100;
  speed = 3;
  lastActionTime = Date.now();
  attackFrame = -1;
  attackActive = false;
  isAttacking = false;
  isShooting = false;
  shootImages = null;
  isSlapAnimation = false;
  slapFrame = 0;
  slapActive = false;
  isSleeping = false;          
  sleepFrame = 0;             
  fullSleepFinished = false;   


  IMAGES_WALKING = [
    "img/1.Sharkie/3.Swim/1.png",
    "img/1.Sharkie/3.Swim/2.png",
    "img/1.Sharkie/3.Swim/3.png",
    "img/1.Sharkie/3.Swim/4.png",
    "img/1.Sharkie/3.Swim/5.png",
    "img/1.Sharkie/3.Swim/6.png",
  ];
  IMAGES_IDLE = [
    "img/1.Sharkie/1.IDLE/1.png",
    "img/1.Sharkie/1.IDLE/2.png",
    "img/1.Sharkie/1.IDLE/3.png",
    "img/1.Sharkie/1.IDLE/4.png",
    "img/1.Sharkie/1.IDLE/5.png",
    "img/1.Sharkie/1.IDLE/6.png",
    "img/1.Sharkie/1.IDLE/7.png",
    "img/1.Sharkie/1.IDLE/8.png",
    "img/1.Sharkie/1.IDLE/9.png",
    "img/1.Sharkie/1.IDLE/10.png",
    "img/1.Sharkie/1.IDLE/11.png",
    "img/1.Sharkie/1.IDLE/12.png",
    "img/1.Sharkie/1.IDLE/13.png",
    "img/1.Sharkie/1.IDLE/14.png",
    "img/1.Sharkie/1.IDLE/15.png",
    "img/1.Sharkie/1.IDLE/16.png",
    "img/1.Sharkie/1.IDLE/17.png",
    "img/1.Sharkie/1.IDLE/18.png",
  ];
  IMAGES_DEAD = [
    "img/1.Sharkie/6.dead/1.Poisoned/1.png",
    "img/1.Sharkie/6.dead/1.Poisoned/2.png",
    "img/1.Sharkie/6.dead/1.Poisoned/3.png",
    "img/1.Sharkie/6.dead/1.Poisoned/4.png",
    "img/1.Sharkie/6.dead/1.Poisoned/5.png",
    "img/1.Sharkie/6.dead/1.Poisoned/6.png",
    "img/1.Sharkie/6.dead/1.Poisoned/7.png",
    "img/1.Sharkie/6.dead/1.Poisoned/8.png",
    "img/1.Sharkie/6.dead/1.Poisoned/9.png",
    "img/1.Sharkie/6.dead/1.Poisoned/10.png",
    "img/1.Sharkie/6.dead/1.Poisoned/11.png",
    "img/1.Sharkie/6.dead/1.Poisoned/12.png",
  ];
  IMAGES_HURT = [
    "img/1.Sharkie/5.Hurt/1.Poisoned/1.png",
    "img/1.Sharkie/5.Hurt/1.Poisoned/2.png",
    "img/1.Sharkie/5.Hurt/1.Poisoned/3.png",
    "img/1.Sharkie/5.Hurt/1.Poisoned/4.png",
  ];
  IMAGES_HURT_ELECTRIC = [
    "img/1.Sharkie/5.Hurt/2.Electric shock/1.png",
    "img/1.Sharkie/5.Hurt/2.Electric shock/2.png",
    "img/1.Sharkie/5.Hurt/2.Electric shock/3.png",
  ];
  IMAGES_SLEEP = [
    "img/1.Sharkie/2.Long_IDLE/i1.png",
    "img/1.Sharkie/2.Long_IDLE/I2.png",
    "img/1.Sharkie/2.Long_IDLE/I3.png",
    "img/1.Sharkie/2.Long_IDLE/I4.png",
    "img/1.Sharkie/2.Long_IDLE/I5.png",
    "img/1.Sharkie/2.Long_IDLE/I6.png",
    "img/1.Sharkie/2.Long_IDLE/I7.png",
    "img/1.Sharkie/2.Long_IDLE/I8.png",
    "img/1.Sharkie/2.Long_IDLE/I9.png",
    "img/1.Sharkie/2.Long_IDLE/I10.png",
    "img/1.Sharkie/2.Long_IDLE/I11.png",
    "img/1.Sharkie/2.Long_IDLE/I12.png",
    "img/1.Sharkie/2.Long_IDLE/I13.png",
    "img/1.Sharkie/2.Long_IDLE/I14.png",
  ];
  IMAGES_ATTACK_NORMAL = [
    "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/1.png",
    "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/2.png",
    "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/3.png",
    "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/4.png",
    "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/5.png",
    "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/6.png",
    "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/7.png",
    "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/8.png",
  ];
  IMAGES_ATTACK_POISON = [
    "img/1.Sharkie/4.Attack/Bubble trap/For Whale/1.png",
    "img/1.Sharkie/4.Attack/Bubble trap/For Whale/2.png",
    "img/1.Sharkie/4.Attack/Bubble trap/For Whale/3.png",
    "img/1.Sharkie/4.Attack/Bubble trap/For Whale/4.png",
    "img/1.Sharkie/4.Attack/Bubble trap/For Whale/5.png",
    "img/1.Sharkie/4.Attack/Bubble trap/For Whale/6.png",
    "img/1.Sharkie/4.Attack/Bubble trap/For Whale/7.png",
    "img/1.Sharkie/4.Attack/Bubble trap/For Whale/8.png",
  ];
  IMAGES_ATTACK_FIN = [
    "img/1.Sharkie/4.Attack/Fin slap/1.png",
    "img/1.Sharkie/4.Attack/Fin slap/2.png",
    "img/1.Sharkie/4.Attack/Fin slap/3.png",
    "img/1.Sharkie/4.Attack/Fin slap/4.png",
    "img/1.Sharkie/4.Attack/Fin slap/5.png",
    "img/1.Sharkie/4.Attack/Fin slap/6.png",
    "img/1.Sharkie/4.Attack/Fin slap/7.png",
    "img/1.Sharkie/4.Attack/Fin slap/8.png",
  ];
  world;

  constructor() {
    super().loadImage("img/1.Sharkie/3.Swim/1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEP);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_HURT_ELECTRIC);
    this.loadImages(this.IMAGES_ATTACK_FIN);
    this.loadImages(this.IMAGES_ATTACK_NORMAL);
    this.loadImages(this.IMAGES_ATTACK_POISON);
    this.offset = {
      top: 90,
      left: 35,
      right: 35,
      bottom: 40,
    };
    this.applyGravity();
    this.animate();
  }

  /**
 * Handles all player movement actions (right, left, jump).
 */
  handleMovement() {
    this.handleRightMovement();
    this.handleLeftMovement();
    this.handleJump();
  }

/**
 * Moves the player right if allowed.
 * Plays swim sound, updates direction and action timestamp.
 */
  handleRightMovement() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      Sounds.swim.play();
      this.otherDirection = false;
      this.lastActionTime = Date.now();
    }
  }

  /**
 * Moves the player left if allowed.
 * Plays swim sound, updates direction and action timestamp.
 */
  handleLeftMovement() {
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      Sounds.swim.play();
      this.otherDirection = true;
      this.lastActionTime = Date.now();
    }
  }

  /**
 * Handles jump input.
 * Initiates jump, plays sound, updates action timestamp.
 */
  handleJump() {
    if (this.world.keyboard.UP && this.y > 0) {
      this.jump();
      Sounds.swim.play();
      this.lastActionTime = Date.now();
    }
  }

  updateCamera() {
    this.world.camera_x = -this.x + 50;
  }

  /**
 * Main animation loop setup.
 * Runs movement & camera updates at 60 FPS unless paused or dead,
 * then starts the sprite animation loop.
 */
  animate() {
    setInterval(() => {
      if (this.world.isPaused) return;
      if (this.isDead()) return;
      this.handleMovement();
      this.updateCamera();
    }, 1000 / 60);
    this.startAnimationLoop();
  }

  /**
 * Handles character animation states in a timed loop.
 * Skips when paused/dead and checks slap, shooting, hurt, movement, or idle.
 */
  startAnimationLoop() {
    setInterval(() => {
      if (this.world.isPaused) return;
      if (this.handleDeath()) return;
      if (this.slapActive) return;
      if (this.handleFinSlap()) return;
      if (this.handleShooting()) return;
      if (this.handleHurt()) return;
      if (
        this.world.keyboard.RIGHT ||this.world.keyboard.LEFT ||this.isAboveGround()
      ) {
        this.playAnimation(this.IMAGES_WALKING);return;}
      this.IDLE();
    }, 100);
  }

  /**
 * Handles hurt animation and sound.
 * Chooses correct hurt images, updates action time.
 * @returns {boolean} True if hurt animation was played.
 */
  handleHurt() {
    if (!this.isHurt()) return false;
    const imgs =
      this.hurtType === "electro"   ? this.IMAGES_HURT_ELECTRIC   : this.IMAGES_HURT;
    this.playAnimation(imgs);
    this.lastActionTime = Date.now();
    Sounds.hurt.play();
    return true;
  }

  /**
 * Handles death animation and sounds.
 * Plays death sequence once and marks it finished.
 * @returns {boolean} True if death handling occurred.
 */
  handleDeath() {
    if (!this.isDead()) return false;
    this.playAnimationOnce(this.IMAGES_DEAD);
    Sounds.hurt.play();
    Sounds.gameOver.play();
    if (this.currentImage >= this.IMAGES_DEAD.length) {
      this.deathAnimationFinished = true;
    }
    return true;
  }

  /**
 * Initiates fin slap attack.
 * Starts slap animation, plays sound, sets attack state.
 * @returns {boolean} True if slap was triggered.
 */
  handleFinSlap() {
    if (!this.world.keyboard.ATTACK || this.slapActive) return false;
    this.slapActive = true;
    this.slapFrame = 0;
    this.isAttacking = true;
    this.world.keyboard.ATTACK = false;
    Sounds.slap.play();
    this.runSlapAnimation();
    this.lastActionTime = Date.now();
    return true;
  }

  /**
 * Plays fin slap animation frame-by-frame.
 * Resets slap and attack states when finished.
 */
  runSlapAnimation() {
    const interval = setInterval(() => {
      if (this.slapFrame < this.IMAGES_ATTACK_FIN.length) {
        const path = this.IMAGES_ATTACK_FIN[this.slapFrame];
        this.img = this.imageCache[path];
        this.slapFrame++;
      } else {
        clearInterval(interval);
        this.slapActive = false;
        this.isAttacking = false;
      }
    }, 100);
  }

  /**
 * Handles shooting animation.
 * Plays shot sequence once and resets frame index.
 * @returns {boolean} True if shooting animation ran.
 */
  handleShooting() {
    if (!this.isShooting) return false;
    this.playAnimationOnce(this.shootImages);
    this.lastActionTime = Date.now();
    if (this.currentImage >= this.shootImages.length) {
      this.currentImage = 0;
    }
    return true;
  }

  /**
 * Handles idle behavior based on inactivity time.
 * Switches between awake idle, sleep start, full sleep, and sleep loop.
 */
IDLE() {
    const idleTime = Date.now() - this.lastActionTime;
    if (this.isAwake(idleTime)) return this.handleAwakeIdle();
    this.startSleepIfNeeded();
    Sounds.snore.play();
    if (!this.fullSleepFinished) return this.playFullSleep();
    this.playSleepLoop();
  }

  /**
 * Checks if the character is still awake based on idle time.
 * @param {number} idleTime - Time since last action.
 * @returns {boolean} True if idle time is within awake threshold.
 */
  isAwake(idleTime) {
    return idleTime <= 10000;
  }

  /**
 * Plays the awake idle animation and resets all sleep states.
 * Stops snore sound and resets its playback position.
 */
  handleAwakeIdle() {
    this.resetSleepState();
    Sounds.snore.pause();
    Sounds.snore.currentTime = 0;
    this.playAnimation(this.IMAGES_IDLE);
  }
  
  /**
 * Resets all sleep-related state flags and counters.
 */
  resetSleepState() {
    this.isSleeping = false;
    this.fullSleepFinished = false;
    this.sleepFrame = 0;
  }
  
  /**
 * Initiates sleep state if not already sleeping.
 * Resets full sleep flags and frame counter.
 */
  startSleepIfNeeded() {
    if (!this.isSleeping) {
      this.isSleeping = true;
      this.fullSleepFinished = false;
      this.sleepFrame = 0;
    }
  }

  /**
 * Plays the full sleep animation sequence.
 * Advances frames until complete, then marks full sleep as finished.
 */
  playFullSleep() {
    if (this.sleepFrame < this.IMAGES_SLEEP.length) {
      this.setSleepFrame(this.sleepFrame++);
    } else {
      this.fullSleepFinished = true;
      this.sleepFrame = this.IMAGES_SLEEP.length - 4;
    }
  }

  /**
 * Plays the looping part of the sleep animation.
 * Cycles through the last 4 sleep frames.
 */
  playSleepLoop() {
    const loopStart = this.IMAGES_SLEEP.length - 4;
    const frame = loopStart + ((this.sleepFrame - loopStart) % 4);
    this.setSleepFrame(frame);
    this.sleepFrame++;
  }
  
  /**
 * Sets the current sleep animation frame by index.
 */
  setSleepFrame(i) {
    const path = this.IMAGES_SLEEP[i];
    this.img = this.imageCache[path];
  }
  
  /**
 * Checks if the character is poisoned.
 * @returns {boolean} True if poison level is above 0.
 */
  isPoison() {
    return this.world.statusBarPoison.percentage_poison > 0;
  }

  /**
 * Starts a shooting attack.
 * Chooses poison or normal animation, runs timed sequence,
 * then resets state and calls `onFinish` if provided.
 * @param {boolean} isPoison - Whether to use the poison attack images.
 * @param {Function} onFinish - Callback fired after shooting ends.
 */
  startShoot(isPoison, onFinish) {
    if (this.isAttacking || this.isShooting) return;
    this.isShooting = true;
    this.shootImages = isPoison ? this.IMAGES_ATTACK_POISON : this.IMAGES_ATTACK_NORMAL;
    this.currentImage = 0;
    const duration = this.shootImages.length * 100 + 50;
    setTimeout(() => {
      this.isShooting = false;
      this.currentImage = 0;
      if (onFinish) onFinish();
    }, duration);
  }
}
