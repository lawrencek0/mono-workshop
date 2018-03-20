import * as React from 'react';
import styled from '../theme';
import MovieItem from './MovieItem';
import { Movie } from '../redux/movies';

interface MovieListProps {
  movies: Movie[];
  className?: string;
}

class MovieList extends React.PureComponent<MovieListProps> {
  render() {
    return (
      <ul className={this.props.className}>
        {this.props.movies.map(movie => (
          <MovieItem key={movie.id} {...movie} />
        ))}
      </ul>
    );
  }
}

// @TODO: add @support query for grid
const StyledMovieList = styled(MovieList)`
  flex-basis: 80%;
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0;
  list-style: none;
`;

export default StyledMovieList;
