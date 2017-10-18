// this should be a singleton property of a Game
var Boom = function(game) {
	// this is the time to wait between booms/rounds so that you get a bit of animation as it explodes around the board
	// on a server, this would be 0
	var roundTimer = 100;
	this._game = game;
	this.squares = [];
	this.ready = true;
	// squares will be added to the array in rounds. 
	// when you click a square, it will be added to a round and then the round is executed
	// as the round is executed, squares explode into others, and any squares that get a tick added will be added to the next round, 
	// and then that round will execute
	this.execute = function() {
		return new Promise((resolve, reject) => {
			if(this.squares.length > 0) {
				this.ready = false;
				// the original set of squares is the current 'round'
				// new squares will be added to the list of squares, but won't fire until
				// this round is completed
				var currentRoundSquares = this.squares; 
				this.squares = [];
				// shuffling the order of the squares to boom will make the action on the board appear more random
				// however, booming the squares in rounds makes the end result not random
				currentRoundSquares.shuffle();
				// each square will boom in intervals of 50ms 
				// when all are done, the next round will execute
				for(let i = 0, l = currentRoundSquares.length, square; i < l; i++) {
					// these are passed in as lambda vars so they hold value until the 
					// async timeout is called
					let square = currentRoundSquares.shift();

					setTimeout(() => {
						square.boom().then(() => {
							if(i == (l - 1)) {
								// this round of booms is over, execute the next round
								setTimeout(() => {
									this.execute().then(() => {
										resolve();
									}); 
								}, roundTimer); 
							}
						});
					}, i*roundTimer);
				}
			} else {
				// when this happens, the turn is over
				this.ready = true;
				resolve();
			}
		});
	}
	this.clear = function() {
		this.squares = [];
		this.ready = true;
	}
}
