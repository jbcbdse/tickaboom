import { Game } from './game';
import { Square } from './square';

export class Player {
    public squares: number = 0;
    public ticks: number = 0;

    constructor(private game: Game, public num: number) { }
}