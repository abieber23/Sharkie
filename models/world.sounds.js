
  /**
 * Applies mute state to all game sounds.
 * @param {boolean} isMuted - Whether all sounds should be muted.
 */
 export function applyMuteState(isMuted) {
    for (let key in Sounds) {
      Sounds[key].muted = isMuted;
    }
  }

  /**
 * Plays background music if not already active.
 * Resets playback time and marks background as playing.
 */
export function  playBackgroundSound() {
    if (!this.backgroundPlaying) {
      Sounds.background.currentTime = 0;
      Sounds.background.play();
      this.backgroundPlaying = true;
    }
  }

  /**
 * Stops background music if currently playing.
 */
export function  stopBackgroundSound() {
    if (this.backgroundPlaying) {
      Sounds.background.pause();
      this.backgroundPlaying = false;
    }
  }