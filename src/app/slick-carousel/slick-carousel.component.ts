import {Component, OnInit, AfterViewInit} from '@angular/core';
import * as $ from 'jquery';
import 'slick-carousel/slick/slick';

@Component({
  selector: 'portfolio-slick-carousel',
  templateUrl: './slick-carousel.component.html',
  styleUrls: ['./slick-carousel.component.css']
})
export class SlickCarouselComponent implements AfterViewInit {
  links = [
    {name: 'Nepal Portal', url: 'https://nepalportal.herokuapp.com', image: 'v1487888597/Nepal%20Portal'},
    {name: 'Narayan Gopal Tribute Page', url: 'https://codepen.io/LKhadka/full/vXQdZv', image: 'v1459667037/41saJId_rbkysj'}
    ];

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
