class StatusBar extends DrawableObject {
  IMAGES_LIFE = [
    "img/4. Marcadores/orange/0_  copia.png",
    "img/4. Marcadores/orange/20_ copia 2.png",
    "img/4. Marcadores/orange/40_  copia.png",
    "img/4. Marcadores/orange/60_  copia.png",
    "img/4. Marcadores/orange/80_  copia.png",
    "img/4. Marcadores/orange/100_  copia.png",
  ];

  IMAGES_COINS = [
    "img/4. Marcadores/Purple/0_ _1.png",
    "img/4. Marcadores/Purple/20_ .png",
    "img/4. Marcadores/Purple/40_ _1.png",
    "img/4. Marcadores/Purple/60_ _1.png",
    "img/4. Marcadores/Purple/80_ _1.png",
    "img/4. Marcadores/Purple/100__1.png",
  ];

  IMAGES_POISON = [
    "img/4. Marcadores/green/poisoned bubbles/0_ copia 2.png",
    "img/4. Marcadores/green/poisoned bubbles/20_ copia 3.png",
    "img/4. Marcadores/green/poisoned bubbles/40_ copia 2.png",
    "img/4. Marcadores/green/poisoned bubbles/60_ copia 2.png",
    "img/4. Marcadores/green/poisoned bubbles/80_ copia 2.png",
    "img/4. Marcadores/green/poisoned bubbles/100_ copia 3.png",
  ];

  percentage_life = 100;
  percentage_coin = 0;
  percentage_poison = 0;
  type = "life";
  percentage_boss = 100;

  constructor(type, start, x, y) {
    super();
    this.type = type;

    this.loadImages(this.IMAGES_LIFE);
    this.loadImages(this.IMAGES_COINS);
    this.loadImages(this.IMAGES_POISON);
    this.x = x;
    this.y = y;
    this.width = 250;
    this.height = 80;
    if (this.type === "life") this.setPercentageLife(start);
    if (this.type === "coins") this.setPercentageCoin(start);
    if (this.type === "poison") this.setPercentagePoison(start); // Startwert setzen
    if (this.type === "boss") this.setPercentageBoss(start);
  }

  /**
 * Updates life bar percentage and sets corresponding image.
 * @param {number} percentage - Life percentage (0–100).
 */
  setPercentageLife(percentage) {
    this.percentage_life = percentage;
    let path = this.IMAGES_LIFE[this.resolveImageIndex(percentage)];
    this.img = this.imageCache[path];
  }

  /**
 * Updates coin bar percentage and sets corresponding image.
 * @param {number} percentage - Coin percentage (0–100).
 */
  setPercentageCoin(percentage) {
    this.percentage_coin = percentage;
    let path = this.IMAGES_COINS[this.resolveImageIndex(percentage)];
    this.img = this.imageCache[path];
  }

  /**
 * Updates poison bar percentage and sets corresponding image.
 * @param {number} percentage - Poison percentage (0–100).
 */
  setPercentagePoison(percentage) {
    this.percentage_poison = percentage;
    let path = this.IMAGES_POISON[this.resolveImageIndex(percentage)];
    this.img = this.imageCache[path];
  }

  /**
 * Updates boss life bar percentage and sets corresponding image.
 * @param {number} percentage - Boss health percentage (0–100).
 */
  setPercentageBoss(percentage) {
    this.percentage_boss = percentage;
    let path = this.IMAGES_LIFE[this.resolveImageIndex(percentage)];
    this.img = this.imageCache[path];
  }

  /**
 * Maps a percentage value to an image index (0–5).
 * @param {number} percentage - Value to evaluate.
 * @returns {number} Index of the corresponding image.
 */
  resolveImageIndex(percentage) {
    if (percentage == 100) {
      return 5;
    } else if (percentage >= 80) {
      return 4;
    } else if (percentage >= 60) {
      return 3;
    } else if (percentage >= 40) {
      return 2;
    } else if (percentage > 0) {
      return 1;
    } else {
      return 0;
    }
  }
}
