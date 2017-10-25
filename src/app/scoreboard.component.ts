import { Component, Input } from '@angular/core';

import { Game } from './game';

@Component({
  selector: 'scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent  {
    @Input() game: Game;
}
