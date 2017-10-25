import { Game } from './game';

export class Sounds {
  public ticks: AudioBuffer[] = [];
  public booms: AudioBuffer[] = [];
  public wins: AudioBuffer[] = [];
  private context: AudioContext;

	constructor(public game: Game) {
    this.context = new AudioContext();
  }

  load(): Promise<Sounds> {
    let promises: Promise<any>[] = [];
    let loader: AudioBufferLoader = null;

    loader = new AudioBufferLoader(this.context, ["assets/sounds/tick1-craig.mp3"]);
    promises.push(loader.load().then(loader => {
        // ticks are done loading
        this.ticks = loader.bufferList;
        return loader;
    }));

    loader = new AudioBufferLoader(this.context, ["assets/sounds/boom1-craig.mp3", "assets/sounds/boom5-craig.mp3", "assets/sounds/boom3-craig.mp3"]);
    promises.push(loader.load().then(loader => {
      // ticks are done loading
      this.booms = loader.bufferList;
      return loader;
    }));

    loader = new AudioBufferLoader(this.context, ["assets/sounds/win1-craig.mp3", "assets/sounds/win2-craig.mp3", "assets/sounds/win3-craig.mp3"]);
    promises.push(loader.load().then(loader => {
      // ticks are done loading
      this.wins = loader.bufferList;
      return loader;
    }));

    return Promise.all(promises).then(loaders => this);
  }

  /**
   * Play the sound for placing a tick on the board
   */
  tick(): void {
    let source = this.context.createBufferSource();
    source.buffer = this.ticks[0];
    source.connect(this.context.destination);
    source.start(0);
  }

  /**
   * Play the sound for winning the game
   */
  win(): void {
    var source = this.context.createBufferSource();
    source.buffer = this.wins[0];
    source.connect(this.context.destination);
    source.start(0);
  }

  /**
   * Play the boom sound for a booming square.
   * This function detunes the audio, changing the pitch
   * at harmonizing intervals. The intervals are randomized
   * making the a series of randomized but harmonic sounds
   */
  boom(): void {
    let source = this.context.createBufferSource();
    // I believe these intervals correspond to a major chord like
    // intervars are in dodecaphonic cents: 100 = 1 whole step = the inteval between C and D at any tuning
    // C E G Bb C D E
    // the higher pitches are a little dissonant, but should still sound ok
    let intervals = [0, 200, 350, 500, 600, 700, 800, 900];
    // the pitches are then lowered 5 whole steps (C down to the next lower F).
    // We want the lowest pitch to be a bit lower than the original mp3 sound
    intervals.forEach((val, key) => { intervals[key] -= 500; });
    let i = Math.floor(Math.random() * intervals.length);
    let cents = intervals[i];
    source.detune.value = cents;
    source.buffer = this.booms[1];
    source.connect(this.context.destination);
    source.start(0);
  }

}

// AudioBufferLoader loads an array of audio buffers for use in an audio context
// by loading the list of URLs by XHR and decoding the response into AudioBuffer objects
class AudioBufferLoader {
  public bufferList: AudioBuffer[] = [];
  constructor(public context: AudioContext, public urlList: string[]) { }

  public load(): Promise<any> {
    let promises: Promise<string>[] = [];

    this.urlList.forEach((url, index) => {
      promises.push(new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
          this.context.decodeAudioData(xhr.response,
            buffer => {
              if(!buffer) {
                reject(new Error("Error decoding the audio into a buffer: " + url));
                return;
              }
              this.bufferList[index] = buffer;
              resolve(url);
            },
            error => {
              reject(new Error("Error decoding audio: " + url));
            }
          );
        }
        xhr.onerror = () => {
          reject("XHR failed for " + url);
        }
        xhr.send();
      }));
    });

    return Promise.all(promises).then(urls => this).catch(reason => reason);
  }
}
