class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 0.5;
  lastHit = 0;
  Death = false;
  contactDamage = 0;

  /**
 * Applies gravity by updating vertical position and velocity.
 * Runs at 25 FPS while object is airborne or moving upward.
 */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
 * Checks whether the entity is above the ground.
 * Throwable objects are always considered airborne.
 * @returns {boolean} True if above ground.
 */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 260;
    }
  }

  /**
 * Checks bounding-box collision with another object.
 * @param {object} mo - The other movable object.
 * @returns {boolean} True if their hitboxes overlap.
 */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  moveRight() {
    this.x += this.speed;
  }

  /**
 * Moves the entity vertically within canvas bounds.
 * Reverses direction on reaching top or bottom limits.
 * @param {number} canvasHeight - Height of the movement area.
 */
  moveUpDown(canvasHeight) {
    if (!this.directionY) this.directionY = 1;
    if (!this.speedY) this.speedY = 2;
    this.y += this.speedY * this.directionY;
    if (this.y + this.height >= canvasHeight) {
      this.y = canvasHeight - this.height;
      this.directionY = -1;
    }
    if (this.y <= 0) {
      this.y = 0;
      this.directionY = 1;
    }
  }

  moveLeft() {
    this.x -= this.speed;
  }

  /**
 * Plays a looping animation by cycling through image frames.
 * @param {string[]} images - Array of image paths.
 */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

/**
 * Plays an animation once without looping.
 * Stays on the last frame after completion.
 * @param {string[]} images - Array of image paths.
 */
  playAnimationOnce(images) {
    if (this.currentImage < images.length) {
      const path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
    } else {
      const path = images[images.length - 1];
      this.img = this.imageCache[path];
    }
  }

  jump() {
    this.speedY = 10;
  }

  /**
 * Applies damage from an enemy.
 * Reduces energy, sets hurt type, and triggers death if energy hits zero.
 * @param {object} enemy - The attacking enemy.
 * @param {number} dmg - Damage amount.
 */
  hit(enemy, dmg) {
    if (this.isDead()) return;
    this.energy -= dmg;
    this.hurtType = enemy instanceof Jellyfish ? "electro" : "poison";
    if (this.energy <= 0) {
      this.energy = 0;
      this.death = true;
      this.currentImage = 0;
    } else {
      this.lastHit = Date.now();
    }
  }

  /**
 * Checks if the entity is currently in a hurt state.
 * @returns {boolean} True if the last hit occurred within 300ms.
 */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed < 300;
  }

  /**
 * Checks if the entity is dead.
 * @returns {boolean} True if energy is 0 or below.
 */
  isDead() {
    return this.energy <= 0;
  }
}
