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
    {name: 'Nepal Portal', url: 'nepalportal.herokuapp.com', image: 'v1487888597/Nepal%20Portal'},
    {name: 'Javascript Calculator', url: 'codepen.io/LKhadka/full/vXQdZv', image: 'v1487888083/Javascript%20Calculator'},
    {name: 'Random Quote Generator', url: 'codepen.io/LKhadka/full/JXOmdB', image: 'v1487888072/Random%20Quote%20Generator'},
    {name: 'Pomodoro Clock', url:'codepen.io/LKhadka/full/pNvRze', image:'v1487888046/Pomodoro%20Clock'},
    {name: 'Weather App', url:'codepen.io/LKhadka/full/grodqq/', image: 'v1487888041/Weather%20App'},
    {name: 'Wikipedia Viewer', url:'codepen.io/LKhadka/full/yOKKjv/', image:'v1487888044/Wikipedia%20Viewer'},
    {name: 'Narayan Gopal Tribute Page', url:'codepen.io/LKhadka/full/pyWPwL/', image:'v1487888039/Narayan%20Gopal%20Tribute%20Page'}
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
