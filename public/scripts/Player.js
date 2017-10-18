var Player = function(game, num) {
	this._game = game;
	this.num = num;
	this.squares = 0;
	this.ticks = 0;

	this.canPlayIn = function(square) {
		var valid = false;
		// if the square is mine, it's good
		if(square.player === this) valid = true;
		// if the square is someone else's it's bad
		else if(square.player) valid = false;
		// if the square is empty and adjacent to one of mine, then it's good
		else if(square.y > 0             && game.squares[square.y-1][square.x  ].player === this) valid = true;
		else if(square.y < (game.size-1) && game.squares[square.y+1][square.x  ].player === this) valid = true;
		else if(square.x > 0             && game.squares[square.y  ][square.x-1].player === this) valid = true;
		else if(square.x < (game.size-1) && game.squares[square.y  ][square.x+1].player === this) valid = true;

		return valid;
	}
}
