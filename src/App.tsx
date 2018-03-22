import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from './redux';
import { moviesActions, Movie, TmdbApiParams } from './redux/movies';
import { genresActions, Genre } from './redux/genres';
import { SliderData, navigationActions } from './redux/navigation';

import styled from './theme';
import Header from './components/Header';
import SideBar from './components/SideBar';
import MovieList from './components/MovieList';

const StyledMain = styled.div`
  display: flex;
`;

interface AppProps {
  // tslint:disable:no-any
  fetchMovies: (params: TmdbApiParams) => any;
  fetchGenres: () => any;
  onGenreChange: () => any;
  onYearSliderChange: () => any;
  onRatingSliderChange: () => any;
  onRuntimeSliderChange: () => any;
  // tslint-enable
  movies: Movie[];
  navigation: {
    genres: Genre[];
    selectedGenre: string;
    year: SliderData;
    rating: SliderData;
    runtime: SliderData;
  };
  loading: boolean;
  errMessage: string | null;
}

class App extends React.Component<AppProps> {
  componentDidMount() {
    this.props.fetchGenres();
    this.getMoviesFromApi();
  }

  getMoviesFromApi() {
    const {
      navigation: { genres, selectedGenre, year, rating, runtime },
      fetchMovies
    } = this.props;

    let genreId = 28;

    if (genres.length > 0) {
      genreId = genres.find(genre => genre.name === selectedGenre)!.id;
    }

    fetchMovies({
      genreId,
      year: year.value,
      rating: rating.value,
      runtime: runtime.value
    });
  }

  render() {
    const {
      loading,
      movies,
      navigation,
      onGenreChange,
      onRatingSliderChange,
      onRuntimeSliderChange,
      onYearSliderChange
    } = this.props;

    // @TODO: better styles, how to handle errors? errorboundary?
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <React.Fragment>
        <Header />
        <StyledMain>
          <SideBar
            {...navigation}
            onGenreChange={onGenreChange}
            onRatingSliderChange={onRatingSliderChange}
            onRuntimeSliderChange={onRuntimeSliderChange}
            onYearSliderChange={onYearSliderChange}
          />
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
  navigation: { ...state.navigation, genres: state.genres.genres }
});

const connectedApp = connect(mapStateToProps, {
  fetchMovies: moviesActions.fetchMovies,
  fetchGenres: genresActions.fetchGenres,
  onGenreChange: navigationActions.updateSelectedGenre,
  onYearSliderChange: navigationActions.updateYearSlider,
  onRatingSliderChange: navigationActions.updateRatingSlider,
  onRuntimeSliderChange: navigationActions.updateRuntimeSlider
})(App);

export default connectedApp;
