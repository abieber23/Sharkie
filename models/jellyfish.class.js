class Jellyfish extends MovableObject {


    IMAGES_WALKING = [
        'img/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png',
        'img/2.Enemy/2 Jelly fish/Regular damage/Yellow 2.png',
        'img/2.Enemy/2 Jelly fish/Regular damage/Yellow 3.png',
        'img/2.Enemy/2 Jelly fish/Regular damage/Yellow 4.png',

    ];

    IMAGES_DEAD = [
        'img/2.Enemy/2 Jelly fish/Dead/Lila/L1.png',
        'img/2.Enemy/2 Jelly fish/Dead/Lila/L2.png',
        'img/2.Enemy/2 Jelly fish/Dead/Lila/L3.png',
        'img/2.Enemy/2 Jelly fish/Dead/Lila/L4.png',
    ]
    deadImageIndex = 0;

    constructor () {
        super().loadImage('img/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png')
 
        this.x = 300 + Math.random() * 2000; 
        this.y = 300 + Math.random() * -200;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 1.15 + Math.random() * 0.25;
        this.offset = {
            top: 5,
            left: 0,
            right: 0,
            bottom: 25
          };
        this.animateUpDown() 
    } 


    animateUpDown() {
        // Bewegung hoch/runter (flüssig)
        setInterval(() => {
          if (!this.isDead()) {
            this.moveUpDown(480); // 480 = Canvas-Höhe
          }
        }, 1000 / 60);
      
        // Animation (langsamer)
        setInterval(() => {
          if (!this.isDead()) {
            this.playAnimation(this.IMAGES_WALKING);
          } else {
            this.playDeathAnimation(this.IMAGES_DEAD);
          }
        }, 1000 / 10); // hier bleibt 100 ms
      }
      
     

      playDeathAnimation() {
        if (this.deadImageIndex < this.IMAGES_DEAD.length) {
          const path = this.IMAGES_DEAD[this.deadImageIndex];
          this.img = this.imageCache[path];
          this.deadImageIndex++;
        } else {
          this.remove();
        }
      }
    
      
  remove() {
    this.markedForRemoval = true;  // World.filter(...) kann das Objekt entsorgen
  }




}