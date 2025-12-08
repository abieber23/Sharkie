 /**
 * Checks input for throwing bubbles on cooldown.
 * Starts throw animation and creates bubble when allowed.
 */
 export function checkThrowObjects() {
    let lastThrow = 0;
    const cooldown = 700;
    setInterval(() => {
      if (this.isPaused) return;
      if (this.keyboard.SPACE) {
        const now = Date.now();
        if (this.canThrowBubble(now, lastThrow, cooldown)) {
          const isPoison = this.character.isPoison();
          this.startThrowAnimation(isPoison, () => {
            this.createBubble(isPoison);
          });
          lastThrow = now;
        }
      }
    }, 1000 / 60);
  }

  /**
 * Determines if a new bubble can be thrown based on cooldown.
 * @returns {boolean} True if enough time passed since last throw.
 */
 export function  canThrowBubble(now, lastThrow, cooldown) {
    return now - lastThrow > cooldown;
  }

  /**
 * Creates a new bubble projectile and plays sound.
 * Spawns poison or normal bubble, adds it to the world,
 * and reduces poison meter if used.
 */
 export function   createBubble(isPoison) {
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
  }

  /**
 * Starts the character’s shooting animation for throwing a bubble.
 * Delegates to the character’s startShoot method.
 */
 export function   startThrowAnimation(isPoison, onFinished) {
    this.character.startShoot(isPoison, onFinished);
  }
