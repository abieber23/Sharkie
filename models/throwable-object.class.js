class ThrowableObject extends MovableObject {


    speed = 8;           // Fluggeschwindigkeit
    markedForRemoval = false;

  IMAGES_FLY = [
    'img/1.Sharkie/4.Attack/Bubble trap/Bubble.png',
  ];

  IMAGES_FLY_POISON = [
    'img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png',
  ];


  constructor(x,y, otherDirection, isPoison) {
    super();
    this.isPoison = isPoison;
    if (isPoison) {
      this.loadImage(this.IMAGES_FLY_POISON[0]);
    } else {
      this.loadImage(this.IMAGES_FLY[0]);
    }
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.otherDirection = otherDirection; 

  if (this.otherDirection) {
    this.x -= 100;  }  else {
      // nach rechts → evtl. leicht nach rechts versetzen
      this.x += 40;   // optional
    }

    this.throw();
  }

throw () {
    this.speedY=10
    this.applyGravity();
    if (!this.otherDirection)  {
        setInterval(() => {
            this.x += 12
        }, 30);
    } else {
        setInterval(() => {
            this.x -= 12
        }, 30); 
    }

}




}