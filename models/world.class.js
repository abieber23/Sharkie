class World {

    character = new Character ();
    level = level1
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    endbossSpawned = false; 
    statusBarLife = new StatusBar ('life', 100,20,0);
    statusBarCoin = new StatusBar ('coins', 0,20,50);
    statusBarPoison = new StatusBar ('poison', 0,20,100);
    throwableObjects = [];
    collectibleObject = [
        new CollectableObject('coin'),
        new CollectableObject('coin'),
        new CollectableObject('coin'),
        new CollectableObject('coin'),
        new CollectableObject('coin'),
        new CollectableObject('poison'),
        new CollectableObject('poison'),
        new CollectableObject('poison'),
        new CollectableObject('poison'),
        new CollectableObject('poison'),
        new CollectableObject('poison'),
        new CollectableObject('poison')
      ];

    constructor (canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard= keyboard;
        this.draw();
        this.setWorld();
        this.checkThrowObjects();
        this.checkCollisions();
        this.checkProjectileCollisions();
        this.checkCollectableCollisions(); // <--- NEU

        
    }

    setWorld() {
        this.character.world = this
    }

    draw () {


        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backroundObjects);
       
        this.addToMap(this.character);
        this.level.enemies = this.level.enemies.filter(e => !e.markedForRemoval);

        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.collectibleObject)
        this.addObjectsToMap(this.throwableObjects);
       


        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusBarLife);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarPoison);
        this.checkBossSpawn();
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        }
        
        );
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o) 
        }  );
   
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(2 * mo.x + mo.width, 0);
            this.ctx.scale(-1,1);            
        }
        mo.draw(this.ctx);

        mo.drawFrame(this.ctx)

    if (mo.otherDirection) {
      this.ctx.restore();        
    }
}


checkCollisions() {
    this.collisionTimer = setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (!this.character.isDead() && this.character.isColliding(enemy)) {
            const dmg = enemy.contactDamage || 5; 
            this.character.hit(enemy, dmg);      
            this.statusBarLife.setPercentageLife(this.character.energy)
          console.log("Collision mit", enemy, this.character.energy)
        }
      });
    }, 1000);
  }

  checkProjectileCollisions() {
    setInterval(() => {
      this.throwableObjects.forEach((bubble) => {
        this.level.enemies.forEach((enemy) => {
  
          if (!bubble.markedForRemoval && !enemy.death && bubble.isColliding(enemy)) {
            if (bubble.isPoison) { 
              enemy.energy -= 100;
              console.log("Poison-Bubble trifft Enemy!", enemy);
            } else {
              enemy.energy -= 40;
              console.log("Normale Bubble trifft Enemy!", enemy);
            }
            bubble.markedForRemoval = true;  
          }
        });
      });
  
      this.throwableObjects = this.throwableObjects.filter(b => !b.markedForRemoval);
  
    }, 1000 / 30);
  }
  

  checkThrowObjects() {
    let lastThrow = 0;
    const cooldown = 700; // 700ms zwischen Würfen
  
    setInterval(() => {  
      if (this.keyboard.SPACE) {
        let now = Date.now();
        if (now - lastThrow > cooldown) {
          let isPoison = this.character.isPoison();
  
          let bubble = new ThrowableObject(
            this.character.x + 100,
            this.character.y + 75,
            this.character.otherDirection,
            isPoison
          );
          this.throwableObjects.push(bubble);
  
          // Verbrauch nur beim Schießen
          if (isPoison) {
            let newValue = Math.max(this.statusBarPoison.percentage_poison - 20, 0);
            this.statusBarPoison.setPercentagePoison(newValue);
          }
  
          lastThrow = now; // Cooldown setzen
        }
      }
    }, 1000 / 60);
  }

  checkCollectableCollisions() {
    setInterval(() => {
      this.collectibleObject.forEach((item, index) => {
        if (this.character.isColliding(item)) {
          
          if (item.type === 'coin') {
            let newValue = Math.min(this.statusBarCoin.percentage_coin + 20, 100);
            this.statusBarCoin.setPercentageCoin(newValue);
            console.log("Coin eingesammelt:", this.statusBarCoin.percentage_coin);

          } 
          
          if (item.type === 'poison') {
            let newValue = Math.min(this.statusBarPoison.percentage_poison + 20, 100);
            this.statusBarPoison.setPercentagePoison(newValue);
            console.log("Poison eingesammelt:", this.statusBarPoison.percentage_poison );
          }
  
          this.collectibleObject.splice(index, 1);
        }
      });
    }, 1000 / 10); 
  }
  endbossSpawned = false; 

  checkBossSpawn() {
    
    if (!this.endbossSpawned && this.character.x > this.level.level_end_x - 500) {
      let boss = new Endboss();
      this.level.enemies.push(boss);
      this.endbossSpawned = true; 
      console.log("Endboss gespawnt!");
    }
  }
  


}



