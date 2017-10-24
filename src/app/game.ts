import { Square } from './square';
import { Player } from './player';
export class Game {
    size: number = 8;
    squares: Array<Array<Square>> = [];
    players: Array<Player> = [];

    constructor(size: number, numberOfPlayers: number) {
        this.size = size;
        
        for(let i = 0; i < numberOfPlayers; i++) {
            this.players.push(new Player(this, i+1));
        }

        for(let y: number = 0; y < this.size; y++) {
            this.squares[y] = [];
            for(let x: number = 0; x < this.size; x++) {
                this.squares[y][x] = new Square(this, y, x);
            }
        }
    }
}