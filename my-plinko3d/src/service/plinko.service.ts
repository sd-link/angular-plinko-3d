import { EventEmitter, Injectable } from '@angular/core';
import { BasicParam } from './../app/game/config';
@Injectable({
  providedIn: 'root'
})
export class PlinkoService {
  events: number = 0; 
  dice: number; 
  hole: number; 
  isReady: boolean = true;
  
  eventOccured: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  setDiceAndHole(): void {
    this.dice = Math.floor(Math.random() * 3);
    this.hole = Math.floor(Math.random() * (BasicParam.grids + 1));
  }

  fallDice(): void {
    if (this.isReady) {
      this.events++;
      this.setDiceAndHole();
      this.eventOccured.emit(this.events);
      this.isReady = false;
      setTimeout (() => {
        this.isReady = true;
        // this.fallDice();
      }, BasicParam.eventDelay);
    }
  }
}
