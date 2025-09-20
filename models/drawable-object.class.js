class DrawableObject {

    x = 120;
    y = 300;
    img;
    height= 100;
    width= 100;
    imageCache = {}
    currentImage = 0
    energy = 100;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      };
    coin = 0
    poison = 0
    
    


    loadImage (path){
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr){
        arr.forEach((path) => {
        let img = new Image();
        img.src =   path;
        this.imageCache[path] = img;
    });
    }


    draw (ctx) {
        ctx.drawImage(this.img, this.x ,this.y, this.width, this.height);
    }

    drawFrame (ctx) {

        if (this instanceof Character || this instanceof Puffer || this instanceof Endboss || this instanceof ThrowableObject || this instanceof CollectableObject) {
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "blue";
            ctx.rect(  this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom);
            ctx.stroke();
        }

    }
}