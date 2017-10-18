// a square object represents a square on the game board, 
// its position, its ticks (the dots on the board), and the 
// behavior when you click on the square
var Square = function(game, y, x) {
	// sample tick to clone for each tick
	var xTick = $("<span class=tick></span>");

	// position on the board
	this._game = game;
	this.player = null;
	this.y = y;
	this.x = x;

	// the array of ticks in this square
	this.ticks = [];

	// the corners only get one tick max
	if     ((x == 0 || x == this._game.size-1) && (y == 0 || y == this._game.size-1)) this.maxTicks = 1;
	// the sides get 2
	else if((x == 0 || x == this._game.size-1) || (y == 0 || y == this._game.size-1)) this.maxTicks = 2;
	// everything else gets 3 ticks before going boom
	else                                              this.maxTicks = 3;

	// the DOM element that represents this square on the screen
	var el = $("<td class=square data-count=0 data-player=0></td>");
	this.el = el;
	var square = this;

	var chooseSquare = function() {
		if(this._game.boom.ready) {
			if(this._game.currentPlayer.canPlayIn(square)) {
				square._game.sounds.tick();
				square.addTick(square._game.currentPlayer);
				square._game.boom.execute().then(() => {
					square._game.nextPlayer();
				});
			}
		}
	}.bind(this);

	// when you click the element, add a tick to the board
	el.click(chooseSquare);

	this.addTick = function(player) {
		var tick = xTick.clone().appendTo(el);
		this.ticks.push(tick);
		el.attr("data-count", this.ticks.length);
		this.player = player;
		el.attr("data-player", player.num);
		this._game.boom.squares.push(this);

		if(this._game.started) {
			this._game.score.update();
		}
	}

	this.boom = function() {
		return new Promise((resolve, reject) => {
			if(this.ticks.length > this.maxTicks) {
				var square = this;
				square._game.sounds.boom();
				$.each([ [y-1,x], [y,x+1], [y+1, x], [y, x-1] ], (i, c) => {
					var y = c[0], x = c[1], nextSquare;
					if(square._game.squares[y] && square._game.squares[y][x]) { nextSquare = square._game.squares[y][x]; }
					if(nextSquare) {
						var tick = square.ticks.pop().remove();
						var player = square.player;
						if(square.ticks.length == 0) {
							square.player = null;
							square.el.attr("data-player", 0);
						}
						el.attr("data-count", square.ticks.length);
						nextSquare.addTick(player);
					}
				});
			}
			resolve();
		});
	}
}
