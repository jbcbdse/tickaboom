import { Component } from '@angular/core';

import { Game } from './game';

@Component({
  selector: 'game',
  templateUrl: './game.component.html'
})
export class GameComponent  { 
    game: Game;
    constructor() {
        this.game = new Game(8);
    }
}
