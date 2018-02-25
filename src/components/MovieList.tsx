import * as React from 'react';
import Movie, { MovieProps } from './Movie';

interface MovieListState {
  movies: MovieProps[];
}

class MovieList extends React.Component<{}, MovieListState> {
  state: MovieListState = { movies: [] };

  componentDidMount() {
    this.fetchMovies();
  }

  fetchMovies = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${
          process.env.REACT_APP_TMDB_API_KEY
        }&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`
      );
      const { results } = await res.json();
      const movies: MovieProps[] = results.map(
        ({
          vote_count,
          id,
          genre_ids,
          poster_path,
          title,
          vote_average,
          release_date
        }: MovieProps) => ({
          vote_count,
          id,
          genre_ids,
          poster_path,
          title,
          vote_average,
          release_date
        })
      );
      this.setState({ movies });
    } catch (e) {
      throw Error('Error fetching results!\n' + e);
    }
  };

  render() {
    if (!this.state.movies) {
      return <span>Loading</span>;
    }
    return (
      <ul>
        {this.state.movies.map(movie => <Movie key={movie.id} {...movie} />)}
      </ul>
    );
  }
}

export default MovieList;
