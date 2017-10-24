import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h1>{{name}}</h1>
    <game></game>
  `,
})
export class AppComponent  { name = 'Tickaboom'; }
