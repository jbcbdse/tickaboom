import { Component, Input } from '@angular/core';

import { Square } from './square';

@Component({
  selector: 'square',
  templateUrl: './square.component.html', 
  styleUrls: ['./square.component.css']
})
export class SquareComponent { 
    @Input() square: Square;
}
