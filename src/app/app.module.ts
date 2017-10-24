import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { GameComponent } from './game.component';
import { SquareComponent } from './square.component';
import { TickComponent } from './tick.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ 
    AppComponent, 
    GameComponent, 
    SquareComponent, 
    TickComponent
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
