class Level {
    enemies;
    backroundObjects;
    level_end_x = 720*3;

    constructor(enemies, backroundObjects) {
        this.enemies = enemies;
        this.backroundObjects = backroundObjects;
    }
}