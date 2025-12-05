class Endboss extends MovableObject {
  height = 400;
  width = 400;
  y = 0;
  x = 2500;
  energy = 300;
  contactDamage = 40;
  deadImageIndex = 0;
  attacking = false;
  attackIndex = 0;
  attackDistance = 300;
  attackFrameMs = 150;
  speedY = 4;
  speed = 8;
  isHurtAnimation = false;
  IMAGES_SPAWN = [
    "img/2.Enemy/3 Final Enemy/1.Introduce/1.png",
    "img/2.Enemy/3 Final Enemy/1.Introduce/2.png",
    "img/2.Enemy/3 Final Enemy/1.Introduce/3.png",
    "img/2.Enemy/3 Final Enemy/1.Introduce/4.png",
    "img/2.Enemy/3 Final Enemy/1.Introduce/5.png",
    "img/2.Enemy/3 Final Enemy/1.Introduce/6.png",
    "img/2.Enemy/3 Final Enemy/1.Introduce/7.png",
    "img/2.Enemy/3 Final Enemy/1.Introduce/8.png",
    "img/2.Enemy/3 Final Enemy/1.Introduce/9.png",
    "img/2.Enemy/3 Final Enemy/1.Introduce/10.png",
  ];
  IMAGES_WALKING = [
    "img/2.Enemy/3 Final Enemy/2.floating/1.png",
    "img/2.Enemy/3 Final Enemy/2.floating/2.png",
    "img/2.Enemy/3 Final Enemy/2.floating/3.png",
    "img/2.Enemy/3 Final Enemy/2.floating/4.png",
    "img/2.Enemy/3 Final Enemy/2.floating/5.png",
    "img/2.Enemy/3 Final Enemy/2.floating/6.png",
    "img/2.Enemy/3 Final Enemy/2.floating/7.png",
    "img/2.Enemy/3 Final Enemy/2.floating/8.png",
    "img/2.Enemy/3 Final Enemy/2.floating/9.png",
    "img/2.Enemy/3 Final Enemy/2.floating/10.png",
    "img/2.Enemy/3 Final Enemy/2.floating/11.png",
    "img/2.Enemy/3 Final Enemy/2.floating/12.png",
    "img/2.Enemy/3 Final Enemy/2.floating/13.png",
  ];
  IMAGES_ATTACK = [
    "img/2.Enemy/3 Final Enemy/Attack/1.png",
    "img/2.Enemy/3 Final Enemy/Attack/2.png",
    "img/2.Enemy/3 Final Enemy/Attack/3.png",
    "img/2.Enemy/3 Final Enemy/Attack/4.png",
    "img/2.Enemy/3 Final Enemy/Attack/5.png",
    "img/2.Enemy/3 Final Enemy/Attack/6.png",
  ];
  IMAGES_HURT = [
    "img/2.Enemy/3 Final Enemy/Hurt/1.png",
    "img/2.Enemy/3 Final Enemy/Hurt/2.png",
    "img/2.Enemy/3 Final Enemy/Hurt/3.png",
    "img/2.Enemy/3 Final Enemy/Hurt/4.png",
  ];
  IMAGES_DEATH = [
    "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2.png",
    "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png",
    "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png",
    "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png",
    "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png",
    "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png",
  ];
  spawning = true;
  spawnIndex = 0;

  constructor() {
    super().loadImage("img/2.Enemy/3 Final Enemy/1.Introduce/1.png");
    this.x = 2000;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_SPAWN);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEATH);
    this.loadImages(this.IMAGES_ATTACK);
    this.speedY = 3.15 + Math.random() * 2.25;
    this.speed = 0.15 + Math.random() * 0.25;
    this.offset = {
      top: 130,
      left: 25,
      right: 35,
      bottom: 70,
    };
    this.animate();
  }

  /**
 * Runs enemy animation loop.
 * Prioritizes death, hurt, spawn, and attack states before walking.
 * Also moves vertically and follows the player.
 */
  animate() {
    setInterval(() => {
      if (this.handleDeath()) return;
      if (this.handleHurt()) return;
      if (this.handleSpawn()) return;
      if (this.handleAttack()) return;
      this.playAnimation(this.IMAGES_WALKING);
      this.moveUpDown(540);
      this.followCharacter();

    }, 150);
  }

  /**
 * Handles enemy death state.
 * Plays death animation and disables attacking.
 * @returns {boolean} True if death was handled.
 */
  handleDeath() {
    if (!this.isDead()) return false;
    this.playDeathAnimation();
    this.attacking = false;
    return true;
  }

  /**
 * Handles hurt animation if active.
 * Plays the hurt sequence once.
 * @returns {boolean} True if hurt animation ran.
 */
  handleHurt() {
    if (!this.isHurtAnimation) return false;
    this.playHurtOnce();
    return true;
  }

  /**
 * Handles spawn animation.
 * Plays spawn sequence once and triggers entry sound.
 * @returns {boolean} True if spawn animation ran.
 */
  handleSpawn() {
    if (!this.spawning) return false;
    this.playSpawnOnce();
    Sounds.endboss_entry.play();
    return true;
  }

  /**
 * Handles attack animation step.
 * Executes one attack frame/step if attacking.
 * @returns {boolean} True if attack animation ran.
 */
  handleAttack() {
    if (!this.attacking) return false;
    this.playAttackStep();
    return true;
  }

  /**
 * Plays the hurt animation once.
 * Advances frames, then resets flags when finished.
 */
  playHurtOnce() {
    if (this.hurtFrame < this.IMAGES_HURT.length) {
      const path = this.IMAGES_HURT[this.hurtFrame];
      this.img = this.imageCache[path];
      this.hurtFrame++;
    } else {
      this.isHurtAnimation = false;
      this.hurtFrame = 0;
    }
  }

  /**
 * Plays the death animation frame-by-frame.
 * Removes the enemy once the final frame is reached.
 */
  playDeathAnimation() {
    if (this.deadImageIndex < this.IMAGES_DEATH.length) {
      const path = this.IMAGES_DEATH[this.deadImageIndex];
      this.img = this.imageCache[path];
      this.deadImageIndex++;
    } else {
      this.remove();
    }
  }

  /**
 * Marks the enemy for removal from the game world.
 */
  remove() {
    this.markedForRemoval = true;
  }

  /**
 * Plays the spawn animation once.
 * Resets spawn state and schedules next attack when finished.
 */
  playSpawnOnce() {
    if (this.spawnIndex < this.IMAGES_SPAWN.length) {
      const path = this.IMAGES_SPAWN[this.spawnIndex];
      this.img = this.imageCache[path];
      this.spawnIndex++;
    } else {
      this.spawning = false;
      this.currentImage = 0;
      this.scheduleNextAttack();
    }
  }

  /**
 * Schedules the next enemy attack after a random delay.
 * Skips scheduling if enemy is dead.
 */
  scheduleNextAttack() {
    if (this.isDead()) return;
    const delay = 1000 + Math.random() * 2000;
    this._attackTimeout = setTimeout(() => {
      if (!this.isDead()) this.startAttack();
    }, delay);
  }

  /**
 * Initiates an attack if the enemy is alive, not spawning, and not already attacking.
 */
  startAttack() {
    if (this.spawning || this.isDead() || this.attacking) return;
    this.attacking = true;
    this.attackIndex = 0;
  }

