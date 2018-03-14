import * as React from 'react';
import { connect } from 'react-redux';
import { moviesActions, Movie } from './redux/movies';
import styled from './theme';
import Header from './components/Header';
import SideBar from './components/SideBar';
import MovieList from './components/MovieList';
import { RootState } from './redux';

const StyledMain = styled.div`
  display: flex;
`;

interface AppProps {
  // tslint:disable-next-line:no-any
  fetchMovies: () => any;
  movies: Movie[];
  loading: boolean;
  errMessage: string | null;
}

class App extends React.Component<AppProps> {
  componentDidMount() {
    this.props.fetchMovies();
  }

  render() {
    const { loading, movies } = this.props;

    // @TODO: better styles, how to handle errors? errorboundary?
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <React.Fragment>
        <Header />
        <StyledMain>
          <SideBar />
          <MovieList movies={movies} />
        </StyledMain>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  movies: state.movies.movies,
  loading: state.movies.isFetching,
  errMessage: state.movies.errMessage
});

const connectedApp = connect(mapStateToProps, {
  fetchMovies: moviesActions.fetchMovies
})(App);

export default connectedApp;
