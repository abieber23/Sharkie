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

  animate() {
    setInterval(() => {
      if (this.handleDeath()) return;
      if (this.handleHurt()) return;
      if (this.handleSpawn()) return;
      if (this.handleAttack()) return;
      this.playAnimation(this.IMAGES_WALKING);
      this.moveUpDown(540);
    }, 150);
  }

  handleDeath() {
    if (!this.isDead()) return false;
    this.playDeathAnimation();
    this.attacking = false;
    return true;
  }

  handleHurt() {
    if (!this.isHurtAnimation) return false;
    this.playHurtOnce();
    return true;
  }

  handleSpawn() {
    if (!this.spawning) return false;
    this.playSpawnOnce();
    Sounds.endboss_entry.play();
    return true;
  }

  handleAttack() {
    if (!this.attacking) return false;
    this.playAttackStep();
    return true;
  }

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

  playDeathAnimation() {
    if (this.deadImageIndex < this.IMAGES_DEATH.length) {
      const path = this.IMAGES_DEATH[this.deadImageIndex];
      this.img = this.imageCache[path];
      this.deadImageIndex++;
    } else {
      this.remove();
    }
  }
  remove() {
    this.markedForRemoval = true;
  }

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

  scheduleNextAttack() {
    if (this.isDead()) return;
    const delay = 1000 + Math.random() * 2000;
    this._attackTimeout = setTimeout(() => {
      if (!this.isDead()) this.startAttack();
    }, delay);
  }

  startAttack() {
    if (this.spawning || this.isDead() || this.attacking) return;
    this.attacking = true;
    this.attackIndex = 0;
  }

  playAttackStep() {
    const frames = this.IMAGES_ATTACK.length;
    const step = this.attackDistance / frames;
    if (this.attackIndex < frames) {
      const path = this.IMAGES_ATTACK[this.attackIndex++];
      this.img = this.imageCache[path];
      this.x -= step;
    } else {
      this.attacking = false;
      this.attackIndex = 0;
      this.x += this.attackDistance;
      this.playAnimation(this.IMAGES_WALKING);
      this.scheduleNextAttack();
    }
  }
}
