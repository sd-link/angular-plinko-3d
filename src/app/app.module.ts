import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PlinkoService } from '../services/plinko/plinko.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    PlinkoService,
  ],
  bootstrap: [
    AppComponent,
  ],
})

export class AppModule {}
