import * as React from 'react';
import styled from './theme';
import Header from './components/Header';
import SideBar from './components/SideBar';
import MovieList from './components/MovieList';

const StyledMain = styled.div`
  display: flex;
`;

class App extends React.Component {
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

export default App;
