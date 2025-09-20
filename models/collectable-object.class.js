class CollectableObject extends MovableObject {
    
    IMAGES_COIN = [
        'img/4. Marcadores/1. Coins/1.png',
        'img/4. Marcadores/1. Coins/2.png',
        'img/4. Marcadores/1. Coins/3.png',
        'img/4. Marcadores/1. Coins/4.png',
    ]

    IMAGES_POISON = [
        'img/4. Marcadores/Posiขn/Animada/1.png',
        'img/4. Marcadores/Posiขn/Animada/2.png',
        'img/4. Marcadores/Posiขn/Animada/3.png',
        'img/4. Marcadores/Posiขn/Animada/4.png',
        'img/4. Marcadores/Posiขn/Animada/5.png',
        'img/4. Marcadores/Posiขn/Animada/6.png',
        'img/4. Marcadores/Posiขn/Animada/7.png',
        'img/4. Marcadores/Posiขn/Animada/8.png',
    ]


    constructor(type) {
        super();

        this.type = type;
        this.loadImages(this.IMAGES_COIN);
        this.loadImages(this.IMAGES_POISON);

        if (this.type === 'coin') {
            this.loadImage(this.IMAGES_COIN[0]); // Startbild setzen
          } else {
            this.loadImage(this.IMAGES_POISON[0]);
          }

          this.x = 100 + Math.random() * 2000; // Zufallsposition
          this.y = 100 + Math.random() * 300;
        this.height = 50;
        this.width = 50;
        this.animateCollect ();  
      }


    animateCollect () {
        if (this.type === 'coin') {
            setInterval(() => {
                this.playAnimation(this.IMAGES_COIN);
            }, 300);
        } else if (this.type === 'poison') {
            setInterval(() => {
                this.playAnimation(this.IMAGES_POISON);
            }, 200);
        }
    }



}


