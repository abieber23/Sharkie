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
    drawStartScreen(this);
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
            drawEndScreen(this, this.winImg);
        } else if (this.character.deathAnimationFinished) {
            drawEndScreen(this, this.gameOverImg);
        }
        if (this.keyboard.PAUSE) {
            this.togglePause();
        }
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        }   );
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
            this.ctx.scale(-1,1);         }
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
        this.level.enemies.forEach(enemy => {
            this.processEnemyCollision(enemy);
        });
    }, 1000);
}

processEnemyCollision(enemy) {
    if (!this.shouldProcessCollision(enemy)) return;
    if (this.character.isAttacking) {
        this.handleAttackCollision(enemy);
    } else {
        this.handleCharacterDamage(enemy);
    }
}

shouldProcessCollision(enemy) {
    return (
        !this.character.isDead() &&
        this.character.isColliding(enemy)
    );
}

handleAttackCollision(enemy) {
    enemy.energy -= 100;
    Sounds.enemy_hurt.play();
    if (enemy.energy <= 0) {
        enemy.death = true;
    }
}

handleCharacterDamage(enemy) {
    const dmg = enemy.contactDamage || 5;
    this.character.hit(enemy, dmg);
    this.statusBarLife.setPercentageLife(this.character.energy);
}

checkProjectileCollisions() {
    setInterval(() => {
        if (this.isPaused) return;
        this.throwableObjects.forEach(bubble => {
            this.level.enemies.forEach(enemy => {
                this.processProjectileCollision(bubble, enemy);
            });
        });
        this.removeMarkedProjectiles();
    }, 1000 / 30);
}

processProjectileCollision(bubble, enemy) {
    if (bubble.markedForRemoval) return;
    if (enemy.death) return;
    if (!bubble.isColliding(enemy)) return;
    this.applyProjectileDamage(bubble, enemy);
    this.applyEndbossHurtState(enemy);
    bubble.markedForRemoval = true;
}

applyProjectileDamage(bubble, enemy) {
    if (bubble.isPoison) {
        enemy.energy -= 80;
    } else {
        enemy.energy -= 40;
    }
    Sounds.enemy_hurt.play();
}

applyEndbossHurtState(enemy) {
    if (enemy instanceof Endboss) {
        enemy.isHurtAnimation = true;
        enemy.hurtFrame = 0;
    }
}

removeMarkedProjectiles() {
    this.throwableObjects = this.throwableObjects.filter(b => !b.markedForRemoval);
}

  checkThrowObjects() {
    let lastThrow = 0;
    const cooldown = 700;
    setInterval(() => {
        if (this.isPaused) return;
        if (this.keyboard.SPACE) {
            const now = Date.now();
            if (this.canThrowBubble(now, lastThrow, cooldown)) {
                const isPoison = this.character.isPoison();
                this.startThrowAnimation(isPoison, () => {
                    this.createBubble(isPoison);});
                lastThrow = now;        }
        }
    }, 1000 / 60);
}

canThrowBubble(now, lastThrow, cooldown) {
    return (now - lastThrow) > cooldown;
}

createBubble(isPoison) {
    const bubble = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 75,
        this.character.otherDirection,
        isPoison  );
    this.throwableObjects.push(bubble);
    Sounds.bubble.play();
    if (isPoison) {
        const newValue = Math.max(this.statusBarPoison.percentage_poison - 20, 0);
        this.statusBarPoison.setPercentagePoison(newValue);
    }
}

startThrowAnimation(isPoison, onFinished) {
    this.character.startShoot(isPoison, onFinished);
}

handleCollectable(item) {
    if (item.type === 'coin') {
        const bar = this.statusBarCoin;
        const newValue = Math.min(bar.percentage_coin + 20, 100);
        bar.setPercentageCoin(newValue);
        Sounds.coin.play();
    } else if (item.type === 'poison') {
        const bar = this.statusBarPoison;
        const newValue = Math.min(bar.percentage_poison + 20, 100);
        bar.setPercentagePoison(newValue);
    }
}

processCollectableCollision(item, index) {
    if (!this.character.isColliding(item)) return;

    this.handleCollectable(item);
    this.collectibleObject.splice(index, 1);
}

checkCollectableCollisions() {
    setInterval(() => {
        if (this.isPaused) return;

        this.collectibleObject.forEach((item, index) => {
            this.processCollectableCollision(item, index);
        });

    }, 1000 / 10);
}

  checkBossSpawn() {
    if (this.isPaused) return; 
    if (!this.endbossSpawned && this.character.x > this.level.level_end_x - 500) {
      let boss = new Endboss();
      this.level.enemies.push(boss);
      this.endboss = boss;     
      this.endbossSpawned = true; 
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
    this.resetWorldState();
    this.resetCharacter();
    this.loadLevel();
    this.resetStatusBars();
    this.resetCollectibles();
    this.initializeEnemies();
    this.playBackgroundSound();
}

resetWorldState() {
    this.isPaused = false;
    this.tryAgainButton = null;
    this.camera_x = 0;
    this.gameWon = false;
    this.backgroundPlaying = false;
    this.endbossSpawned = false;
    this.endboss = null;
}

resetCharacter() {
    Object.assign(this.character, {
        energy: 100,
        x: 120,
        y: 100,
        currentImage: 0,
        deathAnimationFinished: false,
        death: false,
        lastHit: 0,
        otherDirection: false,
        isAttacking: false,
        isShooting: false,
        lastActionTime: Date.now()
    });
}

loadLevel() {
    this.level = createLevel1();
}

resetStatusBars() {
    this.statusBarLife   = new StatusBar('life',   100, 20,   0);
    this.statusBarCoin   = new StatusBar('coins',    0, 20,  50);
    this.statusBarPoison = new StatusBar('poison',   0, 20, 100);
}

resetCollectibles() {
    const coins   = Array(5).fill().map(() => new CollectableObject('coin'));
    const poison  = Array(8).fill().map(() => new CollectableObject('poison'));
    this.collectibleObject = [...coins, ...poison];
    this.throwableObjects = [];
}

initializeEnemies() {
    this.level.enemies.forEach(e => {
        e.world = this;
        if (e.startBehavior) e.startBehavior();
    });
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