import React, { Component } from 'react';
import ReactDOM from 'react-dom';
const Skycons = require('skycons')(window);

class ReactSkycons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skycons: new Skycons({ 'color': 'white' })
    }
  }

  componentDidMount() {
    this.state.skycons.add(ReactDOM.findDOMNode(this), Skycons[this.fixNaming(this.props.icon)]);

    if (this.props.autoPlay) {
      this.state.skycons.play();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state.skycons.set(ReactDOM.findDOMNode(this), Skycons[this.fixNaming(nextProps.icon)]);
  }

  componentWillUnmount() {
    this.state.skycons.pause();
    this.state.skycons.remove(ReactDOM.findDOMNode(this));
  }

  play() {
    this.state.skycons.play();
  }

  pause() {
    this.state.skycons.pause();
  }

  fixNaming = (iconName) => {
    return iconName.replace(/-/g, '_');
  }

  render() {

    const defaultStyle = {
      width: '100%',
      height: '100%'
    };

    return (
      <canvas style={defaultStyle} {...this.props} />
    );
  }
}

export default ReactSkycons;