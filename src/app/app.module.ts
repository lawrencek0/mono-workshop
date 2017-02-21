import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ClarityModule } from "clarity-angular";

import { AppComponent } from './app.component';
import { SlickCarouselComponent } from './slick-carousel/slick-carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    SlickCarouselComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ClarityModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
