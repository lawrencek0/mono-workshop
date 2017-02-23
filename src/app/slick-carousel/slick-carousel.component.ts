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
      centerMode: true,
      centerPadding: '60px',
      dots: true, /* Just changed this to get the bottom dots navigation */
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true
    });
  };
}
