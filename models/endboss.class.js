class Endboss extends MovableObject {


    height= 400;
    width= 400;
    y = 0;
    x = 2500;
    energy = 200;

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

    constructor () {
        super().loadImage('img/2.Enemy/3 Final Enemy/2.floating/1.png')
 
        this.x = 2000;
        this.loadImages(this.IMAGES_WALKING);
        this.speed = 0.15 + Math.random() * 0.25;
        this.offset = {
            top: 130,
            left: 25,
            right: 35,
            bottom: 70
          };

        this.animate();
    } 


    animate () {
        setInterval (() => {
            this.playAnimation(this.IMAGES_WALKING)
    },150);
    }

}