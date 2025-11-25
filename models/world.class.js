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
isPaused = false;
backgroundPlaying = false;

    constructor (canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard= keyboard;
        this.level = createLevel1();    
        this.level.enemies.forEach(e => {
            e.world = this;
            if (e.startBehavior) e.startBehavior();
        });
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
        this.checkCollectableCollisions(); 
    }

    setWorld() {
        this.character.world = this
    }

    draw () {
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
        if (!this.gameWon && this.endboss && this.endboss.isDead()) {
          this.gameWon = true;
          Sounds.win.play();
        }
        if (this.gameWon) {
          this.drawWinScreen();
        } else if (this.character.deathAnimationFinished) {
          this.drawGameOver();

        }
        if (this.keyboard.PAUSE) {
            this.togglePause();
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

togglePause() {
    this.isPaused = !this.isPaused;
    console.log('pause');
    if (this.isPaused) {
        for (let s in Sounds) {
            Sounds[s].pause();
        }
    }
}

checkCollisions() {
    this.collisionTimer = setInterval(() => {
        if (this.isPaused) return; 
      this.level.enemies.forEach((enemy) => {
        if (!this.character.isDead() && this.character.isColliding(enemy)) {
            // Wenn Sharkie gerade angreift → Gegner bekommt Schaden, Sharkie bleibt unversehrt
            if (this.character.isAttacking) {
              enemy.energy -= 100;
              Sounds.enemy_hurt.play();
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
        if (this.isPaused) return; 
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
            if (enemy instanceof Endboss) {
                enemy.isHurtAnimation = true;
                enemy.hurtFrame = 0;
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
        if (this.isPaused) return; 
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
        if (this.isPaused) return; 
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
    if (this.isPaused) return; 
    if (!this.endbossSpawned && this.character.x > this.level.level_end_x - 500) {
      let boss = new Endboss();
      this.level.enemies.push(boss);
      this.endboss = boss;     
      this.endbossSpawned = true; 
      console.log("Endboss gespawnt!");
    }
  }
  

  checkGameOver() {
    if (this.character.deathAnimationFinished) {
      this.restartGame();
      return true;    
    }
    return false;
  }
  
  checkWin() {
    if (this.gameWon) {
      this.restartGame();
      return true;    
    }
    return false;
  }
  
  handleCanvasClick() {
    if (!this.gameStarted && this.startButton) {
      this.gameStarted = true;
      this.startButton = null;
      this.canvas.style.cursor = 'default';
      this.restartGame();
      this.playBackgroundSound();
      return;
    }
    if (this.checkGameOver()) return;
    if (this.checkWin()) return;
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
    this.character.isShooting = false;  
   this.isPaused = false;
    this.character.lastActionTime = Date.now();

    this.level = createLevel1();
    this.endbossSpawned = false;
    this.endboss = null;  
  
    this.statusBarLife   = new StatusBar('life',   100, 20, 0);
    this.statusBarCoin   = new StatusBar('coins',    0, 20, 50);
    this.statusBarPoison = new StatusBar('poison',   0, 20, 100);
  
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
    this.tryAgainButton = null;
    this.camera_x = 0;
    this.gameWon = false;  
    this.backgroundPlaying = false;
    // Gegner neue world zuweisen und Verhalten starten
this.level.enemies.forEach(e => {
    e.world = this;
    if (e.startBehavior) e.startBehavior();
});
this.playBackgroundSound();

  }
  
  drawGameOver() {
    this.ctx.save();
    this.isPaused = true;
    this.stopBackgroundSound();
    this.drawOverlayBackground(0.6);
    if (!this.gameOverImg.complete) {
        this.ctx.restore();
        return;
    }
    const goRect = this.drawCenteredImage(this.gameOverImg, 0.7, -40);
    this.drawTryAgainBelow(this.tryAgainImg, goRect, 0.4, 20);
    this.canvas.style.cursor = 'pointer';
    this.ctx.restore();
}


  drawWinScreen() {
    this.ctx.save();
    this.isPaused = true;
    this.stopBackgroundSound();
    this.drawOverlayBackground(0.6);
    if (!this.winImg.complete) {
        this.ctx.restore();
        return;
    }
    const winRect = this.drawCenteredImage(this.winImg, 0.7, -40);
    this.drawTryAgainBelow(this.tryAgainImg, winRect, 0.4, 20);
    this.canvas.style.cursor = 'pointer';
    this.ctx.restore();
}


  drawStartScreen() {
    this.ctx.save();
    this.isPaused = true;
    this.drawOverlayBackground(1);
    if (this.startImg.complete) {
        const rect = this.drawCenteredImage(this.startImg, 0.6);
        this.startButton = rect;}
    this.canvas.style.cursor = 'pointer';
    this.ctx.restore();
}



  drawOverlayBackground(alpha = 1) {
    this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

drawCenteredImage(img, relativeWidth = 0.7, yOffset = 0) {
    const width = this.canvas.width * relativeWidth;
    const scale = width / img.width;
    const height = img.height * scale;
    const x = (this.canvas.width - width) / 2;
    const y = (this.canvas.height - height) / 2 + yOffset;
    this.ctx.drawImage(img, x, y, width, height);
    return { x, y, width, height };
}

drawTryAgainBelow(img, aboveRect, relativeWidth = 0.4, margin = 20) {
    if (!img.complete) {
        this.tryAgainButton = null;
        return;
    }
    const width  = aboveRect.width * relativeWidth;
    const scale  = width / img.width;
    const height = img.height * scale;
    const x = (this.canvas.width - width) / 2;
    const y = aboveRect.y + aboveRect.height + margin;
    this.ctx.drawImage(img, x, y, width, height);
    this.tryAgainButton = { x, y, width, height };
}

  
  toggleMute() {
    this.isMuted = !this.isMuted;  
    for (let key in Sounds) {
        Sounds[key].muted = this.isMuted;
    }
}
  
playBackgroundSound() {
    if (!this.backgroundPlaying) {
        Sounds.background.currentTime = 0;
        Sounds.background.play();
        this.backgroundPlaying = true;
    }
}

stopBackgroundSound() {
    if (this.backgroundPlaying) {
        Sounds.background.pause();
        this.backgroundPlaying = false;
    }
}
}