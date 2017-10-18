var Score = function(game) {
	this._game = game;
	this.scoreboard = $("<div class=scoreboard></div>").appendTo(game.gameboard);
	this.playerboards = [];
	for(var i = 0; i < game.players.length; i++) {
		var player = game.players[i];
		var playerboard = {};
		playerboard.board = $("<div class=playerboard></div>").appendTo(this.scoreboard);
		playerboard.playerdisplay = $("<div class=player></div>").appendTo(playerboard).text("Player " + player.num);
		playerboard.squaredisplay = $("<div class=squaredisplay><b>Squares: </b><b class=sqaurecounter></b></div>").appendTo(playerboard);
		playerboard.squarecounter = squaredisplay.find(".sqaurecounter");
		playerboard.tickdisplay = $("<div class=tickdisplay><b>Ticks: </b><b class=tickcounter></b></div>").appendTo(playerboard);
		playerboard.tickcounter = tickdisplay.find(".tickcounter");
		this.playerboards[i] = playerboard;
	}

	this.update = function() {
		var scoresquares = [];
		var scoreticks = [];
		for(var p = 0; p < game.players.length; p++) {
			scoresquares[p] = 0;
			scoreticks[p] = 0;
		}
		for(var y = 0; y < game.sqaures.length; y++) {
			for(var x = 0; x < game.squares[y].length; x++) {
				var square = game.squares[y][x];
				if(square.player) {
					scoresquares[square.player.num-1]++;
					scoreticks[square.player.num-1] += square.ticks.length;
				}
			}
		}
		for(var b = 0; b < this.playerboards.length; b++) {
			var playerboard = this.playerboards[b];
			playerboard.squarecounter.text(scoresquares[b]);
			playerboard.tickcounter.text(scoreticks[b]);
		}
	}
}
