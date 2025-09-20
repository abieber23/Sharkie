class Character extends MovableObject {

    height = 180
    width = 180
    y = 100
    speed = 3
    lastActionTime = Date.now();



    IMAGES_WALKING = [
        'img/1.Sharkie/3.Swim/1.png',
        'img/1.Sharkie/3.Swim/2.png',
        'img/1.Sharkie/3.Swim/3.png',
        'img/1.Sharkie/3.Swim/4.png',
        'img/1.Sharkie/3.Swim/5.png',
        'img/1.Sharkie/3.Swim/6.png',
    ];

    IMAGES_IDLE = [
        'img/1.Sharkie/1.IDLE/1.png',
        'img/1.Sharkie/1.IDLE/2.png',
        'img/1.Sharkie/1.IDLE/3.png',
        'img/1.Sharkie/1.IDLE/4.png',
        'img/1.Sharkie/1.IDLE/5.png',
        'img/1.Sharkie/1.IDLE/6.png',
        'img/1.Sharkie/1.IDLE/7.png',
        'img/1.Sharkie/1.IDLE/8.png',
        'img/1.Sharkie/1.IDLE/9.png',
        'img/1.Sharkie/1.IDLE/10.png',
        'img/1.Sharkie/1.IDLE/11.png',
        'img/1.Sharkie/1.IDLE/12.png',
        'img/1.Sharkie/1.IDLE/13.png',
        'img/1.Sharkie/1.IDLE/14.png',
        'img/1.Sharkie/1.IDLE/15.png',
        'img/1.Sharkie/1.IDLE/16.png',
        'img/1.Sharkie/1.IDLE/17.png',
        'img/1.Sharkie/1.IDLE/18.png',
    ];

    IMAGES_DEAD = [
        'img/1.Sharkie/6.dead/1.Poisoned/1.png',
        'img/1.Sharkie/6.dead/1.Poisoned/2.png',
        'img/1.Sharkie/6.dead/1.Poisoned/3.png',
        'img/1.Sharkie/6.dead/1.Poisoned/4.png',
        'img/1.Sharkie/6.dead/1.Poisoned/5.png',
        'img/1.Sharkie/6.dead/1.Poisoned/6.png',
        'img/1.Sharkie/6.dead/1.Poisoned/7.png',
        'img/1.Sharkie/6.dead/1.Poisoned/8.png',
        'img/1.Sharkie/6.dead/1.Poisoned/9.png',
        'img/1.Sharkie/6.dead/1.Poisoned/10.png',
        'img/1.Sharkie/6.dead/1.Poisoned/11.png',
        'img/1.Sharkie/6.dead/1.Poisoned/12.png',
    ]

    IMAGES_HURT = [
        'img/1.Sharkie/5.Hurt/1.Poisoned/1.png',
        'img/1.Sharkie/5.Hurt/1.Poisoned/2.png',
        'img/1.Sharkie/5.Hurt/1.Poisoned/3.png',
        'img/1.Sharkie/5.Hurt/1.Poisoned/4.png',
    ]

    IMAGES_HURT_ELECTRIC = [
        'img/1.Sharkie/5.Hurt/2.Electric shock/1.png',
        'img/1.Sharkie/5.Hurt/2.Electric shock/2.png',
        'img/1.Sharkie/5.Hurt/2.Electric shock/3.png',
    ]

    IMAGES_SLEEP = [
        'img/1.Sharkie/2.Long_IDLE/i1.png',
        'img/1.Sharkie/2.Long_IDLE/I2.png',
        'img/1.Sharkie/2.Long_IDLE/I3.png',
        'img/1.Sharkie/2.Long_IDLE/I4.png',
        'img/1.Sharkie/2.Long_IDLE/I5.png',
        'img/1.Sharkie/2.Long_IDLE/I6.png',
        'img/1.Sharkie/2.Long_IDLE/I7.png',
        'img/1.Sharkie/2.Long_IDLE/I8.png',
        'img/1.Sharkie/2.Long_IDLE/I9.png',
        'img/1.Sharkie/2.Long_IDLE/I10.png',
        'img/1.Sharkie/2.Long_IDLE/I11.png',
        'img/1.Sharkie/2.Long_IDLE/I12.png',
        'img/1.Sharkie/2.Long_IDLE/I13.png',
        'img/1.Sharkie/2.Long_IDLE/I14.png',
    ]

    world;

    constructor () {
        super().loadImage('img/1.Sharkie/3.Swim/1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_HURT_ELECTRIC);
        this.offset = {
            top: 90,
            left: 35,
            right: 35,
            bottom: 40
          };
        this.applyGravity();
        this.animate ();
    }

    animate () {

        setInterval(()=> {
            if (this.isDead()) return;

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight()
                this.otherDirection = false
                this.lastActionTime = Date.now();
            }
            if (this.world.keyboard.LEFT && this.x>0) {
                this.moveLeft()
                this.otherDirection = true
                this.lastActionTime = Date.now();
            }

            if (this.world.keyboard.UP && this.y > 0) {
                this.jump();
                this.lastActionTime = Date.now();
            }

            this.world.camera_x = -this.x +50;
        },1000/60);



        setInterval (() => {
            if (this.isDead()) {
                this.playAnimationOnce(this.IMAGES_DEAD)
            }

            else if (this.isHurt()) {
                const imgs = this.hurtType === 'electro' 
                  ? this.IMAGES_HURT_ELECTRIC 
                  : this.IMAGES_HURT;
                this.playAnimation(imgs);
              }

           else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.isAboveGround()) {
                this.playAnimation(this.IMAGES_WALKING)

    }
    else this.IDLE()
    },100);
    }

    IDLE() {
        let idleTime = Date.now() - this.lastActionTime;
        if (idleTime > 5000) {
          this.playAnimation(this.IMAGES_SLEEP);
        } else {
          this.playAnimation(this.IMAGES_IDLE);
        }
    }

    isPoison(){
        return this.world.statusBarPoison.percentage_poison > 0
      }


}