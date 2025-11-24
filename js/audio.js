const Sounds = {
    win:        new Audio('audio/winner-game-sound-404167.mp3'),
    gameOver:   new Audio('audio/game-over-voice-355993.mp3'),
    snore:      new Audio('audio/male-snore-1-29322.mp3'),
    swim:       new Audio('audio/swim-44183.mp3'),
    bubble:     new Audio('audio/bubble-pop-07-351339.mp3'),
    hurt:       new Audio('audio/man-death-scream-186763.mp3'),
    coin:       new Audio('audio/drop-coin-384921.mp3'),
    enemy_hurt: new Audio('audio/retro-hurt-1-236672.mp3'),
    slap:       new Audio('audio/slap-hurt-pain-sound-effect-262618.mp3'),
    endboss_entry:       new Audio('audio/evil-laugh-with-reverb-423668.mp3'),
    endboss_bite:       new Audio('audio/cartoon-bite-39234.mp3'),
    endboss_death:      new Audio('audio/zombie-death-2-95167.mp3'),
    background:  new Audio ('audio/backround.mp3')
};

Sounds.background.loop = true;
Sounds.background.volume = 0.35;