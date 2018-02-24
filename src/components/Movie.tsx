import * as React from 'react';

interface MovieProps {
  title: String;
}
class Movie extends React.Component<MovieProps> {
  render() {
    return <div>{this.props.title}</div>;
  }
}

export default Movie;
