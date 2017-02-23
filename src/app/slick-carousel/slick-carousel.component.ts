import {Component, OnInit, AfterViewInit} from '@angular/core';
import * as $ from 'jquery';
import 'slick-carousel/slick/slick';

@Component({
  selector: 'portfolio-slick-carousel',
  templateUrl: './slick-carousel.component.html',
  styles: []
})
export class SlickCarouselComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {
    $('.slider').slick({
      dots: true,
      infinite: true,
      speed: 500,
      fade: true,
      cssEase: 'linear',
      arrows: true
    });
  };
}
