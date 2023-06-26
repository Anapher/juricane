import { Howl } from 'howler';
import _ from 'lodash';
import { TypedEmitter } from 'tiny-typed-emitter';
import HowlWrapper from './HowlWrapper';

interface PlayerEvents {
  playStateChanged: () => void;
  requestNextSong: () => void;
}

export default class Player extends TypedEmitter<PlayerEvents> {
  private currentSound: HowlWrapper | null = null;

  private fadingOut: HowlWrapper[] = [];

  public crossfadeDuration: number = 8000; // crossfade duration in ms

  private _volume: number = 1;

  get playing() {
    return this.currentSound?.howl.playing() || false;
  }

  get position() {
    return this.currentSound?.howl.seek() || 0;
  }

  set position(value: number) {
    this.currentSound?.howl.seek(value);
  }

  get duration() {
    return this.currentSound?.howl.duration() || 0;
  }

  get volume() {
    // eslint-disable-next-line no-underscore-dangle
    return this._volume;
  }

  set volume(value: number) {
    this.volume = value;
    this.currentSound?.howl.volume(value);
  }

  public destroy() {
    this.currentSound?.dispose();
    this.fadingOut.forEach((x) => x.dispose());
  }

  public nextTrack(src: string, skipCrossfade = false) {
    const onPlayStateChanged = () => this.emit('playStateChanged');

    const sound = new HowlWrapper(
      new Howl({ src, volume: this.volume }),
      this.crossfadeDuration
    );
    sound.howl.once('load', () => {
      if (this.currentSound) {
        const oldSound = this.currentSound;
        if (skipCrossfade) {
          oldSound.dispose();
        } else {
          this.fadingOut.push(oldSound);
          oldSound.crossfadeDispose(() =>
            _.remove(this.fadingOut, (x) => x === oldSound)
          );
        }
      }

      this.currentSound = sound;

      if (!skipCrossfade && this.fadingOut.length > 0) {
        this.currentSound.fadeIn(this.volume);
      }

      this.currentSound.howl.play();
      onPlayStateChanged();
    });

    sound.howl.on('play', onPlayStateChanged);
    sound.howl.on('pause', onPlayStateChanged);
    sound.on('requestCrossfadeOut', () => {
      this.emit('requestNextSong');
    });
  }

  public play() {
    this.currentSound?.howl.play();
  }

  public pause() {
    this.currentSound?.howl.pause();
  }
}
