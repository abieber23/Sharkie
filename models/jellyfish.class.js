class Jellyfish extends MovableObject {
  IMAGES_WALKING = [
    "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png",
    "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 2.png",
    "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 3.png",
    "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 4.png",
  ];

  IMAGES_DEAD = [
    "img/2.Enemy/2 Jelly fish/Dead/Lila/L1.png",
    "img/2.Enemy/2 Jelly fish/Dead/Lila/L2.png",
    "img/2.Enemy/2 Jelly fish/Dead/Lila/L3.png",
    "img/2.Enemy/2 Jelly fish/Dead/Lila/L4.png",
  ];
  deadImageIndex = 0;

  constructor() {
    super().loadImage("img/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png");

    this.x = 300 + Math.random() * 2000;
    this.y = 300 + Math.random() * -200;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 1.15 + Math.random() * 0.25;
    this.speedY = 1.15 + Math.random() * 0.25;
    this.offset = {
      top: 5,
      left: 0,
      right: 0,
      bottom: 25,
    };
  }

  /**
 * Starts movement and animation behavior loops.
 * Moves vertically at 60 FPS and plays walking/death animations.
 */
  startBehavior() {
    this.moveInterval = setInterval(() => {
      if (this.world?.isPaused) return;
      this.moveUpDown(480);
    }, 1000 / 60);
    this.animationInterval = setInterval(() => {
      if (this.world?.isPaused) return;
      if (!this.isDead()) this.playAnimation(this.IMAGES_WALKING);
      else {
        this.playDeathAnimation(this.IMAGES_DEAD);
      }
    }, 100);
  }

  /**
 * Plays death animation frame-by-frame.
 * Removes the entity once the last frame is reached.
 */
  playDeathAnimation() {
    if (this.deadImageIndex < this.IMAGES_DEAD.length) {
      const path = this.IMAGES_DEAD[this.deadImageIndex];
      this.img = this.imageCache[path];
      this.deadImageIndex++;
    } else {
      this.remove();
    }
  }

  /**
 * Marks this entity for removal from the game world.
 */
  remove() {
    this.markedForRemoval = true;
  }
}
