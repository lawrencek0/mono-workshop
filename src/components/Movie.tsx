import * as React from 'react';
import { TMDB_IMG_BASE_URL, TMDB_IMG_FILE_SIZE } from '../constants';
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
    const imgUrl = `${TMDB_IMG_BASE_URL}/${TMDB_IMG_FILE_SIZE}/${
      this.props.poster_path
    }`;
    return (
      <li>
        <img src={imgUrl} alt="" />
        <span>{this.props.title}</span>
      </li>
    );
  }
}

export default Movie;
