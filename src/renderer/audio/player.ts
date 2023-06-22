import { Howl } from 'howler';
import { TypedEmitter } from 'tiny-typed-emitter';

interface PlayerEvents {
  playStateChanged: () => void;
  requestNextSong: () => void;
}

export default class Player extends TypedEmitter<PlayerEvents> {
  private currentSound: Howl | null = null;

  private currentFadingOut: Howl | null = null;

  private currentFadingOutCleanupTimeout:
    | ReturnType<typeof setTimeout>
    | undefined;

  public crossfadeDuration: number = 8000; // crossfade duration in ms

  private _volume: number = 1;

  get playing() {
    return this.currentSound?.playing() || false;
  }

  get position() {
    return this.currentSound?.seek() || 0;
  }

  get volume() {
    // eslint-disable-next-line no-underscore-dangle
    return this._volume;
  }

  set volume(value: number) {
    this.volume = value;
    this.currentSound?.volume(value);
  }

  public destroy() {
    this.currentSound?.unload();
    this.currentFadingOut?.unload();
  }

  public nextTrack(src: string, skipCrossfade = false) {
    const onPlayStateChanged = () => this.emit('playStateChanged');

    const sound = new Howl({ src, volume: this.volume });
    sound.once('load', () => {
      if (this.currentFadingOut) {
        clearTimeout(this.currentFadingOutCleanupTimeout);

        this.currentFadingOut.unload();
        this.currentFadingOut = null;
      }

      if (this.currentSound) {
        if (skipCrossfade) {
          this.currentSound.unload();
        } else {
          this.currentFadingOut = this.currentSound;
          this.currentFadingOut.fade(this.volume, 0, this.crossfadeDuration);

          this.currentFadingOutCleanupTimeout = setTimeout(() => {
            this.currentFadingOut?.unload();
          }, this.crossfadeDuration);
        }
      }

      this.currentSound = sound;

      if (this.currentFadingOut) {
        sound.fade(0, this.volume, this.crossfadeDuration);
      }

      sound.play();
      onPlayStateChanged();
    });

    sound.on('play', onPlayStateChanged);
    sound.on('pause', onPlayStateChanged);
  }

  public play() {
    this.currentSound?.play();
  }

  public pause() {
    this.currentSound?.pause();
  }
}
