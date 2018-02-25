import * as React from 'react';

export interface MovieProps extends JSX.IntrinsicAttributes {
  id: number;
  title: string;
  genre_ids: number[];
  vote_count: number;
  vote_average: number;
  release_date: number;
  poster_path: string;
}
class Movie extends React.Component<MovieProps> {
  render() {
    return <li>{this.props.title}</li>;
  }
}

export default Movie;
