class Endboss extends MovableObject {


    height= 400;
    width= 400;
    y = 0;
    x = 2500;
    energy = 300;
    contactDamage = 20
    deadImageIndex = 0;
    attacking = false;
    attackIndex = 0;
    attackDistance = 200;  
    attackFrameMs = 150;   

    IMAGES_SPAWN = [
        'img/2.Enemy/3 Final Enemy/1.Introduce/1.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/2.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/3.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/4.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/5.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/6.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/7.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/8.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/9.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/10.png',
    ]

    IMAGES_WALKING = [
        'img/2.Enemy/3 Final Enemy/2.floating/1.png',
        'img/2.Enemy/3 Final Enemy/2.floating/2.png',
        'img/2.Enemy/3 Final Enemy/2.floating/3.png',
        'img/2.Enemy/3 Final Enemy/2.floating/4.png',
        'img/2.Enemy/3 Final Enemy/2.floating/5.png',
        'img/2.Enemy/3 Final Enemy/2.floating/6.png',
        'img/2.Enemy/3 Final Enemy/2.floating/7.png',
        'img/2.Enemy/3 Final Enemy/2.floating/8.png',
        'img/2.Enemy/3 Final Enemy/2.floating/9.png',
        'img/2.Enemy/3 Final Enemy/2.floating/10.png',
        'img/2.Enemy/3 Final Enemy/2.floating/11.png',
        'img/2.Enemy/3 Final Enemy/2.floating/12.png',
        'img/2.Enemy/3 Final Enemy/2.floating/13.png',

    ];

    IMAGES_ATTACK = [
        'img/2.Enemy/3 Final Enemy/Attack/1.png',
        'img/2.Enemy/3 Final Enemy/Attack/2.png',
        'img/2.Enemy/3 Final Enemy/Attack/3.png',
        'img/2.Enemy/3 Final Enemy/Attack/4.png',
        'img/2.Enemy/3 Final Enemy/Attack/5.png',
        'img/2.Enemy/3 Final Enemy/Attack/6.png',
    ];

    IMAGES_HURT= [
        'img/2.Enemy/3 Final Enemy/Hurt/1.png',
        'img/2.Enemy/3 Final Enemy/Hurt/2.png',
        'img/2.Enemy/3 Final Enemy/Hurt/3.png',
        'img/2.Enemy/3 Final Enemy/Hurt/4.png',

    ]

    IMAGES_DEATH = [
        'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2.png',
        'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png',
        'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png',
        'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png',
        'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png',
        'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png',
    ]
    spawning = true;     
    spawnIndex = 0; 

    constructor () {
        super().loadImage('img/2.Enemy/3 Final Enemy/1.Introduce/1.png')
 
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
            bottom: 70
          };

        this.animate();
    } 


    animate() {
        setInterval(() => {
          if (this.isDead()) {
            this.playDeathAnimation();  
            return;                     
          }

          if (this.spawning) {
            this.playSpawnOnce();
            return;
          }

          if (this.attacking){
            this.playAttackStep();
            return;
          }

          this.playAnimation(this.IMAGES_WALKING);
          console.log('los')
          this.moveUpDown(540);
          console.log('klo')
        }, 150);
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
        const delay = 2000 + Math.random() * 2000;
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