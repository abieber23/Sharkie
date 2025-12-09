  /**
 * Periodically checks collisions with enemies.
 * Skips processing when paused.
 */
export function checkCollisions() {
  this.collisionTimer = setInterval(() => {
    if (this.isPaused) return;
    this.level.enemies.forEach((enemy) => {
      this.processEnemyCollision(enemy);
    });
  }, 1000 / 2);
}

  /**
 * Handles collision logic with a single enemy.
 * Processes attack collisions or applies damage to the character.
 */
 export function  processEnemyCollision(enemy) {
    if (!this.shouldProcessCollision(enemy)) return;
    if (this.character.isAttacking) {
      this.handleAttackCollision(enemy);
    } else {
      this.handleCharacterDamage(enemy);
    }
  }

  /**
 * Determines whether a collision with the enemy should be processed.
 * @returns {boolean} True if character is alive and colliding.
 */
 export function  shouldProcessCollision(enemy) {
    return !this.character.isDead() && this.character.isColliding(enemy);
  }

  /**
 * Handles collision when the character is attacking.
 * Deals damage and triggers enemy death if health reaches zero.
 */
 export function  handleAttackCollision(enemy) {
    enemy.energy -= 100;
    Sounds.enemy_hurt.play();
    if (enemy.energy <= 0) {
      enemy.death = true;
    }
  }

  /**
 * Applies damage to the character when touching an enemy.
 * Uses enemy's contactDamage or defaults to 5, then updates life bar.
 */
 export function  handleCharacterDamage(enemy) {
    const dmg = enemy.contactDamage || 5;
    this.character.hit(enemy, dmg);
    this.statusBarLife.setPercentageLife(this.character.energy);
  }

    /**
 * Checks collisions between projectiles and enemies.
 * Processes each hit and removes projectiles marked for deletion.
 */
 export function checkProjectileCollisions() {
    setInterval(() => {
      if (this.isPaused) return;
      this.throwableObjects.forEach((bubble) => {
        this.level.enemies.forEach((enemy) => {
          this.processProjectileCollision(bubble, enemy);
        });
      });
      this.removeMarkedProjectiles();
    }, 1000 / 30);
  }

  /**
 * Handles collision between a projectile and an enemy.
 * Applies damage, triggers boss hurt state, then marks projectile for removal.
 */
 export function  processProjectileCollision(bubble, enemy) {
    if (bubble.markedForRemoval) return;
    if (enemy.death) return;
    if (!bubble.isColliding(enemy)) return;
    this.applyProjectileDamage(bubble, enemy);
    this.applyEndbossHurtState(enemy);
    bubble.markedForRemoval = true;
  }

  /**
 * Applies projectile damage based on poison or normal type.
 * Updates boss health if applicable and plays hurt sound.
 */
 export function applyProjectileDamage(bubble, enemy) {
    if (bubble.isPoison) {
      enemy.energy -= 80;
    } else {
      enemy.energy -= 40;
    }
    this.updateBossHealth(enemy);
    Sounds.enemy_hurt.play();
  }

  /**
 * Updates the boss health bar based on remaining energy.
 * Only applies if the enemy is an Endboss.
 */
 export function updateBossHealth(enemy) {
    if (!(enemy instanceof Endboss) || !this.bossHealthBar) return;
    let percent = Math.max((enemy.energy / 300) * 100, 0);
    this.bossHealthBar.setPercentageLife(percent);
  }

  /**
 * Activates hurt animation state for the endboss when hit.
 */
 export function applyEndbossHurtState(enemy) {
    if (enemy instanceof Endboss) {
      enemy.isHurtAnimation = true;
      enemy.hurtFrame = 0;
    }
  }

  /**
 * Removes all projectiles flagged for deletion.
 */
 export function removeMarkedProjectiles() {
    this.throwableObjects = this.throwableObjects.filter(
      (b) => !b.markedForRemoval
    );
  }
