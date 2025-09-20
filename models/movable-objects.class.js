class MovableObject extends DrawableObject {



    speed = 0.15;
    otherDirection= false;
    speedY= 0;
    acceleration = 0.5;
    lastHit = 0;
    Death = false;


    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround()|| this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }

        }, 1000 / 25);
    }




    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        else {
            return this.y < 260
        }
    
    }


    
    isColliding(mo) {
        return (this.x + this.width - this.offset.right) > (mo.x + mo.offset.left) &&
               (this.x + this.offset.left) < (mo.x + mo.width - mo.offset.right) &&
               (this.y + this.height - this.offset.bottom) > (mo.y + mo.offset.top) &&
               (this.y + this.offset.top) < (mo.y + mo.height - mo.offset.bottom);
      }

    moveRight () {
        this.x += this.speed;
    
    }

    moveUpDown(canvasHeight) {
        // Richtung anhand von Flag speichern
        if (!this.directionY) this.directionY = 1; // 1 = runter, -1 = hoch
      
        this.y += this.speed * this.directionY;
      
        // Unten angekommen → hoch schwimmen
        if (this.y + this.height >= canvasHeight) {
          this.y = canvasHeight - this.height; // nicht über den Rand
          this.directionY = -1;
        }
      
        // Oben angekommen → runter schwimmen
        if (this.y <= 0) {
          this.y = 0;
          this.directionY = 1;
        }
      }

    moveLeft (){
        this.x -= this.speed;
    };

    playAnimation(images){
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
}

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

    jump () {
    this.speedY = 10;
}


hit (enemy) {
   
    if (this.isDead()) return;  
    this.energy -= 5;
    this.hurtType = (enemy instanceof Jellyfish) ? 'electro' : 'poison';
    if (this.energy <= 0) {
      this.energy = 0;
      this.death = true;          // Flag setzen
      this.currentImage = 0;      // Dead-Animation neu starten
    } else {
      this.lastHit = Date.now();  // Hurt-Animation triggern
    }
  }


isHurt () {
    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed < 400;
}

isDead () {
  return this.energy <= 0

}


}

