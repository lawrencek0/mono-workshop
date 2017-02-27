import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ClarityModule } from "clarity-angular";

import { AppComponent } from './app.component';
import { SlickCarouselComponent } from './slick-carousel/slick-carousel.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import {ContactService} from "./contact-form/contact.service";

@NgModule({
  declarations: [
    AppComponent,
    SlickCarouselComponent,
    ContactFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ClarityModule.forRoot(),
  ],
  providers: [
    ContactService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
