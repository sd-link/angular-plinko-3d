import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlinkoService {
  events: number = 0; // increasing before clearing
  dice: number; // 0-blue, 1-green, 2-red
  hole: number; // 0, 1, 2, 3, 4, ... , 13

  
  eventOccured: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  setDiceAndHole(): void {
    this.dice = Math.floor(Math.random() * 3);
    this.hole = Math.floor(Math.random() * 14);
  }

  fallDice(): void {
    this.events++;
    this.setDiceAndHole;
    this.eventOccured.emit(this.events);
  }
}
