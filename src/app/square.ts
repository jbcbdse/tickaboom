import { Game } from './game';
import { Tick } from './tick';

export class Square {
    private ticks: Tick[];
    constructor(
        private game: Game, 
        public y: number, 
        public x: number
    ) { 
        // TODO: this is just for debugging so far
        [1,2,3].forEach(() => {
            this.ticks.push(new Tick());
        });
    }
}