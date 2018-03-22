import * as React from 'react';
import { connect } from 'react-redux';
import * as api from './constants';
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
  fetchMovies: (url: string) => any;
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

const generateUrl = ({ genreId, year, rating, runtime }: TmdbApiParams) =>
  `${api.PATH_BASE}${api.PATH_DISCOVER}${api.PATH_MOVIE}?` +
  `${api.PARAM_API_KEY}=${process.env.REACT_APP_TMDB_API_KEY}&` +
  `${api.PARAM_LANGUAGE}=${api.DEFAULT_LANGUAGE}&` +
  `${api.PARAM_SORT_BY}=${api.DEFAULT_SORT_BY}&` +
  `${api.PARAM_WITH_GENRES}=${genreId}&` +
  `${api.PARAM_PRIMARY_RELEASE_DATE}.${api.MODIFIER_GREATER_THAN}=${
    year.min
  }-01-01&` +
  `${api.PARAM_PRIMARY_RELEASE_DATE}.${api.MODIFIER_LESS_THAN}=${
    year.max
  }-12-31&` +
  `${api.PARAM_VOTE_AVERAGE}.${api.MODIFIER_GREATER_THAN}=${rating.min}&` +
  `${api.PARAM_VOTE_AVERAGE}.${api.MODIFIER_LESS_THAN}=${rating.max}&` +
  `${api.PARAM_WITH_RUNTIME}.${api.MODIFIER_GREATER_THAN}=${runtime.min}&` +
  `${api.PARAM_WITH_RUNTIME}.${api.MODIFIER_LESS_THAN}=${runtime.max}&` +
  `${api.PARAM_PAGE}=${api.DEFAULT_PAGE}&`;

interface AppState {
  apiUrl: string;
}

class App extends React.Component<AppProps, AppState> {
  state = {
    apiUrl: api.DEFAULT_URL
  };

  componentDidMount() {
    this.props.fetchGenres();
    this.props.fetchMovies(this.state.apiUrl);
  }

  getMoviesFromApi = () => {
    const {
      navigation: { genres, selectedGenre, year, rating, runtime },
      fetchMovies
    } = this.props;

    const genreId = genres.find(genre => genre.name === selectedGenre)!.id;

    const url = generateUrl({
      genreId,
      year: year.value,
      rating: rating.value,
      runtime: runtime.value
    });

    if (url !== this.state.apiUrl) {
      this.setState({ apiUrl: url });
      fetchMovies(url);
    }
  };

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
            getMovies={this.getMoviesFromApi}
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
