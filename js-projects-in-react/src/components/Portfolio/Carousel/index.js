import React, { Component } from 'react'
import Slider from 'react-slick';
import './index.css';

export default class SlickGoTo extends Component {
  constructor(props) {
    super(props)
    this.changeHandler = this.changeHandler.bind(this)
  }
  changeHandler(e) {
    this.refs.slider.slickGoTo(e.target.value)
  }
  render() {
    const settings = {
      dots: true
    };
    return (
      <div>
        <Slider ref="slider" {...settings}>
          <div><img src='http://placekitten.com/g/400/200' /></div>
          <div><img src='http://placekitten.com/g/400/200' /></div>
          <div><img src='http://placekitten.com/g/400/200' /></div>
          <div><img src='http://placekitten.com/g/400/200' /></div>
        </Slider>
      </div>
    );
  }
}
