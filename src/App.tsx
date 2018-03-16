import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from './redux';
import { moviesActions, Movie } from './redux/movies';
import { genresActions, Genre } from './redux/genres';
import styled from './theme';
import Header from './components/Header';
import SideBar from './components/SideBar';
import MovieList from './components/MovieList';

const StyledMain = styled.div`
  display: flex;
`;

interface AppProps {
  // tslint:disable:no-any
  fetchMovies: () => any;
  fetchGenres: () => any;
  // tslint-enable
  movies: Movie[];
  genres: Genre[];
  loading: boolean;
  errMessage: string | null;
}

class App extends React.Component<AppProps> {
  componentDidMount() {
    this.props.fetchMovies();
    this.props.fetchGenres();
  }

  render() {
    const { loading, movies, genres } = this.props;

    // @TODO: better styles, how to handle errors? errorboundary?
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <React.Fragment>
        <Header />
        <StyledMain>
          <SideBar genres={genres} />
          <MovieList movies={movies} />
        </StyledMain>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  movies: state.movies.movies,
  loading: state.movies.isFetching,
  errMessage: state.movies.errMessage,
  genres: state.genres.genres
});

const connectedApp = connect(mapStateToProps, {
  fetchMovies: moviesActions.fetchMovies,
  fetchGenres: genresActions.fetchGenres
})(App);

export default connectedApp;
