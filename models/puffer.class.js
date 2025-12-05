class Puffer extends MovableObject {
  IMAGES_WALKING = [
    "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png",
    "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
    "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png",
    "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png",
    "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim5.png",
  ];

  IMAGES_DEAD = [
    "img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png",
    "img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 2 (can animate by going down to the floor after the Fin Slap attack).png",
    "img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 3 (can animate by going down to the floor after the Fin Slap attack).png",
  ];
  deadImageIndex = 0;

  constructor() {
    super().loadImage(
      "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png"
    );

    this.x = 300 + Math.random() * 2000;
    this.y = 300 + Math.random() * -200;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 1.15 + Math.random() * 0.25;
    this.offset = {
      top: 5,
      left: 0,
      right: 0,
      bottom: 25,
    };
  }

  /**
 * Starts movement and death behavior loops.
 * Moves left and animates walking; plays death animation when dead.
 */

  startBehavior() {
    this.moveAnimInterval = setInterval(() => {
      if (this.world?.isPaused) return;
      if (!this.isDead()) {
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 1000 / 15);
    this.deathInterval = setInterval(() => {
      if (this.world?.isPaused) return;
      if (this.isDead()) {
        this.playDeathAnimation(this.IMAGES_DEAD);
      }
    }, 200);
  }

  /**
 * Plays death animation frame-by-frame.
 * Removes the object after the final frame.
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
 * Flags the object for removal from the world.
 */
  remove() {
    this.markedForRemoval = true;
  }
}
