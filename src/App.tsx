import * as React from 'react';
import { connect } from 'react-redux';
import { moviesActions } from './redux/movies';
import styled from './theme';
import Header from './components/Header';
import SideBar from './components/SideBar';
import MovieList from './components/MovieList';

const StyledMain = styled.div`
  display: flex;
`;

interface AppProps {
  // tslint:disable-next-line:no-any
  fetchMovies: () => any;
}

class App extends React.Component<AppProps> {
  componentDidMount() {
    this.props.fetchMovies();
  }
  render() {
    return (
      <React.Fragment>
        <Header />
        <StyledMain>
          <SideBar />
          <MovieList />
        </StyledMain>
      </React.Fragment>
    );
  }
}

const connectedApp = connect(null, {
  fetchMovies: moviesActions.fetchMovies
})(App);

export default connectedApp;
