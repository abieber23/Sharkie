class World {

    character = new Character ();
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    endbossSpawned = false; 
    endboss = null;
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
      gameOverImg = new Image(); 
      tryAgainImg = new Image();
      tryAgainButton = null;
      winImg = new Image();     
      gameWon = false; 
      startImg = new Image();
gameStarted = false;
startButton = null;


    constructor (canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard= keyboard;
        this.level = createLevel1();     

        this.gameOverImg.src = 'img/6.Botones/Tittles/Game Over/Recurso 9.png';
        this.tryAgainImg.src = 'img/6.Botones/Try again/Recurso 15.png';
        this.winImg.src = 'img/6.Botones/Tittles/You win/Recurso 22.png'; 
        this.startImg.src = 'img/6.Botones/Start/3.png';

        this.canvas.addEventListener('click', () => this.handleCanvasClick());

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
        // STARTSCREEN anzeigen, solange das Spiel noch nicht gestartet wurde
if (!this.gameStarted) {
    this.drawStartScreen();
    return requestAnimationFrame(() => this.draw());
  }
  

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

        // Win-Bedingung: Endboss existiert & ist tot
        if (!this.gameWon && this.endboss && this.endboss.isDead()) {
          this.gameWon = true;
          Sounds.win.play();
        }
        
        // Overlays zeichnen
        if (this.gameWon) {
          this.drawWinScreen();
        } else if (this.character.deathAnimationFinished) {
          this.drawGameOver();
          Sounds.gameOver.play();

        }
        
          
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

            // Wenn Sharkie gerade angreift → Gegner bekommt Schaden, Sharkie bleibt unversehrt
            if (this.character.isAttacking) {
              enemy.energy -= 100;
              Sounds.enemy_hurt.play();
              console.log("Sharkie greift an! Gegner verliert 50 Energie:", enemy.energy);
              if (enemy.energy <= 0) enemy.death = true; // optional falls du Todesanimationen hast
              return;
            }
          
            // normaler Schaden, wenn nicht im Angriff
            const dmg = enemy.contactDamage || 5; 
            this.character.hit(enemy, dmg);      
            this.statusBarLife.setPercentageLife(this.character.energy);
            console.log("Collision mit", enemy, this.character.energy);
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
              enemy.energy -= 80;
              console.log("Poison-Bubble trifft Enemy!", enemy);
              Sounds.enemy_hurt.play();
            } else {
              enemy.energy -= 40;
              console.log("Normale Bubble trifft Enemy!", enemy);
              Sounds.enemy_hurt.play();
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
    const cooldown = 700; // ms zwischen Würfen
  
    setInterval(() => {
      if (this.keyboard.SPACE) {
        const now = Date.now();
        if (now - lastThrow > cooldown) {
          const isPoison = this.character.isPoison();
  
          // Mund-Animation starten; Bubble erst NACH der Animation erzeugen
          this.character.startShoot(isPoison, () => {
            const bubble = new ThrowableObject(
              this.character.x + 100,
              this.character.y + 75,
              this.character.otherDirection,
              isPoison
            );
            this.throwableObjects.push(bubble);
            Sounds.bubble.play();

            if (isPoison) {
              const newValue = Math.max(this.statusBarPoison.percentage_poison - 20, 0);
              this.statusBarPoison.setPercentagePoison(newValue);
            }
          });
  
          lastThrow = now; // Cooldown starten, sobald die Aktion begonnen hat
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
            Sounds.coin.play();

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
      this.endboss = boss;     
      this.endbossSpawned = true; 
      console.log("Endboss gespawnt!");
    }
  }
  

  drawGameOver() {
    this.ctx.save();
  
    // dunkles Overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
    const go = this.gameOverImg;
    const ta = this.tryAgainImg;
  
    if (!go.complete) {
      this.ctx.restore();
      return;
    }
  
    // Game Over zentriert zeichnen
    let goWidth  = this.canvas.width * 0.7;
    let goScale  = goWidth / go.width;
    let goHeight = go.height * goScale;
  
    let goX = (this.canvas.width  - goWidth)  / 2;
    let goY = (this.canvas.height - goHeight) / 2 - 40; // leicht nach oben geschoben
  
    this.ctx.drawImage(go, goX, goY, goWidth, goHeight);
  
    // Try Again Button darunter
    if (ta.complete) {
      let taWidth  = goWidth * 0.4;      // kleiner als Game Over
      let taScale  = taWidth / ta.width;
      let taHeight = ta.height * taScale;
  
      let taX = (this.canvas.width  - taWidth)  / 2;
      let taY = goY + goHeight + 20;      // 20px unter dem Game-Over-Text
  
      this.ctx.drawImage(ta, taX, taY, taWidth, taHeight);
  
      // Klickfläche speichern
      this.tryAgainButton = {
        x: taX,
        y: taY,
        width: taWidth,
        height: taHeight
      };
    } else {
      this.tryAgainButton = null;
    }
  
    this.ctx.restore();
  }
  
  handleCanvasClick() {

    // STARTSCREEN geklickt?
    if (!this.gameStarted && this.startButton) {
  
      this.gameStarted = true;
      this.startButton = null;
      this.canvas.style.cursor = 'default';
      this.restartGame();
      return;
    }
  
    // GAME OVER?
    if (this.character.deathAnimationFinished) {
      this.restartGame();
      return;
    }
  
    // WIN?
    if (this.gameWon) {
      this.restartGame();
      return;
    }
  }
  
  
  

  restartGame() {
    // Character neu erstellen
    this.character.energy = 100;
    this.character.x = 120;   // Start-X (wie am Anfang)
    this.character.y = 100;   // Start-Y (wie in Character-Klasse)
    this.character.currentImage = 0;
    this.character.deathAnimationFinished = false;
    this.character.death = false;
    this.character.lastHit = 0;
    this.character.otherDirection = false;
    this.character.isAttacking = false;
    this.character.isShooting = false;  // ganz wichtig: Referenz zurücksetzen
  
    // Level zurücksetzen (so wie am Anfang – falls level1 ein globales Level-Objekt ist,
    // kannst du es hier einfach wieder zuweisen)
    this.level = createLevel1();
    this.endbossSpawned = false;
    this.endboss = null;  
  
    // Statusbars zurücksetzen
    this.statusBarLife   = new StatusBar('life',   100, 20, 0);
    this.statusBarCoin   = new StatusBar('coins',    0, 20, 50);
    this.statusBarPoison = new StatusBar('poison',   0, 20, 100);
  
    // Bubbles und Collectables neu setzen
    this.throwableObjects = [];
    this.collectibleObject = [
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
  
    // Try-Again-Button-Hitbox zurücksetzen (falls du sie verwendest)
    this.tryAgainButton = null;
  
    // Kamera wieder an den Anfang
    this.camera_x = 0;
    this.gameWon = false;  
  }
  
  
  drawWinScreen() {
    this.ctx.save();
  
    // dunkles Overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
    const win = this.winImg;
    const ta  = this.tryAgainImg;
  
    if (!win.complete) {
      this.ctx.restore();
      return;
    }
  
    // "You win" zentriert zeichnen
    let winWidth  = this.canvas.width * 0.7;
    let winScale  = winWidth / win.width;
    let winHeight = win.height * winScale;
  
    let winX = (this.canvas.width  - winWidth)  / 2;
    let winY = (this.canvas.height - winHeight) / 2 - 40;
  
    this.ctx.drawImage(win, winX, winY, winWidth, winHeight);
  
    // Try Again darunter
    if (ta.complete) {
      let taWidth  = winWidth * 0.4;
      let taScale  = taWidth / ta.width;
      let taHeight = ta.height * taScale;
  
      let taX = (this.canvas.width  - taWidth)  / 2;
      let taY = winY + winHeight + 20;
  
      this.ctx.drawImage(ta, taX, taY, taWidth, taHeight);
  
      // Klickbereich für Restart
      this.tryAgainButton = {
        x: taX,
        y: taY,
        width: taWidth,
        height: taHeight
      };
    } else {
      this.tryAgainButton = null;
    }

    this.ctx.restore();
  }

  drawStartScreen() {
    this.ctx.save();
  
    // Schwarzer Hintergrund
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
    const img = this.startImg;
  
    if (img.complete) {
      // Größe skalieren
      let width  = this.canvas.width * 0.6;
      let scale  = width / img.width;
      let height = img.height * scale;
  
      let x = (this.canvas.width  - width)  / 2;
      let y = (this.canvas.height - height) / 2;
  
      this.ctx.drawImage(img, x, y, width, height);
  
      // Klickfläche speichern
      this.startButton = { x, y, width, height };
    }
  
    this.canvas.style.cursor = 'pointer';
    this.ctx.restore();
  }
  
  

}