/**
 * Plays a single attack animation step.
 * Moves forward after the final frame, resets attack state,
 * resumes walking animation, and schedules the next attack.
 */
playAttackStep() {
  const frames = this.IMAGES_ATTACK.length;
  if (this.attackIndex < frames) {
    this.attackStepDirection();
  } else {
    this.attacking = false;
    if (!this.otherDirection) {
      this.x += this.attackDistance;
    } else {
      this.x -= this.attackDistance;
    }
    this.attackIndex = 0;
    this.playAnimation(this.IMAGES_WALKING);
    this.scheduleNextAttack();
  }
}

/**
 * Executes one attack frame and moves the enemy slightly.
 * Advances animation index and shifts position based on direction.
 */
attackStepDirection() {
  const frames = this.IMAGES_ATTACK.length;
  const step = this.attackDistance / frames;
  const path = this.IMAGES_ATTACK[this.attackIndex++];
  this.img = this.imageCache[path];
  if (!this.otherDirection) {
    this.x -= step;
  } else {
    this.x += step;
  }
}

/**
 * Moves the enemy toward the player character.
 * Adjusts direction and shifts position based on relative X position.
 */
followCharacter() {
  if (!this.world || !this.world.character) return;
  const char = this.world.character;
  if (char.x > this.x) {
    this.x += this.speed * 50;   
    this.otherDirection = true;
  } else {
    this.x -= this.speed * 50;
    this.otherDirection = false; 
  }
}
}


