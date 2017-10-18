"use strict";
var Score = function(game) {
	this._game = game;
	this.scoreboard = $("<div class=scoreboard></div>").appendTo(game.gameboard);
	this.playerboards = [];

	this.playersLeft = game.players.slice(0);

	for(var i = 0; i < game.players.length; i++) {
		var player = game.players[i];
		var playerboard = {};
		playerboard.board = $("<div class=playerboard></div>").appendTo(this.scoreboard);
		playerboard.board.addClass("player"+player.num);
		playerboard.playerdisplay = $("<div class=player></div>").appendTo(playerboard.board).text("Player " + player.num);
		playerboard.squaredisplay = $("<div class=squaredisplay><b>Squares: </b><b class=sqaurecounter></b></div>").appendTo(playerboard.board);
		playerboard.squarecounter = playerboard.squaredisplay.find(".sqaurecounter");
		playerboard.tickdisplay = $("<div class=tickdisplay><b>Ticks: </b><b class=tickcounter></b></div>").appendTo(playerboard.board);
		playerboard.tickcounter = playerboard.tickdisplay.find(".tickcounter");
		playerboard.player = player;
		this.playerboards[i] = playerboard;
	}
}

Score.prototype.getBoardFor = function(player) {
	for(var i = 0; i < this.playerboards.length; i++) {
		if(this.playerboards[i].player === player) return this.playerboards[i];
	}
}

Score.prototype.update = function() {
	var scoresquares = [];
	var scoreticks = [];
	for(var p = 0; p < this.playersLeft.length; p++) {
		scoresquares[p] = 0;
		scoreticks[p] = 0;
	}
	for(var y = 0; y < this._game.squares.length; y++) {
		for(var x = 0; x < this._game.squares[y].length; x++) {
			var square = this._game.squares[y][x];
			if(square.player) {
				for(p = 0; p < this.playersLeft.length; p++) {
					if(this.playersLeft[p] === square.player) {
						scoresquares[p]++;
						scoreticks[p] += square.ticks.length;
						break;
					}
				}
			}
		}
	}
	for(p = 0; p < this.playersLeft.length; p++) {
		var playerboard = this.getBoardFor(this.playersLeft[p]);
		playerboard.squarecounter.text(scoresquares[p]);
		playerboard.tickcounter.text(scoreticks[p]);
		if(scoresquares[p] == 0) {
			this.playersLeft.splice(p, 1);
			scoresquares.splice(p, 1);
			scoreticks.splice(p, 1);
			// since the length of the array has changed, 
			// decrement p before it gets incremented again
			// i.e., removing item[1] means that the next iteration will operate on the *new* item[1] after the delete
			console.log("removing player", p, this.playersLeft);
			p--; 
		}
	}
	console.log(this.playersLeft);
	if(this.playersLeft.length == 1) {
		this._game.declareWinner(this.playersLeft[0]);
	}
}

Score.prototype.setCurrentPlayer = function(player) {
	for(var b = 0; b < this.playerboards.length; b++) {
		if(b != (player.num - 1)) this.playerboards[b].board.removeClass("current");
	}
	this.playerboards[player.num - 1].board.addClass("current");
}
