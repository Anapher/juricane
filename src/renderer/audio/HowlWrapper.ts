import { Howl } from 'howler';
import { TypedEmitter } from 'tiny-typed-emitter';

interface HowlWrapperEvents {
  requestCrossfadeOut: () => void;
}

export default class HowlWrapper extends TypedEmitter<HowlWrapperEvents> {
  private currentFadingOutCleanupTimeout:
    | ReturnType<typeof setTimeout>
    | undefined;

  private onCrossfadeOutRequestTimeout:
    | ReturnType<typeof setTimeout>
    | undefined;

  private didRequestCrossfadeOut = false;

  constructor(public howl: Howl, private crossfadeDuration: number) {
    super();

    const onPause = () => {
      clearTimeout(this.onCrossfadeOutRequestTimeout);
    };

    const onPlay = () => {
      if (this.didRequestCrossfadeOut) return;
      if (this.currentFadingOutCleanupTimeout) return;

      this.onCrossfadeOutRequestTimeout = setTimeout(() => {
        this.didRequestCrossfadeOut = true;
        this.emit('requestCrossfadeOut');
      }, Math.floor((this.howl.duration() - this.howl.seek()) * 1000) - this.crossfadeDuration);
    };

    howl.on('play', onPlay);
    howl.on('pause', onPause);
    howl.on('seek', () => {
      onPause();
      onPlay();
    });
  }

  public fadeIn(volume: number) {
    this.howl.fade(0, volume, this.crossfadeDuration);
  }

  public dispose() {
    clearTimeout(this.currentFadingOutCleanupTimeout);
    clearTimeout(this.onCrossfadeOutRequestTimeout);
    this.howl.unload();
  }

  public crossfadeDispose(callback?: () => void) {
    if (this.currentFadingOutCleanupTimeout) return;

    this.howl.fade(this.howl.volume(), 0, this.crossfadeDuration);

    this.currentFadingOutCleanupTimeout = setTimeout(() => {
      this.dispose();
      callback?.();
    }, this.crossfadeDuration);
  }
}
