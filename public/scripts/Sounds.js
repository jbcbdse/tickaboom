var Sounds = function(game) {
	this.game = game;
	this.ticks = [];
	this.booms = [];
	this.wins = [];

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	this.context = new AudioContext();

}

Sounds.prototype.load = function() {
	var sounds = this;

	var promises = [];
	var loader = null;

	loader = new AudioBufferLoader(sounds.context, ["sounds/tick1-craig.mp3"]);
	promises.push(loader.load().then(loader => {
			// ticks are done loading
			sounds.ticks = loader.bufferList;
			return loader;
	}));

	loader = new AudioBufferLoader(sounds.context, ["sounds/boom1-craig.mp3", "sounds/boom5-craig.mp3", "sounds/boom3-craig.mp3"]);
	promises.push(loader.load().then(loader => {
		// ticks are done loading
		sounds.booms = loader.bufferList;
		return loader;
	}));

	loader = new AudioBufferLoader(sounds.context, ["sounds/win1-craig.mp3", "sounds/win2-craig.mp3", "sounds/win3-craig.mp3"]);
	promises.push(loader.load().then(loader => {
		// ticks are done loading
		sounds.wins = loader.bufferList;
		return loader;
	}));

	return Promise.all(promises).then(loaders => sounds);
}

Sounds.prototype.tick = function() {
	var source = this.context.createBufferSource();
	source.buffer = this.ticks[0];
	source.connect(this.context.destination);
	source.start(0);
}

Sounds.prototype.boom = function() {
	var source = this.context.createBufferSource();
	var intervals = [0, 200, 350, 500, 600, 700, 800, 900];
	intervals.forEach((val, key) => { intervals[key] -= 500; });
	var i = Math.floor(Math.random() * intervals.length);
	var cents = intervals[i];
	source.detune.value = cents;
	source.buffer = this.booms[1];
	source.connect(this.context.destination);
	source.start(0);
}

Sounds.prototype.win = function() {
	var source = this.context.createBufferSource();
	source.buffer = this.wins[0];
	source.connect(this.context.destination);
	source.start(0);
}

// AudioBufferLoader loads an array of audio buffers for use in an audio context
// by loading the list of URLs by XHR and decoding the response into 
var AudioBufferLoader = function(context, urlList) {
	this.context = context;
	this.urlList = urlList;
	this.bufferList = [];
}

AudioBufferLoader.prototype.load = function() {
	var loader = this;

	var promises = [];
	loader.urlList.forEach((url, index) => {
		promises.push(new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.responseType = "arraybuffer";
			xhr.onload = () => {
				loader.context.decodeAudioData(xhr.response, 
					buffer => {
						if(!buffer) {
							// error decoding audio. maybe not a valid sound file?
							reject(new Error("Error decoding the audio into a buffer: " + url));
							return;
						} 
						loader.bufferList[index] = buffer;
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
	return Promise.all(promises).then(urls => loader).catch(reason => reason);
}

