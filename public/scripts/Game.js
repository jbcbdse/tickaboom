// Game object houses main game parts
var Game = function(size, players) {
	this.gameboard = $("div.gameboard");
	this.gameboard.html("");
	this.gametable = $("<table class=gametable></table>").appendTo(this.gameboard);
	this.gametbody = $("<tbody></tbody>").appendTo(this.gametable);
	this.size = size;
	this.squares = [];
	this.players = [];

	this.started = false;
	var game = this;

	if(players < 2 || players > 4) throw "2 to 4 players only";
	for(var p = 0; p < players; p++) {
		var player = new Player(this, p+1);
		this.players.push(player);
	}

	for(var y = 0; y < size; y++) {
		this.squares[y] = [];
		var row = $("<tr></tr>").appendTo(this.gametbody);
		for(var x = 0; x < size; x++) {
			var square = new Square(this, y, x);
			this.squares[y][x] = square;
			square.el.appendTo(row);
		}
	}

	this.score = new Score(this);

	this.boom = new Boom(this);
	
	var promises = [];

	game.sounds = new Sounds(game);
	promises.push(game.sounds.load());

	Promise.all(promises).then(() => {
		if(game.players[0]) game.squares[0][0].addTick(game.players[0]);
		if(game.players[1]) game.squares[0][size-1].addTick(game.players[1]);
		if(game.players[2]) game.squares[size-1][0].addTick(game.players[2]);
		if(game.players[3]) game.squares[size-1][size-1].addTick(game.players[3]);
		if(game.players.length == 2) {
			game.squares[size-1][size-1].addTick(game.players[0]);
			game.squares[size-1][0].addTick(game.players[1]);
		}

		game.boom.clear();
		game.score.update();
		game.setPlayer(game.players[0]);
		game.started = true;
	});
}
Game.prototype.setPlayer = function(player) {
	this.currentPlayer = player;
	this.score.setCurrentPlayer(this.currentPlayer);
}
Game.prototype.nextPlayer = function() {
	// the array is zero-based, the player numbers are one-based
	var i = this.score.playersLeft.indexOf(this.currentPlayer);
	if(i < (this.score.playersLeft.length - 1)) {
		this.setPlayer(this.score.playersLeft[i+1]);
	} else {
		this.setPlayer(this.score.playersLeft[0]);
	}
	return this.currentPlayer;
}
Game.prototype.declareWinner = function(player) {
	this.sounds.win();
	alert("Player " + player.num + " is the winner!!");
	new Game(this.size, this.players.length);
}
